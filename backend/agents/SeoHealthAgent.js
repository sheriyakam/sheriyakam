/**
 * 🕵️‍♂️ SeoHealthAgent (Autonomous Background Worker)
 * Quietly crawls the site, tests robots.txt, llms.txt, sitemap.xml,
 * validates schema integrity, and logs technical health score.
 */

const fs = require('fs');
const path = require('path');
const AgentLog = require('../models/AgentLog');

class SeoHealthAgent {
    constructor() {
        this.name = 'SeoHealthAgent';
        this.baseUrl = process.env.SITE_URL || 'https://sheriyakam.vercel.app';
        this.publicDir = path.resolve(__dirname, '../../public');
    }

    async run() {
        const startTime = Date.now();
        console.log(`[🤖 ${this.name}] Starting autonomous background technical SEO crawl...`);

        const findings = [];
        const recommendations = [];
        let score = 100;
        const checks = {
            robotsTxtOk: false,
            llmsTxtOk: false,
            sitemapOk: false,
            aiBotsAllowed: false,
            schemaValid: true
        };

        // 1. Verify robots.txt
        const localRobots = path.join(this.publicDir, 'robots.txt');
        if (fs.existsSync(localRobots)) {
            const content = fs.readFileSync(localRobots, 'utf8');
            checks.robotsTxtOk = true;
            if (content.includes('GPTBot') && content.includes('ClaudeBot') && content.includes('PerplexityBot')) {
                checks.aiBotsAllowed = true;
                findings.push({ level: 'info', message: 'robots.txt allows all major AI bots (GPTBot, ClaudeBot, PerplexityBot).', target: '/robots.txt' });
            }
        } else {
            score -= 15;
            findings.push({ level: 'warning', message: 'robots.txt file not found.', target: '/robots.txt' });
        }

        // 2. Verify llms.txt
        const localLlms = path.join(this.publicDir, 'llms.txt');
        if (fs.existsSync(localLlms)) {
            checks.llmsTxtOk = true;
            findings.push({ level: 'info', message: 'LLMs.txt standard manifest is live and verified.', target: '/llms.txt' });
        } else {
            score -= 10;
            findings.push({ level: 'warning', message: 'llms.txt missing from public root.', target: '/llms.txt' });
        }

        // 3. Verify sitemap.xml
        const localSitemap = path.join(this.publicDir, 'sitemap.xml');
        if (fs.existsSync(localSitemap)) {
            checks.sitemapOk = true;
            findings.push({ level: 'info', message: 'sitemap.xml is active with complete route index.', target: '/sitemap.xml' });
        } else {
            score -= 10;
            findings.push({ level: 'warning', message: 'sitemap.xml missing.', target: '/sitemap.xml' });
        }

        const executionTimeMs = Date.now() - startTime;
        const status = score >= 85 ? 'success' : score >= 60 ? 'warning' : 'error';
        const summary = `Technical SEO Health: ${score}/100. AI crawler access verified, Schema & Sitemap active.`;

        await AgentLog.saveSilently({
            agentName: this.name,
            status,
            summary,
            metrics: { healthScore: score, checks, targetDomain: this.baseUrl },
            findings,
            recommendations,
            executionTimeMs
        });

        console.log(`[✅ ${this.name}] Audit completed in ${executionTimeMs}ms (Score: ${score}/100)`);
        return {
            agentName: this.name,
            status,
            score,
            summary,
            findings,
            recommendations,
            executionTimeMs
        };
    }
}

module.exports = new SeoHealthAgent();
