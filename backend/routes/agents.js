const express = require('express');
const router = express.Router();
const AgentOrchestrator = require('../agents/AgentOrchestrator');
const AgentLog = require('../models/AgentLog');

/**
 * GET /api/agents/status
 * View real-time status of all autonomous backend AI agents
 */
router.get('/status', async (req, res) => {
    try {
        const status = AgentOrchestrator.getLatestStatus();
        return res.json({
            success: true,
            data: status
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/agents/run
 * Trigger an immediate full sweep across SEO, GEO, Content & Backlink agents
 */
router.post('/run', async (req, res) => {
    try {
        // Run in background and return immediate acknowledgement or wait for results
        const results = await AgentOrchestrator.runAllOnce();
        return res.json({
            success: true,
            message: 'Autonomous AI agents sweep executed successfully.',
            data: results
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/agents/run/:agent
 * Run a specific agent ('seo' | 'geo' | 'content' | 'backlinks')
 */
router.post('/run/:agent', async (req, res) => {
    try {
        const agentKey = req.params.agent.toLowerCase();
        const result = await AgentOrchestrator.runSingle(agentKey);
        return res.json({
            success: true,
            message: `Agent ${agentKey} executed successfully.`,
            data: result
        });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/agents/logs
 * Query persistent audit logs from the database
 */
router.get('/logs', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        let logs = [];
        try {
            logs = await AgentLog.find().sort({ createdAt: -1 }).limit(limit);
        } catch (dbErr) {
            logs = [AgentOrchestrator.getLatestStatus()];
        }
        return res.json({
            success: true,
            count: logs.length,
            data: logs
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
