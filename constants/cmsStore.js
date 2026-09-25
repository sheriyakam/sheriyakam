import AsyncStorage from '@react-native-async-storage/async-storage';

class SimpleEventEmitter {
    constructor() {
        this.listeners = {};
    }
    on(event, cb) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(cb);
    }
    off(event, cb) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(l => l !== cb);
    }
    emit(event, data) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(cb => cb(data));
    }
}

export const cmsEvents = new SimpleEventEmitter();

const STORAGE_KEY = 'sheriyakam_cms_data_v1';

const DEFAULT_FAQS = [
    {
        id: 'faq-1',
        category: 'Pricing',
        q: 'How much does an electrician cost near me in Kerala?',
        a: 'Doorstep diagnostic inspection starts at ₹49. Standard electrical repairs start at ₹149 for switch/socket replacements, ₹199 for fan capacitor/regulator fixes, ₹349 for MCB/RCCB tripping, and ₹649 for AC foam jet service. Every booking comes with an upfront transparent rate card and a 30-day rework warranty.'
    },
    {
        id: 'faq-2',
        category: 'Emergency',
        q: 'What is the arrival time for emergency electrical triage?',
        a: 'Emergency electricians are dispatched promptly from the nearest district hub and arrive at your doorstep within 45 to 90 minutes (active in Thalassery HQ, Kannur, Kozhikode, Wayanad, and expanding across Kerala). You will receive a direct confirmation call from your assigned KSELB electrician before arrival.'
    },
    {
        id: 'faq-3',
        category: 'Safety',
        q: 'Are Sheriyakam technicians licensed and insured?',
        a: 'Yes, 100% of technicians hold valid wireman or supervisor licenses certified by the Kerala Electrical Inspectorate. All work is backed by verified safety protocols and our ₹5,00,000 domestic safety insurance cover.'
    },
    {
        id: 'faq-4',
        category: 'Pricing',
        q: 'How does the ₹49 diagnostic visit fee work?',
        a: 'If you have an ambiguous fault or need an on-site estimation, a master electrician arrives in 90 minutes, performs full multimeter and earth resistance testing, and gives an itemized quote. If you approve and proceed with the service, the ₹49 fee is 100% adjusted against your final bill.'
    },
    {
        id: 'faq-5',
        category: 'Payment',
        q: 'Can I pay after the service is completed?',
        a: 'Absolutely. You can choose "Pay After Service" at checkout and pay the technician directly via UPI QR or cash once you test and verify the fix.'
    }
];

const DEFAULT_TARIFFS = [
    { id: 't-diag', name: 'Diagnostic Inspection Visit', price: 49, category: 'General', time: '45 mins', desc: 'Full multimeter fault finding, adjustable against final bill.' },
    { id: 't-fan', name: 'Ceiling Fan / Regulator Service', price: 199, category: 'Electrical', time: '30 mins', desc: 'Bearing noise check, capacitor swap, speed regulator install.' },
    { id: 't-switch', name: 'Switch / Socket Replacement', price: 149, category: 'Electrical', time: '20 mins', desc: 'Modular switch/plug wiring and continuous neutral check.' },
    { id: 't-mcb', name: 'MCB / RCCB Tripping Diagnostic', price: 349, category: 'Emergency', time: '45 mins', desc: 'Distribution board earth leakage trace & breaker isolation.' },
    { id: 't-ac', name: 'Split AC Deep Foam Jet Cleaning', price: 649, category: 'AC', time: '60 mins', desc: 'High-pressure coil rinse, drain clearing & gas pressure test.' },
    { id: 't-cctv', name: 'IP CCTV Camera Point Cabling', price: 499, category: 'CCTV', time: '60 mins', desc: 'Cat6 termination, PoE switch link, and cloud app sync.' }
];

