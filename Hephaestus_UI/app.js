const sidebar = document.querySelector("#sidebar");
const toggle = document.querySelector("#sidebarToggle");
const themeToggle = document.querySelector("#themeToggle");
const themeMeta = document.querySelector('meta[name="theme-color"]');
const navItems = Array.from(document.querySelectorAll(".nav-item"));
const views = Array.from(document.querySelectorAll(".view"));
const mainSurface = document.querySelector("#main");
const sessionList = document.querySelector("#sessionList");
const messageList = document.querySelector("#messageList");
const conversationPanel = document.querySelector(".conversation-panel");
const conversationTitle = document.querySelector("#conversationTitle");
const conversationMeta = document.querySelector("#conversationMeta");
const composer = document.querySelector(".composer");
const composerInput = composer.querySelector("textarea");
const composerSend = composer.querySelector(".composer-send");
const modelRouteSelector = document.querySelector("#modelRouteSelector");
const runtimeModel = document.querySelector("#runtimeModel");
const runtimeStatus = document.querySelector("#runtimeStatus");
const runtimeReasoning = document.querySelector("#runtimeReasoning");
const runtimeStop = document.querySelector("#runtimeStop");
const runtimeResume = document.querySelector("#runtimeResume");
const reasoningToggle = document.querySelector("#reasoningToggle");
const newSessionButton = document.querySelector("#newSessionButton");
const newChatFolderButton = document.querySelector("#newChatFolderButton");
const newProjectButton = document.querySelector("#newProjectButton");
const codingProjectList = document.querySelector("#codingProjectList");
const codingWorkbench = document.querySelector(".coding-workbench");
const workspaceHeader = document.querySelector(".workspace-header");
const workspacePanel = document.querySelector(".workspace-panel");
const codingProjectTitle = document.querySelector("#codingProjectTitle");
const codingProjectPath = document.querySelector("#codingProjectPath");
const codingProjectMeta = document.querySelector("#codingProjectMeta");
const codingWorkspaceTree = document.querySelector("#codingWorkspaceTree");
const codingSessionDetail = document.querySelector("#codingSessionDetail");
const codingSessionType = document.querySelector("#codingSessionType");
const codingSessionTitle = document.querySelector("#codingSessionTitle");
const codingSessionMeta = document.querySelector("#codingSessionMeta");
const codingSessionBody = document.querySelector("#codingSessionBody");
const notebookNoteList = document.querySelector("#notebookNoteList");
const newNotebookNoteButton = document.querySelector("#newNotebookNoteButton");
const sourceList = document.querySelector("#sourceList");
const newSourceButton = document.querySelector("#newSourceButton");
const notebookConversationTitle = document.querySelector("#notebookConversationTitle");
const notebookSourceMeta = document.querySelector("#notebookSourceMeta");
const notebookChatList = document.querySelector("#notebookChatList");
const notebookComposer = document.querySelector(".notebook-composer");
const notebookInput = notebookComposer?.querySelector("textarea");
const notebookSend = notebookComposer?.querySelector(".composer-send");
const skillList = document.querySelector("#skillList");
const newSkillButton = document.querySelector("#newSkillButton");
const skillSearch = document.querySelector("#skillSearch");
const toolList = document.querySelector("#toolList");
const newToolButton = document.querySelector("#newToolButton");
const toolSearch = document.querySelector("#toolSearch");
const modelSlotStatus = document.querySelector("#modelSlotStatus");
const modelSlotDetails = document.querySelector("#modelSlotDetails");
const modelSlotActions = document.querySelector("#modelSlotActions");
const queueCount = document.querySelector("#queueCount");
const taskQueueList = document.querySelector("#taskQueueList");
const uiSizeRange = document.querySelector("#uiSizeRange");
const uiSizeValue = document.querySelector("#uiSizeValue");
const defaultModelSelect = document.querySelector("#defaultModelSelect");
const defaultReasoningToggle = document.querySelector("#defaultReasoningToggle");
const externalTokenInput = document.querySelector("#externalTokenInput");
const regenerateTokenButton = document.querySelector("#regenerateTokenButton");
const copyTokenButton = document.querySelector("#copyTokenButton");
const authOverlay = document.querySelector("#authOverlay");
const authForm = document.querySelector("#authForm");
const authTokenInput = document.querySelector("#authTokenInput");
const authSubmit = document.querySelector("#authSubmit");
const authMessage = document.querySelector("#authMessage");

const icons = {
  plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14" /><path d="M5 12h14" /></svg>',
  edit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 19.5l4.4-1.1 9.8-9.8-3.3-3.3-9.8 9.8z" /><path d="M13.8 6.9l3.3 3.3" /></svg>',
  folder: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 7.5h6l2 2h9v8h-17z" /><path d="M3.5 7.5v10" /></svg>',
  trash: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 7h13" /><path d="M9 7V5.5h6V7" /><path d="M8 9l.6 10h6.8L16 9" /><path d="M10.5 11.5v5" /><path d="M13.5 11.5v5" /></svg>',
  link: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 14.5l-1.1 1.1a3.5 3.5 0 0 1-5-5l2.2-2.2a3.5 3.5 0 0 1 4.9 0" /><path d="M14.5 9.5l1.1-1.1a3.5 3.5 0 0 1 5 5l-2.2 2.2a3.5 3.5 0 0 1-4.9 0" /><path d="M8.5 15.5l7-7" /></svg>',
  unlink: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 14.5l-1.1 1.1a3.5 3.5 0 0 1-5-5l2.2-2.2a3.5 3.5 0 0 1 4.9 0" /><path d="M14.5 9.5l1.1-1.1a3.5 3.5 0 0 1 5 5l-2.2 2.2a3.5 3.5 0 0 1-4.9 0" /><path d="M8 16l8-8" /></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10-6.5z" /></svg>',
  stop: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h10v10H7z" /></svg>',
  grip: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7h8" /><path d="M8 12h8" /><path d="M8 17h8" /></svg>',
  requeue: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.5 7.5A6 6 0 1 0 18 16" /><path d="M17.5 7.5V4" /><path d="M17.5 7.5H14" /></svg>',
  up: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6l-6 6" /><path d="M12 6l6 6" /><path d="M12 6v12" /></svg>',
  down: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 18l-6-6" /><path d="M12 18l6-6" /><path d="M12 18V6" /></svg>',
  prev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>',
  next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>',
};

const markdown = window.markdownit?.({
  html: false,
  linkify: true,
  breaks: true,
  typographer: true,
});

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

const renderMarkdown = (value) => {
  const source = String(value || "");
  if (markdown && window.DOMPurify) return DOMPurify.sanitize(markdown.render(source));
  return escapeHtml(source)
    .replace(/\*\*\*([^\n*](?:[\s\S]*?[^\n*])?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*([^\n*](?:[\s\S]*?[^\n*])?)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^\n_](?:[\s\S]*?[^\n_])?)__/g, "<strong>$1</strong>")
    .replace(/(^|[^\w*])\*([^\s*](?:[^*\n]*?[^\s*])?)\*(?=[^\w*]|$)/g, "$1<em>$2</em>")
    .replace(/(^|[^\w_])_([^\s_](?:[^_\n]*?[^\s_])?)_(?=[^\w_]|$)/g, "$1<em>$2</em>")
    .replace(/\n/g, "<br>");
};

