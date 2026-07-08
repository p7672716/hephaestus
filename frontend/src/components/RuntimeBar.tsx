import type { RuntimeInfo } from '../types';
import { Icon } from './Icon';

interface RuntimeBarProps {
  runtime: RuntimeInfo;
  generating: boolean;
  reasoningEnabled: boolean;
  dark: boolean;
  onToggleTheme: () => void;
  onToggleSidebar: () => void;
  onStop: () => void;
  onResume: () => void;
}

function runtimeState(runtime: RuntimeInfo, generating: boolean) {
  if (generating) return '生成中';
  if (runtime.state === 'starting') return 'ロード中';
  if (runtime.state === 'mock') return 'mock';
  if (runtime.state === 'ready') return 'アイドル';
  if (runtime.state === 'idle') return '停止中';
  if (runtime.state === 'error') return 'エラー';
  if (runtime.state === 'offline') return 'オフライン';
  return '確認中';
}

export function RuntimeBar(props: RuntimeBarProps) {
  const label =
    props.runtime.starting_model_label ??
    props.runtime.active_model_label ??
    'No resident model';

  return (
    <header className="topbar">
      <button className="icon-button" type="button" onClick={props.onToggleSidebar} aria-label="Toggle sidebar"><Icon name="menu" /></button>
      <div className="brand"><img className="brand-icon" src="/assets/hephaestus-icon.svg" width="40" height="40" alt="" /><strong>Hephaestus</strong></div>
      <div className="runtime-pill topbar-runtime" title={props.runtime.last_error ?? undefined}>
        <span className={`status-dot state-${props.runtime.state}`} />
        <span id="runtimeStatus">{runtimeState(props.runtime, props.generating)}</span>
        <strong id="runtimeModel">{label}</strong>
        {props.runtime.acceleration && <small>{props.runtime.acceleration}</small>}
        <span id="runtimeReasoning">{props.reasoningEnabled ? '推論ON' : '推論OFF'}</span>
        <button className="topbar-runtime-button" id="runtimeStop" type="button" onClick={props.onStop} disabled={!props.generating && !props.runtime.active_model_id} aria-label="モデルをアンロードまたは生成を停止"><Icon name="stop" /></button>
        <button className="topbar-runtime-button" id="runtimeResume" type="button" onClick={props.onResume} disabled={props.generating || props.runtime.state === 'starting'} aria-label="モデルをロード"><Icon name="play" /></button>
      </div>
      <button className="icon-button" type="button" onClick={props.onToggleTheme} aria-label="Toggle theme"><Icon name={props.dark ? 'sun' : 'moon'} /></button>
    </header>
  );
}
