import type { ViewId } from '../types';

type StaticViewId = Exclude<ViewId, 'dashboard' | 'chat' | 'setting'>;

const data: Record<StaticViewId, {
  kicker: string;
  title: string;
  summary: string;
  leftTitle: string;
  leftItems: string[];
  mainTitle: string;
  mainItems: string[];
  sideTitle: string;
  sideItems: string[];
}> = {
  coding: {
    kicker: 'Workspace',
    title: 'Coding',
    summary: 'Projects, file tree, and coding sessions are represented here as a static migration shell.',
    leftTitle: 'Projects',
    leftItems: ['Hephaestus UI', 'Runtime harness', 'Tunnel scripts'],
    mainTitle: 'Session detail',
    mainItems: ['Chat UI migration', 'Runtime controls', 'Markdown rendering', 'Stop and unload behavior'],
    sideTitle: 'Workspace tree',
    sideItems: ['frontend/src', 'hephaestus_server', 'scripts'],
  },
  notebook: {
    kicker: 'Research',
    title: 'Notebook',
    summary: 'Notes, source cards, and local model research threads keep the old layout shape for later wiring.',
    leftTitle: 'Notes',
    leftItems: ['Local Model Research', 'llama.cpp tuning', 'Remote access'],
    mainTitle: 'Conversation',
    mainItems: ['Agents-A1 route notes', 'Ornith coding notes', 'GPU offload experiments'],
    sideTitle: 'Sources',
    sideItems: ['README', 'Runtime logs', 'Model cards'],
  },
  skill: {
    kicker: 'Capabilities',
    title: 'Skill',
    summary: 'Skill discovery and toggles are shown as disabled inventory controls.',
    leftTitle: 'Search',
    leftItems: ['ponytail', 'find-skill', 'frontend-design'],
    mainTitle: 'Installed skills',
    mainItems: ['Minimal implementation', 'Skill discovery', 'Web app testing'],
    sideTitle: 'Status',
    sideItems: ['Enabled', 'Local', 'Project scoped'],
  },
  tool: {
    kicker: 'Integrations',
    title: 'Tool',
    summary: 'Tool cards mirror the legacy operations surface without executing actions yet.',
    leftTitle: 'Search',
    leftItems: ['GitHub', 'Calendar', 'Photoshop'],
    mainTitle: 'Available tools',
    mainItems: ['Runtime API', 'Tunnel control', 'Service control'],
    sideTitle: 'Mode',
    sideItems: ['Local first', 'Token gated', 'Manual run'],
  },
  automation: {
    kicker: 'Queue',
    title: 'Automation',
    summary: 'Automation plans and task queue are visible as static scheduling panels.',
    leftTitle: 'Plans',
    leftItems: ['PR hygiene', 'Runtime benchmark', 'UI migration'],
    mainTitle: 'Task queue',
    mainItems: ['Waiting for command', 'No active automation', 'Manual approval required'],
    sideTitle: 'Guards',
    sideItems: ['Single resident model', 'Stop before switch', 'Mock safe mode'],
  },
  knowledge: {
    kicker: 'Memory',
    title: 'Knowledge',
    summary: 'Knowledge indexes, documents, and retrieval status keep their legacy dashboard shape.',
    leftTitle: 'Collections',
    leftItems: ['Project notes', 'Runtime docs', 'Model tuning'],
    mainTitle: 'Index preview',
    mainItems: ['Chat sessions', 'Benchmark notes', 'Deployment notes'],
    sideTitle: 'State',
    sideItems: ['Local only', 'Not indexing', 'Ready for migration'],
  },
};

export function PlaceholderView({ view }: { view: StaticViewId }) {
  const current = data[view];
  return (
    <section className={`page static-surface static-${view}`}>
      <div className="page-heading">
        <div><p className="eyebrow">{current.kicker}</p><h1>{current.title}</h1></div>
        <span className="state-badge">Dummy</span>
      </div>
      <p className="static-summary">{current.summary}</p>
      <div className="static-grid">
        <section className="surface-card static-list">
          <p className="eyebrow">{current.leftTitle}</p>
          {current.leftItems.map((item) => <button key={item} type="button" disabled>{item}</button>)}
        </section>
        <section className="surface-card static-main">
          <p className="eyebrow">{current.mainTitle}</p>
          {current.mainItems.map((item) => <article key={item}><strong>{item}</strong><span>Static React migration shell</span></article>)}
        </section>
        <section className="surface-card static-list">
          <p className="eyebrow">{current.sideTitle}</p>
          {current.sideItems.map((item) => <button key={item} type="button" disabled>{item}</button>)}
        </section>
      </div>
    </section>
  );
}