const splitThinking = (value) => {
  const source = String(value || "");
  const tagged = /<think>([\s\S]*?)<\/think>/i.exec(source);
  if (tagged) {
    return {
      thinking: tagged[1].trim(),
      answer: source.replace(tagged[0], "").trim(),
    };
  }
  const openMatch = /<think>/i.exec(source);
  if (openMatch) {
    return {
      thinking: source.slice(openMatch.index + openMatch[0].length).trim(),
      answer: source.slice(0, openMatch.index).trim(),
    };
  }
  const closeIndex = source.toLowerCase().indexOf("</think>");
  if (closeIndex >= 0) {
    return {
      thinking: source.slice(0, closeIndex).trim(),
      answer: source.slice(closeIndex + 8).trim(),
    };
  }
  const finalMatch = /\n\s*(?:final answer|回答|最終回答)\s*[:：]\s*/i.exec(source);
  if (/^\s*(?:here'?s a )?thinking process\s*[:：]/i.test(source) && finalMatch) {
    return {
      thinking: source.slice(0, finalMatch.index).trim(),
      answer: source.slice(finalMatch.index + finalMatch[0].length).trim(),
    };
  }
  if (/^\s*(?:here'?s a )?thinking process\s*[:：]/i.test(source)) {
    return { thinking: source.replace(/^\s*(?:here'?s a )?thinking process\s*[:：]\s*/i, "").trim(), answer: "" };
  }
  return { thinking: "", answer: source };
};

const applyUiScale = (value) => {
  const scale = Number(value) || 100;
  const factor = scale / 100;
  document.body.style.zoom = "";
  if (mainSurface) {
    mainSurface.style.zoom = `${scale}%`;
    mainSurface.style.setProperty("--ui-view-height", `${Math.max(360, (window.innerHeight - 64) / factor - 56)}px`);
  }
  if (uiSizeValue) uiSizeValue.textContent = `${scale}%`;
  localStorage.setItem(UI_SCALE_KEY, String(scale));
};

const scrollToBottom = (element) => {
  requestAnimationFrame(() => {
    element.scrollTop = element.scrollHeight;
    requestAnimationFrame(() => {
      element.scrollTop = element.scrollHeight;
    });
  });
};

const estimateTokens = (text) => Math.max(1, Math.ceil(Array.from(String(text || "")).length / 3));

const getAssistantMetrics = (message, text) => {
  if (message.role !== "assistant") return null;
  const tokens = message.metrics?.tokens || estimateTokens(text);
  const durationMs = message.metrics?.durationMs || Math.max(120, tokens * 45);
  const seconds = Math.max(durationMs / 1000, 0.1);
  const tokensPerSecond = message.metrics?.tokensPerSecond || tokens / seconds;
  const provider = message.metadata?.provider ? ` / ${message.metadata.provider}` : "";
  const route = message.metadata?.selectedModelLabel
    ? ` / ${message.metadata.selectedModelLabel}${provider} / ${message.metadata.routeReason || "manual"}`
    : "";
  return `${seconds.toFixed(1)}s / ${tokensPerSecond.toFixed(1)} t/s / ${tokens} tokens${route}`;
};

const makeAssistantMetrics = (text, durationMs) => {
  const tokens = estimateTokens(text);
  const seconds = Math.max(durationMs / 1000, 0.1);
  return {
    durationMs,
    tokens,
    tokensPerSecond: tokens / seconds,
  };
};

const formatMessageTime = (date = new Date()) => new Intl.DateTimeFormat("ja-JP", {
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
}).format(date);

const getMessageVersionTimes = (message) => {
  const versions = message.versions || [message.text || ""];
  if (!message.versionTimes) {
    const base = Date.now() - Math.max(0, versions.length - 1) * 60000;
    message.versionTimes = versions.map((_, index) => formatMessageTime(new Date(base + index * 60000)));
  }
  while (message.versionTimes.length < versions.length) {
    message.versionTimes.push(formatMessageTime());
  }
  return message.versionTimes;
};

const getMessageTime = (message) => {
  if (message.versions) return getMessageVersionTimes(message)[message.versionIndex || 0] || "";
  message.sentAt ||= formatMessageTime();
  return message.sentAt;
};

let chatSessions = [
  {
    id: "local-harness",
    title: "Local harness",
    model: "Qwen3 local",
    updated: "03:42",
    messages: [
      {
        id: "m1",
        role: "user",
        versionIndex: 1,
        versions: [
          "ローカルモデルの起動状態だけ確認したい。",
          "ローカルモデルと専用ハーネスの状態を同じ画面で確認したい。",
        ],
      },
      {
        id: "m2",
        role: "assistant",
        parent: { messageId: "m1", versionIndex: 1 },
        versionIndex: 0,
        versions: ["Dashboardに稼働状態を寄せ、Chatには選択中セッションのモデル名とハーネス名を表示する形が最小です。"],
      },
    ],
  },
  {
    id: "prompt-check",
    title: "Prompt check",
    model: "llama.cpp",
    updated: "昨日",
    messages: [
      {
        id: "m3",
        role: "user",
        versionIndex: 0,
        versions: ["推論レベルごとの応答差分を見たい。"],
      },
      {
        id: "m4",
        role: "assistant",
        parent: { messageId: "m3", versionIndex: 0 },
        versionIndex: 0,
        versions: ["同じプロンプトを低/中/高で流し、出力時間と要約品質だけ比較するUIで十分です。"],
      },
    ],
  },
];

let chatFolders = [
  { id: "folder-local", title: "Local model" },
];
chatSessions[0].folderId = "folder-local";

const notebookNotes = [
  {
    id: "note-local-model",
    title: "Local Model",
    updated: "今",
    activeSourceId: "source-harness",
    sources: [
      { id: "source-harness", title: "Local model harness", meta: "12 pages / PDF" },
      { id: "source-inference", title: "Inference notes", meta: "8 notes / Markdown" },
      { id: "source-logs", title: "Harness logs", meta: "今 / Text" },
    ],
    sessions: [
      {
        id: "notebook-research",
        title: "Local Model Research",
        updated: "今",
        messages: [
          { role: "assistant", text: "選択中のSourceに基づいて質問できます。回答生成処理は後で接続します。" },
        ],
      },
    ],
  },
  {
    id: "note-harness",
    title: "Harness",
    updated: "昨日",
    activeSourceId: "source-harness-notes",
    sources: [
      { id: "source-harness-notes", title: "Harness notes", meta: "6 notes / Markdown" },
      { id: "source-runbook", title: "Runbook", meta: "4 pages / PDF" },
    ],
    sessions: [
      {
        id: "notebook-harness",
        title: "Harness reading",
        updated: "昨日",
        messages: [
          { role: "assistant", text: "Sourceを追加して、ハーネス仕様の確認に使う想定のチャットです。" },
        ],
      },
    ],
  },
];

const skills = [
  {
    id: "skill-ponytail",
    name: "ponytail",
    scope: "coding",
    status: "Enabled",
    updated: "Active",
    path: "C:\\Users\\rtale\\.codex\\plugins\\cache\\ponytail\\ponytail\\4.8.4\\skills\\ponytail\\SKILL.md",
    triggers: ["coding task", "simplest solution", "YAGNI"],
    description: "最小実装と過剰設計回避のための coding skill。",
  },
  {
    id: "skill-caveman",
    name: "caveman",
    scope: "communication",
    status: "Enabled",
    updated: "Active",
    path: "C:\\Users\\rtale\\.codex\\skills\\caveman\\SKILL.md",
    triggers: ["brief", "less tokens", "caveman"],
    description: "技術内容を保ったまま応答を短くする communication skill。",
  },
  {
    id: "skill-playwright",
    name: "playwright-cli",
    scope: "verification",
    status: "Enabled",
    updated: "Local",
    path: "C:\\Users\\rtale\\.agents\\skills\\playwright-cli\\SKILL.md",
    triggers: ["browser test", "screenshot", "UI verify"],
    description: "UI操作、スクリーンショット、ブラウザ検証用 skill。",
  },
];

const tools = [
  {
    id: "tool-shell",
    name: "shell_command",
    scope: "local",
    status: "Enabled",
    updated: "Available",
    path: "functions.shell_command",
    triggers: ["terminal", "check", "dev server"],
    description: "PowerShellコマンド実行、構文確認、ローカルサーバー起動に使うツール。",
  },
  {
    id: "tool-apply-patch",
    name: "apply_patch",
    scope: "editing",
    status: "Enabled",
    updated: "Available",
    path: "functions.apply_patch",
    triggers: ["edit files", "patch", "delete temp file"],
    description: "ファイル編集を差分として適用するためのツール。",
  },
  {
    id: "tool-image",
    name: "image_gen",
    scope: "asset",
    status: "Disabled",
    updated: "Available",
    path: "image_gen.imagegen",
    triggers: ["generate image", "icon", "visual asset"],
    description: "アイコンや画像素材を生成するためのツール。",
  },
];

const codingProjects = [
  {
    id: "hephaestus-ui",
    name: "Hephaestus UI",
    path: "D:\\Documents\\Projects\\Hephaestus_UI",
    updated: "今",
    linkedChatSessionIds: ["local-harness", "prompt-check"],
    workspace: [
      { kind: "dir", name: "assets", meta: "1 item" },
      { kind: "dir", name: "references", meta: "2 items" },
      { kind: "file", name: "index.html", meta: "layout" },
      { kind: "file", name: "styles.css", meta: "theme" },
      { kind: "file", name: "app.js", meta: "state" },
    ],
    codingSessions: [
      {
        id: "coding-chat-ui",
        title: "Chat UI build",
        status: "Active",
        updated: "03:58",
        summary: "Static UI wiring for session switching, branching, and composer behavior.",
        steps: ["Inspect current shell", "Patch HTML/CSS/JS", "Verify with Playwright"],
        messages: [
          { role: "assistant", text: "Workspace ready. Describe the code change to make in this project." },
        ],
      },
      {
        id: "coding-dashboard",
        title: "Dashboard resource panel",
        status: "Done",
        updated: "昨日",
        summary: "Dashboard snapshot cards and machine configuration view.",
        steps: ["Capture local system info", "Render cards", "Check theme transition"],
        messages: [
          { role: "assistant", text: "Dashboard work is complete. Ask for follow-up changes if needed." },
        ],
      },
    ],
  },
  {
    id: "local-harness",
    name: "Local Harness",
    path: "D:\\Documents\\Projects\\Local_Model_Harness",
    updated: "未接続",
    linkedChatSessionIds: ["local-harness"],
    workspace: [
      { kind: "dir", name: "models", meta: "workspace" },
      { kind: "dir", name: "runs", meta: "outputs" },
      { kind: "file", name: "harness.config.json", meta: "config" },
    ],
    codingSessions: [
      {
        id: "coding-server-stub",
        title: "Server stub",
        status: "Queued",
        updated: "未開始",
        summary: "Placeholder for local model server control surface.",
        steps: ["Define endpoint shape", "Connect process state", "Stream logs"],
        messages: [
          { role: "assistant", text: "Coding session queued. Send an instruction to start shaping the harness UI." },
        ],
      },
    ],
  },
];

let activeSessionId = chatSessions[0]?.id || null;
let expandedChatFolderId = chatSessions[0]?.folderId || null;
let draggedChatSessionId = null;
let activeNotebookNoteId = notebookNotes[0]?.id || null;
let expandedNotebookNoteId = notebookNotes[0]?.id || null;
let activeNotebookSessionId = null;
let activeNotebookMode = "note";
let activeSkillId = skills[0]?.id || null;
let activeProjectId = codingProjects[0]?.id || null;
let expandedProjectId = codingProjects[0]?.id || null;
let activeCodingMode = "workspace";
let activeCodingSessionType = "coding";
let activeCodingSessionId = codingProjects[0]?.codingSessions[0]?.id || null;
let openLinkProjectId = null;
let linkSearchQuery = "";
let nextSessionNumber = 1;
let nextChatFolderNumber = 1;
let nextNotebookNoteNumber = 1;
let nextNotebookSessionNumber = 1;
let nextSkillNumber = 1;
let nextToolNumber = 1;
let nextProjectNumber = 1;
let nextCodingSessionNumber = 1;
let nextMessageId = 5;
let nextSourceNumber = 1;

const CHAT_STATE_KEY = "hephaestus-chat-state-v1";
const UI_SCALE_KEY = "hephaestus-ui-scale-v1";
const MODEL_LABELS = {
  auto: "Auto",
  "agents-a1": "Agents-A1",
  ornith: "Ornith",
};
const CODING_ROUTE_PATTERN = /実装|修正|テスト|ビルド|エラー|失敗|不具合|バグ|差分|変更|implement|fix|test|build|error|fail|bug|refactor|diff|patch/i;

let selectedModelMode = "auto";
let reasoningEnabled = false;
let runtimeInfo = {
  state: "checking",
  active_model_id: null,
  active_model_label: null,
  provider: null,
  mock: false,
  last_error: null,
};
let activeChatStream = null;
let runtimeStatusTimer = null;
let lastRuntimeModelId = null;

const syncNextMessageId = () => {
  const maxId = chatSessions.reduce((max, session) => {
    const sessionMax = (session.messages || []).reduce((innerMax, message) => {
      const match = /^m(\d+)$/.exec(message.id || "");
      return match ? Math.max(innerMax, Number(match[1])) : innerMax;
    }, 0);
    return Math.max(max, sessionMax);
  }, 0);
  nextMessageId = Math.max(nextMessageId, maxId + 1);
};

const loadChatState = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(CHAT_STATE_KEY) || "{}");
    if (MODEL_LABELS[saved.selectedModelMode]) selectedModelMode = saved.selectedModelMode;
    reasoningEnabled = Boolean(saved.reasoningEnabled);
    if (Array.isArray(saved.chatSessions)) chatSessions = saved.chatSessions;
    chatSessions.forEach((session) => {
      if (!MODEL_LABELS[session.modelMode]) session.modelMode = selectedModelMode;
      if (typeof session.reasoningEnabled !== "boolean") session.reasoningEnabled = reasoningEnabled;
      (session.messages || []).forEach((message) => {
        if (message.metrics?.isRunning) {
          message.metrics.isRunning = false;
          if (message.versions && !message.versions[message.versionIndex || 0]) {
            message.versions[message.versionIndex || 0] = "Stopped.";
          }
        }
      });
    });
    if (Array.isArray(saved.chatFolders)) chatFolders = saved.chatFolders;
    if (typeof saved.activeSessionId === "string") activeSessionId = saved.activeSessionId;
    if (typeof saved.expandedChatFolderId === "string" || saved.expandedChatFolderId === null) {
      expandedChatFolderId = saved.expandedChatFolderId;
    }
    if (saved.runtimeInfo && typeof saved.runtimeInfo === "object") {
      runtimeInfo = { ...runtimeInfo, ...saved.runtimeInfo, state: "checking" };
    }
    syncNextMessageId();
  } catch {
    localStorage.removeItem(CHAT_STATE_KEY);
  }
};

const persistChatState = () => {
  const savedRuntime = {
    state: runtimeInfo.state,
    active_model_id: runtimeInfo.active_model_id,
    active_model_label: runtimeInfo.active_model_label,
    starting_model_id: runtimeInfo.starting_model_id,
    starting_model_label: runtimeInfo.starting_model_label,
    provider: runtimeInfo.provider,
    mock: runtimeInfo.mock,
    acceleration: runtimeInfo.acceleration,
    cuda_build: runtimeInfo.cuda_build,
    last_error: runtimeInfo.last_error,
  };
  localStorage.setItem(CHAT_STATE_KEY, JSON.stringify({
    chatSessions,
    chatFolders,
    activeSessionId,
    expandedChatFolderId,
    selectedModelMode,
    reasoningEnabled,
    runtimeInfo: savedRuntime,
  }));
};

loadChatState();

const applyTheme = (theme) => {
  const dark = theme === "dark";
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("hephaestus-theme", theme);
  themeToggle.setAttribute("aria-pressed", String(dark));
  themeToggle.setAttribute("aria-label", dark ? "ライトモードに切り替える" : "ダークモードに切り替える");
  themeMeta.setAttribute("content", dark ? "#121213" : "#FAF8F5");
};

const savedTheme = localStorage.getItem("hephaestus-theme");
const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
applyTheme(savedTheme || preferredTheme);

toggle.addEventListener("click", () => {
  const collapsed = sidebar.classList.toggle("is-collapsed");
  toggle.setAttribute("aria-expanded", String(!collapsed));
  toggle.setAttribute(
    "aria-label",
    collapsed ? "サイドバーを展開する" : "サイドバーを折りたたむ",
  );
});

themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
});

const showView = (viewId, updateHash = true) => {
  const hasView = views.some((view) => view.dataset.view === viewId);
  if (!hasView) return false;
  const currentView = views.find((view) => !view.hidden)?.dataset.view;
  const changing = currentView !== viewId;

  views.forEach((view) => {
    const active = view.dataset.view === viewId;
    view.hidden = !active;
    view.classList.toggle("is-active", active);
    view.classList.remove("is-entering");
    if (active && changing) {
      void view.offsetWidth;
      view.classList.add("is-entering");
    }
  });

  navItems.forEach((item) => {
    item.classList.toggle("active", item.getAttribute("href") === `#${viewId}`);
  });

  if (updateHash && window.location.hash !== `#${viewId}`) {
    history.replaceState(null, "", `#${viewId}`);
  }

  return true;
};

views.forEach((view) => {
  view.addEventListener("animationend", () => view.classList.remove("is-entering"));
});

navItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    const viewId = item.getAttribute("href")?.slice(1);
    if (!viewId || !showView(viewId)) return;
    if (viewId === "coding") renderCoding();
    event.preventDefault();
  });
});

const initialView = window.location.hash.slice(1) || "dashboard";
const normalizedInitialView = initialView === "index" ? "knowledge" : initialView;
if (!showView(normalizedInitialView, false)) showView("dashboard", false);

const getActiveSession = () => {
  const session = chatSessions.find((item) => item.id === activeSessionId);
  if (session) return session;
  activeSessionId = chatSessions[0]?.id || null;
  return chatSessions[0] || null;
};

const getActiveProject = () => {
  const project = codingProjects.find((item) => item.id === activeProjectId);
  if (project) return project;
  activeProjectId = codingProjects[0]?.id || null;
  return codingProjects[0] || null;
};

const moveToFront = (list, item) => {
  const index = list.indexOf(item);
  if (index > 0) list.unshift(list.splice(index, 1)[0]);
};

const touchChatSession = (session) => {
  if (!session) return;
  session.updated = "今";
  moveToFront(chatSessions, session);
  codingProjects.forEach((project) => {
    if (project.linkedChatSessionIds.includes(session.id)) touchProject(project);
  });
  persistChatState();
};

const deleteChatSession = (session) => {
  const index = chatSessions.findIndex((item) => item.id === session.id);
  if (index < 0) return;
  chatSessions.splice(index, 1);
  codingProjects.forEach((item) => {
    item.linkedChatSessionIds = item.linkedChatSessionIds.filter((id) => id !== session.id);
  });
  if (activeSessionId === session.id) activeSessionId = chatSessions[index]?.id || chatSessions[index - 1]?.id || null;
  persistChatState();
};

const touchChatFolder = (folder) => moveToFront(chatFolders, folder);

const createChatFolder = () => {
  const folder = { id: `chat-folder-${Date.now()}`, title: `New folder ${nextChatFolderNumber++}` };
  chatFolders.unshift(folder);
  expandedChatFolderId = folder.id;
  persistChatState();
  renderChat(true);
};

const deleteChatFolder = (folder) => {
  const index = chatFolders.findIndex((item) => item.id === folder.id);
  if (index < 0) return;
  chatSessions.forEach((session) => {
    if (session.folderId === folder.id) session.folderId = null;
  });
  chatFolders.splice(index, 1);
  if (expandedChatFolderId === folder.id) expandedChatFolderId = null;
  persistChatState();
  renderChat(true);
};

const assignChatSessionToFolder = (sessionId, folder) => {
  const session = chatSessions.find((item) => item.id === sessionId);
  if (!session || !folder) return;
  session.folderId = folder.id;
  expandedChatFolderId = folder.id;
  touchChatSession(session);
  touchChatFolder(folder);
  persistChatState();
  renderChat(true);
};

