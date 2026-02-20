import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = process.env.DATABASE_PATH || path.join(__dirname, 'db.json');

// Initialize database
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({
        users: [],
        agents: [],
        wallets: [],
        logs: [],
        commands: [],
        actions: []  // Real-time actions performed by agents
    }, null, 2));
}

const readDB = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

const app = express();
app.use(cors());
app.use(express.json());

// Enable trust proxy for cloud deployments (Render, Heroku, etc.)
app.set('trust proxy', 1);

// Middleware to authenticate token (static mapping for demo/dev)
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

    const token = authHeader.split(' ')[1];
    const db = readDB();
    const user = db.users.find(u => u.token === token);

    if (!user) return res.status(403).json({ error: 'Invalid token' });

    req.user = user;
    next();
};

// --- AUTH ENDPOINTS ---

app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    let db = readDB();
    let user = db.users.find(u => u.email === email);

    if (!user) {
        return res.status(404).json({ error: 'Account not found. Please register via the web interface.' });
    }

    if (user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json(user);
});

app.post('/auth/register', (req, res) => {
    const { email, password } = req.body;
    let db = readDB();

    if (db.users.find(u => u.email === email)) {
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

    db.users.push(user);
    writeDB(db);
    res.json(user);
});

app.get('/auth/check-user/:email', (req, res) => {
    const db = readDB();
    const exists = db.users.some(u => u.email === req.params.email);
    res.json({ exists });
});

// Used by CLI to check connection
app.get('/health', (req, res) => {
    res.json({ status: 'active', nexus: 'BCH Agent Nexus v1.0' });
});

// --- USER SETTINGS ---

app.get('/user/settings', authMiddleware, (req, res) => {
    const db = readDB();
    const user = db.users.find(u => u.id === req.user.id);
    res.json(user.settings || {
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

app.post('/user/settings', authMiddleware, (req, res) => {
    let db = readDB();
    const user = db.users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.settings = {
        ...user.settings,
        ...req.body
    };

    writeDB(db);
    res.json({ success: true, settings: user.settings });
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

app.get('/agents', authMiddleware, (req, res) => {
    const db = readDB();
    const userAgents = db.agents.filter(a => a.userId === req.user.id);
    res.json(userAgents);
});

// Returns the intelligence configuration for a specific agent.
// Used by the SDK's fetchRemoteConfig() method.
app.get('/agents/:agentId/config', authMiddleware, (req, res) => {
    const db = readDB();
    const agent = db.agents.find(a => a.agentId === req.params.agentId && a.userId === req.user.id);
    const user = db.users.find(u => u.id === req.user.id);

    if (!user) return res.status(404).json({ error: 'User not found' });

    // Fallback logic: Agent-specific config > Global user settings > Default empty
    const settings = (agent && agent.settings) ? agent.settings : (user.settings || {});

    // Structure the response for the SDK
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

app.post('/agents', authMiddleware, (req, res) => {
    const agentData = req.body;
    let db = readDB();

    const newAgent = {
        ...agentData,
        id: agentData.agentId || 'ag_' + Math.random().toString(36).substr(2, 9),
        userId: req.user.id,
        synchronizedAt: new Date().toISOString()
    };

    // Update existing or add new
    const index = db.agents.findIndex(a => a.name === newAgent.name && a.userId === req.user.id);
    if (index !== -1) {
        db.agents[index] = { ...db.agents[index], ...newAgent };
    } else {
        db.agents.push(newAgent);
    }

    // Add to logs
    db.logs.unshift({
        id: 'log_' + Date.now(),
        agentName: newAgent.name,
        action: `Agent synchronized: ${newAgent.type} ${newAgent.ticker ? '(' + newAgent.ticker + ')' : ''}`,
        timestamp: new Date().toISOString()
    });

    writeDB(db);
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

// --- PUBLIC LOGS ---

app.get('/public/logs', (req, res) => {
    const db = readDB();
    res.json(db.logs.slice(0, 20));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Nexus HQ API: ACTIVE`);
    console.log(`📡 Port: ${PORT}`);
    console.log(`📂 Database: ${DB_FILE}\n`);
});
