import { useCallback, useEffect, useState } from 'react';
import { api } from '../api';
import type { ModelMode, RuntimeInfo } from '../types';

const initialRuntime: RuntimeInfo = { state: 'checking' };
const CHAT_STATE_KEY = 'hephaestus-chat-state-v1';

function loadSavedRuntime(): RuntimeInfo {
  try {
    const saved = JSON.parse(localStorage.getItem(CHAT_STATE_KEY) ?? '{}') as { runtimeInfo?: Partial<RuntimeInfo> };
    return saved.runtimeInfo && typeof saved.runtimeInfo === 'object'
      ? { ...initialRuntime, ...saved.runtimeInfo, state: 'checking' }
      : initialRuntime;
  } catch {
    return initialRuntime;
  }
}

function persistRuntime(runtime: RuntimeInfo) {
  try {
    const saved = JSON.parse(localStorage.getItem(CHAT_STATE_KEY) ?? '{}') as Record<string, unknown>;
    saved.runtimeInfo = {
      state: runtime.state,
      active_model_id: runtime.active_model_id,
      active_model_label: runtime.active_model_label,
      starting_model_id: runtime.starting_model_id,
      starting_model_label: runtime.starting_model_label,
      provider: runtime.provider,
      mock: runtime.mock,
      cuda_build: runtime.cuda_build,
      acceleration: runtime.acceleration,
      ctx_size: runtime.ctx_size,
      batch_size: runtime.batch_size,
      ubatch_size: runtime.ubatch_size,
      reasoning: runtime.reasoning,
      show_reasoning: runtime.show_reasoning,
      prepared: runtime.prepared,
      last_error: runtime.last_error,
    };
    localStorage.setItem(CHAT_STATE_KEY, JSON.stringify(saved));
  } catch {
    // localStorage can be unavailable in private or quota-limited contexts.
  }
}

export function useRuntime(enabled: boolean) {
  const [runtime, setRuntime] = useState<RuntimeInfo>(loadSavedRuntime);

  useEffect(() => persistRuntime(runtime), [runtime]);

  const refresh = useCallback(async () => {
    if (!enabled) return;
    try {
      setRuntime(await api.runtimeStatus());
    } catch (cause) {
      setRuntime((current) => ({
        ...current,
        state: 'offline',
        last_error: cause instanceof Error ? cause.message : 'Backend unavailable',
      }));
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    void refresh();
    const timer = window.setInterval(() => void refresh(), 5000);
    return () => window.clearInterval(timer);
  }, [enabled, refresh]);

  const select = useCallback(async (modelId: Exclude<ModelMode, 'auto'>) => {
    setRuntime((current) => ({
      ...current,
      state: 'starting',
      starting_model_id: modelId,
      starting_model_label: modelId === 'ornith' ? 'Ornith' : 'Agents-A1',
    }));
    try {
      setRuntime(await api.selectRuntime(modelId));
    } catch (cause) {
      setRuntime((current) => ({
        ...current,
        state: 'error',
        last_error: cause instanceof Error ? cause.message : 'Model start failed',
      }));
    }
  }, []);

  const stop = useCallback(async () => {
    try {
      setRuntime(await api.stopRuntime());
    } catch (cause) {
      setRuntime((current) => ({
        ...current,
        state: 'error',
        last_error: cause instanceof Error ? cause.message : 'Runtime stop failed',
      }));
    }
  }, []);

  return { runtime, refresh, select, stop };
}