const touchProject = (project) => {
  if (!project) return;
  project.updated = "今";
  moveToFront(codingProjects, project);
};

const touchCodingSession = (project, session) => {
  if (!session) return touchProject(project);
  session.updated = "今";
  if (project) moveToFront(project.codingSessions, session);
  touchProject(project);
};

const touchNotebookNote = (note) => {
  if (!note) return;
  note.updated = "今";
  moveToFront(notebookNotes, note);
};

const touchNotebookSession = (note, session) => {
  if (!session) return touchNotebookNote(note);
  session.updated = "今";
  if (note) moveToFront(note.sessions, session);
  touchNotebookNote(note);
};

const makeIconButton = (className, label, iconName) => {
  const button = document.createElement("button");
  button.className = className;
  button.type = "button";
  button.setAttribute("aria-label", label);
  button.innerHTML = icons[iconName];
  return button;
};

const makeTitleForm = (value, label, onSave) => {
  const form = document.createElement("form");
  form.className = "notebook-title-form";
  const input = document.createElement("input");
  input.className = "notebook-title-input";
  input.value = value;
  input.setAttribute("aria-label", label);
  const save = makeIconButton("message-action", `${label}を保存`, "edit");
  save.type = "submit";
  form.append(input, save);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const next = input.value.trim();
    if (next) onSave(next);
  });
  return form;
};

const makeMemoForm = (target, onSave) => {
  const form = document.createElement("form");
  form.className = "workspace-settings";

  const overviewRow = document.createElement("label");
  overviewRow.className = "setting-row";
  const overviewLabel = document.createElement("span");
  overviewLabel.className = "detail-label";
  overviewLabel.textContent = "Overview";
  const overview = document.createElement("textarea");
  overview.className = "setting-input";
  overview.rows = 5;
  overview.value = target.overview || "";
  overview.placeholder = "概要メモ";

  const promptRow = document.createElement("label");
  promptRow.className = "setting-row";
  const promptLabel = document.createElement("span");
  promptLabel.className = "detail-label";
  promptLabel.textContent = "Dedicated prompt";
  const prompt = document.createElement("textarea");
  prompt.className = "setting-input";
  prompt.rows = 7;
  prompt.value = target.prompt || "";
  prompt.placeholder = "この対象で使う専用プロンプト";

  const save = document.createElement("button");
  save.className = "setting-submit";
  save.type = "submit";
  save.textContent = "Apply";

  overviewRow.append(overviewLabel, overview);
  promptRow.append(promptLabel, prompt);
  form.append(overviewRow, promptRow, save);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    target.overview = overview.value.trim();
    target.prompt = prompt.value.trim();
    onSave();
  });
  return form;
};

const getVisibleViewId = () => views.find((view) => !view.hidden)?.dataset.view || "chat";

const getSessionModelMode = (session = getActiveSession()) => session?.modelMode || selectedModelMode;

const getSessionReasoningEnabled = (session = getActiveSession()) => (
  typeof session?.reasoningEnabled === "boolean" ? session.reasoningEnabled : reasoningEnabled
);

const setSessionModelMode = (value) => {
  const session = getActiveSession();
  if (session) session.modelMode = value;
  else selectedModelMode = value;
};

const setSessionReasoningEnabled = (value) => {
  const session = getActiveSession();
  if (session) session.reasoningEnabled = value;
  else reasoningEnabled = value;
};

const updateDefaultModelSettingsUi = () => {
  if (defaultModelSelect) defaultModelSelect.value = selectedModelMode;
  if (defaultReasoningToggle) defaultReasoningToggle.checked = reasoningEnabled;
};

const resolveClientRoute = (text, surface = getVisibleViewId(), session = getActiveSession()) => {
  const modelMode = getSessionModelMode(session);
  if (modelMode !== "auto") {
    return {
      selectedModel: modelMode,
      selectedModelLabel: MODEL_LABELS[modelMode],
      taskKind: modelMode === "ornith" ? "coding" : "analysis",
      routeReason: "manual selection",
    };
  }
  if (surface === "coding" || CODING_ROUTE_PATTERN.test(text || "")) {
    return {
      selectedModel: "ornith",
      selectedModelLabel: "Ornith",
      taskKind: "coding",
      routeReason: "coding/edit/test signal",
    };
  }
  return {
    selectedModel: "agents-a1",
    selectedModelLabel: "Agents-A1",
    taskKind: "analysis",
    routeReason: "analysis/research default",
  };
};

const updateModelSelectorUi = () => {
  const modelMode = getSessionModelMode();
  modelRouteSelector?.querySelectorAll("button[data-model]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.model === modelMode));
  });
  updateDefaultModelSettingsUi();
};

const getResumeModelId = () => {
  const modelMode = getSessionModelMode();
  if (modelMode !== "auto") return modelMode;
  return runtimeInfo.active_model_id || runtimeInfo.starting_model_id || lastRuntimeModelId || "agents-a1";
};

const getTopbarRuntimeState = () => {
  const model = runtimeInfo.starting_model_label
    || runtimeInfo.active_model_label
    || MODEL_LABELS[getResumeModelId()]
    || "No resident model";
  if (activeChatStream) {
    const action = activeChatStream.reasoningEnabled ? "思考中" : "生成中";
    return { model: activeChatStream.route?.selectedModelLabel || model, status: action };
  }
  if (runtimeInfo.starting_model_label || runtimeInfo.state === "starting") {
    return { model, status: "ロード中" };
  }
  if (runtimeInfo.last_error && runtimeInfo.state === "error") {
    return { model, status: "エラー" };
  }
  if (runtimeInfo.state === "ready") return { model, status: "アイドル" };
  if (runtimeInfo.state === "idle") return { model, status: "停止中" };
  if (runtimeInfo.state === "checking") return { model, status: "確認中" };
  return { model, status: runtimeInfo.state || "オフライン" };
};

const updateRuntimeUi = () => {
  updateModelSelectorUi();
  lastRuntimeModelId = runtimeInfo.active_model_id || runtimeInfo.starting_model_id || lastRuntimeModelId;
  const topbar = getTopbarRuntimeState();
  if (runtimeModel) runtimeModel.textContent = topbar.model;
  if (runtimeStatus) runtimeStatus.textContent = topbar.status;
  if (runtimeReasoning) runtimeReasoning.textContent = getSessionReasoningEnabled() ? "推論ON" : "推論OFF";
  if (runtimeStop) runtimeStop.disabled = !activeChatStream && !runtimeInfo.active_model_id && !runtimeInfo.starting_model_id;
  if (runtimeResume) runtimeResume.disabled = Boolean(activeChatStream || runtimeInfo.starting_model_id || runtimeInfo.state === "starting");
  if (reasoningToggle) reasoningToggle.setAttribute("aria-pressed", String(getSessionReasoningEnabled()));
};

const fetchRuntimeStatus = async () => {
  try {
    const response = await fetch("/api/runtime/status", { cache: "no-store" });
    if (response.status === 401) {
      showAuthOverlay();
      return;
    }
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    runtimeInfo = await response.json();
  } catch (error) {
    runtimeInfo = {
      ...runtimeInfo,
      state: "offline",
      last_error: error.message || "Backend unavailable",
    };
  }
  updateRuntimeUi();
  persistChatState();
  renderDashboardQueue();
};

