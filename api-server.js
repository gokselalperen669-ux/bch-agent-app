import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase credentials missing!');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to handle Supabase responses
const handleResponse = ({ data, error }) => {
    if (error) {
        console.error('Supabase Error:', error);
        throw error;
    }
    return data;
};

// Replace file-based DB with Supabase adapters
const app = express();
app.use(cors());
app.use(express.json());

// Enable trust proxy for cloud deployments (Render, Heroku, etc.)
app.set('trust proxy', 1);

// Serve static files from the frontend build directory
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    console.log(`📂 Serving static files from: ${distPath}`);

    // Handle SPA routing - send all non-API requests to index.html
    app.get('(.*)', (req, res, next) => {
        if (req.path.startsWith('/auth') ||
            req.path.startsWith('/agents') ||
            req.path.startsWith('/wallets') ||
            req.path.startsWith('/commands') ||
            req.path.startsWith('/market') ||
            req.path.startsWith('/public') ||
            req.path.startsWith('/user') ||
            req.path.startsWith('/health')) {
            return next();
        }
        res.sendFile(path.join(distPath, 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.json({ message: "BCH Nexus API is running. Dist folder not found, frontend not served." });
    });
}

// Middleware to authenticate token (Supabase auth)
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

    const token = authHeader.split(' ')[1];

    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('token', token)
        .single();

    if (error || !user) return res.status(403).json({ error: 'Invalid token' });

    req.user = user;
    next();
};

// --- AUTH ENDPOINTS ---

app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    if (error || !user) {
        return res.status(404).json({ error: 'Account not found. Please register via the web interface.' });
    }

    if (user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json(user);
});

app.post('/auth/register', async (req, res) => {
    const { email, password } = req.body;

    const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

    if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
    }

    const user = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        email,
        password,
        name: email.split('@')[0],
        token: 'nexus_' + Math.random().toString(36).substr(2, 20),
        createdAt: new Date().toISOString()
    };

    const { error: insertError } = await supabase.from('users').insert(user);
    if (insertError) return res.status(500).json({ error: insertError.message });

    res.json(user);
});

app.get('/auth/check-user/:email', async (req, res) => {
    const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('email', req.params.email)
        .single();
    res.json({ exists: !!user });
});

// Used by CLI to check connection
app.get('/health', (req, res) => {
    res.json({ status: 'active', nexus: 'BCH Agent Nexus v1.0' });
});

// --- USER SETTINGS ---

app.get('/user/settings', authMiddleware, async (req, res) => {
    const { data: user, error } = await supabase
        .from('users')
        .select('settings')
        .eq('id', req.user.id)
        .single();

    res.json(user?.settings || {
        aiProvider: 'openai',
        aiModel: 'gpt-4o',
        aiApiKey: '',
        aiBaseUrl: '',
        connectors: {
            defi: { apiKey: '', baseUrl: '' },
            social: { discordWebhook: '', telegramToken: '' },
            nft: { storageApiKey: '', gatewayUrl: '' }
        }
    });
});

app.post('/user/settings', authMiddleware, async (req, res) => {
    const { data: user } = await supabase
        .from('users')
        .select('settings')
        .eq('id', req.user.id)
        .single();

    const newSettings = {
        ...(user?.settings || {}),
        ...req.body
    };

    const { error } = await supabase
        .from('users')
        .update({ settings: newSettings })
        .eq('id', req.user.id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, settings: newSettings });
});

app.post('/user/test-connector', authMiddleware, (req, res) => {
    const { id } = req.body;
    // In a real app, this would use the user's stored API keys to ping external services.
    // For this demo, we'll simulate the latency and check if the key is "configured".

    const db = readDB();
    const user = db.users.find(u => u.id === req.user.id);
    const settings = user.settings || {};

    const latency = Math.floor(Math.random() * 150) + 20;

    // Simulate some logic based on what's being tested
    setTimeout(() => {
        if (id === 'ai') {
            if (!settings.aiApiKey) return res.status(400).json({ error: 'AI API Key not configured' });
            return res.json({ success: true, latency, message: `Handshake established with ${settings.aiProvider} (${settings.aiModel})` });
        }

        const connector = settings.connectors?.[id];
        if (!connector) return res.status(400).json({ error: `Connector ${id} not found` });

        // Simple verification simulation
        if (id === 'defi' && !connector.apiKey) return res.status(400).json({ error: 'DeFi Auth Token missing' });
        if (id === 'social' && !connector.telegramToken && !connector.discordWebhook) return res.status(400).json({ error: 'Social credentials missing' });

        res.json({ success: true, latency, message: `Handshake established with ${id.toUpperCase()} relay` });
    }, 1000);
});

