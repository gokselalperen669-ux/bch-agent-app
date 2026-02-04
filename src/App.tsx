import { useState } from 'react';
import {
  Bot,
  Cpu,
  Wallet,
  Settings as SettingsIcon,
  Activity,
  Plus,
  Shield,
  Globe,
  Zap,
  ChevronRight,
  Database,
  Lock,
  Eye,
  Key,
  Server,
  Code,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DocumentationWebsite from './Docs';
import logo from './assets/logo.png';


// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <motion.div
    whileHover={{ x: 4, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active
      ? 'text-primary-color'
      : 'text-text-secondary hover:text-text-primary'
      }`}
    style={active ? { backgroundColor: 'rgba(0, 227, 57, 0.1)', color: 'var(--primary-color)', border: '1px solid rgba(0, 227, 57, 0.2)' } : {}}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
    {active && <motion.div layoutId="active" className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-color" style={{ backgroundColor: 'var(--primary-color)' }} />}
  </motion.div>
);

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [network, setNetwork] = useState('testnet');

  return (
    <div className="app-container overflow-hidden flex bg-color text-primary h-screen w-screen" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}>
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 flex flex-col p-6 backdrop-blur-3xl bg-black/40" style={{ borderRight: '1px solid var(--border-color)' }}>
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-primary-color/30 shadow-[0_0_15px_rgba(0,227,57,0.2)] overflow-hidden" style={{ border: '1px solid rgba(0, 227, 57, 0.3)' }}>
            <img src={logo} alt="BCH Agent Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-title font-extrabold text-xl tracking-tight" style={{ fontFamily: 'var(--font-title)' }}>
              BCH<span className="text-primary-color" style={{ color: 'var(--primary-color)' }}>AGENT</span>
            </h1>
            <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold" style={{ color: 'var(--text-secondary)' }}>Studio v1.0</p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <SidebarItem icon={Activity} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={Bot} label="Agent Lab" active={activeTab === 'lab'} onClick={() => setActiveTab('lab')} />
          <SidebarItem icon={Code} label="Contract Base" active={activeTab === 'contracts'} onClick={() => setActiveTab('contracts')} />
          <SidebarItem icon={Wallet} label="Vault" active={activeTab === 'wallet'} onClick={() => setActiveTab('wallet')} />
          <SidebarItem icon={Database} label="Knowledge" active={activeTab === 'data'} onClick={() => setActiveTab('data')} />
          <SidebarItem icon={BookOpen} label="Documentation" active={activeTab === 'docs'} onClick={() => setActiveTab('docs')} />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-4" style={{ borderTop: '1px solid var(--border-color)' }}>
          <SidebarItem icon={SettingsIcon} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Network</span>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${network === 'mainnet' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}`} style={network === 'mainnet' ? { backgroundColor: 'rgba(249, 115, 22, 0.2)', color: 'rgb(251, 146, 60)' } : { backgroundColor: 'rgba(34, 197, 94, 0.2)', color: 'rgb(74, 222, 128)' }}>{network}</span>
            </div>
            <div className="flex bg-black/40 rounded-lg p-1">
              <button
                onClick={() => setNetwork('testnet')}
                className={`flex-1 text-[10px] font-bold py-1.5 rounded-md transition-all ${network === 'testnet' ? 'bg-white/10 text-white shadow-lg' : 'text-text-secondary hover:text-white/60'}`}
              >TESTNET</button>
              <button
                onClick={() => setNetwork('mainnet')}
                className={`flex-1 text-[10px] font-bold py-1.5 rounded-md transition-all ${network === 'mainnet' ? 'bg-white/10 text-white shadow-lg' : 'text-text-secondary hover:text-white/60'}`}
              >MAINNET</button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 backdrop-blur-md z-10" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold capitalize tracking-tight">{activeTab.replace('-', ' ')}</h2>
            <div className="h-4 w-[1px] bg-white/10"></div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary-color/10 border border-primary-color/20 text-[10px] font-bold text-primary-color uppercase" style={{ backgroundColor: 'rgba(0, 227, 57, 0.1)', color: 'var(--primary-color)', border: '1px solid rgba(0, 227, 57, 0.2)' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-primary-color animate-pulse" style={{ backgroundColor: 'var(--primary-color)' }}></div>
              Node Connected
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
              <Wallet size={16} className="text-text-secondary group-hover:text-primary-color transition-colors" />
              <span className="font-mono text-sm tracking-tighter">0.842 <span className="text-text-secondary">BCH</span></span>
              <Plus size={14} className="text-primary-color hover:rotate-90 transition-transform" style={{ color: 'var(--primary-color)' }} />
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-color to-blue-500 p-[1px] transition-transform hover:scale-105 cursor-pointer shadow-lg" style={{ background: 'linear-gradient(45deg, var(--primary-color), var(--accent-color))' }}>
              <div className="w-full h-full rounded-xl bg-black flex items-center justify-center">
                <span className="font-bold text-xs">AG</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-10 bg-black/10 custom-scroll">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="max-w-6xl mx-auto h-full flex flex-col"
            >
              {activeTab === 'dashboard' && <DashboardOverview />}
              {activeTab === 'lab' && <AgentLab />}
              {activeTab === 'contracts' && <ContractBase />}
              {activeTab === 'wallet' && <VaultPage />}
              {activeTab === 'data' && <KnowledgeBase />}
              {activeTab === 'settings' && <SettingsPage />}
              {activeTab === 'docs' && <DocumentationWebsite />}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Banner */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary-color/50 to-transparent opacity-30 w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(0, 227, 57, 0.5), transparent)' }}></div>
      </main>
    </div>
  );
};

