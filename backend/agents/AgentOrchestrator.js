/**
 * 🎛️ AgentOrchestrator (Master Background Agent Daemon)
 * Runs all autonomous workers quietly in the background on scheduled intervals.
 * Collects metrics, detects anomalies, and logs unified audit trails.
 */

const SeoHealthAgent = require('./SeoHealthAgent');
const GeoAeoAgent = require('./GeoAeoAgent');
const ContentRefresherAgent = require('./ContentRefresherAgent');
const BacklinkMonitorAgent = require('./BacklinkMonitorAgent');
const AgentLog = require('../models/AgentLog');

class AgentOrchestrator {
    constructor() {
        this.agents = {
            seo: SeoHealthAgent,
            geo: GeoAeoAgent,
            content: ContentRefresherAgent,
            backlinks: BacklinkMonitorAgent
        };
        this.timer = null;
        this.intervalMs = 6 * 60 * 60 * 1000; // Runs every 6 hours automatically
        this.lastRunResults = {};
        this.isRunning = false;
    }

    /**
     * Executes all agents sequentially in the background
     */
    async runAllOnce() {
        if (this.isRunning) {
            console.log('[⚠️ Orchestrator] A background sweep is already running. Skipping concurrent run.');
            return this.lastRunResults;
        }

        this.isRunning = true;
        const sweepStart = Date.now();
        console.log(`\n======================================================`);
        console.log(`🚀 [AgentOrchestrator] Starting Autonomous SEO/GEO/Backlink Sweep...`);
        console.log(`======================================================`);

        try {
            const seoResult = await this.agents.seo.run();
            const geoResult = await this.agents.geo.run();
            const contentResult = await this.agents.content.run();
            const backlinksResult = await this.agents.backlinks.run();

            const totalDurationMs = Date.now() - sweepStart;

            this.lastRunResults = {
                timestamp: new Date().toISOString(),
                totalDurationMs,
                status: 'healthy',
                seo: seoResult,
                geo: geoResult,
                content: contentResult,
                backlinks: backlinksResult
            };

            console.log(`======================================================`);
            console.log(`✨ [AgentOrchestrator] All background agents finished in ${totalDurationMs}ms!`);
            console.log(`======================================================\n`);

            return this.lastRunResults;
        } catch (error) {
            console.error('[❌ Orchestrator] Error during sweep:', error);
            return { error: error.message };
        } finally {
            this.isRunning = false;
        }
    }

    /**
     * Run a single agent by key ('seo' | 'geo' | 'content' | 'backlinks')
     */
    async runSingle(agentKey) {
        const agent = this.agents[agentKey];
        if (!agent) {
            throw new Error(`Unknown agent: "${agentKey}". Available: seo, geo, content, backlinks`);
        }
        return await agent.run();
    }

    /**
     * Returns the latest execution report and cached logs
     */
    getLatestStatus() {
        return {
            daemonActive: !!this.timer,
            intervalHours: this.intervalMs / (1000 * 60 * 60),
            lastSweep: this.lastRunResults.timestamp || 'Never',
            summary: this.lastRunResults
        };
    }

    /**
     * Starts the quiet background scheduler
     */
    startDaemon(delayFirstRunMs = 5000) {
        if (this.timer) {
            console.log('[ℹ️ Orchestrator] Daemon is already running.');
            return;
        }

        console.log(`[🤖 Orchestrator] Background AI Agent Daemon initialized (Interval: ${this.intervalMs / 3600000}h).`);
        
        // Initial quiet warm-up run after a short delay
        setTimeout(() => {
            this.runAllOnce().catch(err => console.error('[Orchestrator warm-up error]:', err.message));
        }, delayFirstRunMs);

        // Periodic background interval
        this.timer = setInterval(() => {
            this.runAllOnce().catch(err => console.error('[Orchestrator scheduled run error]:', err.message));
        }, this.intervalMs);
    }

    /**
     * Stops the scheduler
     */
    stopDaemon() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
            console.log('[🛑 Orchestrator] Background daemon stopped.');
        }
    }
}

module.exports = new AgentOrchestrator();