const stopRuntime = async () => {
  if (activeChatStream) {
    cancelActiveStream();
    return;
  }
  if (runtimeStop) runtimeStop.disabled = true;
  try {
    const response = await fetch("/api/runtime/stop", { method: "POST" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    runtimeInfo = await response.json();
  } catch (error) {
    runtimeInfo = { ...runtimeInfo, state: "error", last_error: error.message || "stop failed" };
  }
  updateRuntimeUi();
  renderDashboardQueue();
};

const resumeRuntime = async () => {
  if (runtimeResume) runtimeResume.disabled = true;
  const modelId = getResumeModelId();
  runtimeInfo = {
    ...runtimeInfo,
    state: "starting",
    starting_model_id: modelId,
    starting_model_label: MODEL_LABELS[modelId],
  };
  updateRuntimeUi();
  try {
    const response = await fetch("/api/runtime/select", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model_id: modelId }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    runtimeInfo = await response.json();
  } catch (error) {
    runtimeInfo = { ...runtimeInfo, state: "error", last_error: error.message || "resume failed" };
  }
  updateRuntimeUi();
  renderDashboardQueue();
};

const showAuthOverlay = (message = "") => {
  if (!authOverlay) return;
  authOverlay.hidden = false;
  if (authMessage) authMessage.textContent = message;
  authTokenInput?.focus();
};

const hideAuthOverlay = () => {
  if (authOverlay) authOverlay.hidden = true;
  if (authMessage) authMessage.textContent = "";
};

const startRuntimePolling = () => {
  if (runtimeStatusTimer) return;
  fetchRuntimeStatus();
  runtimeStatusTimer = setInterval(fetchRuntimeStatus, 5000);
};

const refreshAuthStatus = async () => {
  const response = await fetch("/api/auth/status", { cache: "no-store" });
  const status = await response.json();
  if (externalTokenInput && status.token) externalTokenInput.value = status.token;
  if (status.required && !status.authenticated) {
    showAuthOverlay();
    return false;
  }
  hideAuthOverlay();
  startRuntimePolling();
  return true;
};

const loginWithToken = async (token) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  if (!response.ok) throw new Error("Invalid token");
  await refreshAuthStatus();
};

const regenerateExternalToken = async () => {
  const response = await fetch("/api/auth/token/regenerate", { method: "POST" });
  if (response.status === 401) {
    showAuthOverlay();
    return;
  }
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  if (externalTokenInput) externalTokenInput.value = data.token || "";
};

const cancelActiveStream = () => {
  if (!activeChatStream) return;
  activeChatStream.abortController.abort();
};

const queueState = {
  active: null,
  waiting: [
    { id: "task-notebook-answer", title: "Notebook source answer", meta: "Local Model Research / waiting", owner: "Notebook" },
    { id: "task-chat-branch", title: "Chat branch response", meta: "Local harness / waiting", owner: "Chat" },
    { id: "task-knowledge-index", title: "Knowledge indexing", meta: "Harness docs / deferred", owner: "Knowledge" },
  ],
  stopped: [],
};
let draggedQueueTaskId = null;

const stopActiveTask = () => {
  if (!queueState.active) return;
  queueState.stopped.unshift({ ...queueState.active, elapsed: "Stopped" });
  queueState.active = null;
  renderDashboardQueue();
};

const startTask = (task, source) => {
  if (queueState.active) queueState.stopped.unshift({ ...queueState.active, elapsed: "Stopped" });
  queueState[source] = queueState[source].filter((item) => item.id !== task.id);
  queueState.active = { ...task, elapsed: "00:00" };
  renderDashboardQueue();
};

const deleteStoppedTask = (task) => {
  queueState.stopped = queueState.stopped.filter((item) => item.id !== task.id);
  renderDashboardQueue();
};

const deleteWaitingTask = (task) => {
  queueState.waiting = queueState.waiting.filter((item) => item.id !== task.id);
  renderDashboardQueue();
};

const requeueStoppedTask = (task) => {
  queueState.stopped = queueState.stopped.filter((item) => item.id !== task.id);
  queueState.waiting.push({ ...task, elapsed: undefined });
  renderDashboardQueue();
};

const moveQueuedTaskToIndex = (taskId, targetIndex) => {
  if (!taskId) return;
  const from = queueState.waiting.findIndex((item) => item.id === taskId);
  if (from < 0) return;
  let insertIndex = Math.max(0, Math.min(queueState.waiting.length, targetIndex));
  if (from < insertIndex) insertIndex -= 1;
  if (from === insertIndex) return;
  const [task] = queueState.waiting.splice(from, 1);
  queueState.waiting.splice(insertIndex, 0, task);
  renderDashboardQueue(true);
};

const getQueueItemRects = () => {
  if (!taskQueueList) return new Map();
  return new Map(Array.from(taskQueueList.querySelectorAll(".task-queue-item[data-task-id]"))
    .map((item) => [item.dataset.taskId, item.getBoundingClientRect()]));
};

const animateQueueReorder = (previousRects) => {
  if (!previousRects.size) return;
  taskQueueList.querySelectorAll(".task-queue-item[data-task-id]").forEach((item) => {
    if (item.dataset.taskId === draggedQueueTaskId) return;
    const previous = previousRects.get(item.dataset.taskId);
    if (!previous) return;
    const current = item.getBoundingClientRect();
    const deltaY = previous.top - current.top;
    if (Math.abs(deltaY) < 1) return;
    item.style.transition = "none";
    item.style.transform = `translateY(${deltaY}px)`;
    void item.offsetHeight;
    requestAnimationFrame(() => {
      item.style.transition = "";
      item.style.transform = "";
    });
  });
};

const appendDetailRow = (list, label, value) => {
  const row = document.createElement("div");
  const term = document.createElement("dt");
  const description = document.createElement("dd");
  term.textContent = label;
  description.textContent = value;
  row.append(term, description);
  list.append(row);
};

const makeQueueButton = (label, iconName, onClick, disabled = false) => {
  const button = makeIconButton("message-action queue-action", label, iconName);
  button.disabled = disabled;
  button.addEventListener("click", onClick);
  return button;
};

const renderQueueItem = (task, rank, status, actions, draggable = false) => {
  const item = document.createElement("li");
  item.className = "task-queue-item";
  item.dataset.taskId = task.id;
  item.classList.toggle("is-running", status === "Running");
  item.classList.toggle("is-stopped", status === "Stopped");
  item.classList.toggle("is-dragging", task.id === draggedQueueTaskId);

  const handle = draggable
    ? makeIconButton("message-action queue-drag-handle", `${task.title}をドラッグして並び替え`, "grip")
    : document.createElement("span");
  if (!draggable) handle.className = "queue-drag-spacer";
  if (draggable) {
    item.draggable = true;
    handle.draggable = true;
    item.addEventListener("dragstart", (event) => {
      if (!event.target.closest(".queue-drag-handle")) {
        event.preventDefault();
        return;
      }
      draggedQueueTaskId = task.id;
      item.classList.add("is-dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", task.id);
    });
    item.addEventListener("dragend", () => {
      draggedQueueTaskId = null;
      item.classList.remove("is-dragging");
      renderDashboardQueue();
    });
    item.addEventListener("dragover", (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      const targetIndex = queueState.waiting.findIndex((candidate) => candidate.id === task.id);
      if (targetIndex < 0) return;
      const rect = item.getBoundingClientRect();
      const afterTarget = event.clientY > rect.top + rect.height / 2;
      moveQueuedTaskToIndex(draggedQueueTaskId, targetIndex + (afterTarget ? 1 : 0));
    });
    item.addEventListener("drop", (event) => {
      event.preventDefault();
      draggedQueueTaskId = null;
      renderDashboardQueue();
    });
  }

  const label = document.createElement("span");
  label.className = "queue-rank";
  label.textContent = rank;

  const body = document.createElement("div");
  const title = document.createElement("strong");
  const meta = document.createElement("p");
  title.textContent = task.title;
  meta.textContent = `${task.meta} / ${status}`;
  body.append(title, meta);

  const controls = document.createElement("div");
  controls.className = "queue-actions";
  actions.forEach((action) => controls.append(action));

  item.append(handle, label, body, controls);
  return item;
};

const renderDashboardQueue = (animate = false) => {
  if (!modelSlotStatus || !modelSlotDetails || !modelSlotActions || !queueCount || !taskQueueList) return;
  const previousRects = animate ? getQueueItemRects() : new Map();

  const active = queueState.active;
  const runtimeBusy = Boolean(activeChatStream || active);
  const runtimeLabel = runtimeInfo.active_model_label || "None";
  modelSlotStatus.textContent = runtimeBusy ? "Busy" : (runtimeInfo.state === "ready" ? "Ready" : "Idle");
  modelSlotStatus.classList.toggle("is-busy", runtimeBusy || runtimeInfo.state === "ready");
  modelSlotDetails.replaceChildren();
  appendDetailRow(modelSlotDetails, "Resident model", runtimeLabel);
  appendDetailRow(modelSlotDetails, "Provider", runtimeInfo.provider || "auto");
  appendDetailRow(modelSlotDetails, "Active task", activeChatStream ? "Chat response" : (active?.title || "No running task"));
  appendDetailRow(modelSlotDetails, "Owner", activeChatStream ? "Chat" : (active?.owner || "Queue waiting"));
  appendDetailRow(modelSlotDetails, "Elapsed", active?.elapsed || "--:--");
  appendDetailRow(modelSlotDetails, "Policy", runtimeInfo.mock ? "Mock stream, single resident model" : "Single resident model, queued execution");

  modelSlotActions.replaceChildren();
  if (activeChatStream) {
    modelSlotActions.append(makeQueueButton("生成を停止", "stop", cancelActiveStream));
  }

  queueCount.textContent = `${queueState.waiting.length} waiting / ${queueState.stopped.length} stopped`;
  taskQueueList.replaceChildren();

  if (activeChatStream) {
    taskQueueList.append(renderQueueItem({
      id: "task-chat-stream",
      title: "Generate Chat response",
      meta: `${activeChatStream.route.selectedModelLabel} / ${activeChatStream.route.taskKind}`,
      owner: "Chat",
      elapsed: "Running",
    }, "Now", "Running", [
      makeQueueButton("生成を停止", "stop", cancelActiveStream),
    ]));
  } else if (active) {
    taskQueueList.append(renderQueueItem(active, "Now", "Running", [
      makeQueueButton(`${active.title}を停止`, "stop", stopActiveTask),
    ]));
  } else {
    taskQueueList.append(renderQueueItem({
      id: "task-placeholder",
      title: "No running task",
      meta: "Model slot is idle",
    }, "Now", "Idle", []));
    taskQueueList.lastElementChild.classList.add("is-placeholder");
  }

  if (!active && !queueState.waiting.length && !queueState.stopped.length) {
    const empty = document.createElement("li");
    empty.className = "task-queue-empty";
    empty.textContent = "待機中のタスクなし";
    taskQueueList.append(empty);
    return;
  }

  queueState.waiting.forEach((task, index) => {
    taskQueueList.append(renderQueueItem(task, String(index + 1).padStart(2, "0"), "Waiting", [
      makeQueueButton(`${task.title}を開始`, "play", () => startTask(task, "waiting")),
      makeQueueButton(`${task.title}を削除`, "trash", () => deleteWaitingTask(task)),
    ], true));
  });

  queueState.stopped.forEach((task) => {
    taskQueueList.append(renderQueueItem(task, "Stop", "Stopped", [
      makeQueueButton(`${task.title}を再開`, "play", () => startTask(task, "stopped")),
      makeQueueButton(`${task.title}をキュー末尾へ再投入`, "requeue", () => requeueStoppedTask(task)),
      makeQueueButton(`${task.title}を削除`, "trash", () => deleteStoppedTask(task)),
    ]));
  });

  if (animate) animateQueueReorder(previousRects);
};

const closeComposerTools = () => {
  document.querySelectorAll(".composer-tools.is-open").forEach((tools) => {
    tools.classList.remove("is-open");
    tools.querySelector(".composer-tool-toggle")?.setAttribute("aria-expanded", "false");
  });
};

const insertComposerText = (textarea, text) => {
  const start = textarea.selectionStart ?? textarea.value.length;
  const end = textarea.selectionEnd ?? textarea.value.length;
  textarea.value = `${textarea.value.slice(0, start)}${text}${textarea.value.slice(end)}`;
  textarea.setSelectionRange(start + text.length, start + text.length);
  textarea.focus();
};

const decorateComposer = (form) => {
  if (form.querySelector(".composer-tools")) return;
  const box = form.querySelector(".composer-box");
  const textarea = form.querySelector("textarea");

  const tools = document.createElement("div");
  tools.className = "composer-tools";
  tools.addEventListener("click", (event) => event.stopPropagation());

  const toggle = makeIconButton("composer-tool-toggle", "ファイル追加とスキル指定", "plus");
  toggle.setAttribute("aria-expanded", "false");

  const menu = document.createElement("div");
  menu.className = "composer-tool-menu";

  const fileInput = document.createElement("input");
  fileInput.className = "composer-file-input";
  fileInput.type = "file";
  fileInput.multiple = true;
  fileInput.hidden = true;
  fileInput.setAttribute("aria-label", "追加するファイル");

  const file = document.createElement("button");
  file.className = "composer-tool-option";
  file.type = "button";
  file.textContent = "File";
  file.addEventListener("click", () => {
    closeComposerTools();
    fileInput.click();
  });

  fileInput.addEventListener("change", () => {
    const names = Array.from(fileInput.files || []).map((item) => `@${item.name}`);
    if (names.length) insertComposerText(textarea, `${names.join(" ")} `);
    fileInput.value = "";
  });

  const skillRow = document.createElement("div");
  skillRow.className = "composer-skill-row";

  const skillInput = document.createElement("input");
  skillInput.className = "composer-skill-input";
  skillInput.type = "text";
  skillInput.setAttribute("aria-label", "指定するスキル");
  skillInput.placeholder = "$skill";

  const skill = document.createElement("button");
  skill.className = "composer-tool-option";
  skill.type = "button";
  skill.textContent = "Skill";

  const addSkill = () => {
    const value = skillInput.value.trim().replace(/^\$/, "");
    insertComposerText(textarea, `[$${value || "skill"}] `);
    skillInput.value = "";
    closeComposerTools();
  };

  skill.addEventListener("click", addSkill);
  skillInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    addSkill();
  });

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const open = !tools.classList.contains("is-open");
    closeComposerTools();
    tools.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    if (open) skillInput.focus();
  });

  skillRow.append(skillInput, skill);
  menu.append(file, skillRow);
  tools.append(toggle, menu, fileInput);
  box.insertBefore(tools, textarea);
};

const getNotebookSessions = () => notebookNotes.flatMap((note) => note.sessions);

const getActiveNotebookNote = () => {
  const note = notebookNotes.find((item) => item.id === activeNotebookNoteId);
  if (note) return note;
  activeNotebookNoteId = notebookNotes[0]?.id || null;
  expandedNotebookNoteId = expandedNotebookNoteId || activeNotebookNoteId;
  return notebookNotes[0] || null;
};

const getNotebookNoteForSession = (sessionId) => notebookNotes.find((note) => note.sessions.some((session) => session.id === sessionId));

const getActiveNotebookSession = () => {
  if (activeNotebookMode !== "session") return null;
  const noteForSession = getNotebookNoteForSession(activeNotebookSessionId);
  const session = noteForSession?.sessions.find((item) => item.id === activeNotebookSessionId);
  if (session) {
    activeNotebookNoteId = noteForSession.id;
    return session;
  }

  const note = getActiveNotebookNote();
  const fallback = note?.sessions[0] || null;
  activeNotebookSessionId = fallback?.id || null;
  if (!fallback) activeNotebookMode = "note";
  return fallback;
};

const getActiveNotebookSource = (note = getActiveNotebookNote()) => {
  if (!note?.sources?.length) return null;
  const source = note.sources.find((item) => item.id === note.activeSourceId);
  if (source) return source;
  note.activeSourceId = note.sources[0].id;
  return note.sources[0];
};

const makeNotebookMessageElement = (role, text) => {
  const message = typeof role === "object" ? role : { role, text };
  const displayText = message.text || (message.metrics?.isRunning ? "生成中..." : "");
  const article = document.createElement("article");
  article.className = `message from-${message.role}`;

  const header = document.createElement("div");
  header.className = "message-header";

  const roleGroup = document.createElement("div");
  roleGroup.className = "message-role-group";

  const label = document.createElement("span");
  label.className = "message-role";
  label.textContent = message.role === "user" ? "User" : "Notebook";

  const time = document.createElement("span");
  time.className = "message-time";
  time.textContent = getMessageTime(message);

  const metrics = getAssistantMetrics(message, displayText);
  roleGroup.append(label, time);
  if (metrics) {
    const meta = document.createElement("span");
    meta.className = "message-metrics";
    meta.textContent = metrics;
    roleGroup.append(meta);
  }

  const body = document.createElement("div");
  body.className = "message-body";

  const content = document.createElement("div");
  content.className = "message-text";
  content.innerHTML = renderMarkdown(displayText);

  header.append(roleGroup);
  body.append(content);
  article.append(header, body);
  return article;
};

const updateNotebookSourceMeta = () => {
  notebookSourceMeta.textContent = "";
  notebookSourceMeta.hidden = true;
};

const createNotebookSession = (note) => {
  const session = {
    id: `notebook-${Date.now()}`,
    title: `New chat ${nextNotebookSessionNumber++}`,
    updated: "今",
    messages: [],
  };
  note.sessions.unshift(session);
  touchNotebookSession(note, session);
  activeNotebookNoteId = note.id;
  expandedNotebookNoteId = note.id;
  activeNotebookSessionId = session.id;
  activeNotebookMode = "session";
  renderNotebook(true);
  notebookInput.focus();
};

const deleteNotebookSession = (session, note) => {
  const index = note.sessions.findIndex((item) => item.id === session.id);
  if (index < 0) return;
  note.sessions.splice(index, 1);
  touchNotebookNote(note);
  if (activeNotebookSessionId === session.id) {
    activeNotebookSessionId = note.sessions[index]?.id || note.sessions[index - 1]?.id || null;
    activeNotebookMode = activeNotebookSessionId ? "session" : "note";
  }
  renderNotebook(true);
};

const renderNotebookSessionButton = (session, note) => {
  const item = document.createElement("div");
  item.className = "accordion-session coding-session-item session-item";
  item.classList.toggle("is-active", session.id === activeNotebookSessionId);

  const select = document.createElement("button");
  select.className = "coding-session-select session-select";
  select.type = "button";
  select.setAttribute("aria-pressed", String(session.id === activeNotebookSessionId));

  const title = document.createElement("span");
  title.className = "coding-session-title session-title";
  title.textContent = session.title;

  select.append(title);
  select.addEventListener("click", () => {
    if (activeNotebookSessionId === session.id) return;
    activeNotebookNoteId = note.id;
    expandedNotebookNoteId = note.id;
    activeNotebookSessionId = session.id;
    activeNotebookMode = "session";
    renderNotebook(true);
  });

  const remove = makeIconButton("session-delete", `${session.title}を削除`, "trash");
  remove.addEventListener("click", () => deleteNotebookSession(session, note));

  item.append(select, remove);
  return item;
};

const renderNotebookNoteAccordion = (note) => {
  const accordion = document.createElement("div");
  accordion.className = "project-accordion";

  const content = document.createElement("div");
  content.className = "project-accordion-inner";

  const row = document.createElement("div");
  row.className = "session-group-row";

  const label = document.createElement("p");
  label.className = "session-group-title";
  label.textContent = "Sessions";

  const addSession = makeIconButton("new-session coding-session-create", `${note.title}にセッションを追加`, "plus");
  addSession.addEventListener("click", () => createNotebookSession(note));

  row.append(label, addSession);
  content.append(row);
  note.sessions.forEach((session) => content.append(renderNotebookSessionButton(session, note)));

  if (!note.sessions.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "セッションなし";
    content.append(empty);
  }

  accordion.append(content);
  return accordion;
};

