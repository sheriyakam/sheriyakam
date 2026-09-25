/**
 * Bilingual Localization Dictionary (English & Malayalam)
 * Covers core booking, service catalog, AI diagnostic triage, status tracking, and error messages.
 */

export const TRANSLATIONS = {
    en: {
        // Brand & Hero
        brandName: 'Sheriyakam',
        tagline: 'Kerala\'s Trusted On-Demand Electricians',
        emergencyBadge: '45–90 Min Emergency Response',
        warrantyBadge: '30-Day Workmanship Warranty',
        ratingBadge: '4.9★ Kerala Customer Rating',
        bookNow: 'Book Licensed Electrician',
        callNow: 'Direct Phone Helpline',

        // Quick Lead Modal
        modalTitle: 'Book Electrician in 60 Seconds',
        modalSubtitle: 'Verified Kerala licensed wiremen at your doorstep',
        phonePlaceholder: 'Enter 10-digit mobile number',
        addressPlaceholder: 'House/Flat name, locality, landmark',
        describeProblem: 'Describe electrical issue (optional)',
        aiTriageHelp: '⚡ AI Smart Triage: Type in English or Manglish (e.g. "fan slow speed", "switch board spark")',
        urgencyEmergency: 'Emergency (90 Mins)',
        urgencyStandard: 'Same-Day (Flexible)',
        urgencyScheduled: 'Schedule for Later',
        submitBooking: 'Confirm & Send to Dispatch Desk',
        submitting: 'Assigning nearest wireman...',
        successTitle: 'Booking Confirmed!',
        successMessage: 'Assigned wireman will call you within 10 minutes.',

        // Core Services
        serviceDiagnostic: 'Diagnostic & Fault Inspection Visit',
        serviceFan: 'Ceiling & Exhaust Fan Repair',
        serviceSwitch: 'Modular Switch & Socket Replacement',
        serviceMcb: 'MCB Distribution Box & Fuse Repair',
        serviceWiring: 'Complete Home Wiring & Earthing',
        serviceInverter: 'Inverter & Battery Power Backup',
        serviceAc: 'AC Breakdown & Gas Charging',
        serviceCctv: 'CCTV Installation & Security Setup',

        // Pricing & Guarantee
        startsFrom: 'Starts from',
        inspectionFeeAdjustable: '₹49 Inspection Fee (100% Adjusted on Service)',
        reworkGuarantee: '30-Day Free Rework Protection',
        licensedWiremen: 'Government Certified Wiremen',

        // Tracking & Status
        statusReceived: 'Booking Received',
        statusAssigned: 'Technician Assigned',
        statusTransit: 'In Transit',
        statusWorking: 'Repair in Progress',
        statusCompleted: 'Completed & Verified',
        taxInvoice: 'Digital Tax Invoice (SAC 998732)',

        // Errors & Validation
        errPhoneRequired: 'Please enter a valid 10-digit mobile number',
        errAddressRequired: 'Please enter your house/building address',
        errInvalidPhone: 'Mobile number must start with 6, 7, 8, or 9',
        errNetwork: 'Connection issue. Showing cached contacts.',
        welcomeBack: 'Welcome back! Loaded your saved address.',

        // Language Switcher
        switchLanguage: 'മലയാളം'
    },
    ml: {
        // Brand & Hero
        brandName: 'ശരിയാക്കാം',
        tagline: 'കേരളത്തിലെ വിശ്വസ്തരായ ഇലക്ട്രീഷ്യൻ സർവീസ്',
        emergencyBadge: '45–90 മിനിറ്റിൽ എമർജൻസി സഹായം',
        warrantyBadge: '30 ദിവസത്തെ സർവീസ് വാറന്റി',
        ratingBadge: '4.9★ ഉപഭോക്തൃ റേറ്റിംഗ്',
        bookNow: 'ഇലക്ട്രീഷ്യനെ ബുക്ക് ചെയ്യുക',
        callNow: 'ഡയറക്ട് ഹെൽപ്പ്‌ലൈൻ',

        // Quick Lead Modal
        modalTitle: '60 സെക്കൻഡിൽ ഇലക്ട്രീഷ്യനെ ബുക്ക് ചെയ്യാം',
        modalSubtitle: 'സർക്കാർ ലൈസൻസുള്ള വിദഗ്ദ്ധ വയർമാൻമാർ നിങ്ങളുടെ വീട്ടിലെത്തുന്നു',
        phonePlaceholder: '10 അക്ക മൊബൈൽ നമ്പർ നൽകുക',
        addressPlaceholder: 'വീട്ടുപേര്, സ്ഥലം, ലാൻഡ്മാർക്ക്',
        describeProblem: 'വൈദ്യുത പ്രശ്നം വിവരിക്കുക (ഓപ്ഷണൽ)',
        aiTriageHelp: '⚡ AI സ്മാർട്ട് ഡയഗ്നോസിസ്: മലയാളത്തിലോ ഇംഗ്ലീഷിലോ എഴുതാം (ഉദാ: "ഫാൻ കറങ്ങുന്നില്ല", "എംസിബി ട്രിപ്പ് ആകുന്നു")',
        urgencyEmergency: 'എമർജൻസി (90 മിനിറ്റ്)',
        urgencyStandard: 'ഇന്ന് തന്നെ (സൗകര്യപ്രദമായ സമയം)',
        urgencyScheduled: 'മറ്റൊരു ദിവസത്തേക്ക്',
        submitBooking: 'സ്ഥിരീകരിച്ച് വയർമാനെ അയക്കുക',
        submitting: 'അടുത്തുള്ള വയർമാനെ കണ്ടെത്തുന്നു...',
        successTitle: 'ബുക്കിംഗ് വിജയകരം!',
        successMessage: 'നിങ്ങളുടെ വയർമാൻ 10 മിനിറ്റിനുള്ളിൽ വിളിക്കുന്നതാണ്.',

        // Core Services
        serviceDiagnostic: 'ഫോൾട്ട് ഇൻസ്പെക്ഷൻ & ചെക്കപ്പ്',
        serviceFan: 'ഫാൻ റിപ്പയർ & പുതിയത് ഫിറ്റ് ചെയ്യൽ',
        serviceSwitch: 'സ്വിച്ച് & പവർ സോക്കറ്റ് മാറ്റിസ്ഥാപിക്കൽ',
        serviceMcb: 'എംസിബി ഡിസ്ട്രിബ്യൂഷൻ ബോക്സ് റിപ്പയർ',
        serviceWiring: 'വീട് വയറിംഗ് & എർത്തിംഗ് സർവീസ്',
        serviceInverter: 'ഇൻവെർട്ടർ & ബാറ്ററി ബാക്കപ്പ് വയറിംഗ്',
        serviceAc: 'എസി റിപ്പയർ & ഗ്യാസ് ചാർജിംഗ്',
        serviceCctv: 'സിസിടിവി ക്യാമറ ഇൻസ്റ്റാളേഷൻ',

        // Pricing & Guarantee
        startsFrom: 'നിരക്ക്',
        inspectionFeeAdjustable: '₹49 ഇൻസ്പെക്ഷൻ ഫീസ് (സർവീസ് ചെയ്യുമ്പോൾ കുറയ്ക്കുന്നതാണ്)',
        reworkGuarantee: '30 ദിവസത്തെ സൗജന്യ റീ-വർക്ക് ഗ്യാരണ്ടി',
        licensedWiremen: 'സർക്കാർ അംഗീകൃത ലൈസൻസ്ഡ് വയർമാൻമാർ',

        // Tracking & Status
        statusReceived: 'ബുക്കിംഗ് ലഭിച്ചു',
        statusAssigned: 'വയർമാനെ നിയോഗിച്ചു',
        statusTransit: 'ഇലക്ട്രീഷ്യൻ യാത്രയിലാണ്',
        statusWorking: 'വർക്ക് പുരോഗമിക്കുന്നു',
        statusCompleted: 'വിജയകരമായി പൂർത്തിയായി',
        taxInvoice: 'ഡിജിറ്റൽ ടാക്സ് ഇൻവോയ്സ് (SAC 998732)',

        // Errors & Validation
        errPhoneRequired: 'ദയവായി ശരിയായ 10 അക്ക മൊബൈൽ നമ്പർ നൽകുക',
        errAddressRequired: 'ദയവായി വീട്ടുപേരും സ്ഥലവും നൽകുക',
        errInvalidPhone: 'മൊബൈൽ നമ്പർ 6, 7, 8, അല്ലെങ്കിൽ 9-ൽ ആരംഭിക്കണം',
        errNetwork: 'നെറ്റ്‌വർക്ക് കണക്ഷൻ ഇല്ല. സേവ് ചെയ്ത വിവരങ്ങൾ കാണിക്കുന്നു.',
        welcomeBack: 'വീണ്ടും സ്വാഗതം! നിങ്ങളുടെ വിലാസം ലഭ്യമാക്കിയിട്ടുണ്ട്.',

        // Language Switcher
        switchLanguage: 'English'
    }
};

export function getTranslation(lang, key, fallback = '') {
    const selectedLang = TRANSLATIONS[lang] || TRANSLATIONS.en;
    return selectedLang[key] || TRANSLATIONS.en[key] || fallback || key;
}
