import express from 'express';
import cors from 'cors';
import crypto from 'crypto';

const app = express();
const PORT = process.env.PORT || 4000;

// In-memory user database (replace with real database in production)
const users = new Map();

app.use(cors());
app.use(express.json());

// Check if user exists
app.get('/auth/check-user/:email', (req, res) => {
    const email = decodeURIComponent(req.params.email);
    const user = Array.from(users.values()).find(u => u.email === email);

    if (user) {
        res.json({ exists: true });
    } else {
        res.status(404).json({ exists: false, error: 'User not found' });
    }
});

// Login endpoint
app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    let user = Array.from(users.values()).find(u => u.email === email);

    // Auto-register if user doesn't exist (for web interface)
    if (!user) {
        const userId = crypto.randomUUID();
        const token = crypto.randomBytes(32).toString('hex');

        user = {
            id: userId,
            email,
            password: hashPassword(password),
            name: email.split('@')[0],
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
            token,
            inventory: [],
            createdAt: new Date().toISOString()
        };

        users.set(userId, user);
        console.log(`✅ New user registered: ${email}`);
    } else {
        // Verify password
        if (user.password !== hashPassword(password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Regenerate token on login
        user.token = crypto.randomBytes(32).toString('hex');
    }

    // Return user data (without password)
    const { password: _, ...userData } = user;
    res.json(userData);
});

// Logout endpoint
app.post('/auth/logout', (req, res) => {
    res.json({ success: true });
});

// Get user profile
app.get('/auth/profile', authenticateToken, (req, res) => {
    const user = users.get(req.userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const { password: _, ...userData } = user;
    res.json(userData);
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const user = Array.from(users.values()).find(u => u.token === token);

    if (!user) {
        return res.status(403).json({ error: 'Invalid token' });
    }

    req.userId = user.id;
    next();
}

// Simple password hashing (use bcrypt in production)
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        users: users.size,
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`🚀 BCH Agent API running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

export default app;
