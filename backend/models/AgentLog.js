const mongoose = require('mongoose');

const AgentLogSchema = new mongoose.Schema({
    agentName: {
        type: String,
        required: true,
        enum: ['SeoHealthAgent', 'GeoAeoAgent', 'ContentRefresherAgent', 'BacklinkMonitorAgent', 'OpsGuardAgent', 'SystemOrchestrator']
    },
    status: {
        type: String,
        enum: ['success', 'warning', 'error'],
        default: 'success'
    },
    summary: {
        type: String,
        required: true
    },
    metrics: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    findings: [{
        level: { type: String, enum: ['info', 'warning', 'critical'] },
        message: String,
        target: String
    }],
    recommendations: [String],
    executionTimeMs: Number,
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

const Model = mongoose.models.AgentLog || mongoose.model('AgentLog', AgentLogSchema);

// In-memory circular buffer for fast zero-blocking retrieval
const inMemoryLogs = [];
const MAX_MEM_LOGS = 100;

Model.saveSilently = async function(data) {
    const entry = { ...data, createdAt: new Date() };
    inMemoryLogs.unshift(entry);
    if (inMemoryLogs.length > MAX_MEM_LOGS) inMemoryLogs.pop();

    if (mongoose.connection && mongoose.connection.readyState === 1) {
        try {
            return await Model.create(data);
        } catch (e) {
            // Silently ignore DB errors
        }
    }
    return entry;
};

Model.getRecentLogs = async function(limit = 20) {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
        try {
            return await Model.find().sort({ createdAt: -1 }).limit(limit);
        } catch (e) {}
    }
    return inMemoryLogs.slice(0, limit);
};

module.exports = Model;
