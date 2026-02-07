import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Search,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    BarChart3,
    Globe,
    Lock,
    Zap
} from 'lucide-react';

interface TokenizedAgent {
    id: string;
    name: string;
    ticker: string;
    price: string;
    marketCap: string;
    change24h: string;
    holders: number;
    volume24h: string;
    description: string;
    riskScore: number;
    bondingCurveProgress: number;
    isGraduated: boolean;
}

const mockAgents: TokenizedAgent[] = [
    { id: '1', name: 'Alpha Trader', ticker: 'EGNT', price: '0.0042 BCH', marketCap: '4,200 BCH', change24h: '+12.5%', holders: 128, volume24h: '450 BCH', description: 'High-frequency arbitrage trading agent.', riskScore: 24, bondingCurveProgress: 68, isGraduated: false },
    { id: '2', name: 'Sentiment Bot', ticker: 'SENTI', price: '0.0014 BCH', marketCap: '5,400 BCH', change24h: '-2.1%', holders: 85, volume24h: '120 BCH', description: 'Social media sentiment analysis and reporting.', riskScore: 12, bondingCurveProgress: 42, isGraduated: false },
    { id: '3', name: 'DeFi Omni', ticker: 'OMNI', price: '0.0120 BCH', marketCap: '42,000 BCH', change24h: '+5.8%', holders: 342, volume24h: '1,200 BCH', description: 'Cross-protocol yield farming optimizer.', riskScore: 45, bondingCurveProgress: 95, isGraduated: false },
    { id: '4', name: 'Content Gen', ticker: 'WRITER', price: '0.0005 BCH', marketCap: '2,100 BCH', change24h: '+0.5%', holders: 42, volume24h: '15 BCH', description: 'Autonomous content generation for blogs.', riskScore: 8, bondingCurveProgress: 12, isGraduated: false }
];

