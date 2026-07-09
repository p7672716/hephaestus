import { useState } from 'react';
import type { ChatSession, RuntimeInfo } from '../types';
import { Icon } from './Icon';

interface DashboardViewProps {
  runtime: RuntimeInfo;
  sessions: ChatSession[];
  activeSession?: ChatSession;
  chatStreaming: boolean;
  onStopChat: () => void;
}

interface QueueTask {
  id: string;
  title: string;
  meta: string;
  owner: string;
  elapsed?: string;
  state: string;
}

export function DashboardView({ runtime, sessions, activeSession, chatStreaming, onStopChat }: DashboardViewProps) {
  const activeLabel = runtime.starting_model_label ?? runtime.active_model_label ?? 'None';
  const [queue, setQueue] = useState<QueueTask[]>([
    { id: 'task-notebook-answer', title: 'Notebook source answer', meta: 'Local Model Research', owner: 'Notebook', state: 'waiting' },
    { id: 'task-chat-branch', title: 'Chat branch response', meta: 'Local harness', owner: 'Chat', state: 'waiting' },
    { id: 'task-knowledge-index', title: 'Knowledge indexing', meta: 'Harness docs', owner: 'Knowledge', state: 'waiting' },
  ]);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const running = queue.find((task) => task.state === 'running');
  const streamingMessage = [...(activeSession?.messages ?? [])].reverse().find((message) => message.role === 'assistant' && message.streaming);
  const chatTask: QueueTask | null = chatStreaming ? {
    id: 'task-chat-stream',
    title: 'Generate Chat response',
    meta: `${streamingMessage?.metadata?.selectedModelLabel ?? 'Hephaestus'} / ${streamingMessage?.metadata?.taskKind ?? 'chat'}`,
    owner: 'Chat',
    elapsed: 'Running',
    state: 'running',
  } : null;
  const activeTask = chatTask ?? running;
  const waiting = queue.filter((task) => task.state === 'waiting');
  const stopped = queue.filter((task) => task.state === 'stopped');
  const updateTask = (id: string, state: string) => setQueue((current) => current.map((task) => {
    if (task.id === id) return { ...task, state, elapsed: state === 'running' ? '00:00' : state === 'stopped' ? 'Stopped' : undefined };
    return task.state === 'running' && state === 'running' ? { ...task, state: 'stopped', elapsed: 'Stopped' } : task;
  }));
  const removeTask = (id: string) => setQueue((current) => current.filter((task) => task.id !== id));
  const requeueTask = (id: string) => setQueue((current) => current.map((task) => (
    task.id === id ? { ...task, state: 'waiting', elapsed: undefined } : task
  )));
  const moveWaitingTask = (targetId: string, after = false) => {
    if (!draggedTaskId || draggedTaskId === targetId) return;
    setQueue((current) => {
      const dragged = current.find((task) => task.id === draggedTaskId && task.state === 'waiting');
      if (!dragged) return current;
      const without = current.filter((task) => task.id !== draggedTaskId);
      const targetIndex = without.findIndex((task) => task.id === targetId);
      if (targetIndex < 0) return current;
      const insertIndex = targetIndex + (after ? 1 : 0);
      return [...without.slice(0, insertIndex), dragged, ...without.slice(insertIndex)];
    });
  };
  const moveWaitingTaskToEnd = () => {
    if (!draggedTaskId) return;
    setQueue((current) => {
      const dragged = current.find((task) => task.id === draggedTaskId && task.state === 'waiting');
      if (!dragged) return current;
      return [...current.filter((task) => task.id !== draggedTaskId), dragged];
    });
  };

  return (
    <section className="page dashboard-page dashboard view" id="dashboard" data-view="dashboard" aria-labelledby="dashboardTitle">
      <div className="page-heading dashboard-heading">
        <div><p className="eyebrow">Local AI control plane</p><h1 id="dashboardTitle">Dashboard</h1></div>
        <span className={`state-badge state-${runtime.state}`}>{runtime.state}</span>
      </div>
      <div className="metric-grid resource-grid">
        <article className="metric-card"><span className="metric-topline">CPU Load</span><strong>90%</strong><div className="meter"><span style={{ width: '90%' }} /></div><small>12th Gen Intel Core i5-12400</small></article>
        <article className="metric-card"><span className="metric-topline">Memory</span><strong>68%</strong><div className="meter"><span style={{ width: '68%' }} /></div><small>21.7 GB used / 31.7 GB</small></article>
        <article className="metric-card"><span className="metric-topline">Primary Disk</span><strong>53%</strong><div className="meter"><span style={{ width: '53%' }} /></div><small>C: 225.8 GB free / 475.9 GB</small></article>
        <article className="metric-card"><span className="metric-topline">Sessions</span><strong>{sessions.length}</strong><small>Stored in this browser</small></article>
      </div>
      <div className="dashboard-columns queue-grid">
        <article className="surface-card system-panel model-slot-card model-state-panel">
          <div className="page-heading queue-panel-heading">
            <h2>Model Slot</h2>
            <span className={`state-badge status-pill state-${runtime.state}${activeTask ? ' is-busy' : ''}`} id="modelSlotStatus">{activeTask ? 'busy' : runtime.state}</span>
          </div>
          <div className="inventory-list" id="modelSlotDetails">
            <div><strong>Resident model</strong><span>{activeLabel}</span></div>
            <div><strong>Provider</strong><span>{runtime.provider ?? 'auto'}</span></div>
            <div><strong>Acceleration</strong><span>{runtime.acceleration ?? 'Not running'}</span></div>
            <div><strong>Context</strong><span>{runtime.ctx_size ?? '8192'} / batch {runtime.batch_size ?? '512'}</span></div>
            <div><strong>Active task</strong><span>{activeTask?.title ?? 'No running task'}</span></div>
            <div><strong>Owner</strong><span>{activeTask?.owner ?? 'Queue waiting'}</span></div>
            <div><strong>Elapsed</strong><span>{activeTask?.elapsed ?? '--:--'}</span></div>
            <div><strong>Policy</strong><span>{runtime.mock ? 'Mock stream, single resident model' : 'Single resident model, queued execution'}</span></div>
          </div>
          <div className="model-slot-actions" id="modelSlotActions">
            {chatTask && <button className="primary-button" type="button" onClick={onStopChat}>生成を停止</button>}
            {!chatTask && running && <button className="primary-button" type="button" onClick={() => updateTask(running.id, 'stopped')}>Stop task</button>}
          </div>
        </article>
        <article className="surface-card system-panel queue-card task-queue-panel">
          <div className="page-heading queue-panel-heading">
            <h2>Queue</h2>
            <span className="state-badge queue-count" id="queueCount">{waiting.length} waiting / {stopped.length} stopped</span>
          </div>
          <ol className="task-queue" id="taskQueueList">
            {chatTask && <QueueItem task={chatTask} label="Now" onStop={onStopChat} />}
            {!chatTask && running && <QueueItem task={running} label="Now" onStop={() => updateTask(running.id, 'stopped')} />}
            {!chatTask && !running && <li className="task-queue-item task-queue-empty is-placeholder"><span className="queue-drag-spacer" /><span className="queue-rank">Now</span><div><strong>No running task</strong><small>Model slot is idle</small></div></li>}
            {waiting.map((task, index) => (
              <QueueItem
                key={task.id}
                task={task}
                label={String(index + 1).padStart(2, '0')}
                dragging={draggedTaskId === task.id}
                onDragStart={() => setDraggedTaskId(task.id)}
                onDragOver={(after) => moveWaitingTask(task.id, after)}
                onDragEnd={() => setDraggedTaskId(null)}
                onStart={() => updateTask(task.id, 'running')}
                onDelete={() => removeTask(task.id)}
              />
            ))}
            {waiting.length > 0 && (
              <li
                className={draggedTaskId ? 'queue-drop-tail is-active' : 'queue-drop-tail'}
                onDragOver={(event) => {
                  event.preventDefault();
                  moveWaitingTaskToEnd();
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  setDraggedTaskId(null);
                }}
              >
                Drop at end
              </li>
            )}
            {stopped.map((task) => <QueueItem key={task.id} task={task} label="Stop" onStart={() => updateTask(task.id, 'running')} onDelete={() => removeTask(task.id)} onRequeue={() => requeueTask(task.id)} />)}
          </ol>
        </article>
      </div>
      <div className="dashboard-columns system-grid">
        <article className="surface-card system-panel">
          <p className="eyebrow">Prepared models</p>
          <h2>Runtime inventory</h2>
          <div className="inventory-list">
            {Object.entries(runtime.prepared ?? { 'agents-a1': false, ornith: false }).map(([name, ready]) => (
              <div key={name}><strong>{name}</strong><span>{ready ? 'Downloaded' : 'Download on demand'}</span></div>
            ))}
          </div>
        </article>
        <article className="surface-card system-panel">
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

function QueueItem(props: {
  task: QueueTask;
  label: string;
  dragging?: boolean;
  onDragStart?: () => void;
  onDragOver?: (after: boolean) => void;
  onDragEnd?: () => void;
  onStart?: () => void;
  onStop?: () => void;
  onDelete?: () => void;
  onRequeue?: () => void;
}) {
  return (
    <li
      className={`task-queue-item is-${props.task.state}${props.dragging ? ' is-dragging' : ''}`}
      draggable={props.task.state === 'waiting'}
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', props.task.id);
        props.onDragStart?.();
      }}
      onDragOver={(event) => {
        if (props.task.state !== 'waiting') return;
        event.preventDefault();
        const rect = event.currentTarget.getBoundingClientRect();
        props.onDragOver?.(event.clientY > rect.top + rect.height / 2);
      }}
      onDrop={(event) => event.preventDefault()}
      onDragEnd={props.onDragEnd}
    >
      {props.task.state === 'waiting'
        ? <button className="queue-drag-handle" type="button" aria-label={`${props.task.title}をドラッグして並び替え`}><Icon name="grip" /></button>
        : <span className="queue-drag-spacer" />}
      <span className="queue-rank">{props.label}</span>
      <div><strong>{props.task.title}</strong><small>{props.task.meta} / {props.task.state}{props.task.elapsed ? ` / ${props.task.elapsed}` : ''}</small></div>
      <div className="queue-actions">
        {props.task.state === 'running' && props.onStop && <button type="button" onClick={props.onStop} aria-label="Stop task"><Icon name="stop" /></button>}
        {props.task.state === 'waiting' && <button type="button" onClick={props.onStart} aria-label="Start task"><Icon name="play" /></button>}
        {props.task.state === 'stopped' && props.onRequeue && <button type="button" onClick={props.onRequeue} aria-label="Requeue task"><Icon name="requeue" /></button>}
        {props.onDelete && <button type="button" onClick={props.onDelete} aria-label="Delete task"><Icon name="trash" /></button>}
      </div>
    </li>
  );
}
