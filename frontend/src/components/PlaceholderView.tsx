import type { ViewId } from '../types';
import { Icon } from './Icon';

type StaticViewId = Exclude<ViewId, 'dashboard' | 'chat' | 'setting'>;

const projects = [
  {
    name: 'Hephaestus UI',
    updated: '今',
    files: ['assets / 1 item', 'references / 2 items', 'index.html / layout', 'styles.css / theme', 'app.js / state'],
    sessions: ['Chat UI build', 'Dashboard resource panel'],
    linked: ['Local harness', 'Prompt check'],
  },
  {
    name: 'Local Harness',
    updated: '未接続',
    files: ['models / workspace', 'runs / outputs', 'harness.config.json / config'],
    sessions: ['Server stub'],
    linked: ['Local harness'],
  },
];

const notes = [
  {
    title: 'Local Model',
    updated: '今',
    sources: ['Local model harness / 12 pages', 'Inference notes / 8 notes', 'Harness logs / Text'],
  },
  {
    title: 'Harness',
    updated: '昨日',
    sources: ['Harness notes / 6 notes', 'Runbook / 4 pages'],
  },
];

const skills = [
  ['ponytail', 'coding', '最小実装と過剰設計回避のための coding skill。'],
  ['caveman', 'communication', '技術内容を保ったまま応答を短くする communication skill。'],
  ['playwright-cli', 'verification', 'UI操作、スクリーンショット、ブラウザ検証用 skill。'],
];

const tools = [
  ['shell_command', 'local', 'コマンド実行、構文確認、ローカルサーバー起動に使うツール。'],
  ['apply_patch', 'editing', 'ファイル編集を差分として適用するためのツール。'],
  ['image_gen', 'asset', 'アイコンや画像素材を生成するためのツール。'],
];

export function PlaceholderView({ view }: { view: StaticViewId }) {
  if (view === 'coding') return <CodingView />;
  if (view === 'notebook') return <NotebookView />;
  if (view === 'skill') return <InventoryView kind="Skill" items={skills} />;
  if (view === 'tool') return <InventoryView kind="Tool" items={tools} />;
  return <SimpleStaticView view={view} />;
}

function CodingView() {
  const active = projects[0];
  return (
    <section className="page static-view coding-view">
      <header className="view-heading"><p className="eyebrow">Workspace</p><h1>Coding</h1></header>
      <div className="static-coding-shell">
        <aside className="surface-card static-side-panel">
          <div className="static-panel-heading">
            <p className="eyebrow">Projects</p>
            <button className="round-button" type="button" disabled aria-label="New project"><Icon name="plus" /></button>
          </div>
          {projects.map((project, index) => (
            <div key={project.name} className={index === 0 ? 'static-list-item is-active' : 'static-list-item'}>
              <strong>{project.name}</strong>
              <span>{project.updated}</span>
              {index === 0 && (
                <div className="static-accordion">
                  <p>Coding</p>
                  {project.sessions.map((session) => <button key={session} type="button" disabled>{session}</button>)}
                  <p>Linked Chat</p>
                  {project.linked.map((session) => <button key={session} type="button" disabled>{session}</button>)}
                </div>
              )}
            </div>
          ))}
        </aside>
        <section className="surface-card static-workbench">
          <header className="static-workspace-header">
            <div><p className="eyebrow">Project</p><h2>{active.name}</h2></div>
            <span className="state-badge">Dummy</span>
          </header>
          <div className="static-workspace-grid">
            <section className="static-tree">
              <p className="eyebrow">Workspace</p>
              {active.files.map((file) => {
                const [name, meta] = file.split(' / ');
                return <div key={file} className="tree-row"><span>{name.includes('.') ? 'file' : 'dir'}</span><strong>{name}</strong><small>{meta}</small></div>;
              })}
            </section>
            <section className="static-session-detail">
              <div><p className="eyebrow">Session</p><h2>Chat UI build</h2></div>
              <div className="static-message from-assistant">Workspace ready. Describe the code change to make in this project.</div>
              <div className="static-composer"><span>このセッションに送るメッセージ</span><Icon name="send" /></div>
            </section>
          </div>
        </section>
      </div>
    </section>
  );
}

function NotebookView() {
  const active = notes[0];
  return (
    <section className="page static-view notebook-view">
      <header className="view-heading"><p className="eyebrow">Research</p><h1>Notebook</h1></header>
      <div className="static-notebook-shell">
        <aside className="surface-card static-side-panel">
          <div className="static-panel-heading"><p className="eyebrow">Notes</p><button className="round-button" type="button" disabled aria-label="Add note"><Icon name="plus" /></button></div>
          {notes.map((note, index) => <div key={note.title} className={index === 0 ? 'static-list-item is-active' : 'static-list-item'}><strong>{note.title}</strong><span>{note.updated}</span></div>)}
        </aside>
        <section className="surface-card static-session-detail">
          <header><p className="eyebrow">Conversation</p><h2>Local Model Research</h2><span>3 sources / Local model harness selected</span></header>
          <div className="static-message from-assistant">選択中のSourceに基づいて質問できます。回答生成処理は後で接続します。</div>
          <div className="static-composer"><span>ソースについて質問</span><Icon name="send" /></div>
        </section>
        <aside className="surface-card static-side-panel">
          <div className="static-panel-heading"><p className="eyebrow">Sources</p><button className="round-button" type="button" disabled aria-label="Add source"><Icon name="plus" /></button></div>
          {active.sources.map((source) => {
            const [title, meta] = source.split(' / ');
            return <div key={source} className="static-list-item"><strong>{title}</strong><span>{meta}</span></div>;
          })}
        </aside>
      </div>
    </section>
  );
}

function InventoryView({ kind, items }: { kind: 'Skill' | 'Tool'; items: string[][] }) {
  return (
    <section className="page static-view skill-view">
      <div className="skill-shell">
        <header className="skill-heading">
          <div><p className="eyebrow">Capabilities</p><h1>{kind}</h1></div>
          <div className="skill-toolbar">
            <input className="skill-search" type="search" placeholder={`Search ${kind.toLowerCase()}s`} disabled />
            <button className="round-button" type="button" disabled aria-label={`Add ${kind}`}><Icon name="plus" /></button>
          </div>
        </header>
        <div className="skill-grid">
          {items.map(([name, scope, description]) => (
            <article key={name} className="skill-card">
              <div className="skill-card-head">
                <span className="skill-card-icon"><Icon name={kind === 'Skill' ? 'skill' : 'tool'} /></span>
                <div><p>{scope}</p><h2>{name}</h2></div>
              </div>
              <p>{description}</p>
              <footer><span>Enabled</span><button type="button" disabled><Icon name="trash" /></button></footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SimpleStaticView({ view }: { view: 'automation' | 'knowledge' }) {
  const title = view === 'automation' ? 'Automation' : 'Knowledge';
  const items = view === 'automation'
    ? ['PR hygiene', 'Runtime benchmark', 'UI migration']
    : ['Project notes', 'Runtime docs', 'Model tuning'];
  return (
    <section className={`page static-view static-${view}`}>
      <div className="page-heading">
        <div><p className="eyebrow">{view === 'automation' ? 'Queue' : 'Memory'}</p><h1>{title}</h1></div>
        <span className="state-badge">Dummy</span>
      </div>
      <div className="static-grid">
        {items.map((item) => <article key={item} className="surface-card static-main"><strong>{item}</strong><span>Static React migration shell</span></article>)}
      </div>
    </section>
  );
}
