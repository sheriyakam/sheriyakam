/**
 * src/data/seoLocationsAndServices.js
 * Programmatic SEO & GEO Location and Service Node Matrix.
 * 
 * Maps the 7 active postal nodes of the Thalassery–Mahe corridor and the
 * 6 core electrical services with technical diagnostic specifics and Manglish voice queries.
 */

export const CORRIDOR_LOCATIONS = [
  {
    slug: 'thalassery-electrician',
    name: 'Thalassery',
    district: 'Kannur',
    state: 'Kerala',
    pinCode: '670101',
    postalCodes: ['670101', '670102', '670104'],
    hubDistanceKm: 0,
    avgArrivalMins: 30,
    coordinates: { latitude: 11.7495, longitude: 75.4891 },
    gridCharacteristics: 'Dense coastal town grid with historic commercial junction overhead lines and heritage home wiring.',
    commonFaults: 'Old lead-sheathed and non-modular junction box sparking, loose phase connections in commercial shop circuits.',
    landmarks: ['Thalassery Old Bus Stand', 'Overbury Folly', 'Court Road', 'Kayyath Road'],
    bilingualKeywords: ['Thalassery electrician', 'thalasseriyil electrician', 'current work thalassery', 'licensed wireman thalassery']
  },
  {
    slug: 'mahe-electrician',
    name: 'Mahe',
    district: 'Mahe',
    state: 'Puducherry (UT)',
    pinCode: '673310',
    postalCodes: ['673310'],
    hubDistanceKm: 7.2,
    avgArrivalMins: 35,
    coordinates: { latitude: 11.7002, longitude: 75.5347 },
    gridCharacteristics: 'Puducherry Electricity Department enclave grid with severe coastal saline atmospheric exposure.',
    commonFaults: 'Accelerated copper terminal green oxidation, coastal salt-crust shorting in outdoor meter boxes, phase tripping.',
    landmarks: ['Mahe River Promenade', 'Tagore Park', 'Railway Station Road', 'Civil Station'],
    bilingualKeywords: ['Mahe electrician', 'maheyil electrician', 'electrician in mahe pondicherry', 'emergency electrician mahe']
  },
  {
    slug: 'dharmadam-electrician',
    name: 'Dharmadam',
    district: 'Kannur',
    state: 'Kerala',
    pinCode: '670106',
    postalCodes: ['670106'],
    hubDistanceKm: 4.5,
    avgArrivalMins: 30,
    coordinates: { latitude: 11.7675, longitude: 75.4642 },
    gridCharacteristics: 'River island estuary environment with high groundwater table and seasonal humidity.',
    commonFaults: 'Submersible water pump starter capacitor burnouts, outdoor lighting conduit water ingress, RCCB leakage.',
    landmarks: ['Dharmadam Island Point', 'Brennan College Area', 'Palayad', 'Beach Road'],
    bilingualKeywords: ['Dharmadam electrician', 'dharmadathil electrician', 'water motor work dharmadam', 'brennan college electrician']
  },
  {
    slug: 'kadirur-electrician',
    name: 'Kadirur',
    district: 'Kannur',
    state: 'Kerala',
    pinCode: '670642',
    postalCodes: ['670642'],
    hubDistanceKm: 5.8,
    avgArrivalMins: 35,
    coordinates: { latitude: 11.7698, longitude: 75.5332 },
    gridCharacteristics: 'Semi-rural interior grid prone to monsoon lightning surges and agricultural line load imbalances.',
    commonFaults: 'Lightning surge induced MCB trip, open neutral causing 400V high-voltage surges, earthing pit dry-out.',
    landmarks: ['Kadirur Town', 'Pullodi', 'Poniam', 'Ayithara'],
    bilingualKeywords: ['Kadirur electrician', 'kadiruril electrician', 'lightning earth fault kadirur', 'house wiring kadirur']
  },
  {
    slug: 'chokli-electrician',
    name: 'Chokli',
    district: 'Kannur',
    state: 'Kerala',
    pinCode: '670672',
    postalCodes: ['670672'],
    hubDistanceKm: 9.4,
    avgArrivalMins: 45,
    coordinates: { latitude: 11.7251, longitude: 75.5894 },
    gridCharacteristics: 'Long overhead feeder lines running through heavy tree canopies near the Mahe river basin.',
    commonFaults: 'Low voltage during evening peak hours, neutral voltage rise, inverter continuous charging cutoff.',
    landmarks: ['Chokli Town', 'Menaprath', 'Olavilam Road', 'Peringathur Link'],
    bilingualKeywords: ['Chokli electrician', 'chokliyil electrician', 'low voltage issue chokli', 'inverter wiring chokli']
  },
  {
    slug: 'new-mahe-electrician',
    name: 'New Mahe',
    district: 'Kannur',
    state: 'Kerala',
    pinCode: '673311',
    postalCodes: ['673311'],
    hubDistanceKm: 6.8,
    avgArrivalMins: 35,
    coordinates: { latitude: 11.7144, longitude: 75.5398 },
    gridCharacteristics: 'National Highway 66 coastal corridor with mixed residential and automotive commercial loads.',
    commonFaults: 'Distribution board busbar pitting, three-phase unbalance, heavy 16A AC power socket melting.',
    landmarks: ['NH 66 Bypass Junction', 'Peringadi', 'Kallayi Road', 'Madapeedika'],
    bilingualKeywords: ['New Mahe electrician', 'new maheyil electrician', 'nh 66 electrician kannur', 'switchboard repair new mahe']
  },
  {
    slug: 'azhiyur-electrician',
    name: 'Azhiyur',
    district: 'Kozhikode',
    state: 'Kerala',
    pinCode: '673309',
    postalCodes: ['673309'],
    hubDistanceKm: 10.2,
    avgArrivalMins: 45,
    coordinates: { latitude: 11.6917, longitude: 75.5512 },
    gridCharacteristics: 'Kozhikode district coastal border zone with high atmospheric chloride and sea spray.',
    commonFaults: 'Marine air breaker latch corrosion causing false tripping, ceiling fan regulator burnouts from heat.',
    landmarks: ['Azhiyur Railway Gate', 'Chombala Harbour Road', 'Kunjipalli', 'Kallamala'],
    bilingualKeywords: ['Azhiyur electrician', 'azhiyuril electrician', 'chombala electrician', 'kozhikode border electrician']
  }
];