// --- Sub-Pages ---

const DashboardOverview = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <StatsCard icon={Bot} label="Active Agents" value="4" delta="+1" />
    <StatsCard icon={Zap} label="BCH Transactions" value="1,284" delta="+12%" />
    <StatsCard icon={Shield} label="Contract Value" value="42.5 BCH" delta="Stable" />

    <div className="md:col-span-2 glass-panel p-8 min-h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold">Recent Agent Activity</h3>
          <p className="text-xs text-text-secondary mt-1">Real-time autonomous interactions on-chain.</p>
        </div>
        <button className="text-xs font-bold text-primary-color hover:underline bg-primary-color/5 px-4 py-2 rounded-lg border border-primary-color/10" style={{ color: 'var(--primary-color)' }}>View All Logs</button>
      </div>
      <div className="space-y-4 flex-1">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-primary-color/10 group-hover:border-primary-color/20 transition-all">
              <Activity size={18} className="text-text-secondary group-hover:text-primary-color" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold tracking-tight">Strategy Alpha #0{i} <span className="text-text-secondary text-xs font-normal ml-2 tracking-normal">executed <span className="text-primary-color">SELL_ACTION</span> on DEX</span></p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-[9px] text-text-secondary font-mono uppercase tracking-widest px-2 py-0.5 bg-black/40 rounded border border-white/5">0x4d2b...f89c</span>
                <span className="text-[9px] text-text-secondary font-bold uppercase">2m ago</span>
              </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
              <button className="p-2 border border-white/10 rounded-xl hover:bg-white/10">
                <Eye size={14} />
              </button>
              <button className="p-2 border border-blue-500/20 rounded-xl bg-blue-500/5 text-blue-400 hover:bg-blue-500/10">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="glass-panel p-8 flex flex-col gap-8">
      <div>
        <h3 className="text-lg font-bold mb-6">Market Context</h3>
        <div className="p-5 rounded-2xl bg-primary-color/5 border border-primary-color/10 space-y-4">
          <div className="flex justify-between items-center text-sm font-bold">
            <span className="text-text-secondary">BCH / USD</span>
            <span className="text-primary-color">$542.84 <span className="text-[10px] text-green-400 ml-1">+4.2%</span></span>
          </div>
          <div className="flex justify-between items-center text-sm font-bold">
            <span className="text-text-secondary">Block Height</span>
            <span className="text-blue-400 font-mono">812,492</span>
          </div>
          <div className="flex justify-between items-center text-sm font-bold">
            <span className="text-text-secondary">Network Sat/byte</span>
            <span className="text-white">1.0</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-6">LLM Provider</h3>
        <div className="p-5 rounded-2xl bg-black/40 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-20 transform translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform">
            <Zap size={40} className="text-blue-400" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Globe size={16} className="text-blue-400" />
            </div>
            <span className="font-bold text-sm">OpenAI GPT-4o</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-text-secondary">
              <span>Token Usage</span>
              <span className="text-text-primary">75%</span>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                className="bg-gradient-to-r from-blue-500 to-accent-color h-full"
              ></motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto p-4 rounded-xl bg-primary-color/5 border border-primary-color/10 flex items-center gap-3">
        <Shield size={16} className="text-primary-color" />
        <p className="text-[10px] text-text-secondary leading-tight">All agents are secured by <span className="text-primary-color font-bold">UTXO Covenants</span>.</p>
      </div>
    </div>

  </div>
);