const TokenExchange = () => {
    const [agents, setAgents] = useState<TokenizedAgent[]>([]);
    const [bchPrice, setBchPrice] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isBuying, setIsBuying] = useState<TokenizedAgent | null>(null);
    const [txStatus, setTxStatus] = useState<'idle' | 'processing' | 'success'>('idle');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch BCH Price (Real Data)
                const priceRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd');
                const priceData = await priceRes.json();
                setBchPrice(priceData['bitcoin-cash'].usd);

                // 2. Fetch Tokenized Agents (Real Data from our API)
                const agentsRes = await fetch('http://localhost:4000/public/agents');
                const agentsData = await agentsRes.json();

                // Map API data to our UI structure
                const mappedAgents = agentsData.map((a: any) => ({
                    id: a.id,
                    name: a.name,
                    ticker: a.ticker || (a.tokenization?.ticker) || 'UNKN',
                    price: '0.0001 BCH', // Default starting price on curve
                    marketCap: '100 BCH',
                    change24h: '+0.0%',
                    holders: a.holders || 1,
                    volume24h: '0 BCH',
                    description: a.description || 'Autonomous agent on Bitcoin Cash.',
                    riskScore: 0,
                    bondingCurveProgress: a.bondingCurveProgress || 0,
                    isGraduated: a.isGraduated || false
                }));

                setAgents(mappedAgents.length > 0 ? mappedAgents : mockAgents);
            } catch (err) {
                console.error('Failed to fetch real data:', err);
                setAgents(mockAgents); // Fallback
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleBuy = async (agent: TokenizedAgent) => {
        setIsBuying(agent);
        setTxStatus('processing');
        // Simulate BCH transaction
        await new Promise(r => setTimeout(r, 2000));
        setTxStatus('success');
        await new Promise(r => setTimeout(r, 1500));
        setTxStatus('idle');
        setIsBuying(null);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-primary-color/20 border-t-primary-color rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20 text-white">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Market Cap', value: '820.4k BCH', delta: '+2.4%', icon: Globe },
                    { label: '24h Volume', value: '45.2k BCH', delta: '+12.1%', icon: BarChart3 },
                    { label: 'Active Tokens', value: '1,242', delta: '+5', icon: Activity },
                    { label: 'Protocol TVL', value: '2.8M BCH', delta: '-0.2%', icon: Lock }
                ].map((stat, i) => (
                    <div key={i} className="glass-panel p-5 space-y-2 border-white/5 bg-black/20">
                        <div className="flex justify-between items-center text-text-secondary">
                            <stat.icon size={16} />
                            <span className={`text-[10px] font-bold ${stat.delta.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                                {stat.delta}
                            </span>
                        </div>
                        <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">{stat.label}</p>
                        <p className="text-xl font-black text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="trading-terminal p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8 border border-primary-color/20 bg-black/40">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                            <Zap size={160} className="text-primary-color" />
                        </div>

                        <div className="relative z-10 w-full md:w-1/2 space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-primary-color text-black text-[9px] font-black uppercase rounded">King of the Hill</span>
                                <span className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">Graduating Soon</span>
                            </div>
                            <h2 className="text-4xl font-black text-white italic">ALPHA TRADER ($EGNT)</h2>
                            <p className="text-sm text-text-secondary leading-relaxed">
                                Currenly leading the curve with 68% progress. Once it hits 100%,
                                liquidity will be burnt and listed on Jedex DEX automatically.
                            </p>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-white">
                                    <span>Bonding Curve Progress</span>
                                    <span>68.4%</span>
                                </div>
                                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                                    <div className="h-full bg-primary-color shadow-[0_0_20px_rgba(0,255,163,0.5)]" style={{ width: '68.4%' }} />
                                </div>
                            </div>
                            <button
                                onClick={() => handleBuy(agents[0] || mockAgents[0])}
                                className="w-full py-4 bg-primary-color text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-lg shadow-primary-color/20"
                            >
                                BUY ${agents[0]?.ticker || 'EGNT'} ON CURVE
                            </button>
                        </div>

                        <div className="w-full md:w-1/2 grid grid-cols-2 gap-4 relative z-10">
                            {[
                                { label: 'BCH Price', value: `$${bchPrice.toLocaleString()}` },
                                { label: 'Holders', value: agents[0]?.holders || '0' },
                                { label: 'Liquidity', value: '450 BCH' },
                                { label: 'Market Cap', value: agents[0]?.marketCap || '0 BCH' }
                            ].map((s, i) => (
                                <div key={i} className="bg-black/40 border border-white/5 p-4 rounded-2xl">
                                    <p className="text-[9px] text-text-secondary uppercase font-bold tracking-widest mb-1">{s.label}</p>
                                    <p className="text-lg font-black text-white tracking-tight">{s.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-6 flex flex-col gap-4 border-white/5 bg-black/20">
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                        <Activity size={14} className="text-primary-color" />
                        Live Trade Feed
                    </h3>
                    <div className="space-y-4 overflow-y-auto max-h-[350px] custom-scroll pr-2">
                        {[
                            { user: 'bch...4a2', type: 'BUY', amount: '1.2 BCH', token: 'EGNT', time: '2s ago' },
                            { user: 'bch...9e1', type: 'SELL', amount: '0.5 BCH', token: 'SENTI', time: '12s ago' },
                            { user: 'bch...f10', type: 'BUY', amount: '4.8 BCH', token: 'EGNT', time: '45s ago' },
                            { user: 'bch...83b', type: 'BUY', amount: '0.1 BCH', token: 'WRITER', time: '1m ago' },
                            { user: 'bch...2c4', type: 'BUY', amount: '10.5 BCH', token: 'OMNI', time: '3m ago' },
                        ].map((t, i) => (
                            <div key={i} className="flex justify-between items-center text-[10px] border-b border-white/5 pb-2">
                                <div className="flex items-center gap-2">
                                    <span className={t.type === 'BUY' ? 'text-green-400 font-black' : 'text-red-400 font-black'}>{t.type}</span>
                                    <span className="text-white font-bold">{t.amount}</span>
                                    <span className="text-text-secondary">of</span>
                                    <span className="text-primary-color font-bold">${t.token}</span>
                                </div>
                                <span className="text-text-secondary opacity-50 font-mono">{t.time}</span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-text-secondary hover:text-white transition-all uppercase tracking-widest">
                        View All On-Chain History
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-4">
                        <button className="px-6 py-2.5 bg-primary-color/10 border border-primary-color/20 text-primary-color text-xs font-black rounded-xl uppercase tracking-widest">Trending</button>
                        <button className="px-6 py-2.5 hover:bg-white/5 text-text-secondary text-xs font-black rounded-xl uppercase tracking-widest transition-all">New Pairs</button>
                        <button className="px-6 py-2.5 hover:bg-white/5 text-text-secondary text-xs font-black rounded-xl uppercase tracking-widest transition-all">Completion</button>
                    </div>

                    <div className="relative flex-1 max-w-md">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                        <input
                            type="text"
                            placeholder="Search agents by name or ticker..."
                            className="w-full bg-black/60 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary-color transition-all text-xs text-white"
                        />
                    </div>
                </div>

                <div className="glass-panel overflow-hidden border-white/5 bg-black/20">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/[0.02] border-b border-white/5">
                                <tr>
                                    <th className="py-4 px-6 text-[10px] text-text-secondary uppercase font-bold tracking-widest">Agent Token</th>
                                    <th className="py-4 px-6 text-[10px] text-text-secondary uppercase font-bold tracking-widest text-right">Price</th>
                                    <th className="py-4 px-6 text-[10px] text-text-secondary uppercase font-bold tracking-widest text-right">24h Change</th>
                                    <th className="py-4 px-6 text-[10px] text-text-secondary uppercase font-bold tracking-widest text-right">Market Cap</th>
                                    <th className="py-4 px-6 text-[10px] text-text-secondary uppercase font-bold tracking-widest text-right hidden xl:table-cell">Holders</th>
                                    <th className="py-4 px-6 text-[10px] text-text-secondary uppercase font-bold tracking-widest text-right">Progress</th>
                                    <th className="py-4 px-6 text-[10px] text-text-secondary uppercase font-bold tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(agents.length > 0 ? agents : mockAgents).map(agent => (
                                    <motion.tr
                                        key={agent.id}
                                        whileHover={{ background: 'rgba(255,255,255,0.02)' }}
                                        className="border-b border-white/5 group hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-color/20 to-blue-500/20 border border-white/10 flex items-center justify-center font-bold text-primary-color">
                                                    {agent.ticker[0]}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white text-sm leading-tight">{agent.name}</h3>
                                                    <span className="text-[10px] text-text-secondary font-mono tracking-tighter uppercase">Token: ${agent.ticker}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 font-mono text-sm font-bold text-white text-right">
                                            {agent.price}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${agent.change24h.startsWith('+')
                                                ? 'bg-green-500/10 text-green-400'
                                                : 'bg-red-500/10 text-red-400'
                                                }`}>
                                                {agent.change24h.startsWith('+') ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                                {agent.change24h}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 font-mono text-sm text-text-secondary text-right">
                                            {agent.marketCap}
                                        </td>
                                        <td className="py-4 px-6 text-right hidden xl:table-cell">
                                            <div className="flex items-center justify-end gap-1.5 text-white">
                                                <Users size={12} className="text-text-secondary" />
                                                <span className="text-xs font-bold">{agent.holders}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="w-32 ml-auto space-y-1">
                                                <div className="flex justify-between text-[8px] font-bold text-text-secondary uppercase">
                                                    <span>Bonding Curve</span>
                                                    <span>{agent.bondingCurveProgress}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${agent.bondingCurveProgress}%` }}
                                                        transition={{ duration: 1, ease: "easeOut" }}
                                                        className="h-full bg-gradient-to-r from-primary-color to-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <button
                                                onClick={() => handleBuy(agent)}
                                                className="px-4 py-2 bg-primary-color text-black text-[10px] font-black rounded-lg hover:scale-105 transition-all uppercase tracking-widest shadow-lg shadow-primary-color/20"
                                            >
                                                BUY
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isBuying && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="glass-panel max-w-sm w-full p-8 text-center space-y-6 border-primary-color/20 bg-black/60"
                        >
                            {txStatus === 'processing' ? (
                                <>
                                    <div className="w-16 h-16 border-4 border-primary-color/20 border-t-primary-color rounded-full animate-spin mx-auto" />
                                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Broadcasting...</h3>
                                    <p className="text-sm text-text-secondary">
                                        Swapping <span className="text-white font-bold">BCH</span> for <span className="text-primary-color font-bold">${isBuying.ticker}</span>
                                    </p>
                                    <div className="p-3 bg-white/5 rounded-lg text-[10px] font-mono text-text-secondary break-all">
                                        RAW_TX: 0x{Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-primary-color flex items-center justify-center rounded-full mx-auto shadow-[0_0_30px_rgba(0,255,163,0.4)]">
                                        <Zap size={32} className="text-black" fill="currentColor" />
                                    </div>
                                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Transaction Sent!</h3>
                                    <p className="text-sm text-text-secondary">
                                        Your ${isBuying.ticker} tokens are on their way to your vault.
                                    </p>
                                    <p className="text-[10px] text-primary-color font-bold uppercase tracking-[0.2em] animate-pulse">
                                        Confirmed on Testnet4
                                    </p>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TokenExchange;
