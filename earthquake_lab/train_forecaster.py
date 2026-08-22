#!/usr/bin/env python3
from __future__ import annotations
import argparse, io, json, math, time, urllib.parse, urllib.request, zipfile
from datetime import datetime, timedelta, timezone
from pathlib import Path
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression, PoissonRegressor
from sklearn.metrics import roc_auc_score, average_precision_score, brier_score_loss, log_loss
from sklearn.preprocessing import StandardScaler
try:
    from xgboost import XGBClassifier
except Exception:
    XGBClassifier=None

BOUNDS=(22.,49.,120.,153.)
FEATURES=['log_c1','log_c3','log_c7','log_c30','max7','log_etas','log_stress','log_near7','log_bg365','depth30']

def req(url,timeout=120):
    q=urllib.request.Request(url,headers={'User-Agent':'PlateStressResearch/0.4'})
    with urllib.request.urlopen(q,timeout=timeout) as r:return r.read()

def usgs(start,end,minmag,cache):
    f=cache/f'usgs_{start}_{end}_{minmag}.csv.gz'
    if f.exists():
        d=pd.read_csv(f,parse_dates=['time']);d.time=pd.to_datetime(d.time,utc=True);return d
    cur=pd.Timestamp(start,tz='UTC'); stop=pd.Timestamp(end,tz='UTC'); rows={}
    while cur<stop:
        nxt=min(cur+pd.Timedelta(days=60),stop)
        p={'format':'geojson','starttime':cur.isoformat(),'endtime':nxt.isoformat(),'minlatitude':BOUNDS[0],'maxlatitude':BOUNDS[1],'minlongitude':BOUNDS[2],'maxlongitude':BOUNDS[3],'minmagnitude':minmag,'orderby':'time-asc','limit':20000}
        data=json.loads(req('https://earthquake.usgs.gov/fdsnws/event/1/query?'+urllib.parse.urlencode(p)).decode())
        fs=data.get('features',[])
        if len(fs)>19900:raise RuntimeError('USGS result cap approached')
        for x in fs:
            try:
                lo,la,de=x['geometry']['coordinates'][:3]; pr=x['properties']; m=float(pr['mag']); t=pd.to_datetime(int(pr['time']),unit='ms',utc=True)
                rows[x.get('id') or f'{t}-{la}-{lo}']=(t,float(la),float(lo),max(0.,float(de)),m)
            except Exception:pass
        print('USGS',cur.date(),nxt.date(),len(fs),'total',len(rows),flush=True);cur=nxt;time.sleep(.05)
    d=pd.DataFrame(rows.values(),columns=['time','lat','lon','depth','mag']).sort_values('time');d.to_csv(f,index=False,compression='gzip');return d

def imp(b,dec):
    s=b.decode('ascii','ignore').strip()
    if not s:return np.nan
    try:return float(s) if '.' in s else float(int(s))/10**dec
    except:return np.nan

def jrec(line):
    line=line.rstrip(b'\r\n')
    if len(line)<96 or line[:1]!=b'J':return None
    try:
        y,mo,da=int(line[1:5]),int(line[5:7]),int(line[7:9]); hh,mi=int(line[9:11]),int(line[11:13]); ss=imp(line[13:17],2); si=int(ss); us=int(round((ss-si)*1e6))
        t=datetime(y,mo,da,hh,mi,si,us,tzinfo=timezone(timedelta(hours=9))).astimezone(timezone.utc)
        la=int(line[21:24])+imp(line[24:28],2)/60; lo=int(line[32:36])+imp(line[36:40],2)/60; de=imp(line[44:49],2)
        m1,m2=imp(line[52:54],1),imp(line[55:57],1); m=m1 if np.isfinite(m1) else m2
        natural=line[60:61] in (b'1',b' '); quality=line[95:96] in (b'K',b'k',b'A')
        if not natural or not quality or not np.isfinite(m):return None
        return pd.Timestamp(t),float(la),float(lo),max(0.,float(de) if np.isfinite(de) else 0.),float(m)
    except:return None

def jma(start,end,minmag,cache):
    y0,y1=pd.Timestamp(start).year,pd.Timestamp(end).year-1; f=cache/f'jma_{y0}_{y1}_{minmag}.csv.gz'
    if f.exists():
        d=pd.read_csv(f,parse_dates=['time']);d.time=pd.to_datetime(d.time,utc=True);return d
    rows=[]
    for y in range(y0,y1+1):
        print('JMA',y,flush=True); raw=req(f'https://www.data.jma.go.jp/eqev/data/bulletin/data/hypo/h{y}.zip',180)
        with zipfile.ZipFile(io.BytesIO(raw)) as z:
            for n in z.namelist():
                if n.endswith('/'):continue
                for line in z.read(n).splitlines():
                    r=jrec(line)
                    if r is not None:rows.append(r)
        print('JMA cumulative',len(rows),flush=True)
    d=pd.DataFrame(rows,columns=['time','lat','lon','depth','mag']); d=d[(d.mag>=minmag)&d.lat.between(BOUNDS[0],BOUNDS[1])&d.lon.between(BOUNDS[2],BOUNDS[3])].sort_values('time');d.to_csv(f,index=False,compression='gzip');return d

