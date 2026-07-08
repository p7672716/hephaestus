import { useEffect, useState } from 'react';
import type { ModelMode, UserSettings } from '../types';

const STORAGE_KEY = 'hephaestus-react-settings-v1';
const UI_SCALE_KEY = 'hephaestus-ui-scale-v1';
const CHAT_STATE_KEY = 'hephaestus-chat-state-v1';

const defaults: UserSettings = {
  defaultModelMode: 'auto',
  defaultReasoningEnabled: false,
  uiScale: 100,
};
const modelModes = new Set<string>(['auto', 'agents-a1', 'ornith']);

function modelMode(value: unknown): ModelMode | undefined {
  return typeof value === 'string' && modelModes.has(value) ? value as ModelMode : undefined;
}

function loadSettings(): UserSettings {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Partial<UserSettings>;
    const chatState = JSON.parse(localStorage.getItem(CHAT_STATE_KEY) ?? '{}') as Partial<{
      selectedModelMode: ModelMode;
      reasoningEnabled: boolean;
    }>;
    const legacyScale = Number(localStorage.getItem(UI_SCALE_KEY));
    return {
      defaultModelMode: modelMode(saved.defaultModelMode) ?? modelMode(chatState.selectedModelMode) ?? defaults.defaultModelMode,
      defaultReasoningEnabled: saved.defaultReasoningEnabled ?? Boolean(chatState.reasoningEnabled),
      uiScale: Number(saved.uiScale) || legacyScale || defaults.uiScale,
    };
  } catch {
    return defaults;
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(loadSettings);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    localStorage.setItem(UI_SCALE_KEY, String(settings.uiScale));
    document.documentElement.style.setProperty('--ui-scale', String(settings.uiScale / 100));
  }, [settings]);

  return {
    settings,
    setDefaultModelMode: (defaultModelMode: ModelMode) => setSettings((current) => ({ ...current, defaultModelMode })),
    setDefaultReasoningEnabled: (defaultReasoningEnabled: boolean) =>
      setSettings((current) => ({ ...current, defaultReasoningEnabled })),
    setUiScale: (uiScale: number) => setSettings((current) => ({ ...current, uiScale })),
  };
}
