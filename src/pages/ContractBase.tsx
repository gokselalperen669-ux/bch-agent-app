import React from 'react';
import { Shield, Plus } from 'lucide-react';

const ContractBase: React.FC = () => (
    <div className="space-y-8">
        <h3 className="text-3xl font-bold font-title tracking-tight" style={{ fontFamily: 'var(--font-title)' }}>Contract Base</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <Shield className="text-primary-color" size={20} />
                    <span className="font-bold">AgentBase.cash</span>
                </div>
                <p className="text-xs text-text-secondary">The core foundational covenant for all BCH Agents.</p>
                <div className="mt-auto pt-4 border-t border-white/5 flex gap-2">
                    <button className="px-3 py-1.5 bg-white/5 rounded-lg text-xs hover:bg-white/10">View Code</button>
                    <button className="px-3 py-1.5 bg-primary-color/10 text-primary-color rounded-lg text-xs font-bold">Compiled</button>
                </div>
            </div>
            <div className="glass-panel p-6 border-dashed border-white/10 bg-transparent flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-primary-color/50 transition-all">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary-color/10 transition-all">
                    <Plus className="text-text-secondary group-hover:text-primary-color" />
                </div>
                <span className="text-sm font-bold text-text-secondary group-hover:text-text-primary">Create New Template</span>
            </div>
        </div>
    </div>
);

export default ContractBase;
