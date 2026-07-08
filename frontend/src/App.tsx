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

export default function App() {
  const [view, setView] = useState<ViewId>('chat');
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem(THEME_KEY) === 'dark');
  const auth = useAuth();
  const authenticated = Boolean(auth.status && (!auth.status.required || auth.status.authenticated));
  const runtime = useRuntime(authenticated);
  const settings = useSettings();
  const chat = useChat(settings.settings);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
  }, [dark]);

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
      <RuntimeBar
        runtime={runtime.runtime}
        generating={chat.streaming}
        reasoningEnabled={chat.activeSession?.reasoningEnabled ?? settings.settings.defaultReasoningEnabled}
        dark={dark}
        onToggleTheme={() => setDark((value) => !value)}
        onToggleSidebar={() => setCollapsed((value) => !value)}
        onStop={chat.streaming ? stopGeneration : () => void runtime.stop()}
        onResume={() => void resumeRuntime()}
      />
      <div className="body-shell">
        <Sidebar view={view} collapsed={collapsed} onSelect={setView} />
        <main className="main-surface">
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
