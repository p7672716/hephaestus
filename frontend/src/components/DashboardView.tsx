import type { ChatSession, RuntimeInfo } from '../types';

interface DashboardViewProps {
  runtime: RuntimeInfo;
  sessions: ChatSession[];
}

export function DashboardView({ runtime, sessions }: DashboardViewProps) {
  const activeLabel = runtime.starting_model_label ?? runtime.active_model_label ?? 'None';
  return (
    <section className="page dashboard-page">
      <div className="page-heading">
        <div><p className="eyebrow">Local AI control plane</p><h1>Dashboard</h1></div>
        <span className={`state-badge state-${runtime.state}`}>{runtime.state}</span>
      </div>
      <div className="metric-grid">
        <article><span>Resident model</span><strong>{activeLabel}</strong><small>{runtime.provider ?? 'auto provider'}</small></article>
        <article><span>Acceleration</span><strong>{runtime.acceleration ?? 'Not running'}</strong><small>Adaptive GPU-layer fallback</small></article>
        <article><span>Context</span><strong>{runtime.ctx_size ?? '8192'}</strong><small>Batch {runtime.batch_size ?? '512'}</small></article>
        <article><span>Sessions</span><strong>{sessions.length}</strong><small>Stored in this browser</small></article>
      </div>
      <div className="dashboard-columns">
        <article className="surface-card">
          <p className="eyebrow">Prepared models</p>
          <h2>Runtime inventory</h2>
          <div className="inventory-list">
            {Object.entries(runtime.prepared ?? { 'agents-a1': false, ornith: false }).map(([name, ready]) => (
              <div key={name}><strong>{name}</strong><span>{ready ? 'Downloaded' : 'Download on demand'}</span></div>
            ))}
          </div>
        </article>
        <article className="surface-card">
          <p className="eyebrow">Recent activity</p>
          <h2>Conversations</h2>
          <div className="inventory-list">
            {sessions.slice(0, 5).map((session) => (
              <div key={session.id}><strong>{session.title}</strong><span>{session.messages.length} messages</span></div>
            ))}
          </div>
        </article>
      </div>
      {runtime.last_error && <pre className="error-console">{runtime.last_error}</pre>}
    </section>
  );
}
