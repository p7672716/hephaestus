import { useEffect, useState } from 'react';
import type { ModelMode, UserSettings } from '../types';

const STORAGE_KEY = 'hephaestus-react-settings-v1';

const defaults: UserSettings = {
  defaultModelMode: 'auto',
  defaultReasoningEnabled: false,
  uiScale: 100,
};

function loadSettings(): UserSettings {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Partial<UserSettings>;
    return {
      defaultModelMode: saved.defaultModelMode ?? defaults.defaultModelMode,
      defaultReasoningEnabled: Boolean(saved.defaultReasoningEnabled),
      uiScale: Number(saved.uiScale) || defaults.uiScale,
    };
  } catch {
    return defaults;
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(loadSettings);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
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
