import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    Zap,
    TrendingUp
} from 'lucide-react';
import { getApiUrl } from '../config';

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
];

const TokenExchange = () => {
    const [agents, setAgents] = useState<TokenizedAgent[]>([]);
    const [bchPrice, setBchPrice] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isBuying, setIsBuying] = useState<TokenizedAgent | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const priceRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd');
                const priceData = await priceRes.json();
                setBchPrice(priceData['bitcoin-cash'].usd);

                const agentsRes = await fetch(getApiUrl('/public/agents'));
                const agentsData = await agentsRes.json();

                const mappedAgents = agentsData.map((a: any) => ({
                    id: a.id,
                    name: a.name,
                    ticker: a.ticker || 'AGNT',
                    price: '0.0001 BCH',
                    marketCap: '100 BCH',
                    change24h: '+0.0%',
                    holders: a.holders || 1,
                    volume24h: '0 BCH',
                    description: a.description || 'Autonomous agent on Bitcoin Cash.',
                    riskScore: 0,
                    bondingCurveProgress: a.bondingCurveProgress || 15,
                    isGraduated: a.isGraduated || false
                }));

                setAgents(mappedAgents.length > 0 ? mappedAgents : mockAgents);
            } catch (err) {
                console.error(err);
                setAgents(mockAgents);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-16 h-16 border-4 border-primary-color/20 border-t-primary-color rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20 text-white animate-fade-in">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp size={18} className="text-primary-color" />
                        <span className="text-[10px] font-black text-primary-color uppercase tracking-[0.3em]">Institutional Liquidity Layer</span>
                    </div>
                    <h1 className="text-4xl font-black font-title tracking-tight italic">TOKEN EXCHANGE</h1>
                </div>

                <div className="flex gap-4 p-3 bg-white/5 border border-white/5 rounded-2xl">
                    <div className="text-right">
                        <p className="text-[9px] text-text-secondary uppercase font-bold tracking-widest">BCH Index</p>
                        <p className="text-lg font-black text-white">${bchPrice.toLocaleString()}</p>
                    </div>
                    <div className="w-[1px] bg-white/10 mx-2" />
                    <div className="text-right">
                        <p className="text-[9px] text-text-secondary uppercase font-bold tracking-widest">Global Vol</p>
                        <p className="text-lg font-black text-primary-color">45.2k BCH</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Featured Bonding Curve */}
                <div className="lg:col-span-3">
                    <div className="trading-terminal p-10 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none text-primary-color">
                            <Zap size={200} />
                        </div>

                        <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
                            <div className="flex-1 space-y-6">
                                <span className="px-3 py-1 bg-primary-color/20 border border-primary-color/30 text-primary-color text-[10px] font-black uppercase rounded-lg">High Graduation Probability</span>
                                <h2 className="text-5xl font-black italic tracking-tighter">ALPHA TRADER <span className="text-primary-color">$EGNT</span></h2>
                                <p className="text-text-secondary leading-relaxed max-w-md">
                                    The leading arbitrage agent on Testnet4. Bonding curve nearing completion. Automatic DEX listing at 100%.
                                </p>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs font-bold text-white uppercase italic">
                                        <span>Curve Alpha-1 Progress</span>
                                        <span>68.4%</span>
                                    </div>
                                    <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                                        <div className="h-full bg-primary-color shadow-[0_0_20px_rgba(0,255,163,0.4)] rounded-full transition-all" style={{ width: '68.4%' }} />
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsBuying(agents[0])}
                                    className="w-full md:w-auto px-10 py-4 bg-primary-color text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.05] transition-transform shadow-2xl shadow-primary-color/20"
                                >
                                    <TrendingUp size={18} /> INJECT LIQUIDITY
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full md:w-64">
                                {[
                                    { label: 'MCAP', value: '4.2k' },
                                    { label: 'HOLDERS', value: '128' },
                                    { label: 'LIQ', value: '450' },
                                    { label: 'VOL', value: '12.4' }
                                ].map((s, i) => (
                                    <div key={i} className="p-4 bg-black/60 border border-white/5 rounded-2xl flex flex-col items-center">
                                        <p className="text-[8px] text-text-tertiary uppercase font-black mb-1">{s.label}</p>
                                        <p className="text-lg font-black">{s.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Orderbook style feed */}
                <div className="glass-panel p-6 space-y-4 border-white/5">
                    <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                        <Activity size={14} className="text-primary-color" /> Chain Events
                    </h3>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scroll pr-2">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="flex justify-between items-center text-[10px] border-b border-white/5 pb-3">
                                <div>
                                    <span className={i % 2 === 0 ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>{i % 2 === 0 ? 'BUY' : 'SELL'}</span>
                                    <span className="text-white ml-2 font-mono">0.{i}4 BCH</span>
                                </div>
                                <span className="text-text-tertiary font-mono">2s ago</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Trading Table */}
            <div className="glass-panel overflow-hidden border-white/5">
                <table className="w-full text-left">
                    <thead className="bg-white/[0.02] border-b border-white/5">
                        <tr>
                            <th className="py-5 px-8 text-[10px] text-text-secondary uppercase font-black tracking-widest">Agent Token</th>
                            <th className="py-5 px-8 text-[10px] text-text-secondary uppercase font-black tracking-widest text-right">Price</th>
                            <th className="py-5 px-8 text-[10px] text-text-secondary uppercase font-black tracking-widest text-right">24h</th>
                            <th className="py-5 px-8 text-[10px] text-text-secondary uppercase font-black tracking-widest text-right">Progress</th>
                            <th className="py-5 px-8 text-[10px] text-text-secondary uppercase font-black tracking-widest text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {agents.map(agent => (
                            <tr key={agent.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                <td className="py-5 px-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-color/20 to-blue-500/20 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                                            {agent.ticker[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm tracking-tight">{agent.name}</p>
                                            <p className="text-[10px] font-mono text-text-tertiary lowercase tracking-tighter">${agent.ticker}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-5 px-8 text-right font-mono text-xs font-bold">{agent.price}</td>
                                <td className={`py-5 px-8 text-right font-bold text-xs ${agent.change24h.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                                    {agent.change24h}
                                </td>
                                <td className="py-5 px-8">
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-[8px] font-black uppercase text-text-tertiary">{agent.bondingCurveProgress}%</span>
                                        <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary-color" style={{ width: `${agent.bondingCurveProgress}%` }} />
                                        </div>
                                    </div>
                                </td>
                                <td className="py-5 px-8 text-right">
                                    <button
                                        onClick={() => setIsBuying(agent)}
                                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black hover:bg-primary-color hover:text-black transition-all"
                                    >
                                        TRADE
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AnimatePresence>
                {isBuying && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="glass-panel max-w-sm w-full p-8 border-primary-color/30 text-center space-y-6"
                        >
                            <div className="w-20 h-20 bg-primary-color/10 rounded-full flex items-center justify-center mx-auto border-2 border-primary-color/20 mb-4">
                                <Activity size={32} className="text-primary-color animate-pulse" />
                            </div>
                            <h3 className="text-2xl font-black italic uppercase">BROADCASTING...</h3>
                            <p className="text-sm text-text-secondary font-medium">
                                Injecting <span className="text-white">0.5 BCH</span> into the ${isBuying.ticker} bonding curve on Testnet4.
                            </p>
                            <div className="p-3 bg-black/40 rounded-xl font-mono text-[9px] text-text-tertiary break-all border border-white/5">
                                RAW_TX: 0x8f27a...{Math.random().toString(36).substring(7)}
                            </div>
                            <button onClick={() => setIsBuying(null)} className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10">CANCEL STREAM</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TokenExchange;
