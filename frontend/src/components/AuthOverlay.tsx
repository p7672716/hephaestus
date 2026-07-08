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
    <div className="auth-overlay" role="presentation">
      <form className="auth-card" onSubmit={submit}>
        <img className="auth-icon" src="/assets/hephaestus-icon.svg" width="48" height="48" alt="" />
        <p className="eyebrow">Remote access</p>
        <h1>Hephaestus</h1>
        <label>
          <span>Access token</span>
          <input
            type="password"
            autoComplete="current-password"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            autoFocus
          />
        </label>
        <button type="submit" disabled={pending}>{pending ? 'Connecting…' : 'Connect'}</button>
        {(message || error) && <p className="form-error">{message || error}</p>}
      </form>
    </div>
  );
}
