import { useCallback, useEffect, useRef, useState } from 'react';
import { streamChat } from '../api';
import type { ChatMessage, ChatSession, MessageMetadata, ModelMode, StreamEventData, UserSettings } from '../types';

const STORAGE_KEY = 'hephaestus-react-chat-v1';
const modelLabels: Record<Exclude<ModelMode, 'auto'>, string> = {
  'agents-a1': 'Agents-A1',
  ornith: 'Ornith',
};

function createSession(settings?: UserSettings): ChatSession {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    title: 'New chat',
    modelMode: settings?.defaultModelMode ?? 'auto',
    reasoningEnabled: settings?.defaultReasoningEnabled ?? false,
    updatedAt: now,
    messages: [],
  };
}

function normalizeSession(session: ChatSession, settings?: UserSettings): ChatSession {
  return {
    ...session,
    modelMode: session.modelMode ?? settings?.defaultModelMode ?? 'auto',
    reasoningEnabled: session.reasoningEnabled ?? settings?.defaultReasoningEnabled ?? false,
    messages: session.messages ?? [],
  };
}

function loadSessions(settings?: UserSettings): ChatSession[] {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as ChatSession[];
    return Array.isArray(saved) && saved.length
      ? saved.map((session) => normalizeSession(session, settings))
      : [createSession(settings)];
  } catch {
    return [createSession(settings)];
  }
}

function updateMessage(
  sessions: ChatSession[],
  sessionId: string,
  messageId: string,
  updater: (message: ChatMessage) => ChatMessage,
): ChatSession[] {
  return sessions.map((session) =>
    session.id === sessionId
      ? {
          ...session,
          updatedAt: Date.now(),
          messages: session.messages.map((message) => (message.id === messageId ? updater(message) : message)),
        }
      : session,
  );
}