def hav(a,b):
    a=np.radians(np.asarray(a,float));b=np.radians(np.asarray(b,float)); la1=a[:,0,None];lo1=a[:,1,None];la2=b[None,:,0];lo2=b[None,:,1];h=np.sin((la2-la1)/2)**2+np.cos(la1)*np.cos(la2)*np.sin((lo2-lo1)/2)**2
    return 12742*np.arcsin(np.sqrt(np.clip(h,0,1)))

def rollsum(a,w):
    c=np.vstack([np.zeros((1,a.shape[1])),np.cumsum(a,axis=0)]);i=np.arange(len(a));lo=np.maximum(0,i-w+1);return c[i+1]-c[lo]

def rollmax(a,w):return pd.DataFrame(a).rolling(w,min_periods=1).max().to_numpy()
def sigmoid(x):return 1/(1+np.exp(-np.clip(x,-40,40)))
def logit(p):p=np.clip(p,1e-8,1-1e-8);return np.log(p/(1-p))

def build(d,start,end,minmag,target,grid):
    days=pd.date_range(pd.Timestamp(start,tz='UTC'),pd.Timestamp(end,tz='UTC')-pd.Timedelta(days=1),freq='D'); lats=np.arange(BOUNDS[0],BOUNDS[1],grid);lons=np.arange(BOUNDS[2],BOUNDS[3],grid)
    cells=np.array([(la+grid/2,lo+grid/2,la,lo) for la in lats for lo in lons]);nD,nC=len(days),len(cells);print('grid',nC,'days',nD)
    C=np.zeros((nD,nC),np.float32);Y=np.zeros_like(C);YC=np.zeros_like(C);MX=np.full_like(C,np.nan);DEP=np.zeros_like(C);DC=np.zeros_like(C);PROD=np.zeros_like(C);MOM=np.zeros_like(C)
    t=((d.time.dt.floor('D')-days[0])/pd.Timedelta(days=1)).astype(int).to_numpy();ii=np.floor((d.lat.to_numpy()-BOUNDS[0])/grid).astype(int);jj=np.floor((d.lon.to_numpy()-BOUNDS[2])/grid).astype(int);ci=ii*len(lons)+jj
    ok=(t>=0)&(t<nD)&(ci>=0)&(ci<nC)
    for k in np.where(ok)[0]:
        q,c=int(t[k]),int(ci[k]);m=float(d.mag.iloc[k]);de=float(d.depth.iloc[k]);C[q,c]+=1;DEP[q,c]+=de;DC[q,c]+=1;PROD[q,c]+=10**(.9*(m-minmag));MOM[q,c]+=10**(.55*(m-minmag))
        if not np.isfinite(MX[q,c]) or m>MX[q,c]:MX[q,c]=m
        if m>=target:Y[q,c]=1;YC[q,c]+=1
    centers=cells[:,:2]; D=hav(centers,centers); SP=(1+(D/90.)**2)**-1.45; ST=(1+(D/80.)**2)**-1.5; NE=np.exp(-(D/180.)**2);NE/=NE.sum(axis=1,keepdims=True)
    sp_prod=PROD@SP.T;sp_mom=MOM@ST.T; et=np.zeros_like(C);st=np.zeros_like(C)
    kt=(np.arange(1,121)+.08)**-1.12;ks=np.exp(-np.arange(1,181)/45.)
    for c in range(nC):
        et[:,c]=np.convolve(sp_prod[:,c],np.r_[0,kt],mode='full')[:nD];st[:,c]=np.convolve(sp_mom[:,c],np.r_[0,ks],mode='full')[:nD]
    lag=lambda a:np.vstack([np.zeros((1,nC),dtype=a.dtype),a[:-1]])
    lc=lag(C);ld=lag(DEP);ldc=lag(DC);lmx=lag(np.nan_to_num(MX,nan=0.))
    c1=lc;c3=rollsum(lc,3);c7=rollsum(lc,7);c30=rollsum(lc,30);bg=rollsum(lc,365)@NE.T;near=rollsum(lc,7)@NE.T;mx7=rollmax(lmx,7);dep30=rollsum(ld,30)/np.maximum(1,rollsum(ldc,30))
    X=np.stack([np.log1p(c1),np.log1p(c3),np.log1p(c7),np.log1p(c30),mx7/8,np.log1p(et),np.log1p(st),np.log1p(near),np.log1p(bg),dep30/100],axis=-1).astype(np.float32)
    return days,cells,X,Y,YC

