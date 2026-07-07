import React, { useState, useEffect, useMemo, useRef } from 'react';

// --- Google Fonts Loader ---
const injectFonts = () => {
  if (document.getElementById('studio-fonts')) return;
  const link = document.createElement('link');
  link.id = 'studio-fonts';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap';
  document.head.appendChild(link);
};

// --- Custom Elegant SVGs ---
const Icons = {
  Sparkles: () => (
    <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-105" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.1" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  Database: () => (
    <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-105" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.1" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  ),
  Cpu: () => (
    <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-105" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.1" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 5h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2z" />
    </svg>
  ),
  Message: () => (
    <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-105" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  Settings: () => (
    <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-105" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.1" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.1" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Moon: () => (
    <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  ),
  Sun: () => (
    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707-.707M12 17a5 5 0 100-10 5 5 0 000 10z" />
    </svg>
  ),
  Plus: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
    </svg>
  ),
  Power: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 5.636a9 9 0 11-12.728 0m6.364-1.757v9" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  ),
  SidebarToggle: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M4 6h16M4 12h10M4 18h16" />
    </svg>
  ),
};

export default function App() {
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'models' | 'playground' | 'settings'
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // --- Mock Database / State ---
  const [models, setModels] = useState([
    { id: 'llama-3-8b', name: 'Llama 3 8B Instruct', family: 'Meta', size: '4.7 GB', quant: 'Q4_K_M', context: '8k', description: '高精度で汎用性に長けたMetaの最新小型フラグシップモデル。対話や創作、プログラミング支援に最適。', loaded: true },
    { id: 'gemma-2-9b', name: 'Gemma 2 9B IT', family: 'Google', size: '5.5 GB', quant: 'Q5_K_M', context: '8k', description: 'Googleの先進的な言語学知見に基づくモデル。論理的推論や学術的回答で高いパフォーマンスを発揮。', loaded: false },
    { id: 'mistral-7b-v3', name: 'Mistral 7B v0.3', family: 'MistralAI', size: '4.1 GB', quant: 'Q4_K_M', context: '32k', description: '軽量でありながら高速かつ精確。コンテキストウィンドウが広く、長文の読み込みが得意。', loaded: false },
    { id: 'phi-3-medium', name: 'Phi-3 Medium', family: 'Microsoft', size: '7.9 GB', quant: 'Q4_K_M', context: '128k', description: '極めて優れた効率性と超大容量コンテキスト。推論性能は中型モデルを圧倒。', loaded: false }
  ]);

  const [activeModel, setActiveModel] = useState('llama-3-8b');
  const [isNewModelModalOpen, setIsNewModelModalOpen] = useState(false);
  const [newModelName, setNewModelName] = useState('');
  const [newModelSize, setNewModelSize] = useState('Llama 3B');

  // --- Settings State ---
  const [settings, setSettings] = useState({
    temperature: 0.7,
    maxTokens: 2048,
    gpuLayers: 16,
    threads: 8,
    systemPrompt: 'あなたは親切で知的、そして無駄な表現を省いた美しい回答を好むプライベートアシスタントです。'
  });

  // --- Hardware Mock Stats ---
  const [hardware, setHardware] = useState({
    cpu: 10,
    gpu: 40,
    vramUsed: 4.7,
    vramMax: 16.0,
    ramUsed: 8.0,
    ramMax: 32.0,
  });

  // --- Playground / Chat State ---
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', text: '本日はどのような思考をお手伝いしましょう。あなたが用意したローカルリソースをフルに活用して、深い対話を紡ぎ出す準備が整っています。' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Load beautiful fonts
  useEffect(() => {
    injectFonts();
  }, []);

  // Hardware logic simulation (adds subtle organic fluctuation)
  useEffect(() => {
    const interval = setInterval(() => {
      setHardware(prev => {
        const loadedModelObj = models.find(m => m.id === activeModel && m.loaded);
        const baseVRAM = loadedModelObj ? parseFloat(loadedModelObj.size) * 0.9 : 0;
        const randomVRAMNoise = Math.sin(Date.now() / 6000) * 0.08;
        const randomCPUNoise = Math.floor(Math.random() * 5) + (isTyping ? 28 : 6);
        const randomGPUNoise = Math.floor(Math.random() * 6) + (isTyping ? 55 : 3);

        return {
          ...prev,
          cpu: Math.min(Math.max(randomCPUNoise, 2), 98),
          gpu: Math.min(Math.max(randomGPUNoise, 0), 100),
          vramUsed: Math.min(Math.max(Number((baseVRAM + randomVRAMNoise).toFixed(1)), 0), prev.vramMax),
          ramUsed: Math.min(Math.max(Number((8.1 + (isTyping ? 1.2 : 0) + Math.sin(Date.now() / 9000) * 0.15).toFixed(1)), 4), prev.ramMax)
        };
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [activeModel, models, isTyping]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const activeModelDetails = useMemo(() => {
    return models.find(m => m.id === activeModel);
  }, [models, activeModel]);

  // Toggle model loaded state
  const handleToggleLoad = (id) => {
    setModels(prev => prev.map(m => {
      if (m.id === id) {
        const nextState = !m.loaded;
        if (nextState) {
          setActiveModel(id);
        }
        return { ...m, loaded: nextState };
      }
      return m;
    }));
  };

  // Change Active model
  const handleSelectActiveModel = (id) => {
    setModels(prev => prev.map(m => m.id === id ? { ...m, loaded: true } : m));
    setActiveModel(id);
  };

  // Add customized model
  const handleAddCustomModel = (e) => {
    e.preventDefault();
    if (!newModelName.trim()) return;
    const newId = newModelName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newModel = {
      id: newId,
      name: newModelName,
      family: 'Local',
      size: newModelSize === 'Llama 3B' ? '2.1 GB' : '8.5 GB',
      quant: 'Q4_K_M',
      context: '8k',
      description: 'ローカルディレクトリよりインポートされた独自のカスタムモデルファインチューン。',
      loaded: false
    };
    setModels(prev => [...prev, newModel]);
    setNewModelName('');
    setIsNewModelModalOpen(false);
  };

  // Simulate Local Assistant Reply
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!userInput.trim() || isTyping) return;

    const userMessage = userInput;
    setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);
    setUserInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const modelName = activeModelDetails ? activeModelDetails.name : 'Hephaestus Core';
      
      if (userMessage.includes('調子') || userMessage.includes('ステータス')) {
        reply = `【${modelName} の自己診断】\n稼働は極めて良好です。静寂な環境下でパラメータは完全に安定しています。ホストマシンの冷却ファンも通常回転域を維持しています。`;
      } else if (userMessage.includes('モデル') || userMessage.includes('違い')) {
        reply = `現在のコンテキスト閾値は ${settings.maxTokens} トークン。出力多様性（Temperature）は ${settings.temperature} で稼働中です。このプロセスはホストローカルで完全クローズドに演算されています。`;
      } else {
        const mockReplies = [
          `ご提示いただいた問いについて考察を深化させます。「${modelName}」のパラメータ群から不要な不純物を濾過し、もっとも整合性の高いロジックを選択しました。\n\nこの思考は完全にあなたのプライベート空間でのみ保存され、ネットワーク上のいかなるデータプールにも還元されることはありません。`,
          `興味深い角度からの仮説です。このマシンの物理チップ（GPU/VRAM）を直接ドライブし、極限まで無駄を削ぎ落としたテキスト構造で応答を記述しています。あなたの知的探索の足場としてお使いください。`,
          `ヘパイストスの静かな鍛冶場のように、ローカルプロセッサの微細な熱サイクルを通じて論理と言葉を組み立てています。ここには他者の関与する余地はありません。`
        ];
        reply = mockReplies[Math.floor(Math.random() * mockReplies.length)];
      }

      setChatHistory(prev => [...prev, { role: 'assistant', text: reply }]);
      setIsTyping(false);
    }, 1500);
  };

  // Theme design assets
  const appStyles = {
    bg: theme === 'dark' ? 'bg-[#121213] text-[#E4DEC9]' : 'bg-[#FAF8F5] text-[#242426]',
    border: theme === 'dark' ? 'border-[#262629]' : 'border-[#ECE7DC]',
    sidebarBg: theme === 'dark' ? 'bg-[#161618]' : 'bg-[#F2EDE2]',
    cardBg: theme === 'dark' ? 'bg-[#18181A]' : 'bg-[#FCFAF7]',
    accentText: theme === 'dark' ? 'text-[#D06C4C]' : 'text-[#C55734]',
    accentBg: theme === 'dark' ? 'bg-[#D06C4C]' : 'bg-[#C55734]',
    accentHoverBg: theme === 'dark' ? 'hover:bg-[#E28364]' : 'hover:bg-[#D66B4A]',
    accentLight: theme === 'dark' ? 'bg-[#D06C4C]/10 text-[#D06C4C] border-[#D06C4C]/25' : 'bg-[#C55734]/10 text-[#C55734] border-[#C55734]/20',
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 font-studio ${appStyles.bg}`}>
      
      {/* Custom Styles for Sophisticated Micro-animations */}
      <style>{`
        .font-studio {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .font-serif-studio {
          font-family: 'Cormorant Garamond', serif;
        }
        
        /* Subtle Fade In + Slide Up Page Transition */
        .animate-page-slide {
          animation: pageSlide 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes pageSlide {
          0% {
            opacity: 0;
            transform: translateY(12px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Micro-pulsing indicator mimicking slow organic breathing */
        .organic-pulse {
          animation: organicPulse 4s ease-in-out infinite;
        }
        @keyframes organicPulse {
          0%, 100% {
            opacity: 0.65;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.15);
          }
        }

        /* Input highlight border transition */
        .premium-input {
          transition: border-color 0.4s ease, box-shadow 0.4s ease;
        }
        .premium-input:focus {
          border-color: ${theme === 'dark' ? '#D06C4C' : '#C55734'};
          box-shadow: 0 0 0 1px ${theme === 'dark' ? '#D06C4C30' : '#C5573420'};
        }

        /* Fine range slider tuning */
        input[type="range"] {
          -webkit-appearance: none;
          background: transparent;
        }
        input[type="range"]::-webkit-slider-runnable-track {
          width: 100%;
          height: 3px;
          background: ${theme === 'dark' ? '#2F2F32' : '#ECE5D6'};
          border-radius: 1.5px;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 11px;
          width: 11px;
          border-radius: 50%;
          background: ${theme === 'dark' ? '#D06C4C' : '#C55734'};
          margin-top: -4px;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.25);
        }

        /* Scrollbar aesthetics */
        ::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: ${theme === 'dark' ? '#2F2F32' : '#E5DFD4'};
          border-radius: 2px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${theme === 'dark' ? '#444449' : '#D0C9BE'};
        }
      `}</style>

      {/* Elegant Header Panel */}
      <header className={`border-b transition-colors duration-300 ${appStyles.border} px-6 md:px-12 py-5 flex justify-between items-center bg-transparent z-10 relative`}>
        <div className="flex items-center space-x-6">
          {/* Collapse sidebar button */}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className={`p-1.5 rounded transition-all duration-300 opacity-60 hover:opacity-100 ${theme === 'dark' ? 'hover:bg-[#1C1C1E]' : 'hover:bg-[#ECE5D6]'}`}
            title={isSidebarCollapsed ? "サイドバーを展開" : "サイドバーを折りたたむ"}
          >
            <Icons.SidebarToggle />
          </button>

          <div className="flex items-center space-x-4">
            <span className={`text-[10px] uppercase tracking-[0.3em] font-medium opacity-45`}>
              LOCAL MATRIX
            </span>
            <h1 className="text-xl md:text-2xl font-serif-studio font-normal tracking-wide italic flex items-center gap-2.5">
              <span className={`w-2 h-2 rounded-full ${appStyles.accentBg} inline-block organic-pulse`}></span>
              Hephaestus
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span className="opacity-60 text-xs tracking-wider">Independent Core Active</span>
            </div>
            {activeModelDetails && activeModelDetails.loaded ? (
              <span className={`text-xs px-2.5 py-0.5 rounded border font-mono transition-all duration-300 ${appStyles.accentLight}`}>
                {activeModelDetails.name} active
              </span>
            ) : (
              <span className="text-xs opacity-40 border border-current px-2.5 py-0.5 rounded font-mono">
                Void State
              </span>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className={`p-2.5 rounded-full border transition-all duration-300 ${theme === 'dark' ? 'border-[#2D2D31] hover:bg-[#1A1A1C]' : 'border-[#EBE6DD] hover:bg-[#F2ECE2]'}`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />}
          </button>
        </div>
      </header>

      {/* Main Container Layout */}
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row min-h-[calc(100vh-80px)]">
        
        {/* Dynamic Width Collapsible Sidebar Navigation */}
        <aside className={`border-b md:border-b-0 md:border-r transition-all duration-300 ease-out ${appStyles.border} ${appStyles.sidebarBg} ${
          isSidebarCollapsed ? 'md:w-20' : 'md:w-64'
        } p-5 flex md:flex-col justify-between`}>
          
          <div className="space-y-8 w-full">
            <div className="space-y-3">
              {/* Sidebar Header Category Label */}
              {!isSidebarCollapsed && (
                <p className="text-[9px] uppercase tracking-[0.3em] opacity-40 font-semibold px-2">Navigation</p>
              )}
              
              <nav className="space-y-1">
                {[
                  { id: 'overview', label: '書斎概要', icon: <Icons.Sparkles /> },
                  { id: 'models', label: '書庫 (Models)', icon: <Icons.Database /> },
                  { id: 'playground', label: '対話 (Playground)', icon: <Icons.Message /> },
                  { id: 'settings', label: '調律 (Settings)', icon: <Icons.Settings /> },
                ].map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center py-3' : 'space-x-4 px-3 py-2.5'} rounded text-sm transition-all duration-200 group relative ${
                        isActive 
                          ? (theme === 'dark' ? 'bg-[#121213] text-[#D06C4C] font-semibold border-l border-[#D06C4C]' : 'bg-[#FAF8F5] text-[#C55734] font-semibold border-l border-[#C55734]')
                          : 'hover:opacity-100 opacity-60'
                      }`}
                    >
                      {item.icon}
                      {!isSidebarCollapsed && <span className="tracking-wide">{item.label}</span>}
                      
                      {/* Tooltip display only when sidebar is collapsed */}
                      {isSidebarCollapsed && (
                        <div className="absolute left-16 top-1/2 -translate-y-1/2 whitespace-nowrap bg-neutral-900 text-white text-xs px-2.5 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md z-30 font-studio">
                          {item.label}
                        </div>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick System Monitor Display (Hidden when collapsed to keep elegant space) */}
            {!isSidebarCollapsed ? (
              <div className={`hidden md:block p-4 rounded border transition-colors duration-300 ${appStyles.cardBg} ${appStyles.border}`}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[9px] uppercase tracking-wider font-semibold opacity-50">Physical Load</span>
                  <span className="text-[9px] font-mono font-bold opacity-75 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                    Matrix ok
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1 opacity-75">
                      <span>CPU / RAM</span>
                      <span className="font-mono">{hardware.cpu}% / {hardware.ramUsed}GB</span>
                    </div>
                    <div className={`h-[2px] rounded-full ${theme === 'dark' ? 'bg-[#29292C]' : 'bg-[#EAE4D7]'}`}>
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${appStyles.accentBg}`} 
                        style={{ width: `${hardware.cpu}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-1 opacity-75">
                      <span>GPU / VRAM</span>
                      <span className="font-mono">{hardware.gpu}% / {hardware.vramUsed}GB</span>
                    </div>
                    <div className={`h-[2px] rounded-full ${theme === 'dark' ? 'bg-[#29292C]' : 'bg-[#EAE4D7]'}`}>
                      <div 
                        className="bg-emerald-600 h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${hardware.gpu}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Minimal status indicator when collapsed */
              <div className="hidden md:flex flex-col items-center pt-4 border-t border-current border-opacity-10 space-y-4">
                <div className="w-2.5 h-2.5 rounded-full bg-[#C55734] organic-pulse" title="System loaded" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" title="Core ready" />
              </div>
            )}
          </div>

          {!isSidebarCollapsed && (
            <div className="hidden md:block pt-6 border-t border-current border-opacity-5 text-[10px] opacity-40">
              <p className="font-serif-studio italic">Hephaestus Studio</p>
              <p className="mt-1 font-mono">127.0.0.1:11434</p>
            </div>
          )}
        </aside>

        {/* Content Showcase Area */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto max-h-[calc(100vh-80px)]">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-12 animate-page-slide">
              {/* Fine Editorial Hero Block */}
              <div className="space-y-3">
                <p className={`text-[10px] uppercase tracking-[0.25em] font-semibold ${appStyles.accentText}`}>Dashboard</p>
                <h2 className="text-3xl md:text-5xl font-serif-studio font-normal tracking-wide leading-tight">
                  自律する、知の鍛冶場。
                </h2>
                <p className={`max-w-2xl text-sm leading-relaxed opacity-70`}>
                  ネットワークから遮断された完全な聖域。マシンの金属的な物理演算を美しい知性へと結晶化させる、ローカルコントロールモジュールへようこそ。
                </p>
              </div>

              {/* Grid Cards Container */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Active Model Indicator Card */}
                <div className={`lg:col-span-2 p-8 rounded border transition-all duration-500 ${appStyles.cardBg} ${appStyles.border} flex flex-col justify-between min-h-[250px]`}>
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] uppercase tracking-widest opacity-45">Selected Paradigm</span>
                      <span className="text-[10px] font-mono border border-current px-2.5 py-0.5 rounded-full opacity-60">
                        {activeModelDetails?.family || 'Local Stack'}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-serif-studio italic font-normal mb-2.5">
                      {activeModelDetails?.name || 'モデルが展開されていません'}
                    </h3>
                    <p className="text-xs md:text-sm max-w-xl opacity-70 leading-relaxed">
                      {activeModelDetails?.description || '書架（Models）から、展開する思考の核となるAIモデルを選択してください。'}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-6 mt-6 border-t border-dashed border-current border-opacity-[0.12] gap-4">
                    <div className="flex space-x-6 text-[11px] font-mono opacity-75">
                      <div>
                        <span className="opacity-45 mr-1">SIZE:</span> {activeModelDetails?.size || '-'}
                      </div>
                      <div>
                        <span className="opacity-45 mr-1">QUANT:</span> {activeModelDetails?.quant || '-'}
                      </div>
                      <div>
                        <span className="opacity-45 mr-1">CONTEXT:</span> {activeModelDetails?.context || '-'}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setActiveTab('playground')}
                      className={`text-xs font-medium tracking-wider flex items-center space-x-1.5 group hover:underline ${appStyles.accentText}`}
                    >
                      <span>対話を開く</span>
                      <Icons.ArrowRight />
                    </button>
                  </div>
                </div>

                {/* Resource Indicator Ring - Simplified for Elegant Editorial Look */}
                <div className={`p-8 rounded border transition-all duration-500 ${appStyles.cardBg} ${appStyles.border} flex flex-col justify-between`}>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest opacity-45 block mb-4">Memory Allocation</span>
                    <div className="flex justify-center items-center py-3">
                      {/* Quiet Circular Metric */}
                      <div className="relative w-28 h-28 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="42" stroke={theme === 'dark' ? '#252528' : '#ECE5D8'} strokeWidth="1" fill="none" />
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="42" 
                            stroke={theme === 'dark' ? '#D06C4C' : '#C55734'} 
                            strokeWidth="2" 
                            fill="none" 
                            strokeDasharray="263.8" 
                            strokeDashoffset={263.8 - (263.8 * (hardware.vramUsed / hardware.vramMax))} 
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <div className="absolute text-center">
                          <span className="text-2xl font-serif-studio italic font-normal">{hardware.vramUsed}</span>
                          <span className="text-[9px] opacity-45 block uppercase font-mono mt-0.5">VRAM GB</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center text-[11px] opacity-60">
                    割り当て済み容量 {hardware.vramUsed} GB / 最大 {hardware.vramMax} GB
                  </div>
                </div>

              </div>

              {/* Table of Models Loaded Status */}
              <div className="space-y-4 pt-4">
                <h3 className="text-[10px] uppercase tracking-widest opacity-45 font-semibold">Loaded Model Index</h3>
                <div className={`border-t ${appStyles.border}`}>
                  {models.map((model) => (
                    <div 
                      key={model.id}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b transition-all duration-300 ${appStyles.border}`}
                    >
                      <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                        <span className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${model.loaded ? 'bg-emerald-600' : 'bg-transparent border border-current opacity-20'}`}></span>
                        <div>
                          <p className="text-sm font-medium tracking-wide">{model.name}</p>
                          <p className="text-xs opacity-50 font-serif-studio italic">{model.family} • {model.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <span className="text-[11px] font-mono opacity-50">{model.quant}</span>
                        {model.loaded ? (
                          <div className="flex items-center space-x-3">
                            <span className="text-xs opacity-50 font-mono">In VRAM</span>
                            <button 
                              onClick={() => handleToggleLoad(model.id)}
                              className="text-xs text-red-500/80 hover:text-red-500 hover:underline px-2 py-0.5"
                            >
                              Unload
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleToggleLoad(model.id)}
                            className={`text-xs px-3 py-1 rounded transition-colors duration-300 ${
                              theme === 'dark' ? 'bg-[#1D1D20] hover:bg-[#252529]' : 'bg-[#EAE4D7] hover:bg-[#DDD6C8]'
                            }`}
                          >
                            Load
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MODELS */}
          {activeTab === 'models' && (
            <div className="space-y-8 animate-page-slide">
              <div className="flex justify-between items-end">
                <div className="space-y-2">
                  <p className={`text-[10px] uppercase tracking-[0.3em] font-semibold ${appStyles.accentText}`}>Library</p>
                  <h2 className="text-3xl font-serif-studio font-normal">書記たちの記録庫</h2>
                  <p className="text-sm opacity-60 max-w-xl leading-relaxed">
                    ホストマシンに格納されているインテリジェンスモデルの一覧です。ローカルメモリ(VRAM)へ結合して、思考回路を生成します。
                  </p>
                </div>
                <button 
                  onClick={() => setIsNewModelModalOpen(true)}
                  className="flex items-center space-x-2 text-xs font-medium tracking-wider uppercase border border-current px-4 py-2 hover:bg-current hover:text-[#FAF8F5] dark:hover:text-[#121213] transition-all duration-300"
                >
                  <Icons.Plus />
                  <span>モデルの追加</span>
                </button>
              </div>

              {/* Models Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {models.map((model) => (
                  <div 
                    key={model.id}
                    className={`p-6 rounded border transition-all duration-300 flex flex-col justify-between ${
                      model.id === activeModel 
                        ? (theme === 'dark' ? 'bg-[#1D1C1B] border-[#D06C4C]/40' : 'bg-[#FDF9F2] border-[#C55734]/30')
                        : `${appStyles.cardBg} ${appStyles.border}`
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest opacity-45 font-mono">{model.family}</p>
                          <h3 className="text-xl font-serif-studio font-semibold italic mt-0.5">{model.name}</h3>
                        </div>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono border ${
                          model.loaded 
                            ? 'bg-emerald-600/10 text-emerald-600 border-emerald-600/20' 
                            : 'opacity-40 border-current'
                        }`}>
                          {model.loaded ? 'Loaded' : 'Offline'}
                        </span>
                      </div>
                      
                      <p className="text-xs leading-relaxed opacity-75">
                        {model.description}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${theme === 'dark' ? 'bg-[#212124]' : 'bg-[#ECE5D6]'}`}>
                          Size: {model.size}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${theme === 'dark' ? 'bg-[#212124]' : 'bg-[#ECE5D6]'}`}>
                          Quant: {model.quant}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${theme === 'dark' ? 'bg-[#212124]' : 'bg-[#ECE5D6]'}`}>
                          Context: {model.context}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 mt-6 border-t border-dashed border-current border-opacity-10 opacity-70 hover:opacity-100 transition-opacity duration-300">
                      <button 
                        onClick={() => handleToggleLoad(model.id)}
                        className={`text-xs flex items-center space-x-1.5 px-3 py-1.5 rounded border transition-all duration-300 ${
                          model.loaded 
                            ? 'border-red-500/30 text-red-500 hover:bg-red-500/10' 
                            : (theme === 'dark' ? 'border-[#2D2D31] hover:bg-[#202022]' : 'border-[#DDD6C8] hover:bg-[#ECE5D6]')
                        }`}
                      >
                        <Icons.Power />
                        <span>{model.loaded ? 'アンロード' : 'メモリ結合'}</span>
                      </button>
                      
                      <button 
                        onClick={() => handleSelectActiveModel(model.id)}
                        disabled={model.id === activeModel && model.loaded}
                        className={`text-xs font-semibold px-3 py-1.5 rounded transition-all duration-300 ${
                          model.id === activeModel && model.loaded
                            ? 'opacity-30 cursor-default'
                            : `${appStyles.accentText} hover:underline`
                        }`}
                      >
                        {model.id === activeModel && model.loaded ? 'アクティブ' : '優先使用設定'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Model Modal */}
              {isNewModelModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className={`w-full max-w-md p-8 rounded border shadow-2xl ${
                    theme === 'dark' ? 'bg-[#18181A] border-[#29292C]' : 'bg-[#FCFAF7] border-[#ECE7DC]'
                  }`}>
                    <h3 className="text-2xl font-serif-studio italic font-normal mb-1">新規インプット登録</h3>
                    <p className="text-xs opacity-50 mb-6">ローカルパスまたは、GGUF形式で落としたカスタムモデルを追加します。</p>
                    
                    <form onSubmit={handleAddCustomModel} className="space-y-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-semibold opacity-50 mb-1.5">モデル呼称</label>
                        <input 
                          type="text" 
                          required
                          placeholder="My FineTune Llama"
                          value={newModelName}
                          onChange={(e) => setNewModelName(e.target.value)}
                          className={`w-full px-3 py-2 text-sm rounded border bg-transparent focus:outline-none premium-input ${
                            theme === 'dark' ? 'border-[#2D2D31]' : 'border-[#DDD6C8]'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-semibold opacity-50 mb-1.5">容量設定</label>
                        <select 
                          value={newModelSize}
                          onChange={(e) => setNewModelSize(e.target.value)}
                          className={`w-full px-3 py-2 text-sm rounded border bg-transparent focus:outline-none premium-input ${
                            theme === 'dark' ? 'border-[#2D2D31]' : 'border-[#DDD6C8]'
                          }`}
                        >
                          <option value="Llama 3B" className={theme === 'dark' ? 'bg-[#18181A]' : 'bg-[#FCFAF7]'}>3 Billion (~2.1 GB)</option>
                          <option value="Llama 13B" className={theme === 'dark' ? 'bg-[#18181A]' : 'bg-[#FCFAF7]'}>13 Billion (~8.5 GB)</option>
                        </select>
                      </div>

                      <div className="flex space-x-3 pt-4">
                        <button 
                          type="button" 
                          onClick={() => setIsNewModelModalOpen(false)}
                          className="flex-1 py-2 text-xs border border-current opacity-50 hover:opacity-100 rounded transition-all"
                        >
                          キャンセル
                        </button>
                        <button 
                          type="submit" 
                          className={`flex-1 py-2 text-xs text-white rounded font-semibold transition-all ${appStyles.accentBg} ${appStyles.accentHoverBg}`}
                        >
                          登録
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PLAYGROUND */}
          {activeTab === 'playground' && (
            <div className="space-y-6 h-full flex flex-col animate-page-slide">
              <div className="space-y-1">
                <p className={`text-[10px] uppercase tracking-[0.3em] font-semibold ${appStyles.accentText}`}>Playground</p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h2 className="text-3xl font-serif-studio font-normal">対話の余白</h2>
                  <div className="text-xs opacity-50 flex items-center space-x-2 font-mono">
                    <span>Active Paradigm:</span>
                    <span className="font-semibold">{activeModelDetails ? activeModelDetails.name : 'なし'}</span>
                  </div>
                </div>
              </div>

              {/* Chat Container */}
              <div className={`flex-1 min-h-[420px] max-h-[580px] overflow-y-auto border rounded p-6 md:p-8 flex flex-col justify-between ${
                theme === 'dark' ? 'bg-[#161618] border-[#262629]' : 'bg-[#F2EDE2] border-[#ECE7DC]'
              }`}>
                {/* Messages Body */}
                <div className="space-y-6 overflow-y-auto pr-2 max-h-[460px]">
                  {chatHistory.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-page-slide`}
                    >
                      <div className={`max-w-2xl space-y-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                        <span className="text-[8px] uppercase tracking-wider opacity-40 block font-mono">
                          {msg.role === 'user' ? 'Transmission' : 'Hephaestus Answer'}
                        </span>
                        <div className={`inline-block text-sm p-4 rounded leading-relaxed whitespace-pre-wrap transition-colors ${
                          msg.role === 'user' 
                            ? (theme === 'dark' ? 'bg-[#2A2A2E] text-white' : 'bg-[#FCFAF7] text-[#242426]')
                            : 'opacity-90 font-serif-studio text-[15px]'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start animate-pulse">
                      <div className="space-y-1">
                        <span className="text-[8px] uppercase tracking-wider opacity-40 block font-mono">Generating response</span>
                        <div className={`inline-block text-sm p-4 rounded font-serif-studio italic opacity-60`}>
                          文字を鋳造しています...
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input area */}
                <form onSubmit={handleSendMessage} className="mt-8">
                  <div className={`flex items-center border-t pt-4 ${appStyles.border}`}>
                    <input 
                      type="text" 
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder={activeModelDetails?.loaded ? "ここに思索を書き留める..." : "対話する前に、書庫（Models）からモデルをロードしてください。"}
                      disabled={!activeModelDetails?.loaded || isTyping}
                      className="flex-1 bg-transparent py-3 text-sm focus:outline-none placeholder-opacity-40 italic font-serif-studio text-lg"
                    />
                    <button 
                      type="submit" 
                      disabled={!userInput.trim() || isTyping}
                      className={`ml-4 p-3 rounded-full transition-all duration-300 flex items-center justify-center ${
                        userInput.trim() && !isTyping
                          ? `${appStyles.accentBg} text-white ${appStyles.accentHoverBg}`
                          : 'opacity-25 bg-transparent border border-current'
                      }`}
                    >
                      <Icons.ArrowRight />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-10 animate-page-slide">
              <div className="space-y-1">
                <p className={`text-[10px] uppercase tracking-[0.3em] font-semibold ${appStyles.accentText}`}>Tuning</p>
                <h2 className="text-3xl font-serif-studio font-normal">パラメータの調律</h2>
                <p className="text-sm opacity-60 max-w-xl">
                  AIモデルの創造性やシステム割り当ての度合いを微細にコントロールし、あなたのマシンに最適化します。
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left side parameters */}
                <div className="space-y-6">
                  <h3 className="text-md font-serif-studio font-normal border-b pb-2 opacity-80">生成パラメーター</h3>
                  
                  {/* Temperature slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium">温度 (Temperature)</span>
                      <span className={`font-mono font-bold ${appStyles.accentText}`}>{settings.temperature}</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.1" 
                      max="1.5" 
                      step="0.05"
                      value={settings.temperature}
                      onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-[9px] opacity-45">
                      <span>静的・論理的</span>
                      <span>創造的・自由</span>
                    </div>
                  </div>

                  {/* Context size */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium">最長トークン長 (Max Tokens)</span>
                      <span className={`font-mono font-bold ${appStyles.accentText}`}>{settings.maxTokens}</span>
                    </div>
                    <input 
                      type="range" 
                      min="256" 
                      max="8192" 
                      step="256"
                      value={settings.maxTokens}
                      onChange={(e) => setSettings({ ...settings, maxTokens: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  {/* System Prompt */}
                  <div className="space-y-2">
                    <label className="block text-xs font-medium">システムペルソナ Prompt</label>
                    <textarea 
                      rows="4"
                      value={settings.systemPrompt}
                      onChange={(e) => setSettings({ ...settings, systemPrompt: e.target.value })}
                      className={`w-full p-3.5 text-xs rounded border bg-transparent focus:outline-none premium-input leading-relaxed ${
                        theme === 'dark' ? 'border-[#2D2D31]' : 'border-[#DDD6C8]'
                      }`}
                    ></textarea>
                  </div>
                </div>

                {/* Right side parameters (Physical Hardware settings) */}
                <div className="space-y-6">
                  <h3 className="text-md font-serif-studio font-normal border-b pb-2 opacity-80">システムパラメータ</h3>

                  {/* GPU Offload Layers */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium">GPU オフロードレイヤー (Layers)</span>
                      <span className="font-mono font-bold text-emerald-600">{settings.gpuLayers} / 32</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="32" 
                      step="1"
                      value={settings.gpuLayers}
                      onChange={(e) => setSettings({ ...settings, gpuLayers: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <p className="text-[10px] opacity-45">GPUに割り振るレイヤー数。多いほど処理は高速化しますが、VRAM容量を超過しないよう調整してください。</p>
                  </div>

                  {/* Threads */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium">CPU 使用スレッド数 (Threads)</span>
                      <span className="font-mono font-bold text-emerald-600">{settings.threads}</span>
                    </div>
                    <input 
                      type="range" 
                      min="2" 
                      max="16" 
                      step="1"
                      value={settings.threads}
                      onChange={(e) => setSettings({ ...settings, threads: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Warning Note */}
                  <div className={`p-4 rounded border text-xs leading-relaxed opacity-75 ${
                    theme === 'dark' ? 'bg-[#18181A] border-[#29292C]' : 'bg-[#FAF8F5] border-[#ECE7DC]'
                  }`}>
                    <p className="font-serif-studio italic font-semibold mb-1">ローカルホストに関する注意：</p>
                    限界を超えたシステム設定は物理メモリのスワップを発生させ、モデル生成速度の急激な低下やプロセスクラッシュを引き起こす可能性があります。
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end pt-6 border-t border-dashed border-current border-opacity-10">
                <button 
                  onClick={() => alert('調律値がローカルの `hephaestus.config.json` に正常に書き込まれました。')}
                  className={`px-6 py-2.5 text-xs font-semibold tracking-wider uppercase text-white rounded transition-all ${appStyles.accentBg} ${appStyles.accentHoverBg}`}
                >
                  パラメータを保存する
                </button>
              </div>

            </div>
          )}

        </main>

      </div>
    </div>
  );
}