const deleteNotebookNote = (note) => {
  const index = notebookNotes.findIndex((item) => item.id === note.id);
  if (index < 0) return;
  notebookNotes.splice(index, 1);
  const fallback = notebookNotes[index] || notebookNotes[index - 1] || notebookNotes[0] || null;
  activeNotebookNoteId = fallback?.id || null;
  expandedNotebookNoteId = fallback?.id || null;
  activeNotebookSessionId = null;
  activeNotebookMode = "note";
  renderNotebook(true);
};

const renderNotebookNotes = () => {
  notebookNoteList.replaceChildren();

  if (!notebookNotes.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "ノートなし";
    notebookNoteList.append(empty);
    return;
  }

  notebookNotes.forEach((note) => {
    const item = document.createElement("div");
    item.className = "project-item";
    item.classList.toggle("is-active", note.id === activeNotebookNoteId);
    item.classList.toggle("is-expanded", note.id === expandedNotebookNoteId);

    const row = document.createElement("div");
    row.className = "project-row session-item";

    const select = document.createElement("button");
    select.className = "project-select session-select";
    select.type = "button";
    select.setAttribute("aria-pressed", String(note.id === activeNotebookNoteId));
    select.setAttribute("aria-expanded", String(note.id === expandedNotebookNoteId));

    const title = document.createElement("span");
    title.className = "project-title session-title";
    title.textContent = note.title;

    select.append(title);
    select.addEventListener("click", () => {
      const wasSessionFocus = activeNotebookMode === "session";
      const wasSameNote = activeNotebookNoteId === note.id;
      activeNotebookNoteId = note.id;
      expandedNotebookNoteId = wasSameNote && !wasSessionFocus && expandedNotebookNoteId === note.id ? null : note.id;
      activeNotebookSessionId = null;
      activeNotebookMode = "note";
      renderNotebook(true);
    });

    const remove = makeIconButton("session-delete", `${note.title}を削除`, "trash");
    remove.addEventListener("click", () => deleteNotebookNote(note));

    row.append(select, remove);
    item.append(row, renderNotebookNoteAccordion(note));
    notebookNoteList.append(item);
  });
};

const renderNotebookSources = () => {
  const note = getActiveNotebookNote();
  const sources = note?.sources || [];
  sourceList.replaceChildren();
  newSourceButton.disabled = !note;

  if (!note) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "ノートを選択してください";
    sourceList.append(empty);
    return;
  }

  if (!sources.length) {
    note.activeSourceId = null;
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Sourceなし";
    sourceList.append(empty);
    return;
  }

  getActiveNotebookSource(note);

  sources.forEach((source) => {
    const item = document.createElement("div");
    item.className = "source-item";
    item.classList.toggle("is-active", source.id === note.activeSourceId);

    const select = document.createElement("button");
    select.className = "source-select";
    select.type = "button";
    select.setAttribute("aria-pressed", String(source.id === note.activeSourceId));

    const title = document.createElement("span");
    title.className = "source-title";
    title.textContent = source.title;

    const meta = document.createElement("span");
    meta.className = "source-meta";
    meta.textContent = source.meta;

    select.append(title, meta);
    select.addEventListener("click", () => {
      note.activeSourceId = source.id;
      touchNotebookNote(note);
      renderNotebook();
    });

    const remove = makeIconButton("session-delete", `${source.title}を削除`, "trash");
    remove.addEventListener("click", () => {
      const index = sources.findIndex((item) => item.id === source.id);
      if (index < 0) return;
      sources.splice(index, 1);
      if (note.activeSourceId === source.id) note.activeSourceId = sources[index]?.id || sources[index - 1]?.id || null;
      touchNotebookNote(note);
      renderNotebook();
    });

    item.append(select, remove);
    sourceList.append(item);
  });
};

const renderNotebookChat = (animateSession = false) => {
  const note = getActiveNotebookNote();
  const session = getActiveNotebookSession();
  notebookChatList.replaceChildren();
  notebookConversationTitle.replaceChildren();

  if (session) {
    notebookConversationTitle.append(makeTitleForm(session.title, "セッション名", (next) => {
      session.title = next;
      touchNotebookSession(note, session);
      renderNotebook(true);
    }));
  } else if (note) {
    notebookConversationTitle.append(makeTitleForm(note.title, "ノート名", (next) => {
      note.title = next;
      touchNotebookNote(note);
      renderNotebook(true);
    }));
  } else {
    notebookConversationTitle.textContent = "No note";
  }

  if (!session) {
    notebookInput.disabled = true;
    notebookSend.disabled = true;
    if (note) {
      notebookChatList.append(makeMemoForm(note, () => {
        touchNotebookNote(note);
        renderNotebook(true);
      }));
    } else {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "Notebookチャットを作成してください";
      notebookChatList.append(empty);
    }
    updateNotebookSourceMeta();
    return;
  }

  notebookInput.disabled = false;
  notebookSend.disabled = false;
  session.messages.forEach((message) => {
    notebookChatList.append(makeNotebookMessageElement(message));
  });
  if (!session.messages.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "まだメッセージはありません";
    notebookChatList.append(empty);
  }
  updateNotebookSourceMeta();

  if (animateSession) {
    notebookChatList.classList.remove("is-session-entering");
    void notebookChatList.offsetWidth;
    notebookChatList.classList.add("is-session-entering");
  }
};

const renderNotebook = (animateSession = false) => {
  renderNotebookNotes();
  renderNotebookSources();
  renderNotebookChat(animateSession);
};

const renderSkills = () => {
  const query = skillSearch.value.trim().toLowerCase();
  const matches = skills.filter((skill) => {
    const haystack = `${skill.name} ${skill.scope} ${skill.status} ${skill.path} ${skill.triggers.join(" ")} ${skill.description}`.toLowerCase();
    return haystack.includes(query);
  });

  skillList.replaceChildren();

  if (!matches.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = skills.length ? "一致するSKILLなし" : "SKILLなし";
    skillList.append(empty);
    return;
  }

  matches.forEach((skill) => {
    const card = document.createElement("article");
    card.className = "skill-card";

    const head = document.createElement("div");
    head.className = "skill-card-head";

    const icon = document.createElement("div");
    icon.className = "skill-card-icon";
    icon.textContent = skill.name.slice(0, 1).toUpperCase();

    const titleGroup = document.createElement("div");
    titleGroup.className = "skill-card-title";

    const title = document.createElement("h2");
    title.textContent = skill.name;

    const meta = document.createElement("span");
    meta.className = "skill-card-meta";
    meta.textContent = `${skill.scope} / ${skill.status}`;

    titleGroup.append(title, meta);

    const toggle = document.createElement("label");
    toggle.className = "skill-switch";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = skill.status === "Enabled";
    checkbox.setAttribute("aria-label", `${skill.name}を有効化`);
    const switchTrack = document.createElement("span");
    toggle.append(checkbox, switchTrack);
    checkbox.addEventListener("change", () => {
      skill.status = checkbox.checked ? "Enabled" : "Disabled";
      renderSkills();
    });

    head.append(icon, titleGroup, toggle);

    const description = document.createElement("p");
    description.className = "skill-card-description";
    description.textContent = skill.description;

    const triggers = document.createElement("div");
    triggers.className = "skill-chip-list";
    skill.triggers.forEach((trigger) => {
      const chip = document.createElement("span");
      chip.className = "skill-chip";
      chip.textContent = trigger;
      triggers.append(chip);
    });

    const path = document.createElement("p");
    path.className = "skill-card-path";
    path.textContent = skill.path;

    const foot = document.createElement("div");
    foot.className = "skill-card-foot";
    const updated = document.createElement("span");
    updated.textContent = skill.updated;
    const remove = makeIconButton("session-delete", `${skill.name}を削除`, "trash");
    remove.addEventListener("click", () => {
      const index = skills.findIndex((item) => item.id === skill.id);
      if (index < 0) return;
      skills.splice(index, 1);
      if (activeSkillId === skill.id) activeSkillId = skills[index]?.id || skills[index - 1]?.id || null;
      renderSkills();
    });
    foot.append(updated, remove);

    card.append(head, description, triggers, path, foot);
    skillList.append(card);
  });
};

const renderTools = () => {
  const query = toolSearch.value.trim().toLowerCase();
  const matches = tools.filter((tool) => {
    const haystack = `${tool.name} ${tool.scope} ${tool.status} ${tool.path} ${tool.triggers.join(" ")} ${tool.description}`.toLowerCase();
    return haystack.includes(query);
  });

  toolList.replaceChildren();

  if (!matches.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = tools.length ? "一致するツールなし" : "ツールなし";
    toolList.append(empty);
    return;
  }

  matches.forEach((tool) => {
    const card = document.createElement("article");
    card.className = "skill-card";

    const head = document.createElement("div");
    head.className = "skill-card-head";

    const icon = document.createElement("div");
    icon.className = "skill-card-icon";
    icon.textContent = tool.name.slice(0, 1).toUpperCase();

    const titleGroup = document.createElement("div");
    titleGroup.className = "skill-card-title";

    const title = document.createElement("h2");
    title.textContent = tool.name;

    const meta = document.createElement("span");
    meta.className = "skill-card-meta";
    meta.textContent = `${tool.scope} / ${tool.status}`;

    titleGroup.append(title, meta);

    const toggle = document.createElement("label");
    toggle.className = "skill-switch";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = tool.status === "Enabled";
    checkbox.setAttribute("aria-label", `${tool.name}を有効化`);
    const switchTrack = document.createElement("span");
    toggle.append(checkbox, switchTrack);
    checkbox.addEventListener("change", () => {
      tool.status = checkbox.checked ? "Enabled" : "Disabled";
      renderTools();
    });

    head.append(icon, titleGroup, toggle);

    const description = document.createElement("p");
    description.className = "skill-card-description";
    description.textContent = tool.description;

    const triggers = document.createElement("div");
    triggers.className = "skill-chip-list";
    tool.triggers.forEach((trigger) => {
      const chip = document.createElement("span");
      chip.className = "skill-chip";
      chip.textContent = trigger;
      triggers.append(chip);
    });

    const path = document.createElement("p");
    path.className = "skill-card-path";
    path.textContent = tool.path;

    const foot = document.createElement("div");
    foot.className = "skill-card-foot";
    const updated = document.createElement("span");
    updated.textContent = tool.updated;
    const remove = makeIconButton("session-delete", `${tool.name}を削除`, "trash");
    remove.addEventListener("click", () => {
      const index = tools.findIndex((item) => item.id === tool.id);
      if (index < 0) return;
      tools.splice(index, 1);
      renderTools();
    });
    foot.append(updated, remove);

    card.append(head, description, triggers, path, foot);
    toolList.append(card);
  });
};

const startNotebookAssistantReply = (session, text) => {
  const message = {
    role: "assistant",
    text: "",
    sentAt: formatMessageTime(),
    metrics: { durationMs: 0, tokens: estimateTokens(text), tokensPerSecond: 0, isRunning: true },
  };
  const startedAt = performance.now();
  session.messages.push(message);

  const finish = () => {
    const durationMs = performance.now() - startedAt;
    Object.assign(message, {
      text,
      metrics: { ...makeAssistantMetrics(text, durationMs), isRunning: false },
    });
    renderNotebook();
    notebookChatList.scrollTop = notebookChatList.scrollHeight;
  };

  const tick = setInterval(() => {
    if (!getNotebookSessions().includes(session)) {
      clearInterval(tick);
      return;
    }
    const durationMs = performance.now() - startedAt;
    message.metrics = { ...makeAssistantMetrics(text, durationMs), isRunning: true };
    renderNotebook();
    notebookChatList.scrollTop = notebookChatList.scrollHeight;
  }, 120);

  setTimeout(() => {
    clearInterval(tick);
    if (getNotebookSessions().includes(session)) finish();
  }, 900);
};

const ensureVersionedMessages = (session) => {
  session.messages = (session.messages || []).map((message) => {
    if (message.versions) return message;
    return {
      id: message.id || `m${nextMessageId++}`,
      role: message.role,
      parent: message.parent,
      versionIndex: 0,
      versions: [message.text || ""],
      versionTimes: [message.sentAt || formatMessageTime()],
    };
  });
  return session.messages;
};

const getVisibleMessages = (session) => {
  ensureVersionedMessages(session);
  const byId = new Map(session.messages.map((message) => [message.id, message]));
  const visibleIds = new Set();

  return session.messages.filter((message) => {
    if (message.parent) {
      const parent = byId.get(message.parent.messageId);
      if (!parent || !visibleIds.has(parent.id) || parent.versionIndex !== message.parent.versionIndex) return false;
    }
    visibleIds.add(message.id);
    return true;
  });
};

const getProjectSessionItems = (project) => {
  const linkedIds = new Set(project.linkedChatSessionIds);
  const linked = chatSessions
    .filter((session) => linkedIds.has(session.id))
    .map((session) => ({
      type: "chat",
      id: session.id,
      title: session.title,
      meta: `${project.name} / ${session.model} / ${getVisibleMessages(session).length} messages`,
      source: session,
    }));

  const coding = project.codingSessions.map((session) => ({
    type: "coding",
    id: session.id,
    title: session.title,
    meta: `${project.name} / ${session.status} / ${session.updated}`,
    source: session,
  }));

  return { linked, coding, all: [...coding, ...linked] };
};

const getActiveProjectSession = (project) => {
  const sessions = getProjectSessionItems(project);
  const active = sessions.all.find((session) => session.type === activeCodingSessionType && session.id === activeCodingSessionId);
  const fallback = sessions.coding[0] || sessions.linked[0] || null;
  if (!active && fallback) {
    activeCodingSessionType = fallback.type;
    activeCodingSessionId = fallback.id;
  }
  return active || fallback;
};

