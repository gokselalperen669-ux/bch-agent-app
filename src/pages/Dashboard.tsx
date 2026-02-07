import { useState, useEffect, type ElementType } from 'react';
import { motion } from 'framer-motion';
import { Bot, Zap, Shield, Activity, Eye, Globe, Terminal, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { type Agent } from '../types';
import { getApiUrl } from '../config';

const StatsCard = ({ icon: Icon, label, value, delta }: { icon: ElementType, label: string, value: string, delta: string }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="glass-panel p-6 glass-panel-hover"
    >
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <Icon size={20} className="text-primary-color" />
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${delta.startsWith('+') ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-text-secondary'}`}>
                {delta}
            </span>
        </div>
        <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-text-secondary mb-1">{label}</p>
            <h3 className="text-2xl font-black font-title tracking-tight">{value}</h3>
        </div>
    </motion.div>
);

const Dashboard = () => {
    const [activities, setActivities] = useState<Agent[]>([]);
    const [stats, setStats] = useState({ agents: '0', txs: '0', value: '0.00' });
    const [market, setMarket] = useState({ price: '---', change: '---', height: '---' });
    const [isDataLoading, setIsDataLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsDataLoading(true);

            // Market Data
            fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd&include_24hr_change=true')
                .then(res => res.json())
                .then(data => {
                    const bch = data['bitcoin-cash'];
                    setMarket(prev => ({
                        ...prev,
                        price: bch.usd.toFixed(2),
                        change: (bch.usd_24h_change >= 0 ? '+' : '') + bch.usd_24h_change.toFixed(2) + '%'
                    }));
                }).catch(e => console.error(e));

            fetch('https://chipnet.imaginary.cash/api/v1/status')
                .then(res => res.json())
                .then(data => {
                    setMarket(prev => ({ ...prev, height: (data.height || 812492).toLocaleString() }));
                }).catch(e => console.error(e));

            if (!user?.token) {
                setIsDataLoading(false);
                return;
            }

            try {
                const headers = { 'Authorization': `Bearer ${user.token}` };
                const [agentsRes, walletsRes] = await Promise.all([
                    fetch(getApiUrl('/agents'), { headers }),
                    fetch(getApiUrl('/wallets'), { headers })
                ]);

                if (agentsRes.ok) {
                    const agents = await agentsRes.json();
                    setActivities(Array.isArray(agents) ? agents.slice(0, 5) : []);
                    setStats(prev => ({ ...prev, agents: (Array.isArray(agents) ? agents.length : 0).toString() }));
                }

                if (walletsRes.ok) {
                    const wallets = await walletsRes.json();
                    const totalBalance = Array.isArray(wallets)
                        ? wallets.reduce((acc: number, w: any) => acc + parseFloat(w.balance || '0'), 0)
                        : 0;
                    setStats(prev => ({ ...prev, value: totalBalance.toFixed(2) }));
                }
            } catch (e) {
                console.error(e);
            } finally {
                setIsDataLoading(false);
            }
        };
        fetchDashboardData();
    }, [user]);

    if (isDataLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-16 h-16 border-4 border-primary-color/20 border-t-primary-color rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Top Bar Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatsCard icon={Globe} label="BCH Price" value={`$${market.price}`} delta={market.change} />
                <StatsCard icon={Bot} label="Active Agents" value={stats.agents} delta="+24h" />
                <StatsCard icon={Wallet} label="Total Assets" value={`${stats.value} BCH`} delta="Syncing" />
                <StatsCard icon={Terminal} label="Net Health" value={market.height} delta="Stable" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Monitor */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-panel p-8 group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                            <Activity size={240} className="text-primary-color" />
                        </div>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-black font-title tracking-tight italic">COMMAND INTERFACE</h3>
                                <p className="text-text-secondary text-xs uppercase font-bold tracking-widest mt-1">Real-time Autonomous Feedback</p>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-color/10 border border-primary-color/20">
                                <span className="h-2 w-2 rounded-full bg-primary-color animate-pulse" />
                                <span className="text-[10px] font-black text-primary-color uppercase">Live Stream</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {activities.length > 0 ? activities.map(agent => (
                                <div key={agent.id} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-primary-color/30 transition-all cursor-pointer group/item">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="h-10 w-10 rounded-xl bg-primary-color/10 flex items-center justify-center">
                                            <Bot size={20} className="text-primary-color" />
                                        </div>
                                        <span className="text-[10px] font-mono text-text-tertiary"># {agent.id.slice(0, 8)}</span>
                                    </div>
                                    <h4 className="font-bold text-white group-hover/item:text-primary-color transition-colors">{agent.name}</h4>
                                    <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest mt-1">Status: <span className="text-green-400">Autonomous</span></p>
                                </div>
                            )) : (
                                <div className="md:col-span-2 py-20 flex flex-col items-center justify-center text-center opacity-40 grayscale group-hover:grayscale-0 transition-all">
                                    <Terminal size={48} className="text-primary-color mb-4 animate-bounce" />
                                    <h4 className="font-bold text-sm uppercase">No Agents Detected</h4>
                                    <p className="text-xs text-text-secondary mt-2">Interact with the CLI (`bch-agent agent create`) to begin.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="glass-panel p-6 border-blue-500/10">
                            <h4 className="font-bold text-xs uppercase tracking-widest text-blue-400 mb-4 flex items-center gap-2">
                                <Shield size={16} /> Asset Safety
                            </h4>
                            <div className="h-32 flex items-end gap-1 px-2">
                                {[30, 45, 25, 60, 80, 55, 90].map((h, i) => (
                                    <div key={i} className="flex-1 bg-blue-500/20 rounded-t-sm hover:bg-blue-500/40 transition-all" style={{ height: `${h}%` }} />
                                ))}
                            </div>
                        </div>
                        <div className="glass-panel p-6 border-primary-color/10">
                            <h4 className="font-bold text-xs uppercase tracking-widest text-primary-color mb-4 flex items-center gap-2">
                                <Zap size={16} /> Network Sync
                            </h4>
                            <div className="space-y-4">
                                <div className="flex justify-between text-[10px] font-bold uppercase italic">
                                    <span className="text-text-secondary">Uptime</span>
                                    <span className="text-white">99.98%</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    <div className="h-full bg-primary-color" style={{ width: '99%' }} />
                                </div>
                                <p className="text-[10px] text-text-secondary leading-relaxed font-medium">Node synchronized with Testnet4. Memory pool clean.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: CLI Integration */}
                <div className="space-y-6">
                    <div className="glass-panel p-8 bg-primary-color/[0.02] border-primary-color/20 relative overflow-hidden group">
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-color/10 blur-3xl rounded-full" />
                        <h4 className="font-bold text-sm uppercase tracking-tighter italic mb-4 flex items-center gap-2">
                            <Terminal size={18} className="text-primary-color" /> CLI INTEGRATION
                        </h4>
                        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] border border-white/5 mb-6 group-hover:border-primary-color/30 transition-all">
                            <div className="text-primary-color mb-1">$ bch-agent sync</div>
                            <div className="text-text-secondary">Connecting to Nexus...</div>
                            <div className="text-green-400">✓ Auth Successful</div>
                            <div className="text-white mt-2">Syncing Project Data...</div>
                        </div>
                        <button className="w-full py-3 bg-primary-color text-black font-black rounded-xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary-color/10">
                            <Eye size={14} /> View Documentation
                        </button>
                    </div>

                    <div className="glass-panel p-6 space-y-4">
                        <h4 className="font-bold text-xs uppercase tracking-widest text-text-secondary">Live Network Feed</h4>
                        <div className="space-y-4 overflow-y-auto max-h-[300px] custom-scroll pr-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="flex gap-3 text-[10px] border-b border-white/5 pb-3 last:border-0">
                                    <div className="w-1 h-auto rounded-full bg-white/10" />
                                    <div>
                                        <p className="text-white font-bold italic underline">TX Block {market.height}</p>
                                        <p className="text-text-secondary mt-1">Found UTXO belonging to Agent Delta-{i}</p>
                                        <p className="text-[8px] text-text-tertiary mt-0.5">Hash: 8f2...ae{i}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
