package com.sheriyakam.domain

import kotlinx.serialization.Serializable

@Serializable
enum class LanguageCode(val code: String) {
    EN("en"),
    ML("ml");

    companion object {
        fun fromString(value: String): LanguageCode {
            return when (value.lowercase().trim()) {
                "ml", "malayalam" -> ML
                else -> EN
            }
        }
    }
}

object LocalizationEngine {

    private val enDictionary = mapOf(
        // Brand & Hero
        "brandName" to "Sheriyakam",
        "tagline" to "Kerala's Trusted On-Demand Electricians",
        "emergencyBadge" to "45–90 Min Emergency Response",
        "warrantyBadge" to "30-Day Workmanship Warranty",
        "ratingBadge" to "4.9★ Kerala Customer Rating",
        "bookNow" to "Book Licensed Electrician",
        "callNow" to "Direct Phone Helpline",

        // Quick Lead Modal
        "modalTitle" to "Book Electrician in 60 Seconds",
        "modalSubtitle" to "Verified Kerala licensed wiremen at your doorstep",
        "phonePlaceholder" to "Enter 10-digit mobile number",
        "addressPlaceholder" to "House/Flat name, locality, landmark",
        "describeProblem" to "Describe electrical issue (optional)",
        "aiTriageHelp" to "⚡ AI Smart Triage: Type in English or Manglish (e.g. \"fan slow speed\", \"switch board spark\")",
        "urgencyEmergency" to "Emergency (90 Mins)",
        "urgencyStandard" to "Same-Day (Flexible)",
        "urgencyScheduled" to "Schedule for Later",
        "submitBooking" to "Confirm & Send to Dispatch Desk",
        "submitting" to "Assigning nearest wireman...",
        "successTitle" to "Booking Confirmed!",
        "successMessage" to "Assigned wireman will call you within 10 minutes.",

        // Core Services
        "serviceDiagnostic" to "Diagnostic & Fault Inspection Visit",
        "serviceFan" to "Ceiling & Exhaust Fan Repair",
        "serviceSwitch" to "Modular Switch & Socket Replacement",
        "serviceMcb" to "MCB Distribution Box & Fuse Repair",
        "serviceWiring" to "Complete Home Wiring & Earthing",
        "serviceInverter" to "Inverter & Battery Power Backup",
        "serviceAc" to "AC Breakdown & Gas Charging",
        "serviceCctv" to "CCTV Installation & Security Setup",

        // Pricing & Guarantee
        "startsFrom" to "Starts from",
        "inspectionFeeAdjustable" to "₹49 Inspection Fee (100% Adjusted on Service)",
        "reworkGuarantee" to "30-Day Free Rework Protection",
        "licensedWiremen" to "Government Certified Wiremen",

        // Tracking & Status
        "statusReceived" to "Booking Received",
        "statusAssigned" to "Technician Assigned",
        "statusTransit" to "In Transit",
        "statusWorking" to "Repair in Progress",
        "statusCompleted" to "Completed & Verified",
        "taxInvoice" to "Digital Tax Invoice (SAC 998732)",

        // Errors & Validation
        "errPhoneRequired" to "Please enter a valid 10-digit mobile number",
        "errAddressRequired" to "Please enter your house/building address",
        "errInvalidPhone" to "Mobile number must start with 6, 7, 8, or 9",
        "errNetwork" to "Connection issue. Showing cached contacts.",
        "welcomeBack" to "Welcome back! Loaded your saved address.",

        // Language Switcher
        "switchLanguage" to "മലയാളം"
    )