const makeMessage = (text, parent) => ({
  id: `m${nextMessageId++}`,
  role: "user",
  parent,
  versionIndex: 0,
  versions: [text],
  versionTimes: [formatMessageTime()],
});

const makeAssistantMessage = (parent, metadata) => ({
  id: `m${nextMessageId++}`,
  role: "assistant",
  parent,
  versionIndex: 0,
  versions: [""],
  versionTimes: [formatMessageTime()],
  metadata,
  metrics: {
    durationMs: 0,
    tokens: 0,
    tokensPerSecond: 0,
    isRunning: true,
  },
});

const getMessageText = (message) => {
  if (message.versions) return message.versions[message.versionIndex || 0] || "";
  return message.text || "";
};

const getApiMessages = (session, assistantId) => getVisibleMessages(session)
  .filter((message) => message.id !== assistantId)
  .map((message) => ({
    role: message.role === "assistant" ? "assistant" : "user",
    content: getMessageText(message),
  }))
  .filter((message) => message.content.trim());

const rerenderConversationSurface = (surface) => {
  if (surface === "coding") {
    renderCoding();
    renderChat();
    return;
  }
  renderChat();
  renderCoding();
};

const updateStreamingMetrics = (message, startedAt) => {
  const text = getMessageText(message);
  const durationMs = performance.now() - startedAt;
  const server = message.metrics?.server;
  message.metrics = {
    ...makeAssistantMetrics(text || " ", durationMs),
    server,
    isRunning: true,
  };
};

const finishStreamingMessage = (message, startedAt, isRunning = false) => {
  const text = getMessageText(message);
  const durationMs = performance.now() - startedAt;
  const server = message.metrics?.server;
  const base = makeAssistantMetrics(text || " ", durationMs);
  message.metrics = {
    ...base,
    durationMs: server?.durationMs || base.durationMs,
    tokens: server?.tokens || base.tokens,
    tokensPerSecond: server?.tokensPerSecond || base.tokensPerSecond,
    server,
    isRunning,
  };
};

const appendAssistantToken = (message, token) => {
  const index = message.versionIndex || 0;
  message.versions[index] = `${message.versions[index] || ""}${token}`;
};

const appendAssistantProgress = (message, text) => {
  const chunk = String(text || "");
  const current = message.metadata?.progress || "";
  message.metadata = {
    ...message.metadata,
    progress: chunk.startsWith(current) ? chunk : `${current}${chunk}`,
  };
};

const handleStreamEvent = (eventName, data, message) => {
  if (eventName === "start") {
    message.metadata = {
      ...message.metadata,
      selectedModel: data.model_id || message.metadata?.selectedModel,
      selectedModelLabel: data.model_label || message.metadata?.selectedModelLabel,
      taskKind: data.task_kind || message.metadata?.taskKind,
      routeReason: data.route_reason || message.metadata?.routeReason,
      provider: data.provider || message.metadata?.provider,
      mock: Boolean(data.mock),
    };
  }
  if (eventName === "token") appendAssistantToken(message, data.text || "");
  if (eventName === "progress") appendAssistantProgress(message, data.text || "");
  if (eventName === "done" && data.metrics) {
    if (data.metrics.doneReason === "length") {
      appendAssistantToken(message, "\n\n[出力上限に到達したため停止しました。必要なら「続けて」と送ってください。]");
    }
    message.metadata = {
      ...message.metadata,
      provider: data.provider || message.metadata?.provider,
    };
    message.metrics = {
      ...message.metrics,
      server: data.metrics,
    };
  }
  if (eventName === "error") {
    appendAssistantToken(message, `\n\nRuntime error: ${data.message || "unknown error"}`);
    message.metadata = {
      ...message.metadata,
      routeReason: "runtime error",
    };
  }
};

const readSseStream = async (response, onEvent) => {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() || "";
    for (const part of parts) {
      const lines = part.split("\n");
      const eventLine = lines.find((line) => line.startsWith("event:"));
      const dataLine = lines.find((line) => line.startsWith("data:"));
      if (!dataLine) continue;
      const eventName = eventLine ? eventLine.slice(6).trim() : "message";
      const data = JSON.parse(dataLine.slice(5).trim() || "{}");
      onEvent(eventName, data);
    }
  }
};

