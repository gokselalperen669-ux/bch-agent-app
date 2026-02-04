import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Terminal,
    ShieldCheck,
    Zap,
    Layers,
    ChevronRight,
    Workflow
} from 'lucide-react';
import logo from './assets/logo.png';


const DocumentationWebsite = () => {
    const [activeSection, setActiveSection] = useState('getting-started');

    const sections: any = {
        'getting-started': {
            title: 'Getting Started',
            icon: Zap,
            content: (
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-white mb-4">Launch Your First Agent</h2>
                    <p className="text-[#929292] text-lg">
                        The BCH Agent Framework is designed to help you build, deploy, and manage autonomous AI agents on the Bitcoin Cash network in minutes.
                    </p>
                    <div className="bg-black/40 border border-white/10 rounded-xl p-6 font-mono text-sm">
                        <div className="flex items-center gap-2 mb-2 text-[#00E339]">
                            <Terminal size={16} />
                            <span>Installation</span>
                        </div>
                        <code className="text-white">npm install -g @bch-agent/sdk</code>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FeatureCard
                            title="Autonomous"
                            desc="Agents run independent loops, monitoring the chain and acting based on LLM decisions."
                            icon={Workflow}
                        />
                        <FeatureCard
                            title="Secure"
                            desc="Built on CashScript covenants. Only the agent logic can move funds under owner constraints."
                            icon={ShieldCheck}
                        />
                    </div>
                </div>
            )
        },
        'cli-reference': {
            title: 'CLI Reference',
            icon: Terminal,
            content: (
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-white mb-4">Command Line Interface</h2>
                    <div className="space-y-4">
                        <CommandItem
                            cmd="bch-agent init <project>"
                            desc="Create a new framework environment with local logic and contracts."
                        />
                        <CommandItem
                            cmd="bch-agent agent create <name> --type <type>"
                            desc="Generate a pre-built agent. Types: defi, nft, social, vault."
                        />
                        <CommandItem
                            cmd="bch-agent wallet save <mnemonic>"
                            desc="Securely encrypt and store your seed phrase in the local vault."
                        />
                        <CommandItem
                            cmd="bch-agent deploy <name>"
                            desc="Instantiate your agent on-chain and get its unique CashAddr."
                        />
                    </div>
                </div>
            )
        },
        'agent-types': {
            title: 'Agent Templates',
            icon: Layers,
            content: (
                <div className="space-y-8">
                    <h2 className="text-3xl font-bold text-white mb-4">4 Native Agent Architectures</h2>
                    <div className="grid grid-cols-1 gap-6">
                        <AgentTypeItem
                            type="DeFi Agent"
                            desc="Optimized for liquidity management and automated swaps. Includes slippage protection logic."
                            color="#00E339"
                        />
                        <AgentTypeItem
                            type="NFT Agent"
                            desc="Manage CashToken identiy NFTs. Updates state commitments based on AI logic."
                            color="#3b82f6"
                        />
                        <AgentTypeItem
                            type="Social Agent"
                            desc="Tipping bot and on-chain messaging. Great for DAO notifications and micro-payments."
                            color="#a855f7"
                        />
                        <AgentTypeItem
                            type="Vault Agent"
                            desc="High-security treasury management with time-locks and multi-sig support."
                            color="#f59e0b"
                        />
                    </div>
                </div>
            )
        }
    };

    return (
        <div className="min-h-screen bg-[#070708] text-white flex flex-col font-['Outfit']">
            {/* Hero Section */}
            <header className="py-12 px-6 max-w-7xl mx-auto w-full flex items-center justify-between gap-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00E339]/10 border border-[#00E339]/20 text-[#00E339] text-sm font-medium mb-8">
                        <Zap size={14} />
                        <span>Version 1.0.0 Online</span>
                    </div>
                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                        Build Autonomous <span className="text-gradient">AI Entities</span> on BCH
                    </h1>
                    <p className="text-lg text-[#929292] mb-10 leading-relaxed">
                        The standard SDK and CLI for orchestrating CashScript covenants with LLM brains. Decentralized, secure, and autonomous.
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="hidden lg:block w-72 h-72 rounded-[40px] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,227,57,0.15)] bg-gradient-to-br from-[#00E339]/10 to-transparent p-1"
                >
                    <div className="w-full h-full rounded-[38px] overflow-hidden bg-black/40 backdrop-blur-3xl">
                        <img src={logo} alt="BCH Agent Framework Logo" className="w-full h-full object-cover" />
                    </div>
                </motion.div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-12 pb-24">
                {/* Sidebar Nav */}
                <aside className="lg:col-span-1 border-r border-white/5 pr-8 space-y-2">
                    {Object.entries(sections).map(([key, section]: [string, any]) => {
                        const Icon = section.icon;
                        return (
                            <button
                                key={key}
                                onClick={() => setActiveSection(key)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === key
                                    ? 'bg-[#00E339]/10 text-[#00E339] border border-[#00E339]/20'
                                    : 'text-[#929292] hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Icon size={18} />
                                <span className="font-semibold">{section.title}</span>
                                {activeSection === key && <ChevronRight size={16} className="ml-auto" />}
                            </button>
                        )
                    })}
                </aside>

                {/* Content Section */}
                <section className="lg:col-span-3 min-h-[500px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="p-8 rounded-3xl bg-white/[0.02] border border-white/5"
                        >
                            {sections[activeSection].content}
                        </motion.div>
                    </AnimatePresence>
                </section>
            </main>

            <style>{`
        .text-gradient {
          background: linear-gradient(90deg, #00E339 0%, #00B32D 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
        </div>
    );
};

const FeatureCard = ({ title, desc, icon: Icon }: any) => (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
        <div className="w-12 h-12 rounded-xl bg-[#00E339]/10 flex items-center justify-center mb-4 group-hover:bg-[#00E339]/20 transition-all">
            <Icon className="text-[#00E339]" size={24} />
        </div>
        <h4 className="text-white font-bold mb-2">{title}</h4>
        <p className="text-[#929292] text-sm">{desc}</p>
    </div>
);

const CommandItem = ({ cmd, desc }: any) => (
    <div className="flex flex-col gap-2 p-4 rounded-xl bg-black/40 border border-white/5">
        <div className="text-[#00E339] font-mono text-sm">{cmd}</div>
        <div className="text-[#929292] text-sm">{desc}</div>
    </div>
);

const AgentTypeItem = ({ type, desc, color }: any) => (
    <div className="flex gap-6 p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
        <div className="w-2 rounded-full" style={{ backgroundColor: color }} />
        <div className="flex-1">
            <h4 className="text-xl font-bold text-white mb-2">{type}</h4>
            <p className="text-[#929292] leading-relaxed">{desc}</p>
        </div>
    </div>
);

export default DocumentationWebsite;
