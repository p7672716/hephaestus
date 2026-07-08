import { FormEvent, useEffect, useRef, useState } from 'react';
import type { ChatSession, ModelMode } from '../types';

interface ChatViewProps {
  sessions: ChatSession[];
  activeSession?: ChatSession;
  activeId: string;
  streaming: boolean;
  onSelectSession: (id: string) => void;
  onAddSession: () => void;
  onDeleteSession: (id: string) => void;
  onModelMode: (mode: ModelMode) => void;
  onReasoning: (enabled: boolean) => void;
  onSend: (text: string) => Promise<void>;
  onStop: () => void;
}

function formatTime(value: number) {
  return new Intl.DateTimeFormat('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false }).format(value);
}

export function ChatView(props: ChatViewProps) {
  const [text, setText] = useState('');
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

  return (
    <section className="chat-layout">
      <aside className="session-panel">
        <div className="panel-heading">
          <div><p className="eyebrow">Conversations</p><h2>Chat</h2></div>
          <button className="round-button" type="button" onClick={props.onAddSession} aria-label="New chat">＋</button>
        </div>
        <div className="session-list">
          {props.sessions.map((session) => (
            <div key={session.id} className={session.id === props.activeId ? 'session-row is-active' : 'session-row'}>
              <button type="button" onClick={() => props.onSelectSession(session.id)}>
                <strong>{session.title}</strong>
                <span>{formatTime(session.updatedAt)} · {session.modelMode}</span>
              </button>
              <button className="delete-button" type="button" onClick={() => props.onDeleteSession(session.id)} aria-label={`Delete ${session.title}`}>×</button>
            </div>
          ))}
        </div>
      </aside>

      <div className="conversation-panel">
        <div className="conversation-toolbar">
          <div>
            <p className="eyebrow">Local inference</p>
            <h1>{props.activeSession?.title ?? 'Chat'}</h1>
          </div>
          <div className="route-controls" aria-label="Model routing">
            {(['auto', 'agents-a1', 'ornith'] as ModelMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                className={props.activeSession?.modelMode === mode ? 'is-active' : ''}
                onClick={() => props.onModelMode(mode)}
              >
                {mode === 'agents-a1' ? 'Agents-A1' : mode === 'ornith' ? 'Ornith' : 'Auto'}
              </button>
            ))}
            <label className="reasoning-toggle">
              <input
                type="checkbox"
                checked={props.activeSession?.reasoningEnabled ?? false}
                onChange={(event) => props.onReasoning(event.target.checked)}
              />
              <span>Reasoning</span>
            </label>
          </div>
        </div>

        <div className="message-list" aria-live="polite">
          {!props.activeSession?.messages.length && (
            <div className="empty-conversation">
              <span className="forge-mark" aria-hidden="true">H</span>
              <h2>Forge a question</h2>
              <p>Auto routing sends coding work to Ornith and analysis work to Agents-A1.</p>
            </div>
          )}
          {props.activeSession?.messages.map((message) => (
            <article key={message.id} className={`message from-${message.role}`}>
              <header>
                <strong>{message.role === 'user' ? 'You' : message.metadata?.selectedModelLabel ?? 'Hephaestus'}</strong>
                <span>{formatTime(message.createdAt)}</span>
                {message.metadata?.provider && <span>{message.metadata.provider}</span>}
                {message.metrics?.tokensPerSecond && <span>{message.metrics.tokensPerSecond.toFixed(1)} t/s</span>}
              </header>
              {message.metadata?.progress && (
                <details className="reasoning-block">
                  <summary>Reasoning progress</summary>
                  <pre>{message.metadata.progress}</pre>
                </details>
              )}
              <div className="message-content">{message.content || (message.streaming ? 'Generating…' : '')}</div>
            </article>
          ))}
          <div ref={messageEndRef} />
        </div>

        <form className="composer" onSubmit={submit}>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) event.currentTarget.form?.requestSubmit();
            }}
            placeholder="Message Hephaestus…"
            rows={3}
          />
          <div className="composer-footer">
            <span>Ctrl/⌘ + Enter to send</span>
            {props.streaming ? (
              <button className="primary-button" type="button" onClick={props.onStop}>Stop</button>
            ) : (
              <button className="primary-button" type="submit" disabled={!text.trim()}>Send</button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
