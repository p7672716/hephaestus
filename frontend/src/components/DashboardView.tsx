import { useState } from 'react';
import type { ChatSession, RuntimeInfo } from '../types';

interface DashboardViewProps {
  runtime: RuntimeInfo;
  sessions: ChatSession[];
}

interface QueueTask {
  id: string;
  title: string;
  meta: string;
  state: string;
}

export function DashboardView({ runtime, sessions }: DashboardViewProps) {
  const activeLabel = runtime.starting_model_label ?? runtime.active_model_label ?? 'None';
  const [queue, setQueue] = useState<QueueTask[]>([
    { id: 'task-notebook-answer', title: 'Notebook source answer', meta: 'Local Model Research', state: 'waiting' },
    { id: 'task-chat-branch', title: 'Chat branch response', meta: 'Local harness', state: 'waiting' },
    { id: 'task-knowledge-index', title: 'Knowledge indexing', meta: 'Harness docs', state: 'waiting' },
  ]);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const running = queue.find((task) => task.state === 'running');
  const waiting = queue.filter((task) => task.state === 'waiting');
  const stopped = queue.filter((task) => task.state === 'stopped');
  const updateTask = (id: string, state: string) => setQueue((current) => current.map((task) => (
    task.id === id ? { ...task, state } : task.state === 'running' && state === 'running' ? { ...task, state: 'stopped' } : task
  )));
  const removeTask = (id: string) => setQueue((current) => current.filter((task) => task.id !== id));
  const moveWaitingTask = (targetId: string) => {
    if (!draggedTaskId || draggedTaskId === targetId) return;
    setQueue((current) => {
      const dragged = current.find((task) => task.id === draggedTaskId && task.state === 'waiting');
      if (!dragged) return current;
      const without = current.filter((task) => task.id !== draggedTaskId);
      const targetIndex = without.findIndex((task) => task.id === targetId);
      if (targetIndex < 0) return current;
      return [...without.slice(0, targetIndex), dragged, ...without.slice(targetIndex)];
    });
  };

  return (
    <section className="page dashboard-page">
      <div className="page-heading">
        <div><p className="eyebrow">Local AI control plane</p><h1>Dashboard</h1></div>
        <span className={`state-badge state-${runtime.state}`}>{runtime.state}</span>
      </div>
      <div className="metric-grid">
        <article><span>CPU Load</span><strong>90%</strong><div className="meter"><span style={{ width: '90%' }} /></div><small>12th Gen Intel Core i5-12400</small></article>
        <article><span>Memory</span><strong>68%</strong><div className="meter"><span style={{ width: '68%' }} /></div><small>21.7 GB used / 31.7 GB</small></article>
        <article><span>Primary Disk</span><strong>53%</strong><div className="meter"><span style={{ width: '53%' }} /></div><small>C: 225.8 GB free / 475.9 GB</small></article>
        <article><span>Sessions</span><strong>{sessions.length}</strong><small>Stored in this browser</small></article>
      </div>
      <div className="dashboard-columns">
        <article className="surface-card model-slot-card">
          <div className="page-heading">
            <h2>Model Slot</h2>
            <span className={`state-badge state-${runtime.state}`}>{running ? 'busy' : runtime.state}</span>
          </div>
          <div className="inventory-list">
            <div><strong>Resident model</strong><span>{activeLabel}</span></div>
            <div><strong>Provider</strong><span>{runtime.provider ?? 'auto'}</span></div>
            <div><strong>Acceleration</strong><span>{runtime.acceleration ?? 'Not running'}</span></div>
            <div><strong>Context</strong><span>{runtime.ctx_size ?? '8192'} / batch {runtime.batch_size ?? '512'}</span></div>
            <div><strong>Active task</strong><span>{running?.title ?? 'No running task'}</span></div>
          </div>
          {running && <button className="primary-button" type="button" onClick={() => updateTask(running.id, 'stopped')}>Stop task</button>}
        </article>
        <article className="surface-card queue-card">
          <div className="page-heading">
            <h2>Queue</h2>
            <span className="state-badge">{waiting.length} waiting / {stopped.length} stopped</span>
          </div>
          <ol className="task-queue">
            {running && <QueueItem task={running} label="Now" onStart={() => updateTask(running.id, 'running')} onStop={() => updateTask(running.id, 'stopped')} onDelete={() => removeTask(running.id)} />}
            {!running && <li className="task-queue-item is-placeholder"><span>Now</span><strong>No running task</strong><small>Model slot is idle</small></li>}
            {waiting.map((task, index) => (
              <QueueItem
                key={task.id}
                task={task}
                label={String(index + 1).padStart(2, '0')}
                dragging={draggedTaskId === task.id}
                onDragStart={() => setDraggedTaskId(task.id)}
                onDragOver={() => moveWaitingTask(task.id)}
                onDragEnd={() => setDraggedTaskId(null)}
                onStart={() => updateTask(task.id, 'running')}
                onStop={() => updateTask(task.id, 'stopped')}
                onDelete={() => removeTask(task.id)}
              />
            ))}
            {stopped.map((task) => <QueueItem key={task.id} task={task} label="Stop" onStart={() => updateTask(task.id, 'running')} onStop={() => updateTask(task.id, 'stopped')} onDelete={() => removeTask(task.id)} />)}
          </ol>
        </article>
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

function QueueItem(props: {
  task: QueueTask;
  label: string;
  dragging?: boolean;
  onDragStart?: () => void;
  onDragOver?: () => void;
  onDragEnd?: () => void;
  onStart: () => void;
  onStop: () => void;
  onDelete: () => void;
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
        props.onDragOver?.();
      }}
      onDrop={(event) => event.preventDefault()}
      onDragEnd={props.onDragEnd}
    >
      <span>{props.label}</span>
      <div><strong>{props.task.title}</strong><small>{props.task.meta} / {props.task.state}</small></div>
      <div className="queue-actions">
        {props.task.state === 'running'
          ? <button type="button" onClick={props.onStop}>■</button>
          : <button type="button" onClick={props.onStart}>▶</button>}
        <button type="button" onClick={props.onDelete}>×</button>
      </div>
    </li>
  );
}