    private val mlDictionary = mapOf(
        // Brand & Hero
        "brandName" to "ശരിയാക്കാം",
        "tagline" to "കേരളത്തിലെ വിശ്വസ്തരായ ഇലക്ട്രീഷ്യൻ സർവീസ്",
        "emergencyBadge" to "45–90 മിനിറ്റിൽ എമർജൻസി സഹായം",
        "warrantyBadge" to "30 ദിവസത്തെ സർവീസ് വാറന്റി",
        "ratingBadge" to "4.9★ ഉപഭോക്തൃ റേറ്റിംഗ്",
        "bookNow" to "ഇലക്ട്രീഷ്യനെ ബുക്ക് ചെയ്യുക",
        "callNow" to "ഡയറക്ട് ഹെൽപ്പ്‌ലൈൻ",

        // Quick Lead Modal
        "modalTitle" to "60 സെക്കൻഡിൽ ഇലക്ട്രീഷ്യനെ ബുക്ക് ചെയ്യാം",
        "modalSubtitle" to "സർക്കാർ ലൈസൻസുള്ള വിദഗ്ദ്ധ വയർമാൻമാർ നിങ്ങളുടെ വീട്ടിലെത്തുന്നു",
        "phonePlaceholder" to "10 അക്ക മൊബൈൽ നമ്പർ നൽകുക",
        "addressPlaceholder" to "വീട്ടുപേര്, സ്ഥലം, ലാൻഡ്മാർക്ക്",
        "describeProblem" to "വൈദ്യുത പ്രശ്നം വിവരിക്കുക (ഓപ്ഷണൽ)",
        "aiTriageHelp" to "⚡ AI സ്മാർട്ട് ഡയഗ്നോസിസ്: മലയാളത്തിലോ ഇംഗ്ലീഷിലോ എഴുതാം (ഉദാ: \"ഫാൻ കറങ്ങുന്നില്ല\", \"എംസിബി ട്രിപ്പ് ആകുന്നു\")",
        "urgencyEmergency" to "എമർജൻസി (90 മിനിറ്റ്)",
        "urgencyStandard" to "ഇന്ന് തന്നെ (സൗകര്യപ്രദമായ സമയം)",
        "urgencyScheduled" to "മറ്റൊരു ദിവസത്തേക്ക്",
        "submitBooking" to "സ്ഥിരീകരിച്ച് വയർമാനെ അയക്കുക",
        "submitting" to "അടുത്തുള്ള വയർമാനെ കണ്ടെത്തുന്നു...",
        "successTitle" to "ബുക്കിംഗ് വിജയകരം!",
        "successMessage" to "നിങ്ങളുടെ വയർമാൻ 10 മിനിറ്റിനുള്ളിൽ വിളിക്കുന്നതാണ്.",

        // Core Services
        "serviceDiagnostic" to "ഫോൾട്ട് ഇൻസ്പെക്ഷൻ & ചെക്കപ്പ്",
        "serviceFan" to "ഫാൻ റിപ്പയർ & പുതിയത് ഫിറ്റ് ചെയ്യൽ",
        "serviceSwitch" to "സ്വിച്ച് & പവർ സോക്കറ്റ് മാറ്റിസ്ഥാപിക്കൽ",
        "serviceMcb" to "എംസിബി ഡിസ്ട്രിബ്യൂഷൻ ബോക്സ് റിപ്പയർ",
        "serviceWiring" to "വീട് വയറിംഗ് & എർത്തിംഗ് സർവീസ്",
        "serviceInverter" to "ഇൻവെർട്ടർ & ബാറ്ററി ബാക്കപ്പ് വയറിംഗ്",
        "serviceAc" to "എസി റിപ്പയർ & ഗ്യാസ് ചാർജിംഗ്",
        "serviceCctv" to "സിസിടിവി ക്യാമറ ഇൻസ്റ്റാളേഷൻ",

        // Pricing & Guarantee
        "startsFrom" to "നിരക്ക്",
        "inspectionFeeAdjustable" to "₹49 ഇൻസ്പെക്ഷൻ ഫീസ് (സർവീസ് ചെയ്യുമ്പോൾ കുറയ്ക്കുന്നതാണ്)",
        "reworkGuarantee" to "30 ദിവസത്തെ സൗജന്യ റീ-വർക്ക് ഗ്യാരണ്ടി",
        "licensedWiremen" to "സർക്കാർ അംഗീകൃത ലൈസൻസ്ഡ് വയർമാൻമാർ",

        // Tracking & Status
        "statusReceived" to "ബുക്കിംഗ് ലഭിച്ചു",
        "statusAssigned" to "വയർമാനെ നിയോഗിച്ചു",
        "statusTransit" to "ഇലക്ട്രീഷ്യൻ യാത്രയിലാണ്",
        "statusWorking" to "വർക്ക് പുരോഗമിക്കുന്നു",
        "statusCompleted" to "വിജയകരമായി പൂർത്തിയായി",
        "taxInvoice" to "ഡിജിറ്റൽ ടാക്സ് ഇൻവോയ്സ് (SAC 998732)",

        // Errors & Validation
        "errPhoneRequired" to "ദയവായി ശരിയായ 10 അക്ക മൊബൈൽ നമ്പർ നൽകുക",
        "errAddressRequired" to "ദയവായി വീട്ടുപേരും സ്ഥലവും നൽകുക",
        "errInvalidPhone" to "മൊബൈൽ നമ്പർ 6, 7, 8, അല്ലെങ്കിൽ 9-ൽ ആരംഭിക്കണം",
        "errNetwork" to "നെറ്റ്‌വർക്ക് കണക്ഷൻ ഇല്ല. സേവ് ചെയ്ത വിവരങ്ങൾ കാണിക്കുന്നു.",
        "welcomeBack" to "വീണ്ടും സ്വാഗതം! നിങ്ങളുടെ വിലാസം ലഭ്യമാക്കിയിട്ടുണ്ട്.",

        // Language Switcher
        "switchLanguage" to "English"
    )

    fun getTranslation(lang: LanguageCode, key: String, fallback: String = ""): String {
        val dict = when (lang) {
            LanguageCode.ML -> mlDictionary
            LanguageCode.EN -> enDictionary
        }
        return dict[key] ?: enDictionary[key] ?: fallback.ifEmpty { key }
    }

    fun getTranslationByCode(code: String, key: String, fallback: String = ""): String {
        val lang = LanguageCode.fromString(code)
        return getTranslation(lang, key, fallback)
    }

    fun getKeys(lang: LanguageCode): Set<String> {
        return when (lang) {
            LanguageCode.ML -> mlDictionary.keys
            LanguageCode.EN -> enDictionary.keys
        }
    }
}
