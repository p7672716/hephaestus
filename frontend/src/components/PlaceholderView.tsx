import { useState } from 'react';
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

const linkCandidates = [
  ['Runtime tuning notes', 'Ornith / 12 messages'],
  ['React migration review', 'Agents-A1 / 8 messages'],
  ['External access setup', 'Auto / 5 messages'],
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
  const [linkFlowOpen, setLinkFlowOpen] = useState(false);
  return (
    <section className="page static-view coding-view view" id="coding" data-view="coding" aria-labelledby="codingTitle">
      <header className="view-heading"><p className="eyebrow section-kicker">Workspace</p><h1 id="codingTitle">Coding</h1></header>
      <div className="static-coding-shell coding-shell">
        <aside className="surface-card static-side-panel project-panel">
          <div className="static-panel-heading project-heading">
            <p className="eyebrow section-kicker">Projects</p>
            <button className="round-button coding-session-create" id="newProjectButton" type="button" disabled aria-label="New project"><Icon name="plus" /></button>
          </div>
          <div className="project-list" id="codingProjectList">
            {projects.map((project, index) => (
              <div key={project.name} className={index === 0 ? 'static-list-item project-item is-active is-expanded' : 'static-list-item project-item'}>
                <strong className="project-title project-select">{project.name}</strong>
                <span className="project-meta">{project.updated}</span>
                {index === 0 && (
                  <div className="static-accordion project-accordion">
                    <div className="project-accordion-inner">
                    <div className="session-group-row">
                      <p className="session-group-title">Coding</p>
                      <button className="new-session coding-session-create" type="button" disabled aria-label={`${project.name}にCodingセッションを追加`}><Icon name="plus" /></button>
                    </div>
                    {project.sessions.map((session) => <button key={session} className="accordion-session coding-session-item session-item coding-session-select session-select" type="button" disabled><span className="coding-session-title">{session}</span></button>)}
                    <div className="session-group-row">
                      <p className="session-group-title">Linked Chat</p>
                      <button
                        className="new-session link-flow-toggle"
                        type="button"
                        aria-label={`${project.name}にChatをリンク`}
                        aria-expanded={linkFlowOpen}
                        onClick={() => setLinkFlowOpen((open) => !open)}
                      >
                        <Icon name="plus" />
                      </button>
                    </div>
                    {project.linked.map((session) => <button key={session} className="accordion-session coding-session-item session-item coding-session-select session-select" type="button" disabled><span className="coding-session-title">{session}</span></button>)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>
        <section className="surface-card static-workbench coding-workbench">
          <header className="static-workspace-header workspace-header">
            <div><p className="eyebrow section-kicker">Project</p><h2 id="codingProjectTitle">{active.name}</h2></div>
            <p id="codingProjectMeta" hidden>{active.updated}</p>
            <span className="state-badge">Dummy</span>
          </header>
          <div className="static-workspace-grid workspace-grid">
            <section className="static-tree workspace-panel workspace-tree" id="codingWorkspaceTree">
              <p className="eyebrow section-kicker">Workspace</p>
              {active.files.map((file) => {
                const [name, meta] = file.split(' / ');
                return <div key={file} className="tree-row"><span className="tree-kind">{name.includes('.') ? 'file' : 'dir'}</span><strong className="tree-name">{name}</strong><small className="tree-meta">{meta}</small></div>;
              })}
            </section>
            <section className="static-session-detail coding-session-detail" id="codingSessionDetail">
              <header className="detail-header"><div><p className="eyebrow section-kicker">Session</p><h2 className="coding-session-title" id="codingSessionTitle">Chat UI build</h2></div><p id="codingSessionMeta" hidden>Dummy</p></header>
              <div className="coding-session-body detail-block" id="codingSessionBody">
                <div className="static-message from-assistant">Workspace ready. Describe the code change to make in this project.</div>
                <form className="workspace-settings">
                  <label className="setting-row">
                    <span className="detail-label">Directory</span>
                    <input className="setting-input" value="/home/user/hephaestus" readOnly />
                  </label>
                  <button className="setting-submit" type="button" disabled>Apply</button>
                </form>
              </div>
              <div className="static-composer coding-chat-composer"><span>このセッションに送るメッセージ</span><Icon name="send" /></div>
            </section>
          </div>
        </section>
      </div>
      {linkFlowOpen && (
        <div className="link-flow-backdrop" onClick={() => setLinkFlowOpen(false)}>
          <section className="link-flow" aria-label={`${active.name}にリンクするChatを選択`} onClick={(event) => event.stopPropagation()}>
            <header className="link-flow-header">
              <div><p className="section-kicker">Linked Chat</p><h3>{active.name}</h3></div>
              <p className="link-flow-count">{linkCandidates.length} / {linkCandidates.length} linkable</p>
            </header>
            <input className="link-flow-search" type="search" aria-label="リンク可能なChatを検索" placeholder="タイトル・内容を検索" disabled />
            <div className="link-flow-list">
              {linkCandidates.map(([title, meta]) => (
                <div className="link-candidate session-item" key={title}>
                  <button className="coding-session-select session-select" type="button" disabled aria-label={`${title}をリンク`}>
                    <span className="coding-session-title session-title">{title}</span>
                    <span>{meta}</span>
                  </button>
                  <button className="link-action" type="button" disabled aria-label={`${title}をリンク`}><Icon name="link" /></button>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

function NotebookView() {
  const active = notes[0];
  return (
    <section className="page static-view notebook-view view" id="notebook" data-view="notebook" aria-labelledby="notebookTitle">
      <header className="view-heading"><p className="eyebrow section-kicker">Research</p><h1 id="notebookTitle">Notebook</h1></header>
      <div className="static-notebook-shell notebook-shell">
        <aside className="surface-card static-side-panel notebook-sessions">
          <div className="static-panel-heading"><p className="eyebrow section-kicker">Notes</p><button className="round-button" id="newNotebookNoteButton" type="button" disabled aria-label="Add note"><Icon name="plus" /></button></div>
          <div className="project-list" id="notebookNoteList">
            {notes.map((note, index) => <div key={note.title} className={index === 0 ? 'static-list-item project-item is-active' : 'static-list-item project-item'}><strong className="project-title">{note.title}</strong><span className="project-meta">{note.updated}</span></div>)}
          </div>
        </aside>
        <section className="surface-card static-session-detail notebook-main">
          <header className="notebook-header notebook-title-form"><p className="eyebrow section-kicker">Conversation</p><h2 className="notebook-title-input" id="notebookConversationTitle">Local Model Research</h2><span id="notebookSourceMeta">3 sources / Local model harness selected</span></header>
          <div className="notebook-chat-list" id="notebookChatList">
            <div className="static-message from-assistant">選択中のSourceに基づいて質問できます。回答生成処理は後で接続します。</div>
          </div>
          <div className="static-composer notebook-composer"><span>ソースについて質問</span><Icon name="send" /></div>
        </section>
        <aside className="surface-card static-side-panel notebook-sources">
          <div className="static-panel-heading"><p className="eyebrow section-kicker">Sources</p><button className="round-button" id="newSourceButton" type="button" disabled aria-label="Add source"><Icon name="plus" /></button></div>
          <div className="source-list" id="sourceList">
            {active.sources.map((source) => {
              const [title, meta] = source.split(' / ');
              return <div key={source} className="static-list-item source-item source-select"><strong className="source-title">{title}</strong><span className="source-meta">{meta}</span></div>;
            })}
          </div>
        </aside>
      </div>
    </section>
  );
}

function InventoryView({ kind, items }: { kind: 'Skill' | 'Tool'; items: string[][] }) {
  const id = kind.toLowerCase();
  const titleId = kind === 'Skill' ? 'skillTitle' : 'toolTitle';
  const searchId = kind === 'Skill' ? 'skillSearch' : 'toolSearch';
  const buttonId = kind === 'Skill' ? 'newSkillButton' : 'newToolButton';
  const listId = kind === 'Skill' ? 'skillList' : 'toolList';
  return (
    <section className="page static-view skill-view view" id={id} data-view={id} aria-labelledby={titleId}>
      <div className="skill-shell">
        <header className="skill-heading">
          <div><p className="eyebrow section-kicker">Capabilities</p><h1 id={titleId}>{kind}</h1></div>
          <div className="skill-toolbar">
            <input className="skill-search" id={searchId} type="search" placeholder={`Search ${kind.toLowerCase()}s`} disabled />
            <button className="round-button" id={buttonId} type="button" disabled aria-label={`Add ${kind}`}><Icon name="plus" /></button>
          </div>
        </header>
        <div className="skill-grid" id={listId}>
          {items.map(([name, scope, description]) => (
            <article key={name} className="skill-card">
              <div className="skill-card-head">
                <span className="skill-card-icon"><Icon name={kind === 'Skill' ? 'skill' : 'tool'} /></span>
                <div className="skill-card-title"><p className="skill-card-meta">{scope}</p><h2>{name}</h2></div>
              </div>
              <p className="skill-card-description">{description}</p>
              <code className="skill-card-path">Static migration shell</code>
              <footer className="skill-card-foot"><span className="skill-chip-list"><span className="skill-chip">Enabled</span></span><button className="session-delete skill-switch" type="button" disabled><Icon name="trash" /></button></footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SimpleStaticView({ view }: { view: 'automation' | 'knowledge' }) {
  const title = view === 'automation' ? 'Automation' : 'Knowledge';
  const titleId = view === 'automation' ? 'automationTitle' : 'knowledgeTitle';
  const items = view === 'automation'
    ? ['PR hygiene', 'Runtime benchmark', 'UI migration']
    : ['Project notes', 'Runtime docs', 'Model tuning'];
  return (
    <section className={`page static-view static-${view} view`} id={view} data-view={view} aria-labelledby={titleId}>
      <div className="page-heading">
        <div><p className="eyebrow section-kicker">{view === 'automation' ? 'Queue' : 'Memory'}</p><h1 id={titleId}>{title}</h1></div>
        <span className="state-badge">Dummy</span>
      </div>
      <div className="static-grid">
        {items.map((item) => <article key={item} className="surface-card static-main"><strong>{item}</strong><span>Static React migration shell</span></article>)}
      </div>
    </section>
  );
}