const DEFAULT_DISTRICTS = [
    { id: 'kannur', name: 'Kannur', hq: 'Thalassery', active: true, partnersCount: 14, avgArrivalMins: 28 },
    { id: 'kozhikode', name: 'Kozhikode', hq: 'Mavoor Road', active: true, partnersCount: 22, avgArrivalMins: 24 },
    { id: 'ernakulam', name: 'Ernakulam', hq: 'Kochi (Edappally)', active: true, partnersCount: 35, avgArrivalMins: 26 },
    { id: 'thrissur', name: 'Thrissur', hq: 'Swaraj Round', active: true, partnersCount: 18, avgArrivalMins: 32 },
    { id: 'malappuram', name: 'Malappuram', hq: 'Manjeri', active: true, partnersCount: 16, avgArrivalMins: 35 },
    { id: 'thiruvananthapuram', name: 'Thiruvananthapuram', hq: 'Pattom', active: true, partnersCount: 28, avgArrivalMins: 25 },
    { id: 'kollam', name: 'Kollam', hq: 'Chinnakada', active: true, partnersCount: 12, avgArrivalMins: 30 },
    { id: 'alappuzha', name: 'Alappuzha', hq: 'Mullakkal', active: true, partnersCount: 10, avgArrivalMins: 34 },
    { id: 'kottayam', name: 'Kottayam', hq: 'Baker Junction', active: true, partnersCount: 11, avgArrivalMins: 29 },
    { id: 'palakkad', name: 'Palakkad', hq: 'Fort Maidan', active: true, partnersCount: 14, avgArrivalMins: 33 },
    { id: 'wayanad', name: 'Wayanad', hq: 'Kalpetta', active: true, partnersCount: 8, avgArrivalMins: 42 },
    { id: 'kasaragod', name: 'Kasaragod', hq: 'Kanhangad', active: true, partnersCount: 9, avgArrivalMins: 38 },
    { id: 'pathanamthitta', name: 'Pathanamthitta', hq: 'Adoor', active: true, partnersCount: 7, avgArrivalMins: 36 },
    { id: 'idukki', name: 'Idukki', hq: 'Thodupuzha', active: true, partnersCount: 6, avgArrivalMins: 48 }
];

let cmsData = {
    faqs: [...DEFAULT_FAQS],
    tariffs: [...DEFAULT_TARIFFS],
    districts: [...DEFAULT_DISTRICTS]
};

const saveCmsData = async () => {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cmsData));
    } catch (e) {
        console.error('Failed to save CMS data', e);
    }
};

const loadCmsData = async () => {
    try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
            const parsed = JSON.parse(json);
            if (parsed && Array.isArray(parsed.faqs)) {
                cmsData = parsed;
                cmsEvents.emit('change');
            }
        }
    } catch (e) {
        console.error('Failed to load CMS data', e);
    }
};

loadCmsData();

export const getFaqs = () => {
    // Sanitize: Never return an empty answer
    return cmsData.faqs.map(f => ({
        ...f,
        a: (f.a && f.a.trim().length > 0)
            ? f.a.trim()
            : 'Details available upon doorstep diagnostic inspection by verified KSELB wireman.'
    }));
};

export const updateFaq = (id, newQ, newA, category) => {
    const cleanA = (newA && newA.trim().length > 0)
        ? newA.trim()
        : 'Details available upon doorstep diagnostic inspection by verified KSELB wireman.';
    
    cmsData.faqs = cmsData.faqs.map(f => {
        if (f.id === id) {
            return {
                ...f,
                q: newQ?.trim() || f.q,
                a: cleanA,
                category: category || f.category
            };
        }
        return f;
    });
    cmsEvents.emit('change');
    saveCmsData();
    return true;
};

export const addFaq = (q, a, category = 'General') => {
    const cleanA = (a && a.trim().length > 0)
        ? a.trim()
        : 'Details available upon doorstep diagnostic inspection by verified KSELB wireman.';
    const newFaq = {
        id: `faq-${Date.now()}`,
        q: q?.trim() || 'New Frequently Asked Question',
        a: cleanA,
        category
    };
    cmsData.faqs.push(newFaq);
    cmsEvents.emit('change');
    saveCmsData();
    return newFaq;
};

export const deleteFaq = (id) => {
    cmsData.faqs = cmsData.faqs.filter(f => f.id !== id);
    cmsEvents.emit('change');
    saveCmsData();
    return true;
};

export const getTariffs = () => cmsData.tariffs;

export const updateTariff = (id, newPrice, newDesc) => {
    cmsData.tariffs = cmsData.tariffs.map(t => {
        if (t.id === id) {
            return {
                ...t,
                price: Number(newPrice) || t.price,
                desc: newDesc?.trim() || t.desc
            };
        }
        return t;
    });
    cmsEvents.emit('change');
    saveCmsData();
    return true;
};

export const getDistrictCoverage = () => cmsData.districts;

export const toggleDistrictActive = (districtId) => {
    cmsData.districts = cmsData.districts.map(d => {
        if (d.id === districtId) {
            return { ...d, active: !d.active };
        }
        return d;
    });
    cmsEvents.emit('change');
    saveCmsData();
    return true;
};