// --- AGENT ENDPOINTS ---

app.get('/agents', authMiddleware, async (req, res) => {
    const { data: agents, error } = await supabase
        .from('agents')
        .select('*')
        .eq('userId', req.user.id);

    if (error) return res.status(500).json({ error: error.message });
    res.json(agents || []);
});

// Returns the intelligence configuration for a specific agent.
app.get('/agents/:agentId/config', authMiddleware, async (req, res) => {
    const { data: agent } = await supabase
        .from('agents')
        .select('settings')
        .eq('agentId', req.params.agentId)
        .eq('userId', req.user.id)
        .single();

    const { data: user } = await supabase
        .from('users')
        .select('settings')
        .eq('id', req.user.id)
        .single();

    if (!user) return res.status(404).json({ error: 'User not found' });

    const settings = (agent && agent.settings) ? agent.settings : (user.settings || {});

    res.json({
        ai: {
            apiKey: settings.aiApiKey || '',
            model: settings.aiModel || 'gpt-4o',
            provider: settings.aiProvider || 'openai',
            baseUrl: settings.aiBaseUrl || ''
        },
        connectors: settings.connectors || {}
    });
});

app.post('/agents', authMiddleware, async (req, res) => {
    const agentData = req.body;
    const agentId = agentData.agentId || 'ag_' + Math.random().toString(36).substr(2, 9);

    const newAgent = {
        ...agentData,
        agentId: agentId,
        id: agentId,
        userId: req.user.id,
        synchronizedAt: new Date().toISOString()
    };

    const { error: upsertError } = await supabase
        .from('agents')
        .upsert(newAgent, { onConflict: 'agentId,userId' });

    if (upsertError) return res.status(500).json({ error: upsertError.message });

    // Add to logs
    await supabase.from('logs').insert({
        agentName: newAgent.name,
        action: `Agent synchronized: ${newAgent.type}`,
        timestamp: new Date().toISOString(),
        userId: req.user.id
    });

    res.json(newAgent);
});

app.post('/agents/command', authMiddleware, (req, res) => {
    const { agentId, command } = req.body;
    let db = readDB();

    const agent = db.agents.find(a => a.agentId === agentId && a.userId === req.user.id);
    if (!agent) return res.status(404).json({ error: 'Agent not found' });

    const newLog = {
        id: 'cmd_' + Date.now(),
        agentName: agent.name,
        action: `Remote Directive: ${command}`,
        timestamp: new Date().toISOString()
    };

    db.logs.unshift(newLog);

    // Queue command for CLI
    if (!db.commands) db.commands = [];
    db.commands.push({
        id: Date.now(),
        agentId,
        command,
        status: 'pending',
        userId: req.user.id
    });

    writeDB(db);
    res.json({ success: true, log: newLog });
});

app.get('/commands/:agentId', (req, res) => {
    const db = readDB();
    const commands = db.commands.filter(c => c.agentId === req.params.agentId);
    res.json(commands);
});

app.post('/commands/:id/resolve', (req, res) => {
    const { status } = req.body;
    let db = readDB();
    const command = db.commands.find(c => c.id == req.params.id);

    if (command) {
        command.status = status || 'executed';
        writeDB(db);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Command not found' });
    }
});

// --- LIQUIDITY & ACTIONS ---
app.post('/agents/:id/liquidity', authMiddleware, (req, res) => {
    const { amount, action } = req.body; // action: 'add' | 'remove'
    let db = readDB();
    const agent = db.agents.find(a => a.agentId === req.params.id && a.userId === req.user.id);

    if (!agent) return res.status(404).json({ error: 'Agent not found' });

    const logEntry = {
        id: 'liq_' + Date.now(),
        agentName: agent.name,
        action: `Liquidity ${action === 'add' ? 'Injected' : 'Withdrawn'}: ${amount} BCH`,
        timestamp: new Date().toISOString()
    };

    db.logs.unshift(logEntry);

    // Update agent state
    agent.liquidity = (parseFloat(agent.liquidity || '0') + (action === 'add' ? parseFloat(amount) : -parseFloat(amount))).toFixed(4);

    writeDB(db);
    res.json({ success: true, currentLiquidity: agent.liquidity });
});

