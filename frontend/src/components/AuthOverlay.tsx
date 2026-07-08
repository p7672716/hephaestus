import { FormEvent, useState } from 'react';

interface AuthOverlayProps {
  error: string;
  onLogin: (token: string) => Promise<void>;
}

export function AuthOverlay({ error, onLogin }: AuthOverlayProps) {
  const [token, setToken] = useState('');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState(error);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token.trim()) return;
    setPending(true);
    try {
      await onLogin(token.trim());
      setMessage('');
    } catch {
      setMessage('Token rejected');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="auth-overlay" id="authOverlay" role="presentation">
      <form className="auth-card auth-dialog" id="authForm" onSubmit={submit}>
        <img className="auth-icon" src="/assets/hephaestus-icon.svg" width="48" height="48" alt="" />
        <p className="eyebrow">Remote access</p>
        <h1>Hephaestus</h1>
        <label className="auth-field">
          <span>Access token</span>
          <input
            id="authTokenInput"
            type="password"
            autoComplete="current-password"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            autoFocus
          />
        </label>
        <button className="auth-submit" id="authSubmit" type="submit" disabled={pending}>{pending ? 'Connecting…' : 'Connect'}</button>
        {(message || error) && <p className="form-error auth-message" id="authMessage">{message || error}</p>}
      </form>
    </div>
  );
}