export const CORE_SERVICES_METADATA = [
  {
    id: 'fault-inspection',
    name: 'Fault Inspection & Multimeter Diagnosis',
    startingPrice: 499,
    durationMins: 45,
    warrantyDays: 30,
    diagnosticChecks: [
      'Digital true-RMS phase-to-neutral voltage test (220V–240V nominal)',
      'Phase-to-earth leakage test with sensitivity clamp (<30mA threshold)',
      'Distribution board busbar insulation resistance continuity test'
    ],
    toolSpecs: 'Mastech / Fluke True-RMS Digital Multimeter, 1000V VDE Insulated Screwdrivers',
    voiceSynonyms: [
      'current poyi',
      'fuse poyi',
      'current vannilla',
      'power cut or fuse problem',
      'electrician check cheyyan'
    ],
    deliverableSummary: 'On-site multimeter diagnosis with transparent written quote before any work starts. Fee adjusted if repair approved.'
  },
  {
    id: 'switchboard-repair',
    name: 'Switchboard, Socket & Plug Repair',
    startingPrice: 499,
    durationMins: 30,
    warrantyDays: 30,
    diagnosticChecks: [
      'Thermal hotspot infrared check for high-resistance loose contacts',
      '16A heavy appliance plug load terminal torque test',
      'Phase, neutral, and earthing polarity check using socket tester'
    ],
    toolSpecs: 'Non-contact AC voltage detector, torque screwdrivers, terminal strip crimper',
    voiceSynonyms: [
      'switch board spark aavunnu',
      'plug kathi poyi',
      'switch work aavunnilla',
      'ac plug melt aayi',
      'switch board maattan aal'
    ],
    deliverableSummary: 'Safe replacement of sparking switches, burnt sockets, and 16A points using ISI-certified spares at transparent retail MRP.'
  },
  {
    id: 'fan-repair',
    name: 'Ceiling & Exhaust Fan Repair / Installation',
    startingPrice: 549,
    durationMins: 30,
    warrantyDays: 30,
    diagnosticChecks: [
      'Digital capacitance meter microfarad rating check (2.5µF / 3.15µF ±5%)',
      'Stator running and starting coil resistance ohm measurement',
      'Downrod safety bolt split-pin and dynamic rotor balancing inspection'
    ],
    toolSpecs: 'Digital LCR capacitance meter, bearing puller, rubber balancing clip',
    voiceSynonyms: [
      'fan slow aayi',
      'fan humming sound kelkkunnu',
      'fan regulator work cheyyunnilla',
      'fan puthiyath idan',
      'exhaust fan repair'
    ],
    deliverableSummary: 'Capacitor replacement, electronic regulator wiring, bearing noise triage, or new ceiling fan mounting with dynamic balancing.'
  },
  {
    id: 'mcb-db-triage',
    name: 'MCB, RCCB & Fuse Box Tripping (DB Triage)',
    startingPrice: 649,
    durationMins: 45,
    warrantyDays: 30,
    diagnosticChecks: [
      '30mA residual current circuit breaker (RCCB) trip-time threshold test',
      'Individual branch neutral isolation to trace specific earth leakage loops',
      'Main DP switch and busbar screw terminal tightening to eliminate arc heat'
    ],
    toolSpecs: 'RCCB trip-time tester, AC leakage clamp meter, 500V DC megohmmeter',
    voiceSynonyms: [
      'mcb trip aavunnu',
      'rccb thazhe വീഴുന്നു',
      'fuse veendum veendum povunnu',
      'current full poyi main box',
      'blackout in house'
    ],
    deliverableSummary: 'Earth leakage isolation, short-circuit trace, and miniature circuit breaker (MCB) replacement to restore safe power.'
  },
  {
    id: 'inverter-wiring',
    name: 'Inverter & Battery Wiring Setup',
    startingPrice: 749,
    durationMins: 60,
    warrantyDays: 30,
    diagnosticChecks: [
      'Lead-acid / tubular battery DC terminal open-circuit voltage measurement',
      'Manual bypass / rotary changeover switch line isolation test',
      'Inverter output phase load balancing to prevent inverter overload trip'
    ],
    toolSpecs: 'Heavy-duty 16–25 sq mm hydraulic cable lug crimper, terminal petroleum jelly, DC clamp',
    voiceSynonyms: [
      'inverter switch over aavunnilla',
      'battery charge nilkunnilla',
      'current poyal inverter work illa',
      'inverter connection kodukkan',
      'changeover switch fault'
    ],
    deliverableSummary: 'Heavy-gauge DC battery cabling, changeover switch mounting, backup load routing, and terminal anti-corrosion treatment.'
  },
  {
    id: 'house-rewiring',
    name: 'House Wiring, Additional Points & Earthing',
    startingPrice: 899,
    durationMins: 90,
    warrantyDays: 30,
    diagnosticChecks: [
      'Earth pit electrode resistance measurement (< 5 Ohms CEA standard)',
      'Concealed conduit wire insulation resistance test (> 1 Megaohm)',
      'Sub-circuit load capacity assessment to prevent conductor overheating'
    ],
    toolSpecs: 'Four-terminal digital earth ground resistance tester, 1000V Megger, fish tape wire puller',
    voiceSynonyms: [
      'veedu rewiring cheyyan',
      'earth pit inspection',
      'shock adikunnu tapil ninnu',
      'puthiya plug point idan',
      'kseb earthing test'
    ],
    deliverableSummary: 'Concealed conduit wire pulling, earth pit electrode resistance measurement, and full domestic electrical safety assessment.'
  }
];
