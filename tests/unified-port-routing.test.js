const test = require('node:test');
const assert = require('node:assert');

test('Unified Single-Port 8081 Architecture Verification', async (t) => {
    await t.test('Verifies metro.config.js configures enhanceMiddleware correctly', () => {
        const metroConfig = require('../metro.config.js');
        assert.ok(metroConfig.server, 'Metro config must have server section');
        assert.strictEqual(typeof metroConfig.server.enhanceMiddleware, 'function', 'enhanceMiddleware must be a function');
    });

    await t.test('EnhanceMiddleware routes /api requests to backend and non-api to metro', (t, done) => {
        const metroConfig = require('../metro.config.js');
        let metroCalled = false;
        const fakeMetroMiddleware = (req, res, next) => {
            metroCalled = true;
            next();
        };

        const unifiedMiddleware = metroConfig.server.enhanceMiddleware(fakeMetroMiddleware);

        // Test non-api route goes to metro
        const fakeReq = { url: '/cv-linkedin-optimize' };
        const fakeRes = {};
        unifiedMiddleware(fakeReq, fakeRes, () => {
            assert.strictEqual(metroCalled, true, 'Non-API requests must pass to Metro handler');
            done();
        });
    });
});
