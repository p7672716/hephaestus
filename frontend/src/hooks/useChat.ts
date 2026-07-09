import { useCallback, useEffect, useRef, useState } from 'react';
import { streamChat } from '../api';
import type { ChatFolder, ChatMessage, ChatSession, MessageMetadata, ModelMode, RuntimeInfo, StreamEventData, UserSettings } from '../types';

const STORAGE_KEY = 'hephaestus-chat-state-v1';
const REACT_STORAGE_KEY = 'hephaestus-react-chat-v1';
const modelLabels: Record<Exclude<ModelMode, 'auto'>, string> = {
  'agents-a1': 'Agents-A1',
  ornith: 'Ornith',
};
const modelModes = new Set<string>(['auto', 'agents-a1', 'ornith']);

interface ChatStore {
  sessions: ChatSession[];
  folders: ChatFolder[];
  activeId: string;
  expandedFolderId: string | null;
}

type StoredMessage = Partial<ChatMessage> & {
  text?: string;
  sentAt?: string;
};

type StoredSession = Partial<ChatSession> & {
  model?: string;
  updated?: string;
  messages?: StoredMessage[];
};

type StoredFolder = Partial<ChatFolder>;

type StoredChatState = Partial<ChatStore> & {
  chatSessions?: StoredSession[];
  chatFolders?: StoredFolder[];
  activeSessionId?: string;
  expandedChatFolderId?: string | null;
  selectedModelMode?: ModelMode;
  reasoningEnabled?: boolean;
  runtimeInfo?: Partial<RuntimeInfo>;
};

function modelMode(value: unknown): ModelMode | undefined {
  return typeof value === 'string' && modelModes.has(value) ? value as ModelMode : undefined;
}

function createSession(settings?: UserSettings): ChatSession {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    title: 'New chat',
    folderId: null,
    modelMode: settings?.defaultModelMode ?? 'auto',
    reasoningEnabled: settings?.defaultReasoningEnabled ?? false,
    updatedAt: now,
    messages: [],
  };
}

function createFolder(): ChatFolder {
  return { id: crypto.randomUUID(), title: 'New folder', updatedAt: Date.now() };
}

function normalizeMessage(message: StoredMessage): ChatMessage {
  const versionIndex = message.versionIndex ?? 0;
  const content = message.content ?? message.versions?.[versionIndex] ?? message.text ?? '';
  return {
    ...message,
    id: message.id ?? crypto.randomUUID(),
    role: message.role ?? 'assistant',
    content,
    createdAt: typeof message.createdAt === 'number' ? message.createdAt : Date.now(),
    versions: message.versions?.length ? message.versions : [content],
    versionIndex,
    versionTimes: message.versionTimes?.filter((value): value is number => typeof value === 'number'),
  };
}

function normalizeSession(session: StoredSession, settings?: UserSettings, defaults?: Pick<StoredChatState, 'selectedModelMode' | 'reasoningEnabled'>): ChatSession {
  return {
    ...session,
    id: session.id ?? crypto.randomUUID(),
    title: session.title ?? 'New chat',
    folderId: session.folderId ?? null,
    modelMode: modelMode(session.modelMode) ?? modelMode(defaults?.selectedModelMode) ?? settings?.defaultModelMode ?? 'auto',
    reasoningEnabled: session.reasoningEnabled ?? defaults?.reasoningEnabled ?? settings?.defaultReasoningEnabled ?? false,
    updatedAt: typeof session.updatedAt === 'number' ? session.updatedAt : Date.now(),
    messages: (session.messages ?? []).map(normalizeMessage),
  };
}

function normalizeFolder(folder: StoredFolder): ChatFolder {
  return {
    id: folder.id ?? crypto.randomUUID(),
    title: folder.title ?? 'New folder',
    updatedAt: typeof folder.updatedAt === 'number' ? folder.updatedAt : Date.now(),
  };
}

function readSavedState(): StoredChatState | ChatSession[] {
  const primary = localStorage.getItem(STORAGE_KEY);
  if (primary) return JSON.parse(primary) as StoredChatState | ChatSession[];
  return JSON.parse(localStorage.getItem(REACT_STORAGE_KEY) ?? '[]') as StoredChatState | ChatSession[];
}

