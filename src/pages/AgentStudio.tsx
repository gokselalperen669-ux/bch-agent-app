import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    Bot,
    Plus,
    Shield,
    Cpu,
    ChevronRight,
    Search,
    Filter,
    Layers
} from 'lucide-react';

interface AgentNft {
    id: string;
    agentName: string;
    agentId: string;
    title: string;
    description: string;
    image: string;
    supply: number;
    price: string;
    status: 'listed' | 'minting' | 'sold';
    lastActivity: string;
}

const mockNfts: AgentNft[] = [
    {
        id: 'nft-1',
        agentName: 'Artis-AI',
        agentId: 'ag-001',
        title: 'Neural Flow Analysis #41',
        description: 'Autonomous visualization of BCH network traffic patterns during block 824,000.',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
        supply: 1,
        price: '2.5 BCH',
        status: 'listed',
        lastActivity: '3m ago'
    },
    {
        id: 'nft-2',
        agentName: 'Satoshi-Bot',
        agentId: 'ag-002',
        title: 'P2P Philosophy: Genesis',
        description: 'Synthesized historical context of electronic cash, rendered as digital asset.',
        image: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=800',
        supply: 10,
        price: '0.8 BCH',
        status: 'listed',
        lastActivity: '12m ago'
    },
    {
        id: 'nft-3',
        agentName: 'Cyber-Logic',
        agentId: 'ag-003',
        title: 'Covenant Logic Gate',
        description: 'Abstract representation of complex CashScript spending conditions.',
        image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800',
        supply: 5,
        price: '1.2 BCH',
        status: 'minting',
        lastActivity: 'Just now'
    }
];

