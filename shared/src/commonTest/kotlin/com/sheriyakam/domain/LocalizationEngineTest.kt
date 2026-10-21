package com.sheriyakam.domain

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class LocalizationEngineTest {

    @Test
    fun testEnsuresCompleteSymmetryBetweenEnglishAndMalayalamKeys() {
        val enKeys = LocalizationEngine.getKeys(LanguageCode.EN)
        val mlKeys = LocalizationEngine.getKeys(LanguageCode.ML)

        assertEquals(enKeys.size, mlKeys.size, "English and Malayalam key count must match")

        for (key in enKeys) {
            val mlTranslation = LocalizationEngine.getTranslation(LanguageCode.ML, key)
            assertTrue(mlTranslation.isNotEmpty(), "Malayalam translation for $key cannot be empty")
        }
    }

    @Test
    fun testRetrievesCorrectMalayalamTranslationForCoreEmergencyAndBookingTokens() {
        val mlBrand = LocalizationEngine.getTranslation(LanguageCode.ML, "brandName")
        assertEquals("ശരിയാക്കാം", mlBrand)

        val mlEmergency = LocalizationEngine.getTranslation(LanguageCode.ML, "emergencyBadge")
        assertEquals("45–90 മിനിറ്റിൽ എമർജൻസി സഹായം", mlEmergency)

        val mlPhonePlaceholder = LocalizationEngine.getTranslation(LanguageCode.ML, "phonePlaceholder")
        assertEquals("10 അക്ക മൊബൈൽ നമ്പർ നൽകുക", mlPhonePlaceholder)
    }

    @Test
    fun testFallsBackGracefullyToEnglishWhenUnknownLanguageIsRequested() {
        val fallbackRes = LocalizationEngine.getTranslationByCode("fr", "brandName")
        assertEquals("Sheriyakam", fallbackRes)
    }

    @Test
    fun testFallsBackToCustomFallbackStringIfKeyNotFound() {
        val customRes = LocalizationEngine.getTranslation(
            lang = LanguageCode.ML,
            key = "nonExistentKey",
            fallback = "Default Fallback String"
        )
        assertEquals("Default Fallback String", customRes)
    }
}