const StatsCard = ({ icon: Icon, label, value, delta }: any) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="glass-panel p-6 flex flex-col gap-1 relative overflow-hidden group cursor-default"
  >
    <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-color/5 rounded-full blur-3xl group-hover:bg-primary-color/15 transition-all duration-500"></div>
    <div className="flex items-center justify-between relative z-10">
      <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:border-primary-color/30 group-hover:bg-primary-color/5 transition-all">
        <Icon size={20} className="text-text-secondary group-hover:text-primary-color transition-colors" />
      </div>
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
        <div className={`w-1 h-1 rounded-full ${delta.includes('+') ? 'bg-green-400' : 'bg-blue-400'}`}></div>
        <span className="text-[10px] font-bold text-text-primary uppercase tracking-tighter">{delta}</span>
      </div>
    </div>
    <div className="mt-5 relative z-10">
      <p className="text-[10px] text-text-secondary font-bold uppercase tracking-[0.1em]">{label}</p>
      <p className="text-4xl font-extrabold font-title mt-1 tracking-tight" style={{ fontFamily: 'var(--font-title)' }}>{value}</p>
    </div>
  </motion.div>
);



const AgentLab = () => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setDeployed(true);
      setTimeout(() => setDeployed(false), 5000);
    }, 3000);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-3xl font-bold font-title tracking-tight" style={{ fontFamily: 'var(--font-title)' }}>Agent Laboratory</h3>
          <p className="text-text-secondary text-base mt-1">Forge intelligent on-chain autonomous agents with native CashTokens.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0,227,57,0.3)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDeploy}
          disabled={isDeploying}
          className={`px-8 py-4 bg-primary-color text-black font-extrabold rounded-2xl flex items-center gap-3 shadow-xl shadow-primary-color/20 transition-all ${isDeploying ? 'opacity-50 cursor-wait' : ''}`}
          style={{ backgroundColor: 'var(--primary-color)' }}
        >
          {isDeploying ? (
            <>
              <Activity size={20} className="animate-spin" />
              DEPLOYING...
            </>
          ) : deployed ? (
            <>
              <Shield size={20} />
              AGENT ONLINE
            </>
          ) : (
            <>
              <Plus size={20} strokeWidth={3} />
              INITIALIZE AGENT
            </>
          )}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
        <div className="glass-panel p-10 flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h4 className="font-bold flex items-center gap-3 text-primary-color uppercase tracking-widest text-xs" style={{ color: 'var(--primary-color)' }}>
              <Cpu size={18} />
              Logic Configuration
            </h4>
            <span className="text-[10px] font-bold text-text-secondary italic">Drafting...</span>
          </div>

          <div className="flex-1 space-y-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase font-extrabold text-text-secondary tracking-widest">Agent Identity</label>
                <span className="text-[10px] text-text-secondary opacity-40">Unique CID will be generated</span>
              </div>
              <input type="text" placeholder="e.g. TreasuryManager v1.0.4" className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 focus:border-primary-color focus:bg-primary-color/5 outline-none transition-all font-medium placeholder:text-white/20" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase font-extrabold text-text-secondary tracking-widest">Core Narrative (Prompting)</label>
                <Database size={12} className="text-text-secondary opacity-40" />
              </div>
              <textarea placeholder="Instruction your agent: 'Monitor wallet for BCH transfers above 0.5. On detection, swap 20% to tokens via CashSwap DEX and update state...'" className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 focus:border-primary-color focus:bg-primary-color/5 outline-none transition-all h-48 resize-none font-medium text-sm leading-relaxed placeholder:text-white/20"></textarea>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase font-extrabold text-text-secondary tracking-widest">On-Chain Triggers</label>
              <div className="flex flex-wrap gap-3">
                <TriggerBadge label="Token Transfer" active />
                <TriggerBadge label="Oracle Price" />
                <TriggerBadge label="Time Interval" />
                <TriggerBadge label="Contract State" />
                <div className="p-2 border border-dashed border-white/10 rounded-xl text-text-secondary hover:border-white/30 cursor-pointer transition-all">
                  <Plus size={14} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="glass-panel p-8 relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <Lock size={16} className="text-white/20" />
            </div>
            <h4 className="font-bold flex items-center gap-3 mb-6 uppercase tracking-widest text-xs">
              <Shield size={18} className="text-orange-400" />
              Covenant Schema
            </h4>
            <div className="relative">
              <pre className="p-5 bg-black/60 rounded-2xl font-mono text-[11px] border border-white/10 text-text-secondary h-52 overflow-hidden leading-relaxed backdrop-blur-sm group-hover:text-text-primary transition-colors">
                {`pragma cashscript ^0.10.0;

contract GenericAgent(
    pubkey agentPk,
    bytes20 agentID
) {
    function execute(sig s, bytes action) {
        require(checkSig(s, agentPk));
        
        // Context Validation
        require(tx.inputs[0].nftCommitment == agentID);
        
        // Action Dispatch
        bytes4 selector = action.slice(0, 4);
        if (selector == 0xa945451e) { 
            // Swap action...
        }
    }
}`}
              </pre>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="pointer-events-auto px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-xs font-bold backdrop-blur-md">EDIT SOURCE</button>
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 flex-1 flex flex-col gap-6">
            <h4 className="font-bold flex items-center gap-3 uppercase tracking-widest text-xs">
              <SettingsIcon size={18} className="text-blue-400" />
              Autonomy Protocols
            </h4>
            <div className="space-y-6 flex-1">
              <ProtocolItem label="Autonomous Transfers" description="Agent can send tokens without human intervention." active />
              <ProtocolItem label="Automatic Refilling" description="Auto-fund gas from vault if below 0.05 BCH." active />
              <ProtocolItem label="Manual Confirmation" description="Require UI approval for large transactions (>1 BCH)." />
            </div>

            <div className="pt-6 border-t border-white/5 flex gap-4">
              <button className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-xs hover:bg-white/10 transition-all uppercase tracking-widest">Discard</button>
              <button className="flex-1 py-3 bg-primary-color/20 border border-primary-color/30 text-primary-color rounded-xl font-bold text-xs hover:bg-primary-color/30 transition-all uppercase tracking-widest">Save Config</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const TriggerBadge = ({ label, active }: any) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`px-4 py-2 rounded-xl border text-[10px] font-bold uppercase transition-all cursor-pointer ${active
      ? 'bg-primary-color/10 border-primary-color/40 text-primary-color'
      : 'bg-white/5 border-white/5 text-text-secondary hover:border-white/20'
      }`} style={active ? { backgroundColor: 'rgba(0, 227, 57, 0.1)', borderColor: 'rgba(0, 227, 57, 0.4)', color: 'var(--primary-color)' } : {}}>
    {label}
  </motion.div>
);

