import React from 'react';
import { Database } from 'lucide-react';

const KnowledgeBase: React.FC = () => (
    <div className="space-y-8">
        <h3 className="text-3xl font-bold font-title tracking-tight" style={{ fontFamily: 'var(--font-title)' }}>Knowledge Base</h3>
        <div className="glass-panel p-8 flex flex-col items-center justify-center min-h-[300px] gap-6 text-center">
            <div className="w-20 h-20 rounded-3xl bg-primary-color/5 flex items-center justify-center border border-primary-color/10">
                <Database className="text-primary-color" size={32} />
            </div>
            <div>
                <h4 className="text-xl font-bold">Vector Database Offline</h4>
                <p className="text-sm text-text-secondary mt-2 max-w-sm">Connect a knowledge source to feed your agent with private data or market insights.</p>
            </div>
            <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-xs hover:bg-white/10 transition-all uppercase tracking-widest">Connect Dataset</button>
        </div>
    </div>
);

export default KnowledgeBase;
