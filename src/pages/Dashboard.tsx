import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Zap, Shield, Activity, Eye, ChevronRight, Globe, Terminal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { type Agent } from '../types';

const StatsCard = ({ icon: Icon, label, value, delta }: { icon: React.ElementType, label: string, value: string, delta: string }) => (
    <motion.div
        whileHover={{ y: -4 }}
        className="glass-panel p-6 flex flex-col gap-1 relative overflow-hidden group cursor-default shadow-lg shadow-black/20"
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

const Dashboard: React.FC = () => {
    const [activities, setActivities] = useState<Agent[]>([]);
    const [stats, setStats] = useState({ agents: '0', txs: '0', value: '0 BCH' });
    const { user } = useAuth();

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user?.token) return;
            try {
                const agentsRes = await fetch('http://localhost:4000/agents', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (agentsRes.ok) {
                    const agents = await agentsRes.json();
                    setActivities(agents.slice(0, 4)); // Show last 4 agents as "activities" for now
                    setStats(prev => ({ ...prev, agents: agents.length.toString() }));
                }
            } catch (e) {
                console.error('Dashboard fetch error:', e);
            }
        };
        fetchDashboardData();
    }, [user]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard icon={Bot} label="Active Agents" value={stats.agents} delta="+1" />
            <StatsCard icon={Zap} label="BCH Transactions" value="1,284" delta="+12%" />
            <StatsCard icon={Shield} label="Contract Value" value="42.5 BCH" delta="Stable" />

            <div className="md:col-span-2 glass-panel p-8 min-h-[400px] flex flex-col shadow-lg shadow-black/20">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-lg font-bold">Recent Agent Activity</h3>
                        <p className="text-xs text-text-secondary mt-1">Real-time autonomous interactions on-chain.</p>
                    </div>
                    <button className="text-xs font-bold text-primary-color hover:underline bg-primary-color/5 px-4 py-2 rounded-lg border border-primary-color/10" style={{ color: 'var(--primary-color)' }}>View All Logs</button>
                </div>
                <div className="space-y-4 flex-1">
                    {activities.length > 0 ? activities.map((agent, i) => (
                        <div key={agent.id || i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all group cursor-pointer">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-primary-color/10 group-hover:border-primary-color/20 transition-all">
                                <Activity size={18} className="text-text-secondary group-hover:text-primary-color" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold tracking-tight">{agent.name || `Strategy Alpha #0${i + 1}`} <span className="text-text-secondary text-xs font-normal ml-2 tracking-normal">executed <span className="text-primary-color">SYNC_ACTION</span></span></p>
                                <div className="flex items-center gap-3 mt-1.5">
                                    <span className="text-[9px] text-text-secondary font-mono uppercase tracking-widest px-2 py-0.5 bg-black/40 rounded border border-white/5">{agent.id}</span>
                                    <span className="text-[9px] text-text-secondary font-bold uppercase">Just now</span>
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
                    )) : (
                        <div className="flex-1 flex flex-col items-center justify-center opacity-40">
                            <Terminal size={40} className="mb-4" />
                            <p className="text-sm font-medium">No activity detected. Connect CLI to sync agents.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="glass-panel p-8 flex flex-col gap-8 shadow-lg shadow-black/20">
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
};

export default Dashboard;
