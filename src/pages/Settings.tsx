import React from 'react';
import { Key, Lock, Server, Database, Plus } from 'lucide-react';

const Settings: React.FC = () => (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
        <div>
            <h3 className="text-3xl font-bold font-title tracking-tight" style={{ fontFamily: 'var(--font-title)' }}>Settings</h3>
            <p className="text-text-secondary text-base mt-1">Configure your local API keys and node preferences.</p>
        </div>

        <div className="grid grid-cols-1 gap-8">
            <section className="glass-panel p-8 space-y-6">
                <h4 className="text-xs font-bold uppercase tracking-widest text-text-secondary flex items-center gap-2">
                    <Key size={14} />
                    LLM Integration
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className="text-[10px] uppercase font-bold text-text-secondary">AI Provider</label>
                        <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary-color appearance-none cursor-pointer">
                            <option>OpenAI (Standard)</option>
                            <option>Anthropic (Advanced)</option>
                            <option>Local (Ollama/Llama.cpp)</option>
                            <option>DeepSeek (Efficient)</option>
                        </select>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] uppercase font-bold text-text-secondary">API Key Override</label>
                        <div className="relative">
                            <input type="password" placeholder="sk-proj-..................." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary-color font-mono text-xs pr-12" />
                            <Lock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary opacity-40" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="glass-panel p-8 space-y-6">
                <h4 className="text-xs font-bold uppercase tracking-widest text-text-secondary flex items-center gap-2">
                    <Server size={14} />
                    BCH Full Node Connection
                </h4>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                        <div className="w-10 h-10 rounded-xl bg-primary-color/10 flex items-center justify-center">
                            <Database size={18} className="text-primary-color" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold">Standard Integrated Node</p>
                            <p className="text-[10px] text-text-secondary">Optimized for low latency agent interactions.</p>
                        </div>
                        <span className="text-[10px] font-bold text-primary-color uppercase">Connected</span>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-2xl border border-dashed border-white/10 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                            <Plus size={18} className="text-text-secondary" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold">Add Custom RPC Endpoint</p>
                            <p className="text-[10px] text-text-secondary">Connect to your own BCHD or Bitcoin ABC node.</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="flex justify-end gap-4">
                <button className="px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-white/5 transition-all">Cancel</button>
                <button className="px-8 py-2.5 bg-primary-color text-black rounded-xl text-xs font-bold hover:scale-105 transition-all shadow-lg shadow-primary-color/10" style={{ backgroundColor: 'var(--primary-color)' }}>Save Preferences</button>
            </div>
        </div>
    </div>
);

export default Settings;
