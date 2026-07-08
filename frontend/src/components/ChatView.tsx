import { type DragEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import { MarkdownText } from './MarkdownText';
import type { ChatFolder, ChatSession, ModelMode } from '../types';

interface ChatViewProps {
  sessions: ChatSession[];
  folders: ChatFolder[];
  activeSession?: ChatSession;
  activeId: string;
  expandedFolderId: string | null;
  streaming: boolean;
  onSelectSession: (id: string) => void;
  onToggleFolder: (id: string | null) => void;
  onAddSession: () => void;
  onAddFolder: () => void;
  onDeleteSession: (id: string) => void;
  onDeleteFolder: (id: string) => void;
  onRenameSession: (id: string, title: string) => void;
  onRenameFolder: (id: string, title: string) => void;
  onAssignSessionFolder: (id: string, folderId: string | null) => void;
  onEditMessage: (sessionId: string, messageId: string, text: string) => void;
  onSelectMessageVersion: (sessionId: string, messageId: string, index: number) => void;
  onModelMode: (mode: ModelMode) => void;
  onReasoning: (enabled: boolean) => void;
  onSend: (text: string) => Promise<void>;
  onStop: () => void;
}

function formatTime(value: number) {
  return new Intl.DateTimeFormat('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false }).format(value);
}

function splitThinking(value: string) {
  const source = String(value || '');
  const tagged = /<think>([\s\S]*?)<\/think>/i.exec(source);
  if (tagged) return { thinking: tagged[1].trim(), answer: source.replace(tagged[0], '').trim() };
  const openMatch = /<think>/i.exec(source);
  if (openMatch) return { thinking: source.slice(openMatch.index + openMatch[0].length).trim(), answer: source.slice(0, openMatch.index).trim() };
  const closeIndex = source.toLowerCase().indexOf('</think>');
  if (closeIndex >= 0) return { thinking: source.slice(0, closeIndex).trim(), answer: source.slice(closeIndex + 8).trim() };
  const finalMatch = /\n\s*(?:final answer|回答|最終回答)\s*[:：]\s*/i.exec(source);
  if (/^\s*(?:here'?s a )?thinking process\s*[:：]/i.test(source) && finalMatch) {
    return { thinking: source.slice(0, finalMatch.index).trim(), answer: source.slice(finalMatch.index + finalMatch[0].length).trim() };
  }
  if (/^\s*(?:here'?s a )?thinking process\s*[:：]/i.test(source)) {
    return { thinking: source.replace(/^\s*(?:here'?s a )?thinking process\s*[:：]\s*/i, '').trim(), answer: '' };
  }
  return { thinking: '', answer: source };
}

export function ChatView(props: ChatViewProps) {
  const [text, setText] = useState('');
  const [skillOpen, setSkillOpen] = useState(false);
  const [skillText, setSkillText] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [draggingSessionId, setDraggingSessionId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ block: 'end' });
  }, [props.activeSession?.messages]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = text.trim();
    if (!value || props.streaming) return;
    setText('');
    await props.onSend(value);
  }

  function insertText(value: string) {
    setText((current) => `${current}${current && !current.endsWith(' ') ? ' ' : ''}${value}`);
  }

  function addSkill() {
    insertText(`[$${skillText.trim().replace(/^\$/, '') || 'skill'}] `);
    setSkillText('');
    setSkillOpen(false);
  }

  const foldersById = new Map(props.folders.map((folder) => [folder.id, folder]));
  const looseSessions = props.sessions.filter((session) => !session.folderId || !foldersById.has(session.folderId));
  const dropSession = (event: DragEvent, folderId: string | null) => {
    event.preventDefault();
    const sessionId = event.dataTransfer.getData('text/plain') || draggingSessionId;
    if (!sessionId) return;
    props.onAssignSessionFolder(sessionId, folderId);
    setDraggingSessionId(null);
  };

  return (
    <section className="chat-layout">
      <aside className="session-panel">
        <div className="panel-heading">
          <div><p className="eyebrow">Conversations</p><h2>Chat</h2></div>
          <div className="session-heading-actions">
            <button className="round-button new-session" id="newChatFolderButton" type="button" onClick={props.onAddFolder} aria-label="New folder"><Icon name="folder" /></button>
            <button className="round-button new-session" id="newSessionButton" type="button" onClick={props.onAddSession} aria-label="New chat"><Icon name="plus" /></button>
          </div>
        </div>
        <div className="session-list" id="sessionList">
          {props.folders.map((folder) => {
            const open = props.expandedFolderId === folder.id;
            const children = props.sessions.filter((session) => session.folderId === folder.id);
            return (
              <div
                key={folder.id}
                className={draggingSessionId ? 'folder-row is-drop-target' : 'folder-row'}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => dropSession(event, folder.id)}
              >
                <div className="session-row">
                  <button className="folder-select session-select" type="button" onClick={() => props.onToggleFolder(open ? null : folder.id)} aria-expanded={open}>
                    <span className="chat-folder-icon"><Icon name="folder" /></span>
                    <span className="folder-title-stack">
                      <input
                        aria-label={`${folder.title} name`}
                        value={folder.title}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => props.onRenameFolder(folder.id, event.target.value)}
                      />
                      <span>{children.length} sessions</span>
                    </span>
                  </button>
                  <button className="delete-button" type="button" onClick={() => props.onDeleteFolder(folder.id)} aria-label={`Delete ${folder.title}`}><Icon name="trash" /></button>
                </div>
                {open && (
                  <div
                    className={draggingSessionId ? 'folder-sessions is-drop-target' : 'folder-sessions'}
                    onDragOver={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                    onDrop={(event) => {
                      event.stopPropagation();
                      dropSession(event, folder.id);
                    }}
                  >
                    {children.length ? children.map((session) => (
                      <SessionRow
                        key={session.id}
                        session={session}
                        dragging={draggingSessionId === session.id}
                        onDragStart={() => setDraggingSessionId(session.id)}
                        onDragEnd={() => setDraggingSessionId(null)}
                        props={props}
                      />
                    )) : <p className="empty-state">セッションなし</p>}
                  </div>
                )}
              </div>
            );
          })}
          <div
            className={draggingSessionId ? 'loose-session-drop is-drop-target' : 'loose-session-drop'}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => dropSession(event, null)}
          >
            {looseSessions.map((session) => (
              <SessionRow
                key={session.id}
                session={session}
                dragging={draggingSessionId === session.id}
                onDragStart={() => setDraggingSessionId(session.id)}
                onDragEnd={() => setDraggingSessionId(null)}
                props={props}
              />
            ))}
          </div>
        </div>
      </aside>

      <div className="conversation-panel">
        <div className="conversation-toolbar">
          <div className="conversation-title-edit">
            <p className="eyebrow">Local inference</p>
            <input
              id="conversationTitle"
              aria-label="Session name"
              value={props.activeSession?.title ?? 'Chat'}
              onChange={(event) => props.activeSession && props.onRenameSession(props.activeSession.id, event.target.value)}
            />
            {props.activeSession && (
              <select
                aria-label="Session folder"
                value={props.activeSession.folderId ?? ''}
                onChange={(event) => props.onAssignSessionFolder(props.activeSession!.id, event.target.value || null)}
              >
                <option value="">No folder</option>
                {props.folders.map((folder) => <option key={folder.id} value={folder.id}>{folder.title}</option>)}
              </select>
            )}
            <p id="conversationMeta" hidden />
          </div>
          <div className="route-controls model-segmented" id="modelRouteSelector" role="group" aria-label="Model routing">
            {(['auto', 'agents-a1', 'ornith'] as ModelMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                data-model={mode}
                className={props.activeSession?.modelMode === mode ? 'is-active' : ''}
                aria-pressed={props.activeSession?.modelMode === mode}
                onClick={() => props.onModelMode(mode)}
              >
                {mode === 'agents-a1' ? 'Agents-A1' : mode === 'ornith' ? 'Ornith' : 'Auto'}
              </button>
            ))}
            <button
              className="message-action reasoning-toggle"
              id="reasoningToggle"
              type="button"
              aria-label="推論を切り替える"
              aria-pressed={props.activeSession?.reasoningEnabled ?? false}
              onClick={() => props.onReasoning(!(props.activeSession?.reasoningEnabled ?? false))}
            >
              <Icon name="reasoning" />
            </button>
          </div>
        </div>

        <div className="message-list" id="messageList" aria-live="polite">
          {!props.activeSession?.messages.length && (
            <div className="empty-conversation">
              <img className="empty-icon" src="/assets/hephaestus-icon.svg" width="56" height="56" alt="" />
              <h2>Forge a question</h2>
              <p>Auto routing sends coding work to Ornith and analysis work to Agents-A1.</p>
            </div>
          )}
          {props.activeSession?.messages.map((message) => {
            const parts = message.role === 'assistant' ? splitThinking(message.content) : { thinking: '', answer: message.content };
            const progress = message.metadata?.progress || parts.thinking;
            const answer = parts.answer || (message.streaming && !progress ? 'Generating…' : '');
            const versions = message.versions?.length ? message.versions : [message.content];
            const versionIndex = message.versionIndex ?? 0;
            const editing = editingMessageId === message.id;
            return (
              <article key={message.id} className={`message from-${message.role}`}>
                <header>
                  <strong>{message.role === 'user' ? 'You' : message.metadata?.selectedModelLabel ?? 'Hephaestus'}</strong>
                  <span>{formatTime(message.createdAt)}</span>
                  {message.metadata?.provider && <span>{message.metadata.provider}</span>}
                  {message.metrics?.tokensPerSecond && <span>{message.metrics.tokensPerSecond.toFixed(1)} t/s</span>}
                  <span className="message-actions">
                    {versions.length > 1 && (
                      <>
                        <button type="button" disabled={versionIndex <= 0} onClick={() => props.onSelectMessageVersion(props.activeId, message.id, versionIndex - 1)} aria-label="Previous version"><Icon name="prev" /></button>
                        <small>{versionIndex + 1} / {versions.length}</small>
                        <button type="button" disabled={versionIndex >= versions.length - 1} onClick={() => props.onSelectMessageVersion(props.activeId, message.id, versionIndex + 1)} aria-label="Next version"><Icon name="next" /></button>
                      </>
                    )}
                    {message.role === 'user' && (
                      <button type="button" onClick={() => { setEditingMessageId(message.id); setEditingText(message.content); }} aria-label="Edit message"><Icon name="edit" /></button>
                    )}
                  </span>
                </header>
                {progress && (
                  <details className="reasoning-block" open={message.streaming}>
                    <summary>{message.streaming ? '進捗を表示中' : '進捗'}</summary>
                    <div className="reasoning-text"><MarkdownText text={progress} /></div>
                  </details>
                )}
                {answer && <div className="message-content"><MarkdownText text={answer} /></div>}
                {editing && (
                  <form className="edit-form" onSubmit={(event) => {
                    event.preventDefault();
                    props.onEditMessage(props.activeId, message.id, editingText);
                    setEditingMessageId(null);
                  }}>
                    <textarea value={editingText} onChange={(event) => setEditingText(event.target.value)} />
                    <div className="edit-actions">
                      <button type="button" onClick={() => setEditingMessageId(null)}>Cancel</button>
                      <button type="submit">Save</button>
                    </div>
                  </form>
                )}
              </article>
            );
          })}
          <div ref={messageEndRef} />
        </div>

        <form className="composer" onSubmit={submit}>
          <div className="composer-box">
            <div className={skillOpen ? 'composer-tools is-open' : 'composer-tools'}>
              <button className="composer-tool-toggle" type="button" onClick={() => setSkillOpen((value) => !value)} aria-label="Tools"><Icon name="plus" /></button>
              <div className="composer-tool-menu">
                <button type="button" onClick={() => fileInputRef.current?.click()}>File</button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  hidden
                  onChange={(event) => {
                    const names = Array.from(event.target.files ?? []).map((file) => `@${file.name}`);
                    if (names.length) insertText(`${names.join(' ')} `);
                    event.currentTarget.value = '';
                    setSkillOpen(false);
                  }}
                />
                <div className="composer-skill-row">
                  <input value={skillText} onChange={(event) => setSkillText(event.target.value)} placeholder="$skill" />
                  <button type="button" onClick={addSkill}>Skill</button>
                </div>
              </div>
            </div>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) event.currentTarget.form?.requestSubmit();
              }}
              placeholder="Message Hephaestus…"
              rows={3}
            />
            {props.streaming ? (
              <button className="composer-send" type="button" onClick={props.onStop} aria-label="Stop"><Icon name="stop" /></button>
            ) : (
              <button className="composer-send" type="submit" disabled={!text.trim()} aria-label="Send"><Icon name="send" /></button>
            )}
          </div>
          <div className="composer-footer">
            <span>Ctrl/⌘ + Enter to send</span>
          </div>
        </form>
      </div>
    </section>
  );
}

function SessionRow({
  session,
  dragging,
  onDragStart,
  onDragEnd,
  props,
}: {
  session: ChatSession;
  dragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  props: ChatViewProps;
}) {
  return (
    <div
      className={`${session.id === props.activeId ? 'session-row is-active' : 'session-row'}${dragging ? ' is-dragging' : ''}`}
      draggable
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', session.id);
        onDragStart();
      }}
      onDragEnd={onDragEnd}
    >
      <button type="button" onClick={() => props.onSelectSession(session.id)}>
        <input
          aria-label={`${session.title} name`}
          value={session.title}
          onClick={(event) => event.stopPropagation()}
          onChange={(event) => props.onRenameSession(session.id, event.target.value)}
        />
        <span>{formatTime(session.updatedAt)} · {session.modelMode}</span>
      </button>
      <button className="delete-button" type="button" onClick={() => props.onDeleteSession(session.id)} aria-label={`Delete ${session.title}`}><Icon name="trash" /></button>
    </div>
  );
}
