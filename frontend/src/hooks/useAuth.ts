import { useCallback, useEffect, useState } from 'react';
import { api } from '../api';
import type { AuthStatus } from '../types';

export function useAuth() {
  const [status, setStatus] = useState<AuthStatus | null>(null);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    try {
      setStatus(await api.authStatus());
      setError('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Authentication check failed');
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(
    async (token: string) => {
      await api.login(token);
      await refresh();
    },
    [refresh],
  );

  return { status, error, login, refresh };
}
