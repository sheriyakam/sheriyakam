/**
 * SHERIYAKAM — Kerala Geographic Hierarchy & Location Coverage Store
 * Comprehensive database of Kerala's 14 districts, taluks, municipalities and service availability.
 */

export const KERALA_DISTRICTS = [
    {
        id: 'kozhikode',
        name: 'Kozhikode',
        malayalam: 'കോഴിക്കോട്',
        active: true,
        coverageBadge: 'Full Coverage',
        hq: 'Civil Station, Kozhikode',
        phone: '+91 495 280 0000',
        availableTechnicians: 18,
        averageArrivalMins: 45,
        municipalities: [
            { id: 'kozhikode-corp', name: 'Kozhikode Corporation', pincode: '673001', active: true },
            { id: 'vadakara', name: 'Vadakara Municipality', pincode: '673101', active: true },
            { id: 'koyilandy', name: 'Koyilandy Municipality', pincode: '673305', active: true },
            { id: 'ramanattukara', name: 'Ramanattukara', pincode: '673633', active: true },
            { id: 'feroke', name: 'Feroke', pincode: '673631', active: true },
            { id: 'thamarassery', name: 'Thamarassery', pincode: '673573', active: true },
            { id: 'mukkom', name: 'Mukkom Municipality', pincode: '673602', active: true },
            { id: 'balussery', name: 'Balussery', pincode: '673612', active: true }
        ]
    },
    {
        id: 'kannur',
        name: 'Kannur',
        malayalam: 'കണ്ണൂർ',
        active: true,
        coverageBadge: 'Full Coverage',
        hq: 'Fort Road, Kannur',
        phone: '+91 495 280 0000',
        availableTechnicians: 14,
        averageArrivalMins: 50,
        municipalities: [
            { id: 'kannur-corp', name: 'Kannur Corporation', pincode: '670001', active: true },
            { id: 'thalassery', name: 'Thalassery Municipality', pincode: '670101', active: true },
            { id: 'payyanur', name: 'Payyanur Municipality', pincode: '670307', active: true },
            { id: 'taliparamba', name: 'Taliparamba Municipality', pincode: '670141', active: true },
            { id: 'mattannur', name: 'Mattannur (Airport Zone)', pincode: '670702', active: true },
            { id: 'iritty', name: 'Iritty Municipality', pincode: '670703', active: true }
        ]
    },
    {
        id: 'ernakulam',
        name: 'Ernakulam (Kochi)',
        malayalam: 'എറണാകുളം',
        active: true,
        coverageBadge: 'Full Coverage',
        hq: 'MG Road, Kochi',
        phone: '+91 495 280 0000',
        availableTechnicians: 24,
        averageArrivalMins: 40,
        municipalities: [
            { id: 'kochi-corp', name: 'Kochi Corporation', pincode: '682001', active: true },
            { id: 'aluva', name: 'Aluva Municipality', pincode: '683101', active: true },
            { id: 'thrikkakara', name: 'Thrikkakara (InfoPark / Kakkanad)', pincode: '682030', active: true },
            { id: 'kalamassery', name: 'Kalamassery Municipality', pincode: '683104', active: true },
            { id: 'tripunithura', name: 'Tripunithura Municipality', pincode: '682301', active: true },
            { id: 'maradu', name: 'Maradu Municipality', pincode: '682304', active: true },
            { id: 'perumbavoor', name: 'Perumbavoor', pincode: '683542', active: true },
            { id: 'angamaly', name: 'Angamaly Municipality', pincode: '683572', active: true }
        ]
    },
    {
        id: 'malappuram',
        name: 'Malappuram',
        malayalam: 'മലപ്പുറം',
        active: true,
        coverageBadge: 'Full Coverage',
        hq: 'Down Hill, Malappuram',
        phone: '+91 495 280 0000',
        availableTechnicians: 16,
        averageArrivalMins: 55,
        municipalities: [
            { id: 'malappuram-muni', name: 'Malappuram Municipality', pincode: '676505', active: true },
            { id: 'manjeri', name: 'Manjeri Municipality', pincode: '676121', active: true },
            { id: 'perinthalmanna', name: 'Perinthalmanna Municipality', pincode: '679322', active: true },
            { id: 'tirur', name: 'Tirur Municipality', pincode: '676101', active: true },
            { id: 'ponnani', name: 'Ponnani Municipality', pincode: '679577', active: true },
            { id: 'kondotty', name: 'Kondotty (Airport Zone)', pincode: '673638', active: true }
        ]
    },
    {
        id: 'thrissur',
        name: 'Thrissur',
        malayalam: 'തൃശ്ശൂർ',
        active: true,
        coverageBadge: 'Full Coverage',
        hq: 'Swaraj Round, Thrissur',
        phone: '+91 495 280 0000',
        availableTechnicians: 15,
        averageArrivalMins: 50,
        municipalities: [
            { id: 'thrissur-corp', name: 'Thrissur Corporation', pincode: '680001', active: true },
            { id: 'guruvayur', name: 'Guruvayur Municipality', pincode: '680101', active: true },
            { id: 'chalakkudy', name: 'Chalakkudy Municipality', pincode: '680307', active: true },
            { id: 'kodungallur', name: 'Kodungallur Municipality', pincode: '680664', active: true },
            { id: 'kunnamkulam', name: 'Kunnamkulam Municipality', pincode: '680503', active: true }
        ]
    },
    {
        id: 'thiruvananthapuram',
        name: 'Thiruvananthapuram',
        malayalam: 'തിരുവനന്തപുരം',
        active: true,
        coverageBadge: 'Full Coverage',
        hq: 'Statue, Thiruvananthapuram',
        phone: '+91 495 280 0000',
        availableTechnicians: 20,
        averageArrivalMins: 45,
        municipalities: [
            { id: 'tvm-corp', name: 'Thiruvananthapuram Corporation', pincode: '695001', active: true },
            { id: 'kazhakkoottam', name: 'Kazhakkoottam (Technopark)', pincode: '695582', active: true },
            { id: 'neyyattinkara', name: 'Neyyattinkara Municipality', pincode: '695121', active: true },
            { id: 'nedumangad', name: 'Nedumangad Municipality', pincode: '695541', active: true },
            { id: 'attingal', name: 'Attingal Municipality', pincode: '695101', active: true },
            { id: 'varkala', name: 'Varkala Municipality', pincode: '695141', active: true }
        ]
    },
    {
        id: 'palakkad',
        name: 'Palakkad',
        malayalam: 'പാലക്കാട്',
        active: true,
        coverageBadge: 'Full Coverage',
        hq: 'TB Road, Palakkad',
        phone: '+91 495 280 0000',
        availableTechnicians: 11,
        averageArrivalMins: 55,
        municipalities: [
            { id: 'palakkad-muni', name: 'Palakkad Municipality', pincode: '678001', active: true },
            { id: 'ottapalam', name: 'Ottapalam Municipality', pincode: '679101', active: true },
            { id: 'shoranur', name: 'Shoranur Municipality', pincode: '679121', active: true },
            { id: 'chittur', name: 'Chittur-Thathamangalam', pincode: '678101', active: true },
            { id: 'mannarkkad', name: 'Mannarkkad Municipality', pincode: '678582', active: true }
        ]
    },
    {
        id: 'kollam',
        name: 'Kollam',
        malayalam: 'കൊല്ലം',
        active: true,
        coverageBadge: 'Full Coverage',
        hq: 'Chinnakada, Kollam',
        phone: '+91 495 280 0000',
        availableTechnicians: 12,
        averageArrivalMins: 50,
        municipalities: [
            { id: 'kollam-corp', name: 'Kollam Corporation', pincode: '691001', active: true },
            { id: 'paravur', name: 'Paravur Municipality', pincode: '691301', active: true },
            { id: 'karunagappally', name: 'Karunagappally Municipality', pincode: '690518', active: true },
            { id: 'punalur', name: 'Punalur Municipality', pincode: '691305', active: true },
            { id: 'kottarakkara', name: 'Kottarakkara Municipality', pincode: '691506', active: true }
        ]
    },
    {
        id: 'alappuzha',
        name: 'Alappuzha',
        malayalam: 'ആലപ്പുഴ',
        active: true,
        coverageBadge: 'Full Coverage',
        hq: 'Boat Jetty Road, Alappuzha',
        phone: '+91 495 280 0000',
        availableTechnicians: 10,
        averageArrivalMins: 55,
        municipalities: [
            { id: 'alappuzha-muni', name: 'Alappuzha Municipality', pincode: '688001', active: true },
            { id: 'cherthala', name: 'Cherthala Municipality', pincode: '688524', active: true },
            { id: 'kayamkulam', name: 'Kayamkulam Municipality', pincode: '690502', active: true },
            { id: 'mavelikkara', name: 'Mavelikkara Municipality', pincode: '690101', active: true },
            { id: 'chengannur', name: 'Chengannur Municipality', pincode: '689121', active: true }
        ]
    },
    {
        id: 'kottayam',
        name: 'Kottayam',
        malayalam: 'കോട്ടയം',
        active: true,
        coverageBadge: 'Full Coverage',
        hq: 'Collectorate Road, Kottayam',
        phone: '+91 495 280 0000',
        availableTechnicians: 12,
        averageArrivalMins: 50,
        municipalities: [
            { id: 'kottayam-muni', name: 'Kottayam Municipality', pincode: '686001', active: true },
            { id: 'changanassery', name: 'Changanassery Municipality', pincode: '686101', active: true },
            { id: 'pala', name: 'Pala Municipality', pincode: '686575', active: true },
            { id: 'ettumanoor', name: 'Ettumanoor Municipality', pincode: '686631', active: true },
            { id: 'vaikom', name: 'Vaikom Municipality', pincode: '686141', active: true },
            { id: 'erattupetta', name: 'Erattupetta Municipality', pincode: '686121', active: true }
        ]
    },
    {
        id: 'kasaragod',
        name: 'Kasaragod',
        malayalam: 'കാസർഗോഡ്',
        active: true,
        coverageBadge: 'Active Hub',
        hq: 'Vidyanagar, Kasaragod',
        phone: '+91 495 280 0000',
        availableTechnicians: 8,
        averageArrivalMins: 60,
        municipalities: [
            { id: 'kasaragod-muni', name: 'Kasaragod Municipality', pincode: '671121', active: true },
            { id: 'kanhangad', name: 'Kanhangad Municipality', pincode: '671315', active: true },
            { id: 'nileshwar', name: 'Nileshwar Municipality', pincode: '671314', active: true },
            { id: 'uppala', name: 'Uppala', pincode: '671322', active: true }
        ]
    },
    {
        id: 'wayanad',
        name: 'Wayanad',
        malayalam: 'വയനാട്',
        active: true,
        coverageBadge: 'Active Hub',
        hq: 'Kalpetta, Wayanad',
        phone: '+91 495 280 0000',
        availableTechnicians: 7,
        averageArrivalMins: 65,
        municipalities: [
            { id: 'kalpetta-muni', name: 'Kalpetta Municipality', pincode: '673121', active: true },
            { id: 'sulthan-bathery', name: 'Sulthan Bathery Municipality', pincode: '673592', active: true },
            { id: 'mananthavady', name: 'Mananthavady Municipality', pincode: '670645', active: true },
            { id: 'meenangadi', name: 'Meenangadi', pincode: '673591', active: true }
        ]
    },
    {
        id: 'pathanamthitta',
        name: 'Pathanamthitta',
        malayalam: 'പത്തനംതിട്ട',
        active: true,
        coverageBadge: 'Active Hub',
        hq: 'Ring Road, Pathanamthitta',
        phone: '+91 495 280 0000',
        availableTechnicians: 8,
        averageArrivalMins: 60,
        municipalities: [
            { id: 'pathanamthitta-muni', name: 'Pathanamthitta Municipality', pincode: '689645', active: true },
            { id: 'thiruvalla', name: 'Thiruvalla Municipality', pincode: '689101', active: true },
            { id: 'adoor', name: 'Adoor Municipality', pincode: '691523', active: true },
            { id: 'pandalam', name: 'Pandalam Municipality', pincode: '689501', active: true },
            { id: 'ranni', name: 'Ranni', pincode: '689672', active: true }
        ]
    },
    {
        id: 'idukki',
        name: 'Idukki',
        malayalam: 'ഇടുക്കി',
        active: true,
        coverageBadge: 'Active Hub',
        hq: 'Painavu / Thodupuzha',
        phone: '+91 495 280 0000',
        availableTechnicians: 7,
        averageArrivalMins: 70,
        municipalities: [
            { id: 'thodupuzha-muni', name: 'Thodupuzha Municipality', pincode: '685584', active: true },
            { id: 'kattappana-muni', name: 'Kattappana Municipality', pincode: '685508', active: true },
            { id: 'adimali', name: 'Adimali', pincode: '685561', active: true },
            { id: 'munnar', name: 'Munnar', pincode: '685612', active: true }
        ]
    }
];

// Helper: Find district by id or name
export const getDistrictByIdOrName = (identifier) => {
    if (!identifier) return null;
    const clean = identifier.toLowerCase().trim();
    return KERALA_DISTRICTS.find(d => 
        d.id.toLowerCase() === clean || 
        d.name.toLowerCase().includes(clean) || 
        clean.includes(d.name.toLowerCase())
    ) || null;
};
