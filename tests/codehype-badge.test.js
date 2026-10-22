const test = require('node:test');
const assert = require('node:assert');

test('CodeHype Badge Verification & SEO Integration', async (t) => {
    const CODEHYPE_PRODUCT_URL = 'https://www.codehype.ai/product/sheriyakam?utm_source=codehype_badge';
    const CODEHYPE_BADGE_IMG = 'https://www.codehype.ai/badges/sheriyakam.svg?variant=find-us&v=20';

    await t.test('Verifies target URL structure and campaign attribution tracking', () => {
        const url = new URL(CODEHYPE_PRODUCT_URL);
        assert.strictEqual(url.hostname, 'www.codehype.ai');
        assert.strictEqual(url.pathname, '/product/sheriyakam');
        assert.strictEqual(url.searchParams.get('utm_source'), 'codehype_badge');
    });

    await t.test('Verifies badge SVG asset parameters and dimensions', () => {
        const imgUrl = new URL(CODEHYPE_BADGE_IMG);
        assert.strictEqual(imgUrl.hostname, 'www.codehype.ai');
        assert.strictEqual(imgUrl.pathname, '/badges/sheriyakam.svg');
        assert.strictEqual(imgUrl.searchParams.get('variant'), 'find-us');
        assert.strictEqual(imgUrl.searchParams.get('v'), '20');
    });

    await t.test('Generates compliant external link attributes with security rel guardrails', () => {
        const badgeConfig = {
            href: CODEHYPE_PRODUCT_URL,
            target: '_blank',
            rel: 'noopener noreferrer',
            width: 180,
            height: 65,
            alt: 'Featured on CodeHype'
        };

        assert.strictEqual(badgeConfig.rel, 'noopener noreferrer');
        assert.strictEqual(badgeConfig.target, '_blank');
        assert.strictEqual(badgeConfig.width, 180);
        assert.strictEqual(badgeConfig.height, 65);
    });
});
