import { useEffect, useState } from 'react';
import { AuthOverlay } from './components/AuthOverlay';
import { ChatView } from './components/ChatView';
import { DashboardView } from './components/DashboardView';
import { PlaceholderView } from './components/PlaceholderView';
import { RuntimeBar } from './components/RuntimeBar';
import { SettingView } from './components/SettingView';
import { Sidebar } from './components/Sidebar';
import { useAuth } from './hooks/useAuth';
import { useChat } from './hooks/useChat';
import { useRuntime } from './hooks/useRuntime';
import { useSettings } from './hooks/useSettings';
import type { ViewId } from './types';

const THEME_KEY = 'hephaestus-theme';
const viewIds: ViewId[] = ['dashboard', 'chat', 'coding', 'notebook', 'skill', 'tool', 'automation', 'knowledge', 'setting'];

function initialDarkTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function viewFromHash(): ViewId {
  const candidate = window.location.hash.slice(1);
  if (candidate === 'index') return 'knowledge';
  return viewIds.includes(candidate as ViewId) ? candidate as ViewId : 'dashboard';
}

export default function App() {
  const [view, setView] = useState<ViewId>(viewFromHash);
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(initialDarkTheme);
  const auth = useAuth();
  const authenticated = Boolean(auth.status && (!auth.status.required || auth.status.authenticated));
  const runtime = useRuntime(authenticated);
  const settings = useSettings();
  const chat = useChat(settings.settings);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#1c1b19' : '#f5f0e7');
  }, [dark]);

  useEffect(() => {
    const syncHash = () => setView(viewFromHash());
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  function selectView(next: ViewId) {
    setView(next);
    if (window.location.hash !== `#${next}`) window.location.hash = next;
  }

  async function resumeRuntime() {
    const selected = chat.activeSession?.modelMode;
    const defaultModel = settings.settings.defaultModelMode === 'auto' ? 'agents-a1' : settings.settings.defaultModelMode;
    const model = selected && selected !== 'auto'
      ? selected
      : runtime.runtime.active_model_id === 'ornith'
        ? 'ornith'
        : defaultModel;
    await runtime.select(model);
  }

  async function stopGeneration() {
    chat.stop();
    await runtime.stop();
  }

  if (!auth.status) {
    return (
      <div className="loading-screen">
        <img className="empty-icon" src="/assets/hephaestus-icon.svg" width="56" height="56" alt="" />
        <p>{auth.error || 'Connecting to the local backend…'}</p>
      </div>
    );
  }

  if (auth.status.required && !auth.status.authenticated) {
    return <AuthOverlay error={auth.error} onLogin={auth.login} />;
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">Mainへ移動</a>
      <RuntimeBar
        runtime={runtime.runtime}
        generating={chat.streaming}
        reasoningEnabled={chat.activeSession?.reasoningEnabled ?? settings.settings.defaultReasoningEnabled}
        dark={dark}
        sidebarCollapsed={collapsed}
        onToggleTheme={() => setDark((value) => !value)}
        onToggleSidebar={() => setCollapsed((value) => !value)}
        onStop={chat.streaming ? stopGeneration : () => void runtime.stop()}
        onResume={() => void resumeRuntime()}
      />
      <div className="body-shell">
        <Sidebar view={view} collapsed={collapsed} onSelect={selectView} />
        <main className="main-surface" id="main" tabIndex={-1} aria-label="ワークスペース">
          {view === 'dashboard' && <DashboardView runtime={runtime.runtime} sessions={chat.sessions} />}
          {view === 'chat' && (
            <ChatView
              sessions={chat.sessions}
              folders={chat.folders}
              activeSession={chat.activeSession}
              activeId={chat.activeId}
              expandedFolderId={chat.expandedFolderId}
              streaming={chat.streaming}
              onSelectSession={chat.setActiveId}
              onToggleFolder={chat.setExpandedFolderId}
              onAddSession={chat.addSession}
              onAddFolder={chat.addFolder}
              onDeleteSession={chat.deleteSession}
              onDeleteFolder={chat.deleteFolder}
              onRenameSession={chat.renameSession}
              onRenameFolder={chat.renameFolder}
              onAssignSessionFolder={chat.assignSessionFolder}
              onEditMessage={chat.editMessage}
              onSelectMessageVersion={chat.selectMessageVersion}
              onModelMode={chat.setModelMode}
              onReasoning={chat.setReasoningEnabled}
              onSend={chat.send}
              onStop={() => void stopGeneration()}
            />
          )}
          {view === 'setting' && (
            <SettingView
              authStatus={auth.status}
              settings={settings.settings}
              onDefaultModelMode={settings.setDefaultModelMode}
              onDefaultReasoning={settings.setDefaultReasoningEnabled}
              onUiScale={settings.setUiScale}
              onRegenerateToken={auth.regenerateToken}
            />
          )}
          {view !== 'dashboard' && view !== 'chat' && view !== 'setting' && <PlaceholderView view={view} />}
        </main>
      </div>
    </div>
  );
}