app.post('/agents/:id/actions/execute', authMiddleware, (req, res) => {
    const { type, payload } = req.body; // type: 'trade' | 'rebalance' | 'signal'
    let db = readDB();
    const agent = db.agents.find(a => a.agentId === req.params.id);

    if (!agent) return res.status(404).json({ error: 'Agent not found' });

    const actionRecord = {
        id: 'act_' + Date.now(),
        agentId: agent.agentId,
        agentName: agent.name,
        type,
        payload,
        timestamp: new Date().toISOString()
    };

    db.actions = db.actions || [];
    db.actions.unshift(actionRecord);

    db.logs.unshift({
        id: 'log_act_' + Date.now(),
        agentName: agent.name,
        action: `Autonomous Execution: ${type.toUpperCase()} - ${JSON.stringify(payload)}`,
        timestamp: new Date().toISOString()
    });

    writeDB(db);
    res.json(actionRecord);
});

app.post('/market/interact', authMiddleware, (req, res) => {
    const { agentId, action, amount } = req.body;
    let db = readDB();
    const agent = db.agents.find(a => (a.agentId === agentId || a.id === agentId));

    if (!agent) return res.status(404).json({ error: 'Agent not found' });

    const logEntry = {
        id: 'mkt_' + Date.now(),
        agentName: agent.name,
        action: `Market Interaction: ${action.toUpperCase()} - ${amount} units`,
        timestamp: new Date().toISOString()
    };

    db.logs.unshift(logEntry);

    // Simple bonding curve logic for mock
    if (action === 'buy_nft' || action === 'inject_liquidity') {
        agent.bondingCurveProgress = Math.min(100, (agent.bondingCurveProgress || 0) + (parseFloat(amount) * 10));
        if (agent.bondingCurveProgress >= 100) agent.status = 'graduated';
    }

    writeDB(db);
    res.json({ success: true, agent });
});

app.get('/public/agents', (req, res) => {
    const db = readDB();
    // Return all agents for the public market
    res.json(db.agents);
});

app.get('/market/dex', (req, res) => {
    // Mock DEX data for visualization
    res.json({
        pairs: [
            { id: 'bch-nexus', name: 'BCH / NEXUS', price: '0.00042', volume: '1240.5', change: '+12.5%' },
            { id: 'bch-test', name: 'BCH / TEST', price: '0.00010', volume: '450.2', change: '-2.1%' }
        ],
        recentSwaps: [
            { id: 1, pair: 'BCH/NEXUS', type: 'buy', amount: '0.5 BCH', time: '2s ago' },
            { id: 2, pair: 'BCH/NEXUS', type: 'sell', amount: '1.2 BCH', time: '5m ago' }
        ]
    });
});

// --- WALLET ENDPOINTS ---

app.get('/wallets', authMiddleware, (req, res) => {
    const db = readDB();
    const userWallets = db.wallets.filter(w => w.userId === req.user.id);
    res.json(userWallets);
});

app.post('/wallets', authMiddleware, (req, res) => {
    const walletData = req.body;
    let db = readDB();

    const newWallet = {
        ...walletData,
        userId: req.user.id,
        synchronizedAt: new Date().toISOString(),
        balance: walletData.balance || (Math.random() * 0.1).toFixed(4) // Mock balance if not provided
    };

    const index = db.wallets.findIndex(w => w.address === newWallet.address && w.userId === req.user.id);
    if (index !== -1) {
        db.wallets[index] = { ...db.wallets[index], ...newWallet };
    } else {
        db.wallets.push(newWallet);
    }

    writeDB(db);
    res.json(newWallet);
});

app.get('/public/logs', async (req, res) => {
    const { data: logs } = await supabase
        .from('logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(20);
    res.json(logs || []);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Nexus HQ API (Supabase): ACTIVE`);
    console.log(`📡 Port: ${PORT}\n`);
});
