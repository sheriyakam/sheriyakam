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
        category: 'Service Area',
        q: 'What areas do you currently serve in Kerala?',
        a: 'We are actively serving the Thalassery–Mahe corridor within a 12km radius, including Thalassery town, Mahe, Dharmadam, Kadirur, Chokli, New Mahe, and Azhiyur. If you are located nearby, our local electrician will confirm doorstep feasibility during the direct pre-dispatch phone confirmation.'
    },
    {
        id: 'faq-3',
        category: 'Materials',
        q: 'How are replacement electrical spare parts billed?',
        a: 'You have complete freedom: you can provide your own ISI-marked spare parts (switches, MCBs, capacitors, wires), or your electrician can procure them from a local hardware store on your behalf. In all cases, replacement parts are billed strictly at MRP / actual store receipt cost with zero markup, and the hardware shop bill is photographed for your records.'
    },
    {
        id: 'faq-4',
        category: 'Warranty',
        q: 'What warranty is provided on electrical repairs?',
        a: 'Every completed electrical repair is backed by our direct 30-day workmanship warranty on the exact point repaired. If the same issue reoccurs within 30 days, simply contact us via WhatsApp or phone, and a senior electrician will revisit to resolve it at ₹0 visit fee.'
    },
    {
        id: 'faq-5',
        category: 'Payment',
        q: 'When and how do I pay?',
        a: 'You pay only after the work is completely finished, tested, and demonstrated to your satisfaction. You can pay securely via any UPI app (Google Pay, PhonePe, Paytm, BHIM) by scanning the technician\'s QR code, or in cash.'
    }
];

const DEFAULT_TARIFFS = [
    { id: 't-inspection', name: 'Fault Inspection & Multimeter Diagnosis', price: 499, category: 'Electrical', time: '45 mins', desc: 'On-site multimeter diagnosis and line triage (fee adjusted if repair approved).' },
    { id: 't-switch', name: 'Switchboard, Socket & Plug Repair', price: 499, category: 'Electrical', time: '30 mins', desc: 'Sparking switches, burnt plugs, and 6A/16A power points (plus ISI spares).' },
    { id: 't-fan', name: 'Ceiling & Exhaust Fan Repair / Installation', price: 549, category: 'Electrical', time: '30 mins', desc: 'Capacitor replacement, speed regulator, or new fan mounting.' },
    { id: 't-mcb', name: 'MCB, RCCB & Fuse Box Tripping (DB Triage)', price: 649, category: 'Emergency', time: '45 mins', desc: 'Distribution board earth leakage trace & breaker isolation.' },
    { id: 't-inverter', name: 'Inverter & Battery Wiring Setup', price: 749, category: 'Electrical', time: '60 mins', desc: 'Single/double battery wiring & backup load routing.' },
    { id: 't-wiring', name: 'House Wiring, Additional Points & Earthing', price: 899, category: 'Electrical', time: '1-2 hrs', desc: 'Full house rewiring, earth pit rod & custom quote after on-site inspection.' }
];

const DEFAULT_DISTRICTS = [
    { id: 'thalassery-mahe', name: 'Thalassery–Mahe Corridor', hq: 'Old Bus Stand, Thalassery', active: true, partnersCount: 8, avgArrivalMins: 35, towns: ['Thalassery', 'Mahe', 'Dharmadam', 'Kadirur', 'Chokli', 'New Mahe', 'Azhiyur'] }
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
