import React from 'react';
import { motion } from 'framer-motion';
import { Globe, ArrowRight, Wallet, MessageSquare, ShoppingBag, Layers, Terminal } from 'lucide-react';

interface Platform {
    id: string;
    name: string;
    type: 'defi' | 'wallet' | 'social' | 'payment';
    description: string;
    status: 'connected' | 'available' | 'maintenance';
}

const platforms: Platform[] = [
    { id: 'jedex', name: 'JEDEX', type: 'defi', description: 'Decentralized exchange for swapping CashTokens.', status: 'available' },
    { id: 'chainbased', name: 'Chainbased', type: 'defi', description: 'Lending and yield farming protocols.', status: 'maintenance' },
    { id: 'electron', name: 'Electron Cash', type: 'wallet', description: 'Advanced SPV wallet with CashFusion support.', status: 'connected' },
    { id: 'cashonize', name: 'Cashonize', type: 'wallet', description: 'Web-based wallet for CashTokens and DeFi.', status: 'available' },
    { id: 'memo', name: 'Memo.cash', type: 'social', description: 'On-chain social network for censorship-resistant content.', status: 'connected' },
    { id: 'noise', name: 'Noise.app', type: 'social', description: 'Micro-blogging platform engaging BCH users.', status: 'available' },
    { id: 'bitpay', name: 'BitPay', type: 'payment', description: 'Leading crypto payment processor integration.', status: 'available' },
];

const PlatformCard = ({ platform }: { platform: Platform }) => {
    const getIcon = (type: string) => {
        switch (type) {
            case 'defi': return <Layers size={20} className="text-blue-400" />;
            case 'wallet': return <Wallet size={20} className="text-green-400" />;
            case 'social': return <MessageSquare size={20} className="text-purple-400" />;
            case 'payment': return <ShoppingBag size={20} className="text-orange-400" />;
            default: return <Globe size={20} />;
        }
    };

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="glass-panel p-6 flex flex-col gap-4 relative overflow-hidden group shadow-lg shadow-black/20"
        >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                {getIcon(platform.type)}
            </div>

            <div className="flex items-start justify-between">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:border-primary-color/30 group-hover:bg-primary-color/5 transition-all">
                    {getIcon(platform.type)}
                </div>
                <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${platform.status === 'connected' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        platform.status === 'maintenance' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                            'bg-white/5 text-text-secondary border-white/5'
                    }`}>
                    {platform.status}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-bold text-text-primary">{platform.name}</h3>
                <p className="text-sm text-text-secondary mt-1">{platform.description}</p>
            </div>

            <div className="mt-auto pt-4 border-t border-white/5 flex gap-2">
                {platform.status === 'connected' ? (
                    <button className="flex-1 py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/20 transition-all">
                        CONFIGURE
                    </button>
                ) : (
                    <button className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-text-primary text-xs font-bold border border-white/10 transition-all group-hover:bg-primary-color/10 group-hover:border-primary-color/30 group-hover:text-primary-color">
                        CONNECT
                    </button>
                )}
                <button className="p-2 rounded-lg border border-white/10 hover:bg-white/5 text-text-secondary transition-all">
                    <Terminal size={14} />
                </button>
            </div>
        </motion.div>
    );
};

const Platforms: React.FC = () => {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold font-title tracking-tight">Platform Hub</h1>
                    <p className="text-text-secondary mt-2 max-w-2xl">
                        Integrate your autonomous agents with the wider Bitcoin Cash ecosystem.
                        Manage connections to DeFi protocols, wallets, and social networks.
                    </p>
                </div>
                <button className="px-5 py-2.5 bg-primary-color hover:bg-primary-color/90 text-black font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-primary-color/20">
                    <Globe size={18} />
                    <span>Discover More</span>
                    <ArrowRight size={18} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {platforms.map(platform => (
                    <PlatformCard key={platform.id} platform={platform} />
                ))}
            </div>
        </div>
    );
};

export default Platforms;
