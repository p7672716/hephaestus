import type { AuthStatus, ModelMode, UserSettings } from '../types';

interface SettingViewProps {
  authStatus: AuthStatus;
  settings: UserSettings;
  onDefaultModelMode: (mode: ModelMode) => void;
  onDefaultReasoning: (enabled: boolean) => void;
  onUiScale: (scale: number) => void;
  onRegenerateToken: () => Promise<string>;
}

export function SettingView(props: SettingViewProps) {
  return (
    <section className="page settings-page">
      <div className="page-heading">
        <div><p className="eyebrow">Control defaults</p><h1>Setting</h1></div>
        <span className="state-badge">{props.settings.uiScale}%</span>
      </div>

      <div className="settings-grid">
        <section className="surface-card setting-card">
          <p className="eyebrow">UI size</p>
          <h2>Scale</h2>
          <label className="range-row">
            <input
              type="range"
              min="90"
              max="125"
              step="5"
              value={props.settings.uiScale}
              onChange={(event) => props.onUiScale(Number(event.target.value))}
            />
            <strong>{props.settings.uiScale}%</strong>
          </label>
        </section>

        <section className="surface-card setting-card">
          <p className="eyebrow">Model defaults</p>
          <h2>New sessions</h2>
          <label>
            <span>Default model</span>
            <select
              value={props.settings.defaultModelMode}
              onChange={(event) => props.onDefaultModelMode(event.target.value as ModelMode)}
            >
              <option value="auto">Auto</option>
              <option value="agents-a1">Agents-A1</option>
              <option value="ornith">Ornith</option>
            </select>
          </label>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={props.settings.defaultReasoningEnabled}
              onChange={(event) => props.onDefaultReasoning(event.target.checked)}
            />
            <span>Reasoning default ON</span>
          </label>
        </section>

        <section className="surface-card setting-card token-card">
          <p className="eyebrow">Remote access</p>
          <h2>Access token</h2>
          <input className="token-input" value={props.authStatus.token ?? ''} readOnly />
          <div className="setting-actions">
            <button type="button" onClick={() => void navigator.clipboard?.writeText(props.authStatus.token ?? '')}>
              Copy
            </button>
            <button type="button" onClick={() => void props.onRegenerateToken()}>
              Regenerate
            </button>
          </div>
          <small>{props.authStatus.trusted_devices} trusted device(s)</small>
        </section>
      </div>
    </section>
  );
}