export function useChat(settings?: UserSettings) {
  const [sessions, setSessions] = useState<ChatSession[]>(() => loadSessions(settings));
  const [activeId, setActiveId] = useState(() => sessions[0]?.id ?? '');
  const abortRef = useRef<AbortController | null>(null);
  const [streaming, setStreaming] = useState(false);
  const frameRef = useRef<number | null>(null);
  const pendingTokenRef = useRef('');
  const pendingProgressRef = useRef('');

  const activeSession = sessions.find((session) => session.id === activeId) ?? sessions[0];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  const addSession = useCallback(() => {
    const session = createSession(settings);
    setSessions((current) => [session, ...current]);
    setActiveId(session.id);
  }, [settings]);

  const deleteSession = useCallback((sessionId: string) => {
    setSessions((current) => {
      const next = current.filter((session) => session.id !== sessionId);
      return next.length ? next : [createSession(settings)];
    });
    setActiveId((current) => (current === sessionId ? '' : current));
  }, [settings]);

  useEffect(() => {
    if (!sessions.some((session) => session.id === activeId)) setActiveId(sessions[0]?.id ?? '');
  }, [activeId, sessions]);

  const patchActive = useCallback((patch: Partial<ChatSession>) => {
    setSessions((current) =>
      current.map((session) => (session.id === activeId ? { ...session, ...patch, updatedAt: Date.now() } : session)),
    );
  }, [activeId]);

  const setModelMode = useCallback((modelMode: ModelMode) => patchActive({ modelMode }), [patchActive]);
  const setReasoningEnabled = useCallback(
    (reasoningEnabled: boolean) => patchActive({ reasoningEnabled }),
    [patchActive],
  );

  const flushPending = useCallback((sessionId: string, messageId: string) => {
    const token = pendingTokenRef.current;
    const progress = pendingProgressRef.current;
    pendingTokenRef.current = '';
    pendingProgressRef.current = '';
    frameRef.current = null;
    if (!token && !progress) return;

    setSessions((current) =>
      updateMessage(current, sessionId, messageId, (message) => ({
        ...message,
        content: message.content + token,
        metadata: progress
          ? { ...message.metadata, progress: (message.metadata?.progress ?? '') + progress }
          : message.metadata,
      })),
    );
  }, []);

  const scheduleFlush = useCallback((sessionId: string, messageId: string) => {
    if (frameRef.current !== null) return;
    frameRef.current = window.requestAnimationFrame(() => flushPending(sessionId, messageId));
  }, [flushPending]);

  const send = useCallback(async (text: string, surface = 'chat') => {
    const session = sessions.find((item) => item.id === activeId);
    if (!session || !text.trim() || abortRef.current) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text.trim(),
      createdAt: Date.now(),
    };
    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      createdAt: Date.now(),
      streaming: true,
    };
    const nextMessages = [...session.messages, userMessage, assistantMessage];
    setSessions((current) =>
      current.map((item) =>
        item.id === session.id
          ? {
              ...item,
              title: item.messages.length ? item.title : text.trim().slice(0, 36),
              updatedAt: Date.now(),
              messages: nextMessages,
            }
          : item,
      ),
    );

    const controller = new AbortController();
    abortRef.current = controller;
    setStreaming(true);
    const startedAt = performance.now();

    const applyEvent = (event: string, data: StreamEventData) => {
      if (event === 'token') {
        pendingTokenRef.current += data.text ?? '';
        scheduleFlush(session.id, assistantMessage.id);
        return;
      }
      if (event === 'progress') {
        pendingProgressRef.current += data.text ?? '';
        scheduleFlush(session.id, assistantMessage.id);
        return;
      }

      setSessions((current) =>
        updateMessage(current, session.id, assistantMessage.id, (message) => {
          const metadata: MessageMetadata = {
            ...message.metadata,
            selectedModel: data.model_id ?? message.metadata?.selectedModel,
            selectedModelLabel: data.model_label ?? message.metadata?.selectedModelLabel,
            taskKind: data.task_kind ?? message.metadata?.taskKind,
            routeReason: data.route_reason ?? message.metadata?.routeReason,
            provider: data.provider ?? message.metadata?.provider,
            mock: data.mock ?? message.metadata?.mock,
          };
          if (event === 'error') {
            return { ...message, content: `${message.content}\n\nRuntime error: ${data.message ?? 'unknown error'}`, metadata };
          }
          return { ...message, metadata, metrics: data.metrics ?? message.metrics };
        }),
      );
    };

    try {
      await streamChat({
        messages: nextMessages
          .filter((message) => message.id !== assistantMessage.id)
          .map((message) => ({ role: message.role, content: message.content })),
        selection: session.modelMode,
        surface,
        sessionId: session.id,
        reasoningEnabled: session.reasoningEnabled,
        signal: controller.signal,
        onEvent: applyEvent,
      });
      flushPending(session.id, assistantMessage.id);
    } catch (cause) {
      flushPending(session.id, assistantMessage.id);
      const stopped = cause instanceof DOMException && cause.name === 'AbortError';
      setSessions((current) =>
        updateMessage(current, session.id, assistantMessage.id, (message) => ({
          ...message,
          content: `${message.content}${stopped ? '\n\nStopped.' : `\n\nRuntime error: ${cause instanceof Error ? cause.message : String(cause)}`}`,
        })),
      );
    } finally {
      const durationMs = performance.now() - startedAt;
      setSessions((current) =>
        updateMessage(current, session.id, assistantMessage.id, (message) => ({
          ...message,
          streaming: false,
          metrics: { ...message.metrics, durationMs },
        })),
      );
      abortRef.current = null;
      setStreaming(false);
    }
  }, [activeId, flushPending, scheduleFlush, sessions]);

  const stop = useCallback(() => abortRef.current?.abort(), []);

  return {
    sessions,
    activeSession,
    activeId,
    setActiveId,
    addSession,
    deleteSession,
    setModelMode,
    setReasoningEnabled,
    send,
    stop,
    streaming,
    modelLabels,
  };
}
