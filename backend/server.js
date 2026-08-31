const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const { ipRateLimiter } = require('./utils/security');

const app = express();

// Trust proxy for correct IP resolution behind Vercel/Nginx reverse proxies
app.set('trust proxy', 1);

// Restricted CORS — only allow requests from the Sheriyakam frontend
const allowedOrigins = [
    process.env.FRONTEND_URL || 'https://sheriyakam.vercel.app',
    'http://localhost:8081',
    'http://localhost:19006'
];
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, server-to-server)
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('Blocked by CORS policy'));
    },
    credentials: true
}));

app.use(express.json({ limit: '1mb' }));

// Global security headers (Helmet-equivalent)
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');
    next();
});

// Global rate limiting (from utils/security.js — was previously unused)
app.use(ipRateLimiter);

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sheriyakam';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Successfully connected to MongoDB Compass!'))
    .catch((error) => console.error('❌ MongoDB connection error:', error));

// Auth Routes
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

// Autonomous AI Agents Routes (SEO, GEO, AEO, Backlinks, Content)
const agentsRouter = require('./routes/agents');
app.use('/api/agents', agentsRouter);

// Agent Orchestrator Daemon
const AgentOrchestrator = require('./agents/AgentOrchestrator');

// Basic route to test the server
app.get('/api/health', (req, res) => {
    res.json({ status: 'active', message: 'Sheriyakam Backend API is running properly' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    // Start silent background AI Agent Daemon
    AgentOrchestrator.startDaemon(3000);
});