function loadStore(settings?: UserSettings): ChatStore {
  try {
    const saved = readSavedState();
    const sessions = Array.isArray(saved) ? saved : saved.sessions ?? saved.chatSessions;
    const normalized = Array.isArray(sessions) && sessions.length
      ? sessions.map((session) => normalizeSession(session, settings, Array.isArray(saved) ? undefined : saved))
      : [createSession(settings)];
    const folders = !Array.isArray(saved)
      ? (saved.folders ?? saved.chatFolders ?? []).map(normalizeFolder)
      : [];
    return {
      sessions: normalized,
      folders,
      activeId: !Array.isArray(saved) && (saved.activeId ?? saved.activeSessionId) ? (saved.activeId ?? saved.activeSessionId)! : normalized[0]?.id ?? '',
      expandedFolderId: !Array.isArray(saved) ? saved.expandedFolderId ?? saved.expandedChatFolderId ?? null : null,
    };
  } catch {
    const session = createSession(settings);
    return { sessions: [session], folders: [], activeId: session.id, expandedFolderId: null };
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
  const initial = useRef<ChatStore | null>(null);
  if (!initial.current) initial.current = loadStore(settings);
  const [sessions, setSessions] = useState<ChatSession[]>(initial.current.sessions);
  const [folders, setFolders] = useState<ChatFolder[]>(initial.current.folders);
  const [activeId, setActiveId] = useState(initial.current.activeId);
  const [expandedFolderId, setExpandedFolderId] = useState<string | null>(initial.current.expandedFolderId);
  const abortRef = useRef<AbortController | null>(null);
  const [streaming, setStreaming] = useState(false);
  const frameRef = useRef<number | null>(null);
  const pendingTokenRef = useRef('');
  const pendingProgressRef = useRef('');

  const activeSession = sessions.find((session) => session.id === activeId) ?? sessions[0];

  useEffect(() => {
    let runtimeInfo: Partial<RuntimeInfo> | undefined;
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as StoredChatState;
      if (saved.runtimeInfo && typeof saved.runtimeInfo === 'object') runtimeInfo = saved.runtimeInfo;
    } catch {
      runtimeInfo = undefined;
    }
    const selectedModelMode = activeSession?.modelMode ?? settings?.defaultModelMode ?? 'auto';
    const reasoningEnabled = activeSession?.reasoningEnabled ?? settings?.defaultReasoningEnabled ?? false;
    const chatSessions = sessions.map((session) => ({
      ...session,
      updated: '今',
      messages: session.messages.map((message) => ({
        ...message,
        versionIndex: message.versionIndex ?? 0,
        versions: message.versions?.length ? message.versions : [message.content],
      })),
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      sessions,
      folders,
      activeId,
      expandedFolderId,
      chatSessions,
      chatFolders: folders,
      activeSessionId: activeId,
      expandedChatFolderId: expandedFolderId,
      selectedModelMode,
      reasoningEnabled,
      runtimeInfo,
    }));
  }, [activeId, activeSession?.modelMode, activeSession?.reasoningEnabled, expandedFolderId, folders, sessions, settings?.defaultModelMode, settings?.defaultReasoningEnabled]);

  const addSession = useCallback(() => {
    const session = createSession(settings);
    setSessions((current) => [session, ...current]);
    setActiveId(session.id);
  }, [settings]);

  const addFolder = useCallback(() => {
    const folder = createFolder();
    setFolders((current) => [folder, ...current]);
    setExpandedFolderId(folder.id);
  }, []);

  const deleteSession = useCallback((sessionId: string) => {
    setSessions((current) => {
      const next = current.filter((session) => session.id !== sessionId);
      return next.length ? next : [createSession(settings)];
    });
    setActiveId((current) => (current === sessionId ? '' : current));
  }, [settings]);

  const deleteFolder = useCallback((folderId: string) => {
    setFolders((current) => current.filter((folder) => folder.id !== folderId));
    setSessions((current) => current.map((session) => (
      session.folderId === folderId ? { ...session, folderId: null, updatedAt: Date.now() } : session
    )));
    setExpandedFolderId((current) => (current === folderId ? null : current));
  }, []);

  const renameSession = useCallback((sessionId: string, title: string) => {
    const next = title.trim();
    if (!next) return;
    setSessions((current) => current.map((session) => (
      session.id === sessionId ? { ...session, title: next, updatedAt: Date.now() } : session
    )));
  }, []);

  const renameFolder = useCallback((folderId: string, title: string) => {
    const next = title.trim();
    if (!next) return;
    setFolders((current) => current.map((folder) => (
      folder.id === folderId ? { ...folder, title: next, updatedAt: Date.now() } : folder
    )));
  }, []);

  const assignSessionFolder = useCallback((sessionId: string, folderId: string | null) => {
    setSessions((current) => current.map((session) => (
      session.id === sessionId ? { ...session, folderId, updatedAt: Date.now() } : session
    )));
    if (folderId) setExpandedFolderId(folderId);
  }, []);

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

  const editMessage = useCallback((sessionId: string, messageId: string, text: string) => {
    const next = text.trim();
    if (!next) return;
    setSessions((current) =>
      updateMessage(current, sessionId, messageId, (message) => {
        const versions = message.versions?.length ? [...message.versions] : [message.content];
        const versionTimes = message.versionTimes?.length ? [...message.versionTimes] : [message.createdAt];
        versions.push(next);
        versionTimes.push(Date.now());
        return { ...message, content: next, versions, versionTimes, versionIndex: versions.length - 1 };
      }),
    );
  }, []);

  const selectMessageVersion = useCallback((sessionId: string, messageId: string, index: number) => {
    setSessions((current) =>
      updateMessage(current, sessionId, messageId, (message) => {
        const versions = message.versions ?? [message.content];
        const nextIndex = Math.max(0, Math.min(versions.length - 1, index));
        return { ...message, content: versions[nextIndex], versionIndex: nextIndex };
      }),
    );
  }, []);

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
    folders,
    activeSession,
    activeId,
    expandedFolderId,
    setActiveId,
    setExpandedFolderId,
    addSession,
    addFolder,
    deleteSession,
    deleteFolder,
    renameSession,
    renameFolder,
    assignSessionFolder,
    editMessage,
    selectMessageVersion,
    setModelMode,
    setReasoningEnabled,
    send,
    stop,
    streaming,
    modelLabels,
  };
}
