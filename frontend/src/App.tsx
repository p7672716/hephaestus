import { useEffect, useState } from 'react';
import { AuthOverlay } from './components/AuthOverlay';
import { ChatView } from './components/ChatView';
import { DashboardView } from './components/DashboardView';
import { PlaceholderView } from './components/PlaceholderView';
import { RuntimeBar } from './components/RuntimeBar';
import { Sidebar } from './components/Sidebar';
import { useAuth } from './hooks/useAuth';
import { useChat } from './hooks/useChat';
import { useRuntime } from './hooks/useRuntime';
import type { ViewId } from './types';

const THEME_KEY = 'hephaestus-theme';

export default function App() {
  const [view, setView] = useState<ViewId>('chat');
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem(THEME_KEY) === 'dark');
  const auth = useAuth();
  const authenticated = Boolean(auth.status && (!auth.status.required || auth.status.authenticated));
  const runtime = useRuntime(authenticated);
  const chat = useChat();

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
  }, [dark]);

  async function resumeRuntime() {
    const selected = chat.activeSession?.modelMode;
    const model = selected && selected !== 'auto'
      ? selected
      : runtime.runtime.active_model_id === 'ornith'
        ? 'ornith'
        : 'agents-a1';
    await runtime.select(model);
  }

  if (!auth.status) {
    return (
      <div className="loading-screen">
        <span className="forge-mark" aria-hidden="true">H</span>
        <p>{auth.error || 'Connecting to the local backend…'}</p>
      </div>
    );
  }

  if (auth.status.required && !auth.status.authenticated) {
    return <AuthOverlay error={auth.error} onLogin={auth.login} />;
  }

  return (
    <div className="app-shell">
      <RuntimeBar
        runtime={runtime.runtime}
        generating={chat.streaming}
        dark={dark}
        onToggleTheme={() => setDark((value) => !value)}
        onToggleSidebar={() => setCollapsed((value) => !value)}
        onStop={chat.streaming ? chat.stop : () => void runtime.stop()}
        onResume={() => void resumeRuntime()}
      />
      <div className="body-shell">
        <Sidebar view={view} collapsed={collapsed} onSelect={setView} />
        <main className="main-surface">
          {view === 'dashboard' && <DashboardView runtime={runtime.runtime} sessions={chat.sessions} />}
          {view === 'chat' && (
            <ChatView
              sessions={chat.sessions}
              activeSession={chat.activeSession}
              activeId={chat.activeId}
              streaming={chat.streaming}
              onSelectSession={chat.setActiveId}
              onAddSession={chat.addSession}
              onDeleteSession={chat.deleteSession}
              onModelMode={chat.setModelMode}
              onReasoning={chat.setReasoningEnabled}
              onSend={chat.send}
              onStop={chat.stop}
            />
          )}
          {view !== 'dashboard' && view !== 'chat' && <PlaceholderView view={view} />}
        </main>
      </div>
    </div>
  );
}
