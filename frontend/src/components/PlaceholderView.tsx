import type { ViewId } from '../types';

export function PlaceholderView({ view }: { view: Exclude<ViewId, 'dashboard' | 'chat'> }) {
  return (
    <section className="page placeholder-page">
      <p className="eyebrow">React migration boundary</p>
      <h1>{view[0].toUpperCase() + view.slice(1)}</h1>
      <p>This surface is intentionally isolated as the next migration slice. Chat and runtime control already use the typed React client.</p>
      <div className="surface-card migration-card">
        <span>Next step</span>
        <strong>Move data and actions behind a feature hook, then replace this boundary without touching the app shell.</strong>
      </div>
    </section>
  );
}