def metric(y,p,base):
    z={'positive_rate':float(y.mean()),'accuracy05':float(((p>=.5)==y).mean()),'null_accuracy':float((y==0).mean())}
    try:z['roc_auc']=float(roc_auc_score(y,p));z['pr_auc']=float(average_precision_score(y,p))
    except:z['roc_auc']=z['pr_auc']=None
    b=float(brier_score_loss(y,p));bb=float(brier_score_loss(y,base));z['brier']=b;z['brier_skill']=float(1-b/bb) if bb else None;z['log_loss']=float(log_loss(y,np.clip(p,1e-8,1-1e-8),labels=[0,1]));z['info_gain_bits']=float((log_loss(y,np.clip(base,1e-8,1-1e-8),labels=[0,1])-z['log_loss'])/math.log(2))
    cut=np.quantile(p,.9);z['top10_capture']=float(y[p>=cut].sum()/max(1,y.sum()));ece=0
    for a,bn in zip(np.linspace(0,1,11)[:-1],np.linspace(0,1,11)[1:]):
        m=(p>=a)&(p<(bn if bn<1 else 1.0001));ece+=m.mean()*abs(p[m].mean()-y[m].mean()) if m.any() else 0
    z['ece10']=float(ece);return z

def train(days,cells,X,Y,YC,source,start,end,target,grid,events,out):
    nC=len(cells);FX=X.reshape(-1,X.shape[-1]);fy=Y.reshape(-1);fc=YC.reshape(-1);dr=np.repeat(days.tz_convert(None).to_numpy(),nC);cr=np.tile(np.arange(nC),len(days));te=pd.Timestamp(end)-pd.Timedelta(days=365);ca=te-pd.Timedelta(days=365);wa=pd.Timestamp(start)+pd.Timedelta(days=366)
    tr=(dr>=wa.to_datetime64())&(dr<ca.to_datetime64());cal=(dr>=ca.to_datetime64())&(dr<te.to_datetime64());test=dr>=te.to_datetime64();print('rows',tr.sum(),cal.sum(),test.sum(),'positives',fy[tr].sum(),fy[cal].sum(),fy[test].sum())
    td=len(np.unique(dr[tr]));pc=(np.bincount(cr[tr],weights=fy[tr],minlength=nC)+.5)/(td+1);pcl=pc[cr]
    ep=PoissonRegressor(alpha=1e-3,max_iter=400).fit(FX[tr][:,[5,8]],fc[tr]);mu=np.maximum(1e-10,ep.predict(FX[:,[5,8]]));pet=1-np.exp(-mu)
    XC=np.column_stack([FX,logit(pet)]);sc=StandardScaler().fit(XC[tr]);Z=sc.transform(XC);lr=LogisticRegression(C=.35,max_iter=600).fit(Z[tr],fy[tr]);pcp=lr.predict_proba(Z)[:,1]
    px=None
    if XGBClassifier is not None:
        rng=np.random.default_rng(42);it=np.where(tr)[0];po=it[fy[it]==1];ne=it[fy[it]==0];nn=min(len(ne),max(50000,len(po)*35));sel=np.r_[po,rng.choice(ne,nn,False)];rng.shuffle(sel);xm=XGBClassifier(n_estimators=240,max_depth=4,learning_rate=.05,subsample=.82,colsample_bytree=.85,min_child_weight=5,reg_lambda=2,tree_method='hist',n_jobs=2,random_state=42);xm.fit(XC[sel],fy[sel]);raw=xm.predict_proba(XC)[:,1];tp=fy[tr].mean();sp=fy[sel].mean();fac=(tp/(1-tp+1e-12))/(sp/(1-sp+1e-12));od=raw/(1-raw+1e-12)*fac;px=np.clip(od/(1+od),1e-8,1-1e-8)
    cds=np.unique(dr[cal]);cut=cds[max(0,int(len(cds)*.67)-1)];meta=cal&(dr<=cut);hold=cal&(dr>cut)
    BM=np.column_stack([logit(pet),logit(pcp)]);bm=LogisticRegression(C=.25,max_iter=400).fit(BM[meta],fy[meta]);pb=bm.predict_proba(BM)[:,1];br=None
    if fy[hold].sum()>=10:br=LogisticRegression(C=1e6,max_iter=300).fit(logit(pb[hold]).reshape(-1,1),fy[hold]);pb=br.predict_proba(logit(pb).reshape(-1,1))[:,1]
    comps=[pet,pcp];names=['etas','compact']
    if px is not None:comps.append(px);names.append('xgb')
    M=np.column_stack([logit(x) for x in comps]);mm=LogisticRegression(C=.25,max_iter=400).fit(M[meta],fy[meta]);ph=mm.predict_proba(M)[:,1];rr=None
    if fy[hold].sum()>=10:rr=LogisticRegression(C=1e6,max_iter=300).fit(logit(ph[hold]).reshape(-1,1),fy[hold]);ph=rr.predict_proba(logit(ph).reshape(-1,1))[:,1]
    idx=np.where(test)[0];base=pcl[idx];pred={'climatology':pcl,'etas':pet,'compact':pcp,'browser_hybrid':pb,'hybrid':ph};
    if px is not None:pred['xgb']=px
    met={k:metric(fy[idx],v[idx],base) for k,v in pred.items()};last=slice((len(days)-1)*nC,len(days)*nC);latest=sorted([{'cell':i,'lat':float(cells[i,0]),'lon':float(cells[i,1]),'browser_hybrid':float(pb[last][i]),'etas':float(pet[last][i]),'compact':float(pcp[last][i])} for i in range(nC)],key=lambda x:x['browser_hybrid'],reverse=True)[:40]
    bundle={'schema':'plate-stress-hybrid-v2','generated_at':datetime.now(timezone.utc).isoformat(),'source':source,'config':{'start':start,'end':end,'target_mag':target,'grid_deg':grid},'feature_names':FEATURES+['etas_logit'],'grid_cells':[{'id':i,'lat':float(c[0]),'lon':float(c[1]),'lat0':float(c[2]),'lon0':float(c[3])} for i,c in enumerate(cells)],'etas_poisson':{'features':['log_etas','log_bg365'],'coef':ep.coef_.tolist(),'intercept':float(ep.intercept_)},'compact':{'scaler_mean':sc.mean_.tolist(),'scaler_scale':sc.scale_.tolist(),'coef':lr.coef_[0].tolist(),'intercept':float(lr.intercept_[0])},'browser_stack':{'components':['etas','compact'],'coef':bm.coef_[0].tolist(),'intercept':float(bm.intercept_[0]),'recal_coef':float(br.coef_[0,0]) if br else 1.,'recal_intercept':float(br.intercept_[0]) if br else 0.},'research_stack':{'components':names,'coef':mm.coef_[0].tolist(),'intercept':float(mm.intercept_[0]),'recal_coef':float(rr.coef_[0,0]) if rr else 1.,'recal_intercept':float(rr.intercept_[0]) if rr else 0.},'metrics':met,'splits':{'calibration_start':str(ca.date()),'test_start':str(te.date()),'test_end':end},'counts':{'events':int(events),'test_rows':int(test.sum()),'test_positives':int(fy[test].sum())},'latest_top':latest,'notes':['Strictly time-ordered evaluation.','Unsigned stress-envelope feature; not signed Coulomb stress.']}
    out.mkdir(parents=True,exist_ok=True);(out/'model_bundle.json').write_text(json.dumps(bundle,indent=2));pd.DataFrame([{'model':k,**v} for k,v in met.items()]).to_csv(out/'metrics.csv',index=False);print(json.dumps(met,indent=2))

def main():
    a=argparse.ArgumentParser();a.add_argument('--source',choices=['usgs','jma'],required=True);a.add_argument('--start',required=True);a.add_argument('--end',required=True);a.add_argument('--min-mag',type=float,default=2.5);a.add_argument('--target-mag',type=float,default=4);a.add_argument('--grid',type=float,default=1.5);a.add_argument('--cache',default='cache');a.add_argument('--out',default='output');z=a.parse_args();cache=Path(z.cache);cache.mkdir(parents=True,exist_ok=True);d=usgs(z.start,z.end,z.min_mag,cache) if z.source=='usgs' else jma(z.start,z.end,z.min_mag,cache);d=d[(d.mag>=z.min_mag)&d.lat.between(BOUNDS[0],BOUNDS[1])&d.lon.between(BOUNDS[2],BOUNDS[3])].sort_values('time').reset_index(drop=True);print('events',len(d),'targets',int((d.mag>=z.target_mag).sum()));days,cells,X,Y,YC=build(d,z.start,z.end,z.min_mag,z.target_mag,z.grid);train(days,cells,X,Y,YC,z.source,z.start,z.end,z.target_mag,z.grid,len(d),Path(z.out))
if __name__=='__main__':main()
