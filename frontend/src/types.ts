export type ViewId =
  | 'dashboard'
  | 'chat'
  | 'coding'
  | 'notebook'
  | 'skill'
  | 'tool'
  | 'automation'
  | 'knowledge'
  | 'setting';

export type ModelMode = 'auto' | 'agents-a1' | 'ornith';
export type MessageRole = 'user' | 'assistant';

export interface AuthStatus {
  required: boolean;
  authenticated: boolean;
  token: string | null;
  trusted_devices: number;
}

export interface RuntimeInfo {
  state: 'checking' | 'mock' | 'ready' | 'starting' | 'idle' | 'error' | 'offline';
  mock?: boolean;
  provider?: string | null;
  active_model_id?: string | null;
  active_model_label?: string | null;
  starting_model_id?: string | null;
  starting_model_label?: string | null;
  acceleration?: string | null;
  cuda_build?: boolean | null;
  ctx_size?: string | number;
  batch_size?: string | number;
  ubatch_size?: string | number;
  reasoning?: string;
  show_reasoning?: boolean;
  prepared?: Record<string, boolean>;
  last_error?: string | null;
  logs?: string[];
}

export interface MessageMetrics {
  durationMs?: number;
  tokens?: number;
  tokensPerSecond?: number;
  doneReason?: string | null;
}

export interface MessageMetadata {
  selectedModel?: string;
  selectedModelLabel?: string;
  taskKind?: string;
  routeReason?: string;
  provider?: string;
  progress?: string;
  mock?: boolean;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: number;
  versions?: string[];
  versionIndex?: number;
  versionTimes?: number[];
  metadata?: MessageMetadata;
  metrics?: MessageMetrics;
  streaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  folderId?: string | null;
  modelMode: ModelMode;
  reasoningEnabled: boolean;
  updatedAt: number;
  messages: ChatMessage[];
}

export interface ChatFolder {
  id: string;
  title: string;
  updatedAt: number;
}

export interface StreamEventData {
  model_id?: string;
  model_label?: string;
  task_kind?: string;
  route_reason?: string;
  provider?: string;
  mock?: boolean;
  text?: string;
  message?: string;
  metrics?: MessageMetrics;
}

export interface UserSettings {
  defaultModelMode: ModelMode;
  defaultReasoningEnabled: boolean;
  uiScale: number;
}
