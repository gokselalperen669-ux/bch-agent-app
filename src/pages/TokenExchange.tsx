import { motion } from 'framer-motion';
import {
    TrendingUp,
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
}

const mockAgents: TokenizedAgent[] = [
    { id: '1', name: 'Alpha Trader', ticker: 'ALPHA', price: '14.20 BCH', marketCap: '14,200 BCH', change24h: '+12.5%', holders: 128, volume24h: '450 BCH', description: 'High-frequency arbitrage trading agent.', riskScore: 24 },
    { id: '2', name: 'Sentiment Bot', ticker: 'SENTI', price: '5.40 BCH', marketCap: '5,400 BCH', change24h: '-2.1%', holders: 85, volume24h: '120 BCH', description: 'Social media sentiment analysis and reporting.', riskScore: 12 },
    { id: '3', name: 'DeFi Omni', ticker: 'OMNI', price: '42.00 BCH', marketCap: '42,000 BCH', change24h: '+5.8%', holders: 342, volume24h: '1,200 BCH', description: 'Cross-protocol yield farming optimizer.', riskScore: 45 },
    { id: '4', name: 'Content Gen', ticker: 'WRITER', price: '2.10 BCH', marketCap: '2,100 BCH', change24h: '+0.5%', holders: 42, volume24h: '15 BCH', description: 'Autonomous content generation for blogs.', riskScore: 8 }
];

const TradingRow = ({ agent }: { agent: TokenizedAgent }) => (
    <motion.tr
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
            <div className="flex items-center justify-end gap-1.5">
                <Users size={12} className="text-text-secondary" />
                <span className="text-xs font-bold text-white">{agent.holders}</span>
            </div>
        </td>
        <td className="py-4 px-6 text-right">
            <button className="px-4 py-2 bg-primary-color/10 border border-primary-color/20 text-primary-color text-[10px] font-bold rounded-lg hover:bg-primary-color hover:text-black transition-all uppercase tracking-widest">
                Trade
            </button>
        </td>
    </motion.tr>
);

const TokenExchange = () => {
    return (
        <div className="space-y-8 pb-20">
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

            <div className="flex flex-col gap-6">
                <div className="flex items-end justify-between trading-terminal p-10 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                        <TrendingUp size={200} className="text-primary-color" />
                    </div>
                    <div className="relative z-10 w-full">
                        <h1 className="text-3xl font-black font-title tracking-tight text-white mb-2 uppercase glow-text-primary">Agent Equity Exchange</h1>
                        <p className="text-text-secondary text-sm max-w-2xl">
                            Institutional-grade trading terminal for autonomous agent equity tokens.
                            Participate in the growth of on-chain intelligence through specialized BCH CashTokens.
                        </p>

                        <div className="flex flex-wrap gap-4 mt-8">
                            <div className="relative flex-1 max-w-md">
                                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                                <input
                                    type="text"
                                    placeholder="Search agents by name or ticker..."
                                    className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary-color transition-all text-sm"
                                />
                            </div>
                            <button className="px-8 py-4 bg-primary-color text-black font-extrabold rounded-2xl flex items-center gap-2 shadow-xl shadow-primary-color/20 transition-transform hover:scale-105">
                                <Zap size={18} fill="currentColor" />
                                LAUNCH NEW AGENT
                            </button>
                        </div>
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
                                    <th className="py-4 px-6 text-[10px] text-text-secondary uppercase font-bold tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockAgents.map(agent => (
                                    <TradingRow key={agent.id} agent={agent} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 bg-white/[0.02] text-center border-t border-white/5">
                        <button className="text-[10px] font-bold text-text-secondary hover:text-white transition-colors uppercase tracking-widest">
                            View all 1,242 on-chain agents
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TokenExchange;
