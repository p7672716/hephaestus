import { useCallback, useEffect, useState } from 'react';
import { api } from '../api';
import type { ModelMode, RuntimeInfo } from '../types';

const initialRuntime: RuntimeInfo = { state: 'checking' };

export function useRuntime(enabled: boolean) {
  const [runtime, setRuntime] = useState<RuntimeInfo>(initialRuntime);

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
