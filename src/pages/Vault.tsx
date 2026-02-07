import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Zap,
    Activity,
    Lock,
    Wallet as WalletIcon,
    Copy,
    Loader,
    Shield,
    Check,
    Bot,
    Search,
    ChevronDown,
    ArrowUpRight,
    ArrowDownLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { type Wallet, type Agent } from '../types';

const Vault: React.FC = () => {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const [unlockedWallets, setUnlockedWallets] = useState<Set<string>>(new Set());
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
    const [showUnlockModal, setShowUnlockModal] = useState(false);
    const [unlockMnemonic, setUnlockMnemonic] = useState('');
    const [viewMode, setViewMode] = useState<'all' | 'personal' | 'agent'>('all');

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.token) return;
            try {
                const [walletRes, agentRes] = await Promise.all([
                    fetch('http://localhost:4000/wallets', { headers: { 'Authorization': `Bearer ${user.token}` } }),
                    fetch('http://localhost:4000/agents', { headers: { 'Authorization': `Bearer ${user.token}` } })
                ]);

                if (walletRes.ok) setWallets(await walletRes.json());
                if (agentRes.ok) setAgents(await agentRes.json());
            } catch (e) {
                console.error("Failed to fetch vault data", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const confirmUnlock = () => {
        if (unlockMnemonic.split(' ').length >= 12) {
            if (selectedWallet) {
                setUnlockedWallets(prev => new Set(prev).add(selectedWallet.id));
                setShowUnlockModal(false);
                setUnlockMnemonic('');
            }
        } else {
            alert("Minimum 12 words required");
        }
    };

    const filteredWallets = wallets.filter(w => {
        if (viewMode === 'personal') return !w.agentId;
        if (viewMode === 'agent') return !!w.agentId;
        return true;
    });

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 overflow-hidden">
                <div className="space-y-2">
                    <h3 className="text-4xl font-black font-title tracking-tighter uppercase">Secure Vault</h3>
                    <p className="text-text-secondary text-base">On-chain asset management for humans and autonomous agents.</p>
                </div>

                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                    <button
                        onClick={() => setViewMode('all')}
                        className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'all' ? 'bg-primary-color text-black shadow-lg shadow-primary-color/20' : 'text-text-secondary hover:text-white'}`}
                    >
                        ALL ASSETS
                    </button>
                    <button
                        onClick={() => setViewMode('personal')}
                        className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'personal' ? 'bg-primary-color text-black' : 'text-text-secondary hover:text-white'}`}
                    >
                        PERSONAL
                    </button>
                    <button
                        onClick={() => setViewMode('agent')}
                        className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'agent' ? 'bg-primary-color text-black' : 'text-text-secondary hover:text-white'}`}
                    >
                        AGENT MANAGED
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-20">
                    <Loader className="animate-spin text-primary-color" size={40} />
                </div>
            ) : filteredWallets.length === 0 ? (
                <div className="glass-panel p-20 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                        <WalletIcon size={40} className="text-text-secondary opacity-20" />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-2xl font-bold">No Records Identified</h4>
                        <p className="text-text-secondary max-w-sm mx-auto text-sm leading-relaxed">
                            No wallets matching the current filter were found. Sync your personal wallet or deploy an agent in the Lab.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {filteredWallets.map((wallet) => {
                        const managingAgent = agents.find(a => a.id === wallet.agentId);
                        const isUnlocked = unlockedWallets.has(wallet.id);

                        return (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                key={wallet.id}
                                className={`glass-panel p-8 relative overflow-hidden border-l-4 transition-all duration-500 ${wallet.agentId ? 'border-l-blue-500 bg-blue-500/[0.01]' : 'border-l-primary-color bg-primary-color/[0.01]'}`}
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                                    {wallet.agentId ? <Bot size={120} /> : <Shield size={120} />}
                                </div>

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${wallet.agentId ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-primary-color/10 border-primary-color/20 text-primary-color'}`}>
                                                {wallet.agentId ? <Bot size={24} /> : <Shield size={24} />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-lg font-black tracking-tight text-white uppercase">{wallet.name}</p>
                                                    {isUnlocked && <div className="px-2 py-0.5 bg-green-500/20 text-green-500 text-[8px] font-black rounded uppercase tracking-widest border border-green-500/30">Active Session</div>}
                                                </div>
                                                <div
                                                    onClick={() => copyToClipboard(wallet.address)}
                                                    className="flex items-center gap-2 mt-1 cursor-pointer group/addr"
                                                >
                                                    <p className="text-[11px] font-mono text-text-secondary group-hover/addr:text-white transition-colors">
                                                        {wallet.address.slice(0, 12)}...{wallet.address.slice(-8)}
                                                    </p>
                                                    <Copy size={10} className="text-text-secondary group-hover/addr:text-primary-color" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-[10px] text-text-secondary uppercase font-black tracking-widest opacity-60">Confirmed Balance</p>
                                            <p className="text-2xl font-black text-white mt-1">
                                                {wallet.balance || '0.00'} <span className={`text-sm ${wallet.agentId ? 'text-blue-400' : 'text-primary-color'}`}>BCH</span>
                                            </p>
                                        </div>
                                    </div>

                                    {wallet.agentId && (
                                        <div className="mb-8 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                                    <Activity size={16} className="text-blue-400" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] text-text-secondary uppercase font-black tracking-widest">Managed By</p>
                                                    <p className="text-xs font-bold text-white">{managingAgent?.name || 'Autonomous Agent'}</p>
                                                </div>
                                            </div>
                                            <div className="px-3 py-1 bg-blue-500/10 rounded-lg text-[9px] font-black group cursor-pointer hover:bg-blue-500/20 transition-all border border-blue-500/20 text-blue-400 uppercase tracking-widest">
                                                View Logs
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-auto grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <ActionButton icon={ArrowDownLeft} label="Deposit" onClick={() => { }} bg="bg-white/5 hover:bg-white/10" />
                                        <ActionButton icon={ArrowUpRight} label="Withdraw" onClick={() => {
                                            if (!isUnlocked) {
                                                setSelectedWallet(wallet);
                                                setShowUnlockModal(true);
                                            } else {
                                                alert("Withdrawal sequence initiated.");
                                            }
                                        }} bg="bg-white/5 hover:bg-white/10" />
                                        <ActionButton icon={Activity} label="Activity" onClick={() => { }} bg="bg-white/5 hover:bg-white/10" />
                                        <ActionButton icon={Lock} label="Control" onClick={() => { }} bg="bg-white/5 hover:bg-white/10" />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Unlock Modal */}
            <AnimatePresence>
                {showUnlockModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="glass-panel w-full max-w-md p-10 border border-primary-color/20 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                                <Lock size={120} className="text-primary-color" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-1.5 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-primary-color animate-pulse" />
                                    <span className="text-[10px] font-black text-primary-color uppercase tracking-[0.3em]">Security Protocol 84-A</span>
                                </div>
                                <h3 className="text-2xl font-black mb-1 text-white uppercase tracking-tight">Unlock {selectedWallet?.name}</h3>
                                <p className="text-sm text-text-secondary mb-8">Authorizing signing capability for this session.</p>

                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] uppercase font-black text-text-secondary mb-3 block tracking-widest">Master Mnemonic Phase</label>
                                        <textarea
                                            value={unlockMnemonic}
                                            onChange={(e) => setUnlockMnemonic(e.target.value)}
                                            placeholder="enter 12 or 24 word phrase..."
                                            className="w-full h-32 bg-black/60 border border-white/10 rounded-2xl p-5 text-sm font-mono focus:border-primary-color focus:bg-primary-color/[0.03] outline-none resize-none transition-all placeholder:text-white/10"
                                        />
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => {
                                                setShowUnlockModal(false);
                                                setUnlockMnemonic('');
                                            }}
                                            className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all"
                                        >
                                            Terminate
                                        </button>
                                        <button
                                            onClick={confirmUnlock}
                                            className="flex-3 py-4 bg-primary-color text-black rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-primary-color/90 shadow-xl shadow-primary-color/20 transition-all"
                                        >
                                            Authorize Access
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-center text-text-secondary opacity-40 font-bold uppercase tracking-widest">
                                        End-to-end encrypted session • No persistence
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ActionButton = ({ icon: Icon, label, onClick, bg }: { icon: React.ElementType, label: string, onClick: () => void, bg: string }) => (
    <button
        onClick={onClick}
        className={`p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-2 transition-all group ${bg}`}
    >
        <Icon size={20} className="text-text-secondary group-hover:text-white transition-all group-hover:scale-110" />
        <span className="text-[9px] font-black uppercase text-text-secondary group-hover:text-white transition-colors tracking-tighter">{label}</span>
    </button>
);

export default Vault;