const ProtocolItem = ({ label, description, active }: any) => (
  <div className="flex items-center justify-between group">
    <div>
      <p className="text-sm font-bold tracking-tight">{label}</p>
      <p className="text-[10px] text-text-secondary mt-1 max-w-[200px] leading-relaxed">{description}</p>
    </div>
    <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all ${active ? 'bg-primary-color' : 'bg-white/10'}`} style={active ? { backgroundColor: 'var(--primary-color)' } : {}}>
      <motion.div
        animate={{ x: active ? 24 : 0 }}
        className="w-4 h-4 rounded-full bg-white shadow-lg"
      ></motion.div>
    </div>
  </div>
);

const SettingsPage = () => (
  <div className="max-w-4xl mx-auto space-y-8 pb-20">
    <div>
      <h3 className="text-3xl font-bold font-title tracking-tight" style={{ fontFamily: 'var(--font-title)' }}>Settings</h3>
      <p className="text-text-secondary text-base mt-1">Configure your local API keys and node preferences.</p>
    </div>

    <div className="grid grid-cols-1 gap-8">
      <section className="glass-panel p-8 space-y-6">
        <h4 className="text-xs font-bold uppercase tracking-widest text-text-secondary flex items-center gap-2">
          <Key size={14} />
          LLM Integration
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-[10px] uppercase font-bold text-text-secondary">AI Provider</label>
            <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary-color appearance-none cursor-pointer">
              <option>OpenAI (Standard)</option>
              <option>Anthropic (Advanced)</option>
              <option>Local (Ollama/Llama.cpp)</option>
              <option>DeepSeek (Efficient)</option>
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] uppercase font-bold text-text-secondary">API Key Override</label>
            <div className="relative">
              <input type="password" placeholder="sk-proj-..................." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary-color font-mono text-xs pr-12" />
              <Lock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary opacity-40" />
            </div>
          </div>
        </div>
      </section>

      <section className="glass-panel p-8 space-y-6">
        <h4 className="text-xs font-bold uppercase tracking-widest text-text-secondary flex items-center gap-2">
          <Server size={14} />
          BCH Full Node Connection
        </h4>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-primary-color/10 flex items-center justify-center">
              <Database size={18} className="text-primary-color" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">Standard Integrated Node</p>
              <p className="text-[10px] text-text-secondary">Optimized for low latency agent interactions.</p>
            </div>
            <span className="text-[10px] font-bold text-primary-color uppercase">Connected</span>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl border border-dashed border-white/10 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
              <Plus size={18} className="text-text-secondary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">Add Custom RPC Endpoint</p>
              <p className="text-[10px] text-text-secondary">Connect to your own BCHD or Bitcoin ABC node.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-end gap-4">
        <button className="px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-white/5 transition-all">Cancel</button>
        <button className="px-8 py-2.5 bg-primary-color text-black rounded-xl text-xs font-bold hover:scale-105 transition-all shadow-lg shadow-primary-color/10" style={{ backgroundColor: 'var(--primary-color)' }}>Save Preferences</button>
      </div>
    </div>
  </div>
);

// --- New Tab Components ---

const ContractBase = () => (
  <div className="space-y-8">
    <h3 className="text-3xl font-bold font-title tracking-tight" style={{ fontFamily: 'var(--font-title)' }}>Contract Base</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="glass-panel p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Shield className="text-primary-color" size={20} />
          <span className="font-bold">AgentBase.cash</span>
        </div>
        <p className="text-xs text-text-secondary">The core foundational covenant for all BCH Agents.</p>
        <div className="mt-auto pt-4 border-t border-white/5 flex gap-2">
          <button className="px-3 py-1.5 bg-white/5 rounded-lg text-xs hover:bg-white/10">View Code</button>
          <button className="px-3 py-1.5 bg-primary-color/10 text-primary-color rounded-lg text-xs font-bold">Compiled</button>
        </div>
      </div>
      {/* Add more templates here */}
      <div className="glass-panel p-6 border-dashed border-white/10 bg-transparent flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-primary-color/50 transition-all">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary-color/10 transition-all">
          <Plus className="text-text-secondary group-hover:text-primary-color" />
        </div>
        <span className="text-sm font-bold text-text-secondary group-hover:text-text-primary">Create New Template</span>
      </div>
    </div>
  </div>
);

const VaultPage = () => (
  <div className="space-y-8">
    <h3 className="text-3xl font-bold font-title tracking-tight" style={{ fontFamily: 'var(--font-title)' }}>Secure Vault</h3>
    <div className="glass-panel p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs text-text-secondary uppercase font-bold tracking-widest">Master Wallet</p>
          <p className="text-2xl font-mono mt-1 tracking-tighter">bchtest:qzfr...00t</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-secondary uppercase font-bold tracking-widest">Balance</p>
          <p className="text-3xl font-bold text-primary-color">0.842 <span className="text-sm">BCH</span></p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-2 hover:bg-white/10">
          <Plus size={20} className="text-primary-color" />
          <span className="text-[10px] font-bold uppercase">Receive</span>
        </button>
        <button className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-2 hover:bg-white/10">
          <Zap size={20} className="text-orange-400" />
          <span className="text-[10px] font-bold uppercase">Send</span>
        </button>
        <button className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-2 hover:bg-white/10">
          <Activity size={20} className="text-blue-400" />
          <span className="text-[10px] font-bold uppercase">History</span>
        </button>
        <button className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-2 hover:bg-white/10">
          <Lock size={20} className="text-purple-400" />
          <span className="text-[10px] font-bold uppercase">Backup</span>
        </button>
      </div>
    </div>
  </div>
);

const KnowledgeBase = () => (
  <div className="space-y-8">
    <h3 className="text-3xl font-bold font-title tracking-tight" style={{ fontFamily: 'var(--font-title)' }}>Knowledge Base</h3>
    <div className="glass-panel p-8 flex flex-col items-center justify-center min-h-[300px] gap-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-primary-color/5 flex items-center justify-center border border-primary-color/10">
        <Database className="text-primary-color" size={32} />
      </div>
      <div>
        <h4 className="text-xl font-bold">Vector Database Offline</h4>
        <p className="text-sm text-text-secondary mt-2 max-w-sm">Connect a knowledge source to feed your agent with private data or market insights.</p>
      </div>
      <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-xs hover:bg-white/10 transition-all uppercase tracking-widest">Connect Dataset</button>
    </div>
  </div>
);

export default App;

