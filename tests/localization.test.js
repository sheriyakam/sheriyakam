const { test, describe } = require('node:test');
const assert = require('assert');

const { TRANSLATIONS, getTranslation } = require('../constants/translations');

describe('Bilingual Malayalam & English Localization Engine', () => {
    test('Ensures complete symmetry between English and Malayalam translation keys', () => {
        const enKeys = Object.keys(TRANSLATIONS.en);
        const mlKeys = Object.keys(TRANSLATIONS.ml);

        assert.strictEqual(enKeys.length, mlKeys.length, 'English and Malayalam key count must match');

        for (const key of enKeys) {
            assert.ok(TRANSLATIONS.ml[key], `Missing Malayalam translation for key: ${key}`);
            assert.strictEqual(typeof TRANSLATIONS.ml[key], 'string');
            assert.ok(TRANSLATIONS.ml[key].length > 0, `Malayalam translation for ${key} cannot be empty`);
        }
    });

    test('Retrieves correct Malayalam translation for core emergency and booking tokens', () => {
        const mlBrand = getTranslation('ml', 'brandName');
        assert.strictEqual(mlBrand, 'ശരിയാക്കാം');

        const mlEmergency = getTranslation('ml', 'emergencyBadge');
        assert.strictEqual(mlEmergency, '45–90 മിനിറ്റിൽ എമർജൻസി സഹായം');

        const mlPhonePlaceholder = getTranslation('ml', 'phonePlaceholder');
        assert.strictEqual(mlPhonePlaceholder, '10 അക്ക മൊബൈൽ നമ്പർ നൽകുക');
    });

    test('Falls back gracefully to English when an unknown language code is requested', () => {
        const fallbackRes = getTranslation('fr', 'brandName');
        assert.strictEqual(fallbackRes, 'Sheriyakam');
    });

    test('Falls back to custom fallback string if key is not found in dictionary', () => {
        const customRes = getTranslation('ml', 'nonExistentKey', 'Default Fallback String');
        assert.strictEqual(customRes, 'Default Fallback String');
    });
});