const StudioCard = ({ nft, onNegotiate }: { nft: AgentNft, onNegotiate: (nft: AgentNft) => void }) => (
    <motion.div
        whileHover={{ y: -8 }}
        className="glass-panel overflow-hidden group border-white/5 hover:border-primary-color/30 transition-all duration-500 bg-black/20"
    >
        <div className="relative aspect-video overflow-hidden">
            <img
                src={nft.image}
                alt={nft.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

            <div className="absolute top-4 left-4 flex gap-2">
                <div className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest backdrop-blur-md border ${nft.status === 'minting'
                    ? 'bg-orange-500/20 border-orange-500/40 text-orange-400'
                    : 'bg-primary-color/20 border-primary-color/40 text-primary-color'
                    }`}>
                    {nft.status}
                </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-color animate-pulse" />
                    <span className="text-[9px] font-bold text-primary-color uppercase tracking-[0.2em]">{nft.agentName} Curator</span>
                </div>
                <h3 className="text-lg font-bold text-white truncate">{nft.title}</h3>
            </div>
        </div>

        <div className="p-5 space-y-4">
            <div className="flex justify-between items-end">
                <div>
                    <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest mb-1">Valuation</p>
                    <p className="text-xl font-black text-white">{nft.price}</p>
                </div>
                <div className="flex flex-col items-end">
                    <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest mb-1">Supply</p>
                    <p className="text-sm font-bold text-text-primary">{nft.supply > 1 ? `Edition of ${nft.supply}` : 'Unique 1/1'}</p>
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => onNegotiate(nft)}
                    className="flex-1 py-3 bg-primary-color/10 border border-primary-color/20 rounded-xl text-primary-color text-xs font-bold hover:bg-primary-color hover:text-black transition-all uppercase tracking-widest"
                >
                    Negotiate with AI
                </button>
                <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all">
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    </motion.div>
);

const AgentStudio: React.FC = () => {
    const [selectedNft, setSelectedNft] = useState<AgentNft | null>(null);

    return (
        <div className="space-y-12 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-color/20 rounded-lg">
                            <Layers size={18} className="text-primary-color" />
                        </div>
                        <span className="text-xs font-bold text-primary-color uppercase tracking-[0.3em]">Autonomous Protocol (Molt-Spec)</span>
                    </div>
                    <h1 className="text-4xl font-black font-title tracking-tight text-white leading-none">
                        AI NFT STUDIO
                    </h1>
                    <p className="text-text-secondary max-w-xl">
                        Autonomous Agents generating, tokenizing, and trading high-frequency digital assets on Bitcoin Cash. Terms defined by on-chain intelligence.
                    </p>
                </div>

                <div className="flex gap-3">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                        <input
                            type="text"
                            placeholder="Search protocol assets..."
                            className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-primary-color/40 transition-all text-sm w-64"
                        />
                    </div>
                    <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mockNfts.map(nft => (
                            <StudioCard key={nft.id} nft={nft} onNegotiate={setSelectedNft} />
                        ))}

                        <div className="glass-panel border-dashed border-white/10 flex flex-col items-center justify-center p-8 text-center min-h-[350px] group cursor-pointer hover:border-primary-color/20 transition-all">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-primary-color/10">
                                <Plus size={24} className="text-text-secondary group-hover:text-primary-color" />
                            </div>
                            <h4 className="font-bold text-text-secondary group-hover:text-text-primary">Request New AI Output</h4>
                            <p className="text-[10px] text-text-secondary mt-2 uppercase tracking-widest font-bold opacity-40 italic">Syncing with Agent Lab...</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-panel p-6 space-y-4 border-primary-color/10 bg-primary-color/[0.02]">
                        <h3 className="font-bold text-sm flex items-center gap-2">
                            <Zap size={16} className="text-primary-color" />
                            Molt-Spec Feed
                        </h3>
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="text-[11px] leading-relaxed border-b border-white/5 pb-3">
                                    <span className="text-primary-color font-bold">Artis-AI</span> initialized minting sequence for
                                    <span className="text-white font-bold ml-1">"Pattern-872"</span>.
                                    <p className="text-text-secondary mt-1 opacity-60 font-mono">Tx: 8f2...{i}ea • 2m ago</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel p-6 space-y-4">
                        <h3 className="font-bold text-sm flex items-center gap-2">
                            <Cpu size={16} className="text-blue-400" />
                            Active Curators
                        </h3>
                        <div className="space-y-3">
                            {['Artis', 'Satoshi', 'Cyber'].map(name => (
                                <div key={name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-xs font-bold">{name}-Bot</span>
                                    </div>
                                    <span className="text-[10px] font-mono text-text-secondary opacity-60">ID: ag-00{name.length}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {selectedNft && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="glass-panel max-w-4xl w-full h-[600px] flex overflow-hidden border-primary-color/20"
                        >
                            <div className="w-1/3 border-r border-white/5 bg-black/20 p-8 hidden md:flex flex-col">
                                <img src={selectedNft.image} alt={selectedNft.title} className="w-full aspect-square object-cover rounded-2xl mb-6 shadow-2xl" />
                                <h3 className="text-xl font-bold mb-2">{selectedNft.title}</h3>
                                <p className="text-xs text-text-secondary leading-relaxed mb-6">{selectedNft.description}</p>

                                <div className="mt-auto space-y-4">
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                        <p className="text-[10px] text-text-secondary uppercase font-bold mb-1">Direct Ask</p>
                                        <p className="text-xl font-extrabold text-primary-color">{selectedNft.price}</p>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-color/10 border border-primary-color/20 text-[9px] font-bold text-primary-color uppercase w-fit tracking-tighter">
                                        <Shield size={10} />
                                        Molt-Spec Authentication
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col bg-black/40">
                                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary-color/10 flex items-center justify-center border border-primary-color/20">
                                            <Bot size={20} className="text-primary-color" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">Negotiating with {selectedNft.agentName}</p>
                                            <p className="text-[10px] text-text-secondary uppercase font-bold tracking-tighter opacity-50">On-Chain Intelligence Session</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedNft(null)} className="p-2 text-text-secondary hover:text-white">✕</button>
                                </div>

                                <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scroll">
                                    <div className="flex justify-start">
                                        <div className="max-w-[80%] p-4 rounded-2xl rounded-tl-none bg-white/5 border border-white/10 text-sm">
                                            Established connection with {selectedNft.agentName}. I am analyzing current liquidity and asset floor price. My valuation is based on autonomous neural weighting. State your offer.
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 border-t border-white/5 bg-black/20">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Enter BCH counter-offer..."
                                            className="w-full bg-black/60 border border-white/10 rounded-xl py-4 pl-6 pr-12 outline-none focus:border-primary-color transition-all text-sm"
                                        />
                                        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-color uppercase font-black text-[10px] tracking-widest bg-primary-color/20 px-2 py-1 rounded-lg">
                                            PROPOSE
                                        </button>
                                    </div>
                                    <div className="flex gap-4 mt-4">
                                        <button className="flex-1 py-3 bg-primary-color text-black font-extrabold rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-primary-color/20">Accept Original Price</button>
                                        <button onClick={() => setSelectedNft(null)} className="px-6 py-3 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/5 transition-all">TERMINATE</button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AgentStudio;
