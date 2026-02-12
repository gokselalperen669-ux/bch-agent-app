# BCH Agent CLI & Web Integration

This document explains how the BCH Agent CLI and Web Interface work together seamlessly.

## 🔗 Integration Features

### 1. **Auto-Login from CLI**
When you login via the CLI, the web interface automatically opens and logs you in:

```bash
bch-agent login
```

This will:
- Validate your credentials
- Check if your account exists
- Automatically open your default browser
- Log you into the web interface with your session token

### 2. **Account Validation**
The CLI now validates that accounts exist before allowing login:

- ✅ **Existing accounts**: Can login via CLI
- ❌ **Non-existent accounts**: Must register via web interface first
- 🔒 **Invalid credentials**: Clear error messages

### 3. **Skip Browser Opening**
If you don't want the browser to open automatically:

```bash
bch-agent login --no-browser
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Both `bch-agent-sdk` and `bch-agent-app` repositories

### Setup

1. **Install Web App Dependencies**
```bash
cd bch-agent-app
npm install
```

2. **Install SDK Dependencies**
```bash
cd bch-agent-sdk
npm install
npm run build
```

3. **Link SDK Globally (for CLI access)**
```bash
cd bch-agent-sdk
npm link
```

### Running the System

#### Option 1: Run Everything Together (Recommended)
```bash
cd bch-agent-app
npm run dev:all
```

This starts both:
- Web interface on `http://localhost:5173`
- API server on `http://localhost:4000`

#### Option 2: Run Separately
```bash
# Terminal 1 - API Server
cd bch-agent-app
npm run api

# Terminal 2 - Web Interface
cd bch-agent-app
npm run dev

# Terminal 3 - Use CLI
bch-agent login
```

## 📋 Usage Flow

### First Time User

1. **Create Account via Web**
   - Visit `http://localhost:5173`
   - Click "Create Account"
   - Enter email and password
   - Account is created automatically

2. **Login via CLI**
   ```bash
   bch-agent login
   ```
   - Enter the same email and password
   - Browser opens automatically
   - You're logged into the web interface

### Returning User

```bash
bch-agent login
```
- Enter your credentials
- Web interface opens automatically
- Continue working seamlessly

## 🔧 Configuration

### Environment Variables

**Web App** (`.env` in `bch-agent-app`):
```env
VITE_API_URL=http://localhost:4000
```

**SDK** (set in your shell or `.env`):
```env
AGENT_API_URL=http://localhost:4000
AGENT_WEB_URL=http://localhost:5173
```

## 🛡️ Security Features

- **Token-based authentication**: Secure session management
- **Password hashing**: SHA-256 hashing (upgrade to bcrypt in production)
- **Auto-expiring sessions**: Tokens regenerated on each login
- **CORS protection**: Only allowed origins can access the API

## 🐛 Troubleshooting

### "Account not found" error
**Solution**: Create an account via the web interface first at `http://localhost:5173`

### "Connection failed" error
**Solution**: Ensure the API server is running:
```bash
cd bch-agent-app
npm run api
```

### Browser doesn't open
**Solution**: 
1. Check if the web server is running
2. Try manual login at `http://localhost:5173`
3. Use `--no-browser` flag and open manually

### CLI commands not found
**Solution**: Link the SDK globally:
```bash
cd bch-agent-sdk
npm link
```

## 📦 Project Structure

```
bch-agent-sdk/
├── src/
│   ├── cli/
│   │   └── commands/
│   │       └── login.ts          # Enhanced with auto-browser opening
│   └── utils/
│       ├── auth.ts                # Authentication utilities
│       └── browser.ts             # NEW: Browser opening utilities
│
bch-agent-app/
├── api-server.js                  # NEW: Express API server
├── src/
│   ├── pages/
│   │   └── Login.tsx              # Enhanced with auto-login support
│   └── context/
│       └── AuthContext.tsx        # Authentication context
└── package.json                   # Updated with API scripts
```

## 🎯 Next Steps

1. **Deploy to Production**
   - Use PostgreSQL or MongoDB for user storage
   - Implement bcrypt for password hashing
   - Add JWT token expiration
   - Set up HTTPS

2. **Enhanced Features**
   - Password reset functionality
   - Email verification
   - Two-factor authentication
   - Session management dashboard

## 📝 API Endpoints

### `POST /auth/login`
Login with email and password. Auto-registers if user doesn't exist (web only).

**Request:**
```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "user",
  "token": "session-token",
  "avatar": "avatar-url",
  "inventory": []
}
```

### `GET /auth/check-user/:email`
Check if a user account exists (used by CLI).

**Response (exists):**
```json
{
  "exists": true
}
```

**Response (not found):**
```json
{
  "exists": false,
  "error": "User not found"
}
```

### `GET /health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "users": 5,
  "timestamp": "2026-02-12T15:38:22.000Z"
}
```

## 🤝 Contributing

When contributing to the integration:
1. Test both CLI and Web flows
2. Ensure backward compatibility
3. Update this README with any changes
4. Add error handling for edge cases

## 📄 License

MIT License - See LICENSE file for details
