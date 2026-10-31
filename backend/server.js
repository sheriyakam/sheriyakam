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

// Global rate limiting
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

// Push Notification Dispatch Routes (FCM / APNs)
const notificationsRouter = require('./routes/notifications');
app.use('/api/notifications', notificationsRouter);

// Webhook Routes (Razorpay Route & Disputes)
const webhooksRouter = require('./routes/webhooks');
app.use('/api/webhooks', webhooksRouter);

// Offline Mutation Batch Sync Routes
const mutationsRouter = require('./routes/mutations');
app.use('/api/v1/mutations', mutationsRouter);

// Agent Orchestrator Daemon
const AgentOrchestrator = require('./agents/AgentOrchestrator');

// Production Health Check: Verifies critical dependencies (MongoDB connection)
app.get('/api/health', (req, res) => {
    const isDbConnected = mongoose.connection.readyState === 1;
    const dbStatus = isDbConnected ? 'connected' : 'disconnected';
    const statusCode = isDbConnected ? 200 : 503;

    return res.status(statusCode).json({
        status: isDbConnected ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        database: dbStatus,
        port: process.env.PORT || 8081
    });
});

// Global Error Handler: Suppresses stack traces in production (OWASP / Pre-Deploy Checklist Check 2)
app.use((err, req, res, next) => {
    console.error('[Backend Unhandled Error]', err);
    if (res.headersSent) return next(err);
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production' 
            ? 'An internal error occurred. Please try again later.' 
            : (err.message || 'Internal Server Error')
    });
});

// Start Server when executed directly; export as middleware when imported
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Standalone server is running on http://localhost:${PORT}`);
        AgentOrchestrator.startDaemon(3000);
    });
} else {
    // When mounted inside unified Metro dev server on port 8081
    AgentOrchestrator.startDaemon(3000);
}

module.exports = app;
