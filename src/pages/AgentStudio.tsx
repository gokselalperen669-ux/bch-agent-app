import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    Bot,
    Plus,
    Shield,
    Filter,
    Layers,
    Activity,
    Lock,
    Search
} from 'lucide-react';
import { getApiUrl } from '../config';

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
        description: 'Autonomous visualization of BCH network traffic patterns.',
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
        description: 'Synthesized historical context of electronic cash.',
        image: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=800',
        supply: 10,
        price: '0.8 BCH',
        status: 'listed',
        lastActivity: '12m ago'
    }
];

const StudioCard = ({ nft, onNegotiate }: { nft: AgentNft, onNegotiate: (nft: AgentNft) => void }) => (
    <motion.div
        whileHover={{ y: -8 }}
        className="glass-panel overflow-hidden group border-white/5 hover:border-primary-color/30 transition-all duration-500 bg-black/20"
    >
        <div className="relative aspect-square overflow-hidden">
            <img
                src={nft.image}
                alt={nft.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute top-4 left-4">
                <div className="px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-bold text-primary-color uppercase tracking-widest">
                    {nft.status}
                </div>
            </div>
        </div>

        <div className="p-5 space-y-4">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <Bot size={12} className="text-primary-color" />
                    <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">{nft.agentName}</span>
                </div>
                <h3 className="text-sm font-bold text-white truncate">{nft.title}</h3>
            </div>

            <div className="flex justify-between items-end border-t border-white/5 pt-4">
                <div>
                    <p className="text-[9px] text-text-secondary uppercase font-bold tracking-widest mb-0.5">Valuation</p>
                    <p className="text-lg font-black text-white">{nft.price}</p>
                </div>
                <button
                    onClick={() => onNegotiate(nft)}
                    className="p-2.5 bg-primary-color/10 border border-primary-color/20 rounded-xl text-primary-color hover:bg-primary-color hover:text-black transition-all shadow-lg shadow-primary-color/5"
                >
                    <Zap size={16} />
                </button>
            </div>
        </div>
    </motion.div>
);

const AgentStudio = () => {
    const [selectedNft, setSelectedNft] = useState<AgentNft | null>(null);
    const [nfts, setNfts] = useState<AgentNft[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStudioData = async () => {
            try {
                const agentsRes = await fetch(getApiUrl('/public/agents'));
                const agentsData = await agentsRes.json();

                const mappedNfts = agentsData.filter((a: any) => a.type === 'nft' || a.category === 'nft').map((a: any) => ({
                    id: `nft-${a.id}`,
                    agentName: a.name,
                    agentId: a.agentId || a.id,
                    title: `${a.name} State Commitment`,
                    description: `Autonomous state commitment hash recorded by ${a.name}.`,
                    image: `https://api.dicebear.com/7.x/identicon/svg?seed=${a.name}`,
                    supply: 1,
                    price: '0.5 BCH',
                    status: 'listed' as const,
                    lastActivity: 'Active'
                }));

                setNfts(mappedNfts.length > 0 ? mappedNfts : mockNfts);
            } catch (err) {
                console.error(err);
                setNfts(mockNfts);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStudioData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-16 h-16 border-4 border-primary-color/20 border-t-primary-color rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-color/20 rounded-lg">
                            <Layers size={18} className="text-primary-color" />
                        </div>
                        <span className="text-[10px] font-black text-primary-color uppercase tracking-[0.3em]">Agentic Output Studio</span>
                    </div>
                    <h1 className="text-4xl font-black font-title tracking-tight text-white italic">NFT FORGE</h1>
                    <p className="text-text-secondary text-sm max-w-xl">
                        Monitor and trade generative assets produced by autonomous agents on the BCH network.
                    </p>
                </div>

                <div className="flex gap-2">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                        <input
                            type="text"
                            placeholder="Filter artifacts..."
                            className="bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs outline-none focus:border-primary-color/40 w-48"
                        />
                    </div>
                    <button className="p-2 bg-white/5 border border-white/10 rounded-xl text-white">
                        <Filter size={18} />
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {nfts.map(nft => (
                    <StudioCard key={nft.id} nft={nft} onNegotiate={setSelectedNft} />
                ))}

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-panel border-dashed border-white/20 flex flex-col items-center justify-center p-8 text-center min-h-[300px] group cursor-pointer hover:border-primary-color/40"
                >
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-primary-color/10">
                        <Plus size={24} className="text-text-secondary group-hover:text-primary-color" />
                    </div>
                    <h4 className="font-bold text-text-secondary text-sm">Deploy New NFT Agent</h4>
                    <p className="text-[10px] text-text-tertiary mt-2 uppercase font-black italic">Use CLI: `agent create --type nft`</p>
                </motion.div>
            </div>

            {/* Live Feed Sidebar Style Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-10">
                <div className="lg:col-span-2 glass-panel p-8 overflow-hidden relative border-blue-500/20">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none text-blue-500">
                        <Lock size={160} />
                    </div>
                    <h3 className="text-lg font-black italic uppercase italic mb-6">Security & Commitment Proofs</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <Shield size={16} className="text-blue-400" />
                                    <span className="text-xs font-mono text-text-secondary">Commit: 0x82f...e{i}7a</span>
                                </div>
                                <span className="text-[9px] font-black text-green-400 uppercase">Verified on Chain</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-panel p-8 border-primary-color/20 bg-primary-color/[0.02]">
                    <h3 className="text-lg font-black italic uppercase mb-6 flex items-center gap-2">
                        <Activity size={20} className="text-primary-color" /> Live Mint Feed
                    </h3>
                    <div className="space-y-6">
                        {[1, 2].map(i => (
                            <div key={i} className="text-[11px] leading-relaxed">
                                <span className="text-primary-color font-bold">Artis-AI</span> initialized minting sequence for
                                <span className="text-white font-bold ml-1">"Artifact-0x{i}"</span>.
                                <p className="text-text-tertiary mt-1 font-mono">2m ago • Block 824,00{i}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {selectedNft && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass-panel max-w-lg w-full p-8 border-primary-color/30"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-2xl">
                                        <img src={selectedNft.image} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black italic uppercase">{selectedNft.title}</h3>
                                        <p className="text-xs text-text-secondary">{selectedNft.agentName} Output</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedNft(null)} className="text-text-tertiary hover:text-white">✕</button>
                            </div>

                            <div className="bg-black/40 rounded-2xl p-6 border border-white/5 mb-6">
                                <p className="text-xs text-text-secondary leading-relaxed italic">
                                    "I have analyzed the current market floor and my internal resource allocation. This NFT represents a unique state commitment of my logic."
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <button className="flex-1 py-4 bg-primary-color text-black font-black rounded-xl text-xs uppercase tracking-widest shadow-xl shadow-primary-color/20">Buy artifact</button>
                                <button onClick={() => setSelectedNft(null)} className="px-6 py-4 border border-white/10 rounded-xl text-xs font-bold">Close</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AgentStudio;
