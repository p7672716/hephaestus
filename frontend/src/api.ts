import type { AuthStatus, ModelMode, RuntimeInfo, StreamEventData } from './types';

async function jsonRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, init);
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `HTTP ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const api = {
  authStatus: () => jsonRequest<AuthStatus>('/api/auth/status', { cache: 'no-store' }),
  login: (token: string) =>
    jsonRequest<{ ok: boolean }>('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    }),
  regenerateToken: () =>
    jsonRequest<{ token: string }>('/api/auth/token/regenerate', { method: 'POST' }),
  runtimeStatus: () => jsonRequest<RuntimeInfo>('/api/runtime/status', { cache: 'no-store' }),
  selectRuntime: (modelId: Exclude<ModelMode, 'auto'>) =>
    jsonRequest<RuntimeInfo>('/api/runtime/select', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model_id: modelId }),
    }),
  stopRuntime: () => jsonRequest<RuntimeInfo>('/api/runtime/stop', { method: 'POST' }),
};

interface StreamChatInput {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  selection: ModelMode;
  surface: string;
  sessionId: string;
  reasoningEnabled: boolean;
  signal: AbortSignal;
  onEvent: (event: string, data: StreamEventData) => void;
}

function parseEventBlock(block: string): { event: string; data: StreamEventData } | null {
  let event = 'message';
  const dataLines: string[] = [];
  for (const line of block.split(/\r?\n/)) {
    if (line.startsWith('event:')) event = line.slice(6).trim();
    if (line.startsWith('data:')) dataLines.push(line.slice(5).trimStart());
  }
  if (!dataLines.length) return null;
  return { event, data: JSON.parse(dataLines.join('\n')) as StreamEventData };
}

export async function streamChat(input: StreamChatInput): Promise<void> {
  const response = await fetch('/api/chat/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: input.messages,
      selection: input.selection,
      surface: input.surface,
      session_id: input.sessionId,
      max_tokens: 4096,
      reasoning_enabled: input.reasoningEnabled,
    }),
    signal: input.signal,
  });

  if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`);

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    buffer += decoder.decode(value, { stream: !done });
    const blocks = buffer.split(/\r?\n\r?\n/);
    buffer = blocks.pop() ?? '';
    for (const block of blocks) {
      const parsed = parseEventBlock(block);
      if (parsed) input.onEvent(parsed.event, parsed.data);
    }
    if (done) break;
  }

  const final = parseEventBlock(buffer);
  if (final) input.onEvent(final.event, final.data);
}
