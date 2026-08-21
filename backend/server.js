const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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

