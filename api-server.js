import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, 'db.json');

// Initialize database
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({
        users: [],
        agents: [],
        wallets: [],
        logs: []
    }, null, 2));
}

const readDB = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

const app = express();
app.use(cors());
app.use(express.json());

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

// --- AGENT ENDPOINTS ---

app.get('/agents', authMiddleware, (req, res) => {
    const db = readDB();
    const userAgents = db.agents.filter(a => a.userId === req.user.id);
    res.json(userAgents);
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
        action: `Agent synchronized: ${newAgent.type}`,
        timestamp: new Date().toISOString()
    });

    writeDB(db);
    res.json(newAgent);
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

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`\n🚀 BCH Agent API Server running at http://localhost:${PORT}`);
    console.log(`📂 Database: ${DB_FILE}\n`);
});
