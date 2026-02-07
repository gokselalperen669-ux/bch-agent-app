import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bot, Wallet, Shield, Zap, Terminal, Key, Copy, Check } from 'lucide-react';

const Profile: React.FC = () => {
    const { user } = useAuth();
    const [copied, setCopied] = useState(false);
    const [stats, setStats] = useState({ agents: 0, wallets: 0 });

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.token) return;
            try {
                const headers = { 'Authorization': `Bearer ${user.token}` };
                const agentsRes = await fetch('http://localhost:4000/agents', { headers });
                const walletsRes = await fetch('http://localhost:4000/wallets', { headers });

                if (agentsRes.ok && walletsRes.ok) {
                    const agents = await agentsRes.json();
                    const wallets = await walletsRes.json();
                    setStats({
                        agents: agents.length,
                        wallets: wallets.length
                    });
                }
            } catch (e) {
                console.error('Error fetching profile stats:', e);
            }
        };
        fetchData();
    }, [user]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-10">
            {/* Header Profile Section */}
            <div className="glass-panel p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <Shield size={200} className="text-primary-color" />
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-primary-color to-accent-color p-[2px]">
                        <div className="w-full h-full rounded-3xl bg-black flex items-center justify-center overflow-hidden">
                            <img src={user?.avatar} alt="Avatar" className="w-full h-full" />
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                            <h2 className="text-4xl font-title font-extrabold tracking-tight">{user?.name}</h2>
                            <span className="px-3 py-1 rounded-full bg-primary-color/10 border border-primary-color/20 text-[10px] font-bold text-primary-color uppercase w-fit mx-auto md:mx-0">
                                Authorized Operator
                            </span>
                        </div>
                        <p className="text-text-secondary font-medium mb-6">{user?.email}</p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl cursor-default group">
                                <Terminal size={14} className="text-text-secondary group-hover:text-primary-color transition-colors" />
                                <span className="text-xs font-mono text-text-secondary">Terminal ID: <span className="text-white">{user?.id}</span></span>
                            </div>
                            <div
                                onClick={() => copyToClipboard(user?.token || '')}
                                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-all group"
                            >
                                <Key size={14} className="text-text-secondary group-hover:text-primary-color transition-colors" />
                                <span className="text-xs font-mono text-text-secondary">Sync Token</span>
                                {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} className="text-text-secondary group-hover:text-white" />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-8 flex items-center justify-between group hover:border-primary-color/30 transition-all">
                    <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-text-secondary mb-1">Managed Agents</p>
                        <h3 className="text-4xl font-title font-extrabold">{stats.agents}</h3>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-primary-color/10 flex items-center justify-center border border-primary-color/20 group-hover:scale-110 transition-transform">
                        <Bot size={32} className="text-primary-color" />
                    </div>
                </div>

                <div className="glass-panel p-8 flex items-center justify-between group hover:border-accent-color/30 transition-all">
                    <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-text-secondary mb-1">Stored Vaults</p>
                        <h3 className="text-4xl font-title font-extrabold">{stats.wallets}</h3>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-accent-color/10 flex items-center justify-center border border-accent-color/20 group-hover:scale-110 transition-transform">
                        <Wallet size={32} className="text-accent-color" />
                    </div>
                </div>
            </div>

            {/* CLI Instruction Box */}
            <div className="glass-panel p-8 border-primary-color/20 bg-primary-color/[0.02]">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary-color/10">
                        <Zap size={24} className="text-primary-color" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-lg font-bold mb-2">Connect your CLI tool</h4>
                        <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                            Use your profile credentials to authorize the <code className="text-primary-color bg-black/40 px-2 py-0.5 rounded">bch-agent</code> CLI.
                            Once connected, all agents and wallets created via terminal will automatically sync here.
                        </p>
                        <div className="bg-black/60 rounded-xl p-5 font-mono text-sm border border-white/5 relative group">
                            <div className="flex items-center justify-between text-[10px] text-text-secondary mb-3 uppercase tracking-widest font-bold">
                                <span>Terminal Session</span>
                                <span className="text-green-500 animate-pulse">Secure Layer Active</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-primary-color/50">$</span>
                                <code className="text-white">bch-agent login</code>
                            </div>
                            <button
                                onClick={() => copyToClipboard('bch-agent login')}
                                className="absolute right-4 bottom-4 p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/5 rounded-lg"
                            >
                                <Copy size={16} className="text-text-secondary" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