const streamAssistantReply = async (session, assistantMessage, surface, route) => {
  const abortController = new AbortController();
  const startedAt = performance.now();
  const modelMode = getSessionModelMode(session);
  const sessionReasoning = getSessionReasoningEnabled(session);
  activeChatStream = { abortController, sessionId: session.id, messageId: assistantMessage.id, route, reasoningEnabled: sessionReasoning };
  updateRuntimeUi();
  renderDashboardQueue();

  const tick = setInterval(() => {
    updateStreamingMetrics(assistantMessage, startedAt);
    rerenderConversationSurface(surface);
    updateRuntimeUi();
  }, 220);

  try {
    const response = await fetch("/api/chat/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: getApiMessages(session, assistantMessage.id),
        selection: modelMode,
        surface,
        session_id: session.id,
        max_tokens: 4096,
        reasoning_enabled: sessionReasoning,
      }),
      signal: abortController.signal,
    });
    if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`);
    await readSseStream(response, (eventName, data) => {
      handleStreamEvent(eventName, data, assistantMessage);
      updateStreamingMetrics(assistantMessage, startedAt);
      rerenderConversationSurface(surface);
    });
    finishStreamingMessage(assistantMessage, startedAt, false);
  } catch (error) {
    const aborted = error.name === "AbortError";
    appendAssistantToken(assistantMessage, aborted ? "\n\nStopped." : `\n\nRuntime error: ${error.message || error}`);
    assistantMessage.metadata = {
      ...assistantMessage.metadata,
      routeReason: aborted ? "cancelled" : "runtime error",
    };
    finishStreamingMessage(assistantMessage, startedAt, false);
  } finally {
    clearInterval(tick);
    activeChatStream = null;
    await fetchRuntimeStatus();
    persistChatState();
    rerenderConversationSurface(surface);
    updateRuntimeUi();
    renderDashboardQueue();
  }
};

const submitModelMessage = (session, text, surface, onTouch) => {
  const visibleMessages = getVisibleMessages(session);
  const last = visibleMessages.at(-1);
  const userParent = last ? { messageId: last.id, versionIndex: last.versionIndex } : undefined;
  const userMessage = makeMessage(text, userParent);
  session.messages.push(userMessage);
  if (session.messages.length === 1) session.title = text.slice(0, 28);

  const route = {
    ...resolveClientRoute(text, surface, session),
    modelMode: getSessionModelMode(session),
    reasoningEnabled: getSessionReasoningEnabled(session),
  };
  const assistantParent = { messageId: userMessage.id, versionIndex: userMessage.versionIndex };
  const assistantMessage = makeAssistantMessage(assistantParent, route);
  session.messages.push(assistantMessage);

  onTouch?.();
  persistChatState();
  rerenderConversationSurface(surface);
  streamAssistantReply(session, assistantMessage, surface, route);
};

const createSession = () => {
  const session = {
    id: `session-${Date.now()}`,
    title: `New chat ${nextSessionNumber++}`,
    model: "Local model",
    modelMode: selectedModelMode,
    reasoningEnabled,
    updated: "今",
    messages: [],
  };
  chatSessions.unshift(session);
  activeSessionId = session.id;
  persistChatState();
  showView("chat");
  renderChat(true);
  composerInput.focus();
};

const selectProjectSessionFallback = (project) => {
  const fallback = getProjectSessionItems(project).coding[0] || getProjectSessionItems(project).linked[0];
  activeCodingMode = fallback ? "session" : "workspace";
  activeCodingSessionType = fallback?.type || "coding";
  activeCodingSessionId = fallback?.id || null;
};

const createCodingSession = (project) => {
  const session = {
    id: `coding-${Date.now()}`,
    title: `New coding ${nextCodingSessionNumber++}`,
    status: "Active",
    updated: "今",
    summary: "",
    steps: [],
    messages: [
      {
        id: `m${nextMessageId++}`,
        role: "assistant",
        versionIndex: 0,
        versions: [`${project.name} ready. Send a coding instruction for this workspace.`],
        versionTimes: [formatMessageTime()],
      },
    ],
  };
  project.codingSessions.unshift(session);
  touchCodingSession(project, session);
  activeProjectId = project.id;
  expandedProjectId = project.id;
  activeCodingMode = "session";
  activeCodingSessionType = "coding";
  activeCodingSessionId = session.id;
  openLinkProjectId = null;
  renderCoding(true);
};

const createProject = () => {
  const project = {
    id: `project-${Date.now()}`,
    name: `New project ${nextProjectNumber++}`,
    path: "未設定",
    updated: "今",
    linkedChatSessionIds: [],
    workspace: [],
    codingSessions: [],
  };
  codingProjects.unshift(project);
  activeProjectId = project.id;
  expandedProjectId = project.id;
  activeCodingMode = "workspace";
  activeCodingSessionType = "coding";
  activeCodingSessionId = null;
  openLinkProjectId = null;
  renderCoding();
};

const deleteProject = (project) => {
  const index = codingProjects.findIndex((item) => item.id === project.id);
  if (index < 0) return;
  const wasActive = activeProjectId === project.id;
  codingProjects.splice(index, 1);
  if (wasActive) {
    const fallback = codingProjects[index] || codingProjects[index - 1] || null;
    activeProjectId = fallback?.id || null;
    expandedProjectId = fallback?.id || null;
    activeCodingMode = "workspace";
    activeCodingSessionType = "coding";
    activeCodingSessionId = null;
  } else if (expandedProjectId === project.id) {
    expandedProjectId = null;
  }
  if (openLinkProjectId === project.id) openLinkProjectId = null;
  renderCoding();
};

const deleteProjectSession = (session, project) => {
  if (session.type === "chat") {
    deleteChatSession(session);
    renderChat();
  } else {
    const index = project.codingSessions.findIndex((item) => item.id === session.id);
    if (index < 0) return;
    project.codingSessions.splice(index, 1);
  }

  touchProject(project);
  if (activeCodingSessionType === session.type && activeCodingSessionId === session.id) selectProjectSessionFallback(project);
  renderCoding(true);
};

const renderChatSessionItem = (session) => {
  const item = document.createElement("div");
  item.className = "session-item";
  item.draggable = true;
  item.classList.toggle("is-active", session.id === activeSessionId);
  item.classList.toggle("is-dragging", session.id === draggedChatSessionId);

  item.addEventListener("dragstart", (event) => {
    draggedChatSessionId = session.id;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", session.id);
    item.classList.add("is-dragging");
  });
  item.addEventListener("dragend", () => {
    draggedChatSessionId = null;
    item.classList.remove("is-dragging");
  });

  const select = document.createElement("button");
  select.className = "session-select";
  select.type = "button";
  select.setAttribute("aria-pressed", String(session.id === activeSessionId));

  const title = document.createElement("span");
  title.className = "session-title";
  title.textContent = session.title;

  select.append(title);
  select.addEventListener("click", () => {
    if (activeSessionId === session.id) return;
    activeSessionId = session.id;
    if (session.folderId) expandedChatFolderId = session.folderId;
    persistChatState();
    renderChat(true, true);
  });

  const remove = makeIconButton("session-delete", `${session.title}を削除`, "trash");
  remove.addEventListener("click", () => {
    deleteChatSession(session);
    renderChat(true);
  });

  item.append(select, remove);
  return item;
};

const renderChatFolder = (folder) => {
  const sessions = chatSessions.filter((session) => session.folderId === folder.id);
  const item = document.createElement("div");
  item.className = "project-item chat-folder";
  item.classList.toggle("is-expanded", folder.id === expandedChatFolderId);
  item.classList.toggle("is-drop-target", draggedChatSessionId && draggedChatSessionId !== folder.id);

  const row = document.createElement("div");
  row.className = "project-row session-item";
  row.addEventListener("dragover", (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    item.classList.add("is-drop-target");
  });
  row.addEventListener("dragleave", () => item.classList.remove("is-drop-target"));
  row.addEventListener("drop", (event) => {
    event.preventDefault();
    item.classList.remove("is-drop-target");
    assignChatSessionToFolder(event.dataTransfer.getData("text/plain") || draggedChatSessionId, folder);
  });

  const select = document.createElement("button");
  select.className = "project-select session-select";
  select.type = "button";
  select.setAttribute("aria-expanded", String(folder.id === expandedChatFolderId));

  const title = document.createElement("span");
  title.className = "project-title session-title";
  title.textContent = folder.title;

  const icon = document.createElement("span");
  icon.className = "chat-folder-icon";
  icon.innerHTML = icons.folder;

  select.append(icon, title);
  select.addEventListener("click", () => {
    expandedChatFolderId = expandedChatFolderId === folder.id ? null : folder.id;
    persistChatState();
    renderChat(true);
  });

  const remove = makeIconButton("session-delete", `${folder.title}を削除`, "trash");
  remove.addEventListener("click", () => deleteChatFolder(folder));

  const accordion = document.createElement("div");
  accordion.className = "project-accordion";
  const content = document.createElement("div");
  content.className = "project-accordion-inner";
  sessions.forEach((session) => content.append(renderChatSessionItem(session)));
  if (!sessions.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "セッションなし";
    content.append(empty);
  }
  accordion.append(content);

  row.append(select, remove);
  item.append(row, accordion);
  return item;
};

const renderSessions = () => {
  sessionList.replaceChildren();

  if (!chatSessions.length && !chatFolders.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "セッションなし";
    sessionList.append(empty);
    return;
  }

  chatFolders.forEach((folder) => sessionList.append(renderChatFolder(folder)));
  chatSessions
    .filter((session) => !chatFolders.some((folder) => folder.id === session.folderId))
    .forEach((session) => sessionList.append(renderChatSessionItem(session)));
};

decorateComposer(composer);
decorateComposer(notebookComposer);
document.addEventListener("click", closeComposerTools);

newSessionButton.addEventListener("click", createSession);
newChatFolderButton.addEventListener("click", createChatFolder);
newProjectButton.addEventListener("click", createProject);
newSkillButton.addEventListener("click", () => {
  const skill = {
    id: `skill-${Date.now()}`,
    name: `new-skill-${nextSkillNumber++}`,
    scope: "local",
    status: "Enabled",
    updated: "Draft",
    path: "未設定",
    triggers: ["manual"],
    description: "新規SKILLのプレースホルダーです。",
  };
  skills.unshift(skill);
  activeSkillId = skill.id;
  skillSearch.value = "";
  renderSkills();
});

skillSearch.addEventListener("input", renderSkills);

newToolButton.addEventListener("click", () => {
  const tool = {
    id: `tool-${Date.now()}`,
    name: `new-tool-${nextToolNumber++}`,
    scope: "local",
    status: "Enabled",
    updated: "Draft",
    path: "未設定",
    triggers: ["manual"],
    description: "新規ツールのプレースホルダーです。",
  };
  tools.unshift(tool);
  toolSearch.value = "";
  renderTools();
});

toolSearch.addEventListener("input", renderTools);

modelRouteSelector?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-model]");
  if (!button || activeChatStream) return;
  setSessionModelMode(button.dataset.model);
  persistChatState();
  updateRuntimeUi();
  renderMessages();
});

runtimeStop?.addEventListener("click", stopRuntime);
runtimeResume?.addEventListener("click", resumeRuntime);
reasoningToggle?.addEventListener("click", () => {
  setSessionReasoningEnabled(!getSessionReasoningEnabled());
  persistChatState();
  updateRuntimeUi();
});

defaultModelSelect?.addEventListener("change", () => {
  if (MODEL_LABELS[defaultModelSelect.value]) selectedModelMode = defaultModelSelect.value;
  persistChatState();
  updateRuntimeUi();
});

defaultReasoningToggle?.addEventListener("change", () => {
  reasoningEnabled = defaultReasoningToggle.checked;
  persistChatState();
  updateRuntimeUi();
});

newNotebookNoteButton.addEventListener("click", () => {
  const note = {
    id: `note-${Date.now()}`,
    title: `New note ${nextNotebookNoteNumber++}`,
    updated: "今",
    activeSourceId: null,
    sources: [],
    sessions: [],
  };
  notebookNotes.unshift(note);
  activeNotebookNoteId = note.id;
  expandedNotebookNoteId = note.id;
  activeNotebookSessionId = null;
  activeNotebookMode = "note";
  renderNotebook();
});

newSourceButton.addEventListener("click", () => {
  const note = getActiveNotebookNote();
  if (!note) return;
  const source = {
    id: `source-${Date.now()}`,
    title: `New source ${nextSourceNumber++}`,
    meta: "Draft / Local",
  };
  note.sources.unshift(source);
  note.activeSourceId = source.id;
  touchNotebookNote(note);
  renderNotebook();
});

notebookComposer.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = notebookInput.value.trim();
  if (!text) return;
  const session = getActiveNotebookSession();
  if (!session) return;
  const source = getActiveNotebookSource();

  session.messages.push({ role: "user", text, sentAt: formatMessageTime() });
  if (session.messages.length <= 2) session.title = text.slice(0, 28);
  const note = getNotebookNoteForSession(session.id);
  touchNotebookSession(note, session);
  notebookInput.value = "";
  renderNotebook();
  startNotebookAssistantReply(session, `${source?.title || "Source"} を参照して回答する想定のプレースホルダーです。生成処理は後で接続します。`);
  notebookChatList.scrollTop = notebookChatList.scrollHeight;
});

notebookInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && event.ctrlKey) {
    event.preventDefault();
    notebookComposer.requestSubmit();
  }
});

notebookChatList.addEventListener("animationend", () => {
  notebookChatList.classList.remove("is-session-entering");
});

uiSizeRange?.addEventListener("input", () => {
  applyUiScale(uiSizeRange.value);
});
uiSizeRange?.addEventListener("change", () => applyUiScale(uiSizeRange.value));
window.addEventListener("resize", () => applyUiScale(uiSizeRange?.value || 100));
authForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const token = authTokenInput?.value.trim() || "";
  if (!token) return;
  if (authSubmit) authSubmit.disabled = true;
  try {
    await loginWithToken(token);
    if (authTokenInput) authTokenInput.value = "";
  } catch {
    showAuthOverlay("Token rejected");
  } finally {
    if (authSubmit) authSubmit.disabled = false;
  }
});
regenerateTokenButton?.addEventListener("click", async () => {
  try {
    await regenerateExternalToken();
  } catch {
    if (externalTokenInput) externalTokenInput.value = "regenerate failed";
  }
});
copyTokenButton?.addEventListener("click", async () => {
  const token = externalTokenInput.value;
  try {
    await navigator.clipboard.writeText(token);
  } catch {
    externalTokenInput.select();
    document.execCommand("copy");
  }
});
const savedUiScale = localStorage.getItem(UI_SCALE_KEY);
if (uiSizeRange && savedUiScale) uiSizeRange.value = savedUiScale;
applyUiScale(uiSizeRange?.value || 100);

renderDashboardQueue();
renderNotebook();
renderSkills();
renderTools();

const renderCodingProjects = () => {
  document.querySelectorAll(".link-flow-backdrop").forEach((item) => item.remove());
  codingProjectList.replaceChildren();

  if (!codingProjects.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "プロジェクトなし";
    codingProjectList.append(empty);
    return;
  }

  codingProjects.forEach((project) => {
    const item = document.createElement("div");
    item.className = "project-item";
    item.dataset.projectId = project.id;
    item.classList.toggle("is-active", project.id === activeProjectId);
    item.classList.toggle("is-expanded", project.id === expandedProjectId);

    const row = document.createElement("div");
    row.className = "project-row session-item";

    const select = document.createElement("button");
    select.className = "project-select session-select";
    select.type = "button";
    select.setAttribute("aria-pressed", String(project.id === activeProjectId));
    select.setAttribute("aria-expanded", String(project.id === expandedProjectId));

    const title = document.createElement("span");
    title.className = "project-title";
    title.textContent = project.name;

    select.append(title);
    select.addEventListener("click", () => {
      const wasSessionFocus = activeCodingMode === "session";
      const wasSameProject = activeProjectId === project.id;
      activeProjectId = project.id;
      expandedProjectId = wasSameProject && !wasSessionFocus && expandedProjectId === project.id ? null : project.id;
      activeCodingMode = "workspace";
      openLinkProjectId = null;
      syncProjectListState();
      renderCodingWorkbench();
    });

    const remove = makeIconButton("session-delete", `${project.name}を削除`, "trash");
    remove.addEventListener("click", () => deleteProject(project));

    row.append(select, remove);
    item.append(row, renderProjectAccordion(project));
    codingProjectList.append(item);
  });
};

const syncProjectListState = () => {
  codingProjectList.querySelectorAll(".project-item").forEach((item) => {
    const projectId = item.dataset.projectId;
    const active = projectId === activeProjectId;
    const expanded = projectId === expandedProjectId;
    item.classList.toggle("is-active", active);
    item.classList.toggle("is-expanded", expanded);
    const select = item.querySelector(":scope > .project-row > .project-select");
    select?.setAttribute("aria-pressed", String(active));
    select?.setAttribute("aria-expanded", String(expanded));
  });

  if (!openLinkProjectId) {
    document.querySelectorAll(".link-flow-backdrop").forEach((item) => item.remove());
  }
};

const renderWorkspace = (project) => {
  codingProjectTitle.replaceChildren();
  codingProjectTitle.append(makeTitleForm(project.name, "プロジェクト名", (next) => {
    project.name = next;
    touchProject(project);
    renderCoding();
  }));
  if (codingProjectPath) codingProjectPath.textContent = "";
  codingProjectMeta.textContent = "";
  codingProjectMeta.hidden = true;
  codingWorkspaceTree.replaceChildren();

  project.workspace.forEach((entry) => {
    const row = document.createElement("div");
    row.className = "tree-row";

    const kind = document.createElement("span");
    kind.className = "tree-kind";
    kind.textContent = entry.kind === "dir" ? "dir" : "file";

    const body = document.createElement("div");
    const name = document.createElement("div");
    name.className = "tree-name";
    name.textContent = entry.name;

    const meta = document.createElement("div");
    meta.className = "tree-meta";
    meta.textContent = entry.meta;

    body.append(name, meta);
    row.append(kind, body);
    codingWorkspaceTree.append(row);
  });
};

const renderCodingSessionButton = (session, project) => {
  const item = document.createElement("div");
  item.className = "accordion-session coding-session-item session-item";
  item.classList.toggle("is-active", activeCodingMode === "session" && session.type === activeCodingSessionType && session.id === activeCodingSessionId);

  const select = document.createElement("button");
  select.className = "coding-session-select session-select";
  select.type = "button";
  select.setAttribute("aria-pressed", String(activeCodingMode === "session" && session.type === activeCodingSessionType && session.id === activeCodingSessionId));

  const title = document.createElement("span");
  title.className = "coding-session-title session-title";
  title.textContent = session.title;

  select.append(title);
  select.addEventListener("click", () => {
    if (activeCodingMode === "session" && session.type === activeCodingSessionType && session.id === activeCodingSessionId) return;
    activeCodingMode = "session";
    activeCodingSessionType = session.type;
    activeCodingSessionId = session.id;
    openLinkProjectId = null;
    renderCoding(true);
  });

  item.append(select);

  if (session.type === "chat") {
    const unlink = makeIconButton("session-delete", `${session.title}のリンクを解除`, "unlink");
    unlink.addEventListener("click", () => {
      project.linkedChatSessionIds = project.linkedChatSessionIds.filter((id) => id !== session.id);
      touchProject(project);
      if (activeCodingSessionType === "chat" && activeCodingSessionId === session.id) {
        selectProjectSessionFallback(project);
      }
      renderCoding(true);
    });
    item.append(unlink);
    return item;
  }

  const remove = makeIconButton("session-delete", `${session.title}を削除`, "trash");
  remove.addEventListener("click", () => deleteProjectSession(session, project));
  item.append(remove);

  return item;
};

const renderProjectAccordion = (project) => {
  const sessions = getProjectSessionItems(project);
  const accordion = document.createElement("div");
  accordion.className = "project-accordion";

  const content = document.createElement("div");
  content.className = "project-accordion-inner";

  const codingHeader = document.createElement("div");
  codingHeader.className = "session-group-row";

  const codingLabel = document.createElement("p");
  codingLabel.className = "session-group-title";
  codingLabel.textContent = "Coding";

  const addCoding = makeIconButton("new-session coding-session-create", `${project.name}にCodingセッションを追加`, "plus");
  addCoding.addEventListener("click", () => createCodingSession(project));

  codingHeader.append(codingLabel, addCoding);
  content.append(codingHeader);
  sessions.coding.forEach((session) => content.append(renderCodingSessionButton(session, project)));

  const chatHeader = document.createElement("div");
  chatHeader.className = "session-group-row";

  const chatLabel = document.createElement("p");
  chatLabel.className = "session-group-title";
  chatLabel.textContent = "Linked Chat";

  const linkToggle = makeIconButton("new-session link-flow-toggle", `${project.name}にChatをリンク`, "plus");
  linkToggle.setAttribute("aria-expanded", String(openLinkProjectId === project.id));
  linkToggle.addEventListener("click", () => {
    linkSearchQuery = "";
    openLinkProjectId = openLinkProjectId === project.id ? null : project.id;
    renderCoding();
  });

  chatHeader.append(chatLabel, linkToggle);
  content.append(chatHeader);
  sessions.linked.forEach((session) => content.append(renderCodingSessionButton(session, project)));

  const linkedIds = new Set(project.linkedChatSessionIds);
  const unlinked = chatSessions.filter((session) => !linkedIds.has(session.id));

  if (openLinkProjectId === project.id) {
    const query = linkSearchQuery.trim().toLowerCase();
    const matches = unlinked.filter((session) => {
      const messages = getVisibleMessages(session).map((message) => message.versions[message.versionIndex] || "").join(" ");
      return `${session.title} ${session.model} ${messages}`.toLowerCase().includes(query);
    });

    const backdrop = document.createElement("div");
    backdrop.className = "link-flow-backdrop";
    backdrop.addEventListener("click", (event) => {
      if (event.target !== backdrop) return;
      openLinkProjectId = null;
      renderCoding();
    });

    const flow = document.createElement("section");
    flow.className = "link-flow";
    flow.setAttribute("aria-label", `${project.name}にリンクするChatを選択`);

    const flowHeader = document.createElement("header");
    flowHeader.className = "link-flow-header";

    const flowTitle = document.createElement("div");
    const kicker = document.createElement("p");
    kicker.className = "section-kicker";
    kicker.textContent = "Linked Chat";

    const heading = document.createElement("h3");
    heading.textContent = project.name;

    const count = document.createElement("p");
    count.className = "link-flow-count";
    count.textContent = `${matches.length} / ${unlinked.length} linkable`;

    flowTitle.append(kicker, heading);
    flowHeader.append(flowTitle, count);

    const search = document.createElement("input");
    search.className = "link-flow-search";
    search.type = "search";
    search.setAttribute("aria-label", "リンク可能なChatを検索");
    search.autocomplete = "off";
    search.placeholder = "タイトル・内容を検索";
    search.value = linkSearchQuery;
    search.addEventListener("input", () => {
      linkSearchQuery = search.value;
      renderCoding();
    });

    const list = document.createElement("div");
    list.className = "link-flow-list";

    matches.forEach((session) => {
      const item = document.createElement("div");
      item.className = "link-candidate session-item";
    const linkChat = () => {
      project.linkedChatSessionIds.push(session.id);
      touchProject(project);
      activeCodingMode = "session";
      activeCodingSessionType = "chat";
      activeCodingSessionId = session.id;
      openLinkProjectId = null;
      linkSearchQuery = "";
      renderCoding(true);
    };

      const summary = document.createElement("button");
      summary.className = "coding-session-select session-select";
      summary.type = "button";
      summary.setAttribute("aria-label", `${session.title}をリンク`);

      const title = document.createElement("span");
      title.className = "coding-session-title session-title";
      title.textContent = session.title;

      summary.append(title);
      summary.addEventListener("click", linkChat);

      const link = makeIconButton("link-action", `${session.title}をリンク`, "link");
      link.addEventListener("click", linkChat);

      item.append(summary, link);
      list.append(item);
    });

    if (!matches.length) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = unlinked.length ? "一致するChatなし" : "リンク可能なChatなし";
      list.append(empty);
    }

    flow.append(flowHeader, search, list);
    backdrop.append(flow);
    document.body.append(backdrop);
    requestAnimationFrame(() => search.focus());
  }

  accordion.prepend(content);
  return accordion;
};

const addDetailBlock = (label, value) => {
  const block = document.createElement("div");
  block.className = "detail-block";

  const heading = document.createElement("span");
  heading.className = "detail-label";
  heading.textContent = label;

  const text = document.createElement("p");
  text.className = "detail-value";
  text.textContent = value;

  block.append(heading, text);
  codingSessionBody.append(block);
};

const renderWorkspaceSettings = (project) => {
  if (codingSessionType) codingSessionType.textContent = "Workspace";
  codingSessionTitle.textContent = "Project notes";
  codingSessionMeta.textContent = "";
  codingSessionMeta.hidden = true;
  codingSessionBody.replaceChildren();

  const form = document.createElement("form");
  form.className = "workspace-settings";

  const pathRow = document.createElement("label");
  pathRow.className = "setting-row";

  const pathLabel = document.createElement("span");
  pathLabel.className = "detail-label";
  pathLabel.textContent = "Directory";

  const pathInput = document.createElement("input");
  pathInput.className = "setting-input";
  pathInput.value = project.path;

  const save = document.createElement("button");
  save.className = "setting-submit";
  save.type = "submit";
  save.textContent = "Apply";

  pathRow.append(pathLabel, pathInput);
  form.append(pathRow, save);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    project.path = pathInput.value.trim() || project.path;
    touchProject(project);
    renderCoding(true);
  });

  const memo = makeMemoForm(project, () => {
    touchProject(project);
    renderCoding(true);
  });

  codingSessionBody.append(form, memo);
};

const renderMessage = (message, rerender, onEdit) => {
  const refresh = rerender || renderChat;
  const article = document.createElement("article");
  article.className = `message from-${message.role}`;

  const currentText = message.versions[message.versionIndex] || (message.metrics?.isRunning ? "生成中..." : "");
  const header = document.createElement("div");
  header.className = "message-header";

  const role = document.createElement("span");
  role.className = "message-role";
  role.textContent = message.role === "user" ? "User" : "Assistant";

  const time = document.createElement("span");
  time.className = "message-time";
  time.textContent = getMessageTime(message);

  const roleGroup = document.createElement("div");
  roleGroup.className = "message-role-group";
  roleGroup.append(role, time);

  const metrics = getAssistantMetrics(message, currentText);
  if (metrics) {
    const meta = document.createElement("span");
    meta.className = "message-metrics";
    meta.textContent = metrics;
    roleGroup.append(meta);
  }

  const actions = document.createElement("div");
  actions.className = "message-actions";

  if (message.versions.length > 1) {
    const versionControls = document.createElement("div");
    versionControls.className = "version-controls";

    const prev = makeIconButton("message-action", "前の版", "prev");
    prev.disabled = message.versionIndex === 0;
    prev.addEventListener("click", () => {
      message.versionIndex = Math.max(0, message.versionIndex - 1);
      refresh();
    });

    const count = document.createElement("span");
    count.className = "message-version";
    count.textContent = `${message.versionIndex + 1} / ${message.versions.length}`;

    const next = makeIconButton("message-action", "次の版", "next");
    next.disabled = message.versionIndex === message.versions.length - 1;
    next.addEventListener("click", () => {
      message.versionIndex = Math.min(message.versions.length - 1, message.versionIndex + 1);
      refresh();
    });

    versionControls.append(prev, count, next);
    actions.append(versionControls);
  }

  const canEdit = message.role === "user";
  const edit = canEdit ? makeIconButton("message-action", "編集", "edit") : null;
  if (edit) actions.append(edit);
  header.append(roleGroup, actions);

  const body = document.createElement("div");
  body.className = "message-body";

  const text = document.createElement("div");
  text.className = "message-text";
  const parts = message.role === "assistant" ? splitThinking(currentText) : { thinking: "", answer: currentText };
  const isRunning = Boolean(message.metrics?.isRunning);
  const progressText = message.metadata?.progress || parts.thinking;
  const answerText = parts.answer || (isRunning && !progressText ? "生成中..." : "");
  text.innerHTML = renderMarkdown(answerText);

  if (progressText) {
    const thinking = document.createElement("details");
    thinking.className = "message-progress";
    thinking.open = isRunning;
    const summary = document.createElement("summary");
    summary.textContent = isRunning ? "進捗を表示中" : "進捗";
    const thinkingText = document.createElement("div");
    thinkingText.className = "message-text message-progress-text";
    thinkingText.innerHTML = renderMarkdown(progressText);
    thinking.append(summary, thinkingText);
    body.append(thinking);
  }
  if (answerText) body.append(text);

  if (canEdit) {
    const form = document.createElement("form");
    form.className = "edit-form";
    form.hidden = true;

    const textarea = document.createElement("textarea");
    textarea.setAttribute("aria-label", "編集メッセージ");
    textarea.value = currentText;

    const editActions = document.createElement("div");
    editActions.className = "edit-actions";

    const cancel = document.createElement("button");
    cancel.className = "edit-cancel";
    cancel.type = "button";
    cancel.textContent = "Cancel";

    const save = document.createElement("button");
    save.className = "edit-submit";
    save.type = "submit";
    save.textContent = "Save";

    editActions.append(cancel, save);
    form.append(textarea, editActions);
    body.append(form);

    edit.addEventListener("click", () => {
      text.hidden = true;
      form.hidden = false;
      textarea.focus();
    });

    cancel.addEventListener("click", () => {
      text.hidden = false;
      form.hidden = true;
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const nextText = textarea.value.trim();
      if (nextText && nextText !== currentText) {
        getMessageVersionTimes(message);
        message.versions.push(nextText);
        message.versionTimes.push(formatMessageTime());
        message.versionIndex = message.versions.length - 1;
        onEdit?.();
        persistChatState();
      }
      refresh();
    });
  }

  article.append(header, body);
  return article;
};

const renderCodingChatDetail = (active, project) => {
  const sessionKind = active.type === "chat" ? "Linked Chat" : "Coding";
    if (codingSessionType) codingSessionType.textContent = `${project.name} / ${sessionKind}`;
  codingSessionTitle.replaceChildren();
  codingSessionTitle.append(makeTitleForm(active.title, "セッション名", (next) => {
    active.source.title = next;
    if (active.type === "coding") touchCodingSession(project, active.source);
    if (active.type === "chat") touchChatSession(active.source);
    renderCoding(true);
    if (active.type === "chat") renderChat();
  }));
  codingSessionMeta.hidden = true;
  codingSessionBody.replaceChildren();

  const list = document.createElement("div");
  list.className = "message-list";

  if (active.type === "chat") {
    const messages = getVisibleMessages(active.source);
    codingSessionMeta.textContent = "";
    messages.forEach((message) => list.append(renderMessage(message, () => renderCoding(), () => {
      touchChatSession(active.source);
      touchProject(project);
    })));
  } else {
    const messages = getVisibleMessages(active.source);
    codingSessionMeta.textContent = "";
    messages.forEach((message) => list.append(renderMessage(message, () => renderCoding(), () => touchCodingSession(project, active.source))));
  }

  if (!list.childElementCount) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "まだメッセージはありません";
    list.append(empty);
  }

  const form = document.createElement("form");
  form.className = "composer coding-chat-composer";

  const box = document.createElement("div");
  box.className = "composer-box";

  const textarea = document.createElement("textarea");
  textarea.rows = 2;
  textarea.setAttribute("aria-label", "Codingセッションメッセージ");
  textarea.placeholder = "このセッションに送るメッセージ";

  const send = document.createElement("button");
  send.className = "composer-send";
  send.type = "submit";
  send.setAttribute("aria-label", "送信");
  send.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13" /><path d="M13 6l6 6-6 6" /></svg>';

  box.append(textarea, send);
  form.append(box);
  decorateComposer(form);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = textarea.value.trim();
    if (!text || activeChatStream) return;
    textarea.value = "";
    submitModelMessage(active.source, text, "coding", () => {
      if (active.type === "coding") touchCodingSession(project, active.source);
      if (active.type === "chat") touchChatSession(active.source);
    });
  });

  textarea.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.ctrlKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });

  codingSessionBody.append(list, form);
};

const renderCodingSessionDetail = (project) => {
  if (activeCodingMode === "workspace") {
    renderWorkspaceSettings(project);
    return;
  }

  const active = getActiveProjectSession(project);

  if (!active) {
    if (codingSessionType) codingSessionType.textContent = "Session";
    codingSessionTitle.textContent = "No session";
    codingSessionMeta.textContent = "";
    codingSessionMeta.hidden = true;
    addDetailBlock("State", "No project session.");
    return;
  }

  renderCodingChatDetail(active, project);
};

const renderCodingWorkbench = (animateSession = false) => {
  const project = getActiveProject();
  if (!project) {
    codingWorkbench.classList.remove("is-session-mode", "is-workspace-mode");
    codingSessionDetail.classList.remove("is-chat-mode", "is-session-entering");
    workspaceHeader.hidden = false;
    workspacePanel.hidden = false;
    codingProjectTitle.textContent = "No project";
    if (codingProjectPath) codingProjectPath.textContent = "";
    codingProjectMeta.textContent = "";
    codingWorkspaceTree.replaceChildren();
    if (codingSessionType) codingSessionType.textContent = "Project";
    codingSessionTitle.textContent = "No project";
    codingSessionMeta.textContent = "";
    codingSessionMeta.hidden = true;
    codingSessionBody.replaceChildren();
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "新規プロジェクトを作成してください";
    codingSessionBody.append(empty);
    return;
  }
  if (activeCodingMode === "session") getActiveProjectSession(project);
  const sessionMode = activeCodingMode === "session";
  codingWorkbench.classList.toggle("is-session-mode", sessionMode);
  codingWorkbench.classList.toggle("is-workspace-mode", !sessionMode);
  codingSessionDetail.classList.toggle("is-chat-mode", sessionMode);
  workspaceHeader.hidden = sessionMode;
  workspacePanel.hidden = true;
  renderWorkspace(project);
  renderCodingSessionDetail(project);

  if (animateSession) {
    codingSessionDetail.classList.remove("is-session-entering");
    void codingSessionDetail.offsetWidth;
    codingSessionDetail.classList.add("is-session-entering");
  } else {
    codingSessionDetail.classList.remove("is-session-entering");
  }
};

const renderCoding = (animateSession = false) => {
  renderCodingProjects();
  renderCodingWorkbench(animateSession);
};

codingSessionDetail.addEventListener("animationend", () => {
  codingSessionDetail.classList.remove("is-session-entering");
});

const renderMessages = () => {
  const session = getActiveSession();
  messageList.replaceChildren();

  if (!session) {
    conversationTitle.textContent = "No session";
    conversationMeta.textContent = "";
    conversationMeta.hidden = true;
    composerInput.disabled = true;
    composerSend.disabled = true;
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "表示する会話がありません";
    messageList.append(empty);
    return;
  }

  const visibleMessages = getVisibleMessages(session);
  conversationTitle.replaceChildren();
  conversationTitle.append(makeTitleForm(session.title, "セッション名", (next) => {
    session.title = next;
    touchChatSession(session);
    renderChat(true);
    renderCoding();
  }));
  conversationMeta.textContent = "";
  conversationMeta.hidden = true;
  composerInput.disabled = Boolean(activeChatStream);
  composerSend.disabled = Boolean(activeChatStream);
  visibleMessages.forEach((message) => messageList.append(renderMessage(message, undefined, () => touchChatSession(session))));
};

const renderChat = (animateSession = false, scrollBottom = false) => {
  renderSessions();
  renderMessages();
  if (scrollBottom) scrollToBottom(messageList);
  if (animateSession) {
    conversationPanel.classList.remove("is-session-entering");
    void conversationPanel.offsetWidth;
    conversationPanel.classList.add("is-session-entering");
  }
};

conversationPanel.addEventListener("animationend", () => {
  conversationPanel.classList.remove("is-session-entering");
});

renderChat(false, true);
renderCoding();
updateRuntimeUi();
refreshAuthStatus().catch(() => showAuthOverlay("Backend unavailable"));

composer.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = composerInput.value.trim();
  if (!text || activeChatStream) return;

  let session = getActiveSession();
  if (!session) {
    createSession();
    session = getActiveSession();
  }

  composerInput.value = "";
  submitModelMessage(session, text, "chat", () => touchChatSession(session));
  messageList.scrollTop = messageList.scrollHeight;
});

composerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && event.ctrlKey) {
    event.preventDefault();
    composer.requestSubmit();
  }
});
