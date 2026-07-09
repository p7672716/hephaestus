import type { AuthStatus, ModelMode, UserSettings } from '../types';
import { Icon } from './Icon';

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
    <section className="page settings-page skill-view" id="setting" data-view="setting" aria-labelledby="settingTitle">
      <div className="page-heading skill-heading">
        <div><p className="eyebrow">Control defaults</p><h1 id="settingTitle">Setting</h1></div>
        <span className="state-badge detail-value" id="uiSizeValue">{props.settings.uiScale}%</span>
      </div>

      <div className="settings-grid">
        <section className="surface-card setting-card system-panel">
          <p className="eyebrow">UI size</p>
          <h2>Scale</h2>
          <label className="range-row setting-row">
            <input
              className="setting-range"
              id="uiSizeRange"
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

        <section className="surface-card setting-card system-panel">
          <p className="eyebrow">Model defaults</p>
          <h2>New sessions</h2>
          <label className="setting-row">
            <span className="detail-label">Default model</span>
            <select
              className="setting-input"
              id="defaultModelSelect"
              value={props.settings.defaultModelMode}
              onChange={(event) => props.onDefaultModelMode(event.target.value as ModelMode)}
            >
              <option value="auto">Auto</option>
              <option value="agents-a1">Agents-A1</option>
              <option value="ornith">Ornith</option>
            </select>
          </label>
          <label className="checkbox-row setting-row setting-check-row">
            <input
              id="defaultReasoningToggle"
              type="checkbox"
              checked={props.settings.defaultReasoningEnabled}
              onChange={(event) => props.onDefaultReasoning(event.target.checked)}
            />
            <span>Reasoning default ON</span>
          </label>
        </section>

        <section className="surface-card setting-card token-card system-panel">
          <p className="eyebrow">Remote access</p>
          <h2>Access token</h2>
          <div className="token-row">
            <input className="setting-input token-input" id="externalTokenInput" value={props.authStatus.token ?? ''} readOnly />
            <button className="message-action setting-icon-button" id="regenerateTokenButton" type="button" onClick={() => void props.onRegenerateToken()} aria-label="トークンを再生成">
              <Icon name="requeue" />
            </button>
            <button className="message-action setting-icon-button" id="copyTokenButton" type="button" onClick={() => void navigator.clipboard?.writeText(props.authStatus.token ?? '')} aria-label="トークンをコピー">
              <Icon name="copy" />
            </button>
          </div>
          <small>{props.authStatus.trusted_devices} trusted device(s)</small>
        </section>
      </div>
    </section>
  );
}
