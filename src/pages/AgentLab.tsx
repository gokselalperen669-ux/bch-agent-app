import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Plus, Activity, Shield, Database, Lock, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { type Agent } from '../types';

const TriggerBadge = ({ label, active }: { label: string, active?: boolean }) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`px-4 py-2 rounded-xl border text-[10px] font-bold uppercase transition-all cursor-pointer ${active
            ? 'bg-primary-color/10 border-primary-color/40 text-primary-color'
            : 'bg-white/5 border-white/5 text-text-secondary hover:border-white/20'
            }`} style={active ? { backgroundColor: 'rgba(0, 227, 57, 0.1)', borderColor: 'rgba(0, 227, 57, 0.4)', color: 'var(--primary-color)' } : {}}>
        {label}
    </motion.div>
);

const ProtocolItem = ({ label, description, active }: { label: string, description: string, active?: boolean }) => (
    <div className="flex items-center justify-between group">
        <div>
            <p className="text-sm font-bold tracking-tight">{label}</p>
            <p className="text-[10px] text-text-secondary mt-1 max-w-[200px] leading-relaxed">{description}</p>
        </div>
        <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all ${active ? 'bg-primary-color' : 'bg-white/10'}`} style={active ? { backgroundColor: 'var(--primary-color)' } : {}}>
            <motion.div
                animate={{ x: active ? 24 : 0 }}
                className="w-4 h-4 rounded-full bg-white shadow-lg"
            ></motion.div>
        </div>
    </div>
);

const AgentLab = () => {
    const { user } = useAuth();
    const [isDeploying, setIsDeploying] = useState(false);
    const [deployed, setDeployed] = useState(false);
    const [agents, setAgents] = useState<Agent[]>([]);

    useEffect(() => {
        const fetchAgents = async () => {
            if (!user?.token) return;
            try {
                const res = await fetch('http://localhost:4000/agents', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (res.ok) setAgents(await res.json());
            } catch (e) { console.error(e); }
        };
        fetchAgents();
    }, [user]);

    const handleDeploy = async () => {
        if (!user || !user.token) return;
        setIsDeploying(true);

        // Simulate deployment and save to API
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            await fetch('http://localhost:4000/agents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    name: `Agent ${agents.length + 1}`,
                    type: 'custom',
                    createdAt: new Date().toISOString()
                })
            });

            setDeployed(true);
            setTimeout(() => setDeployed(false), 5000);

            // Refresh list
            const res = await fetch('http://localhost:4000/agents', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            setAgents(await res.json());
        } catch (e) {
            console.error(e);
        } finally {
            setIsDeploying(false);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h3 className="text-3xl font-bold font-title tracking-tight" style={{ fontFamily: 'var(--font-title)' }}>Agent Laboratory</h3>
                    <p className="text-text-secondary text-base mt-1">Forge intelligent on-chain autonomous agents with native CashTokens.</p>
                </div>
                <div className="flex items-center gap-4">
                    {agents.length > 0 && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                            <Database size={16} className="text-primary-color" />
                            <span className="text-sm font-bold text-white">{agents.length} Synced</span>
                        </div>
                    )}
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0,227,57,0.3)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDeploy}
                        disabled={isDeploying}
                        className={`px-8 py-4 bg-primary-color text-black font-extrabold rounded-2xl flex items-center gap-3 shadow-xl transition-all ${isDeploying ? 'opacity-50 cursor-wait' : 'shadow-primary-color/20'}`}
                        style={{ backgroundColor: 'var(--primary-color)' }}
                    >
                        {isDeploying ? (
                            <>
                                <Activity size={20} className="animate-spin" />
                                DEPLOYING...
                            </>
                        ) : deployed ? (
                            <>
                                <Shield size={20} />
                                AGENT ONLINE
                            </>
                        ) : (
                            <>
                                <Plus size={20} strokeWidth={3} />
                                INITIALIZE AGENT
                            </>
                        )}
                    </motion.button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                <div className="glass-panel p-10 flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                        <h4 className="font-bold flex items-center gap-3 text-primary-color uppercase tracking-widest text-xs" style={{ color: 'var(--primary-color)' }}>
                            <Cpu size={18} />
                            Logic Configuration
                        </h4>
                        <span className="text-[10px] font-bold text-text-secondary italic">Drafting...</span>
                    </div>

                    {/* Synced Agents List (Mini) */}
                    {agents.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/5">
                            {agents.map(agent => (
                                <div key={agent.id} className="min-w-[120px] p-3 rounded-lg bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10">
                                    <p className="text-xs font-bold text-white truncate">{agent.name}</p>
                                    <p className="text-[9px] text-text-secondary uppercase">{agent.type || 'Custom'}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex-1 space-y-8">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] uppercase font-extrabold text-text-secondary tracking-widest">Agent Identity</label>
                                <span className="text-[10px] text-text-secondary opacity-40">Unique CID will be generated</span>
                            </div>
                            <input type="text" placeholder="e.g. TreasuryManager v1.0.4" className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 focus:border-primary-color focus:bg-primary-color/5 outline-none transition-all font-medium placeholder:text-white/20" />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] uppercase font-extrabold text-text-secondary tracking-widest">Core Narrative (Prompting)</label>
                                <Database size={12} className="text-text-secondary opacity-40" />
                            </div>
                            <textarea placeholder="Instruction your agent: 'Monitor wallet for BCH transfers above 0.5. On detection, swap 20% to tokens via CashSwap DEX and update state...'" className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 focus:border-primary-color focus:bg-primary-color/5 outline-none transition-all h-48 resize-none font-medium text-sm leading-relaxed placeholder:text-white/20"></textarea>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] uppercase font-extrabold text-text-secondary tracking-widest">On-Chain Triggers</label>
                            <div className="flex flex-wrap gap-3">
                                <TriggerBadge label="Token Transfer" active />
                                <TriggerBadge label="Oracle Price" />
                                <TriggerBadge label="Time Interval" />
                                <TriggerBadge label="Contract State" />
                                <div className="p-2 border border-dashed border-white/10 rounded-xl text-text-secondary hover:border-white/30 cursor-pointer transition-all">
                                    <Plus size={14} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-8">
                    <div className="glass-panel p-8 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <Lock size={16} className="text-white/20" />
                        </div>
                        <h4 className="font-bold flex items-center gap-3 mb-6 uppercase tracking-widest text-xs">
                            <Shield size={18} className="text-orange-400" />
                            Covenant Schema
                        </h4>
                        <div className="relative">
                            <pre className="p-5 bg-black/60 rounded-2xl font-mono text-[11px] border border-white/10 text-text-secondary h-52 overflow-hidden leading-relaxed backdrop-blur-sm group-hover:text-text-primary transition-colors">
                                {`pragma cashscript ^0.10.0;

contract GenericAgent(
    pubkey agentPk,
    bytes20 agentID
) {
    function execute(sig s, bytes action) {
        require(checkSig(s, agentPk));
        
        // Context Validation
        require(tx.inputs[0].nftCommitment == agentID);
        
        // Action Dispatch
        bytes4 selector = action.slice(0, 4);
        if (selector == 0xa945451e) { 
            // Swap action...
        }
    }
}`}
                            </pre>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="pointer-events-auto px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-xs font-bold backdrop-blur-md">EDIT SOURCE</button>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-8 flex-1 flex flex-col gap-6">
                        <h4 className="font-bold flex items-center gap-3 uppercase tracking-widest text-xs">
                            <SettingsIcon size={18} className="text-blue-400" />
                            Autonomy Protocols
                        </h4>
                        <div className="space-y-6 flex-1">
                            <ProtocolItem label="Autonomous Transfers" description="Agent can send tokens without human intervention." active />
                            <ProtocolItem label="Automatic Refilling" description="Auto-fund gas from vault if below 0.05 BCH." active />
                            <ProtocolItem label="Manual Confirmation" description="Require UI approval for large transactions (>1 BCH)." />
                        </div>

                        <div className="pt-6 border-t border-white/5 flex gap-4">
                            <button className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-xs hover:bg-white/10 transition-all uppercase tracking-widest">Discard</button>
                            <button
                                className={`flex-1 py-3 border rounded-xl font-bold text-xs transition-all uppercase tracking-widest ${deployed
                                    ? 'bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30'
                                    : 'bg-white/5 border-white/5 text-gray-500 cursor-not-allowed'
                                    }`}
                                disabled={!deployed}
                            >
                                Tokenize
                            </button>
                            <button className="flex-1 py-3 bg-primary-color/20 border border-primary-color/30 text-primary-color rounded-xl font-bold text-xs hover:bg-primary-color/30 transition-all uppercase tracking-widest" onClick={handleDeploy}>Save Config</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentLab;
