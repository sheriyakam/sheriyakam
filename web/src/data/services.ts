import { Service, Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'cat-fans',
    slug: 'fan-services',
    name: 'Fan Services',
    description: 'Ceiling, BLDC, exhaust, and regulator repairs & installations',
    iconName: 'Fan'
  },
  {
    id: 'cat-lighting',
    slug: 'lighting',
    name: 'Lighting',
    description: 'LEDs, tube lights, chandeliers, and outdoor architectural fixtures',
    iconName: 'Lightbulb'
  },
  {
    id: 'cat-switches',
    slug: 'switches-and-sockets',
    name: 'Switches & Sockets',
    description: 'Modular switchboards, heavy load sockets, and USB ports',
    iconName: 'ToggleRight'
  },
  {
    id: 'cat-wiring',
    slug: 'power-and-wiring',
    name: 'Power & Wiring',
    description: 'MCB replacement, RCCB safety leakage switches, and sub-meter setups',
    iconName: 'Zap'
  },
  {
    id: 'cat-faults',
    slug: 'electrical-faults',
    name: 'Electrical Faults',
    description: 'Short circuit diagnosis, tripping troubleshooting, and voltage fluctuations',
    iconName: 'AlertTriangle'
  },
  {
    id: 'cat-appliances',
    slug: 'home-installation',
    name: 'Home Installation',
    description: 'Geyser connections, doorbell wiring, inverter setup, and CCTV lines',
    iconName: 'Home'
  }
];

export const SERVICE_CATEGORIES = CATEGORIES;

export const SERVICES: Service[] = [
  // --- FAN SERVICES ---
  {
    id: 'srv-fan-install',
    category: 'Fan Services',
    categorySlug: 'fan-services',
    title: 'Ceiling Fan Installation',
    slug: 'ceiling-fan-installation',
    shortDescription: 'Assembly, ceiling hook hanging, blade balancing, and wire connection.',
    description: 'Standard ceiling fan installation on existing ceiling hook and wiring point. Includes hook safety verification, downrod assembly, blade pitch balancing, and regulator connection.',
    price: 199,
    priceType: 'starting',
    durationMinutes: 30,
    included: [
      'Assembly of motor, downrod, and blades',
      'Hanging on existing ceiling hook and clamp',
      'Connection to existing switchboard wiring',
      'Blade rotation and noise balancing test'
    ],
    exclusions: [
      'Spare parts, fan regulator, or anchor fasteners (billed separately if needed)',
      'Ceiling hook drilling or masonry cutting',
      'New electrical line running from DB'
    ],
    popular: true,
    active: true
  },
  {
    id: 'srv-fan-repair',
    category: 'Fan Services',
    categorySlug: 'fan-services',
    title: 'Ceiling Fan Repair',
    slug: 'ceiling-fan-repair',
    shortDescription: 'Diagnosis and fix for slow rotation, humming noise, or wobbling.',
    description: 'Comprehensive inspection and servicing of slow, humming, or vibrating ceiling fans. Covers capacitor health testing, bearing inspection, and regulator continuity check.',
    price: 249,
    priceType: 'starting',
    durationMinutes: 45,
    included: [
      'Inspection of motor windings and capacitor rating',
      'Regulator switch continuity test',
      'Bearing lubrication and wobble reduction',
      'Post-repair operational verification'
    ],
    exclusions: [
      'Cost of new capacitor, bearing, or replacement motor',
      'Rewinding of burnt stator coils (requires workshop repair)'
    ],
    popular: true,
    active: true
  },
  {
    id: 'srv-bldc-install',
    category: 'Fan Services',
    categorySlug: 'fan-services',
    title: 'BLDC Fan Installation',
    slug: 'bldc-fan-installation',
    shortDescription: 'Modern energy-saving BLDC fan setup and remote controller pairing.',
    description: 'Precision installation of Brushless DC (BLDC) fans (Atomberg, Havells, Crompton, Orient). Includes PCB bypass of existing step regulators for direct AC input and remote pairing.',
    price: 299,
    priceType: 'starting',
    durationMinutes: 40,
    included: [
      'Unboxing, downrod coupling, and canopy mounting',
      'Regulator bypass to ensure clean 230V power to BLDC circuit',
      'Remote RF/IR pairing and speed calibration test',
      'Demo of timer, sleep, and boost modes'
    ],
    exclusions: [
      'Replacement batteries for remote',
      'New ceiling anchor installation or structural alteration'
    ],
    popular: true,
    active: true
  },
  {
    id: 'srv-bldc-repair',
    category: 'Fan Services',
    categorySlug: 'fan-services',
    title: 'BLDC Fan Repair',
    slug: 'bldc-fan-repair',
    shortDescription: 'Diagnostic testing for remote unresponsiveness, PCB failure, or speed drop.',
    description: 'Advanced diagnostic testing for electronic BLDC fan units. Tests input supply voltage, PCB driver health, receiver sensor, and motor sensor feedback.',
    price: 349,
    priceType: 'starting',
    durationMinutes: 45,
    included: [
      'Input voltage and driver circuit continuity diagnostics',
      'Remote receiver sensor check',
      'Switchboard direct-line integrity testing'
    ],
    exclusions: [
      'Replacement BLDC driver PCB module or manufacturer motor replacement'
    ],
    active: true
  },
  {
    id: 'srv-fan-regulator',
    category: 'Fan Services',
    categorySlug: 'fan-services',
    title: 'Fan Regulator Replacement',
    slug: 'fan-regulator-replacement',
    shortDescription: 'Replacement of faulty, burnt, or stuck rotary/step fan regulators.',
    description: 'Safe replacement of malfunctioning or loose fan speed controllers inside modular or classic switchboards. Ensures smooth step transitions and prevents buzzing.',
    price: 149,
    priceType: 'starting',
    durationMinutes: 20,
    included: [
      'Removal of damaged rotary/socket regulator',
      'Wiring of replacement step regulator to phase circuit',
      'Load continuity and 5-speed testing'
    ],
    exclusions: [
      'Cost of the replacement regulator unit (customer-supplied or billed at MRP)'
    ],
    active: true
  },
  {
    id: 'srv-fan-capacitor',
    category: 'Fan Services',
    categorySlug: 'fan-services',
    title: 'Fan Capacitor Replacement',
    slug: 'fan-capacitor-replacement',
    shortDescription: 'Speed restoration with new calibrated capacitor install (2.25µF / 2.5µF).',
    description: 'Diagnose slow fan spinning caused by degraded start/run capacitors. Technician safely replaces the capacitor with the exact manufacturer rating.',
    price: 149,
    priceType: 'starting',
    durationMinutes: 25,
    included: [
      'Capacitance degradation test',
      'Safe discharge and removal of worn capacitor',
      'Installation of new capacitor with insulated sleeves',
      'Rotation direction and speed check'
    ],
    exclusions: [
      'Cost of replacement capacitor (billed at MRP if provided by technician)'
    ],
    active: true
  },

  // --- LIGHTING ---
  {
    id: 'srv-light-install',
    category: 'Lighting',
    categorySlug: 'lighting',
    title: 'Light Fixture Installation',
    slug: 'light-fixture-installation',
    shortDescription: 'Mounting and connection of ceiling, wall bracket, or spotlight fixtures.',
    description: 'Mounting and safe electrical connection of indoor wall brackets, spotlights, battens, or ceiling surface lights on existing electrical points.',
    price: 149,
    priceType: 'starting',
    durationMinutes: 25,
    included: [
      'Drilling and wall plug mounting for bracket',
      'Connection to 230V AC terminal block',
      'Testing with switch control'
    ],
    exclusions: [
      'Cost of light fixture, bulbs, or drivers',
      'Running new concealed wiring lines'
    ],
    popular: true,
    active: true
  },
  {
    id: 'srv-led-tube',
    category: 'Lighting',
    categorySlug: 'lighting',
    title: 'LED Batten / Tube Light Installation',
    slug: 'led-tube-light-installation',
    shortDescription: 'Installation or replacement of modern energy-efficient LED tube battens.',
    description: 'Replacing old electromagnetic choke fluorescent tubes with energy-efficient T5/T8 LED slim battens, or mounting new units on existing points.',
    price: 149,
    priceType: 'starting',
    durationMinutes: 20,
    included: [
      'Removal of old fluorescent tube and ballast if needed',
      'Mounting clamp installation on wall/ceiling',
      'Live and neutral insulated wire termination'
    ],
    exclusions: [
      'Cost of LED batten fixture',
      'New switchboard wiring'
    ],
    active: true
  },
  {
    id: 'srv-decorative-light',
    category: 'Lighting',
    categorySlug: 'lighting',
    title: 'Decorative & Chandelier Light Installation',
    slug: 'decorative-light-installation',
    shortDescription: 'Assembly and secure ceiling anchor mounting for chandeliers and pendant lights.',
    description: 'Specialized mounting for multi-arm chandeliers, hanging pendants, cove profile lighting, and decorative glass fixtures. Ensures reinforced ceiling anchors and load testing.',
    price: 499,
    priceType: 'starting',
    durationMinutes: 60,
    included: [
      'Unboxing and crystal/arm assembly',
      'Heavy-duty anchor hook verification',
      'Multi-driver wiring connection to switch controls',
      'Weight suspension and illumination testing'
    ],
    exclusions: [
      'Cost of chandelier fixture, extra bulbs, or transformers',
      'Scaffolding for ceilings exceeding 12 feet'
    ],
    active: true
  },
  {
    id: 'srv-outdoor-light',
    category: 'Lighting',
    categorySlug: 'lighting',
    title: 'Outdoor & Gate Light Installation',
    slug: 'outdoor-light-installation',
    shortDescription: 'Weatherproof gate pillar, floodlight, and garden post light wiring.',
    description: 'Weatherproof installation of outdoor gate pillar lights, garden spike fixtures, IP65 sensor floodlights, and balcony luminaires with waterproof junctions.',
    price: 249,
    priceType: 'starting',
    durationMinutes: 40,
    included: [
      'IP-rated waterproof enclosure sealing',
      'Pillar/wall surface mounting with rawl plugs',
      'Terminal insulated connection with moisture barrier'
    ],
    exclusions: [
      'Underground trenching or PVC conduit laying',
      'Light fixtures and armoured cables'
    ],
    active: true
  },

  // --- SWITCHES & SOCKETS ---
  {
    id: 'srv-switch-replace',
    category: 'Switches & Sockets',
    categorySlug: 'switches-and-sockets',
    title: 'Switch & Socket Replacement (Up to 3)',
    slug: 'switch-socket-replacement',
    shortDescription: 'Replacement of burnt, loose, or sparking switches and sockets.',
    description: 'Safe replacement of up to 3 individual 6A/16A switches, 3-pin sockets, or indicator modules in modular or piano switchboards.',
    price: 199,
    priceType: 'starting',
    durationMinutes: 30,
    included: [
      'Main breaker isolation and safety check',
      'Removal of defective switches/sockets',
      'Phase, neutral, and earth wire termination',
      'Socket polarity and ground continuity test'
    ],
    exclusions: [
      'Cost of switches, sockets, or modular grid plates',
      'Replacement of completely damaged metal back box'
    ],
    popular: true,
    active: true
  },
  {
    id: 'srv-switchboard-replace',
    category: 'Switches & Sockets',
    categorySlug: 'switches-and-sockets',
    title: 'Complete Switchboard Replacement',
    slug: 'complete-switchboard-replacement',
    shortDescription: 'Full replacement of multi-gang modular switchboard with neat wire dressing.',
    description: 'Complete replacement of 6M/8M/12M/18M modular switchboard plate, switches, regulators, and sockets. Includes rewiring, terminal tightening, and neutral grouping.',
    price: 399,
    priceType: 'starting',
    durationMinutes: 60,
    included: [
      'Full circuit isolation and mapping of load lines',
      'Removal of legacy faceplate and module assembly',
      'Installation of new modular plate and dressed wiring',
      'Verification of each switch point and earth terminal'
    ],
    exclusions: [
      'Cost of modular faceplate, grid, switches, and sockets',
      'Concealed wall box chipping or masonry repatching'
    ],
    popular: true,
    active: true
  },
  {
    id: 'srv-heavy-socket',
    category: 'Switches & Sockets',
    categorySlug: 'switches-and-sockets',
    title: 'AC / Geyser Power Point Installation',
    slug: 'heavy-power-point-installation',
    shortDescription: '16A / 20A dedicated power socket and isolator switch installation.',
    description: 'Installation of high-load 16A/20A power points suitable for air conditioners, water heaters (geysers), washing machines, and microwave ovens.',
    price: 299,
    priceType: 'starting',
    durationMinutes: 45,
    included: [
      'Heavy gauge wire connection check (2.5 sq mm / 4.0 sq mm)',
      '16A socket and miniature switch mounting',
      'Earth loop impedance and load test'
    ],
    exclusions: [
      'New cable pulling from main distribution board (billed per meter if required)',
      'Cost of 16A socket, metal box, and isolator'
    ],
    active: true
  },

  // --- POWER & WIRING ---
  {
    id: 'srv-mcb-replace',
    category: 'Power & Wiring',
    categorySlug: 'power-and-wiring',
    title: 'MCB / Isolator Replacement',
    slug: 'mcb-replacement',
    shortDescription: 'Replacement of faulty, buzzing, or frequently tripping miniature circuit breakers.',
    description: 'Replacement of single pole, double pole, or three-pole MCBs and main isolators in your distribution board. Ensures proper ampere rating matching the circuit load.',
    price: 299,
    priceType: 'starting',
    durationMinutes: 35,
    included: [
      'Distribution board safety isolation and busbar check',
      'Removal of defective MCB from DIN rail',
      'Installation and torque tightening of new MCB',
      'Load test and tripping response check'
    ],
    exclusions: [
      'Cost of replacement MCB unit (Legrand, Schneider, Havells, etc.)',
      'Distribution board replacement'
    ],
    popular: true,
    active: true
  },
  {
    id: 'srv-rccb-install',
    category: 'Power & Wiring',
    categorySlug: 'power-and-wiring',
    title: 'RCCB / ELCB Earth Leakage Breaker Installation',
    slug: 'rccb-elcb-installation',
    shortDescription: 'Life-saving electric shock and earth leakage protection installation (30mA).',
    description: 'Installation of Residual Current Circuit Breakers (RCCB) to prevent fatal electric shocks and protect appliances against leakage currents as mandated by CEA/KSEB standards.',
    price: 449,
    priceType: 'starting',
    durationMinutes: 60,
    included: [
      'Neutral separation and isolation diagnostics',
      'DIN rail mounting of 2-pole or 4-pole 30mA RCCB',
      'Trip-test button check and earth leakage simulation',
      'Phase balance verification'
    ],
    exclusions: [
      'Cost of RCCB device',
      'Neutral-earth leak isolation if existing house wiring has hidden cross-neutral faults (quoted after inspection)'
    ],
    active: true
  },
  {
    id: 'srv-short-circuit',
    category: 'Power & Wiring',
    categorySlug: 'power-and-wiring',
    title: 'Short Circuit & Power Failure Diagnosis',
    slug: 'short-circuit-diagnosis',
    shortDescription: 'Triage and fault localization for total blackout, sparking, or blown fuses.',
    description: 'Emergency electrical diagnostic triage to pinpoint short circuits, burnt junction boxes, overloaded phases, or neutral breaks causing blackout.',
    price: 399,
    priceType: 'starting',
    durationMinutes: 60,
    included: [
      'Multimeter insulation and continuity testing',
      'Phase-by-phase circuit isolation in DB',
      'Identification of shorted line or faulty appliance',
      'Temporary emergency restoration of safe circuits'
    ],
    exclusions: [
      'Full conduit re-cabling or major structural wiring rework (quoted after diagnosis)',
      'Cost of replacement wires and cables'
    ],
    popular: true,
    active: true
  },

  // --- ELECTRICAL FAULTS ---
  {
    id: 'srv-fault-diagnosis',
    category: 'Electrical Faults',
    categorySlug: 'electrical-faults',
    title: 'Comprehensive Home Electrical Health Check',
    slug: 'electrical-fault-diagnosis',
    shortDescription: 'Inspection of earthing, leakage, distribution board, and voltage stability.',
    description: 'Complete electrical safety audit of your residential premises. Tests earth pit resistance, neutral-earth voltage difference, switchboard thermography for hotspots, and breaker health.',
    price: 499,
    priceType: 'starting',
    durationMinutes: 75,
    included: [
      'Earth-neutral voltage measurement (< 2V test)',
      'MCB load distribution and terminal tightness audit',
      'Earthing pit inspection and leakage detection',
      'Written inspection checklist and recommendations'
    ],
    exclusions: [
      'Repair labor and replacement parts (billed separately based on findings)'
    ],
    active: true
  },
  {
    id: 'srv-mcb-tripping',
    category: 'Electrical Faults',
    categorySlug: 'electrical-faults',
    title: 'Frequent MCB Tripping Investigation',
    slug: 'frequent-mcb-tripping-investigation',
    shortDescription: 'Identification of circuit overload, line shorting, or faulty home appliances.',
    description: 'Pinpoint why a specific circuit breaker keeps tripping when certain appliances turn on. Isolates load imbalance, insulation breakdown, and compressor startup surges.',
    price: 349,
    priceType: 'starting',
    durationMinutes: 45,
    included: [
      'Clamp meter current measurement under active load',
      'Appliance surge draw testing',
      'Phase redistribution recommendation'
    ],
    exclusions: [
      'Appliance internal PCB repairs',
      'Re-cabling of overloaded lines'
    ],
    active: true
  },
  {
    id: 'srv-voltage-issue',
    category: 'Electrical Faults',
    categorySlug: 'electrical-faults',
    title: 'Low Voltage & Flickering Diagnostics',
    slug: 'low-voltage-flickering-diagnostics',
    shortDescription: 'Troubleshooting dim lights, phase drop, loose neutral, or inverter cycling.',
    description: 'Diagnose intermittent light flickering, low voltage across one phase, or loose main service neutral connections before expensive electronics get damaged.',
    price: 349,
    priceType: 'starting',
    durationMinutes: 45,
    included: [
      'Line-to-line (415V) and line-to-neutral (230V) testing',
      'Main cutout and service fuse inspection',
      'Neutral terminal link tightening in main board'
    ],
    exclusions: [
      'KSEB supply-side grid faults (requires KSEB lineman intervention)',
      'Voltage stabilizer hardware repairs'
    ],
    active: true
  },

  // --- HOME INSTALLATION ---
  {
    id: 'srv-geyser-connection',
    category: 'Home Installation',
    categorySlug: 'home-installation',
    title: 'Water Heater / Geyser Electrical Connection',
    slug: 'geyser-electrical-connection',
    shortDescription: 'Dedicated heavy-duty wiring, 16A DP switch, and earthing connection.',
    description: 'Safe electrical installation and earth bonding for instant and storage water heaters. Prevents electrical leakage in wet bathroom areas.',
    price: 249,
    priceType: 'starting',
    durationMinutes: 35,
    included: [
      'Geyser power cable connection to 16A DP switch',
      'Dedicated earth continuity verification',
      'Thermostat heating cycle and indicator test'
    ],
    exclusions: [
      'Plumbing inlet/outlet pipe fitting and wall hanging of geyser unit',
      'Cost of 16A DP switch and power cord'
    ],
    active: true
  },
  {
    id: 'srv-exhaust-fan',
    category: 'Home Installation',
    categorySlug: 'home-installation',
    title: 'Exhaust Fan Installation',
    slug: 'exhaust-fan-installation',
    shortDescription: 'Mounting and electrical termination for kitchen and bathroom exhaust fans.',
    description: 'Mounting, screw securing, and wire connection of kitchen chimney/exhaust fans or bathroom ventilation units in existing circular/rectangular wall openings.',
    price: 199,
    priceType: 'starting',
    durationMinutes: 30,
    included: [
      'Mounting on existing wall duct frame',
      'Connection to wall switch control point',
      'Blade rotation and backdraft shutter test'
    ],
    exclusions: [
      'Wall circular core cutting or glass pane hole cutting',
      'Cost of exhaust fan unit'
    ],
    active: true
  },
  {
    id: 'srv-doorbell-install',
    category: 'Home Installation',
    categorySlug: 'home-installation',
    title: 'Doorbell Installation & Repair',
    slug: 'doorbell-installation',
    shortDescription: 'Wiring and mounting for electronic melodies, ding-dong chimes, or video doorbells.',
    description: 'Installation of wired door chimes, doorbell transformers, or wireless video doorbell power adapters at front entrance.',
    price: 149,
    priceType: 'starting',
    durationMinutes: 25,
    included: [
      'Chime unit wall mounting and wiring',
      'Push-button switch installation at gate/door frame',
      'Sound and chime volume test'
    ],
    exclusions: [
      'Cost of doorbell chime or bell push switch',
      'Conduit laying across long compound walls'
    ],
    active: true
  },
  {
    id: 'srv-inverter-wiring',
    category: 'Home Installation',
    categorySlug: 'home-installation',
    title: 'Inverter & UPS Power Connection',
    slug: 'inverter-ups-wiring',
    shortDescription: 'Inverter AC output connection, battery terminal cabling, and changeover setup.',
    description: 'Safe integration of home inverters with residential wiring. Connects dedicated critical backup circuits (lights, fans) and ensures proper battery terminal grease insulation.',
    price: 449,
    priceType: 'starting',
    durationMinutes: 60,
    included: [
      'Battery terminal lug connection with anti-corrosion coating',
      'Inverter input socket and output backup line termination',
      'Automatic changeover and bypass switch functionality test'
    ],
    exclusions: [
      'Cost of inverter, battery, or heavy DC cables',
      'Running new inverter output sub-lines throughout the house'
    ],
    active: true
  },
  {
    id: 'srv-cctv-power',
    category: 'Home Installation',
    categorySlug: 'home-installation',
    title: 'CCTV Power & Adapter Wiring',
    slug: 'cctv-power-wiring',
    shortDescription: 'Dedicated SMPS power supply and surge protector wiring for security systems.',
    description: 'Wiring dedicated 12V DC SMPS power supplies, weatherproof junction boxes, and surge protectors for security camera installations.',
    price: 349,
    priceType: 'starting',
    durationMinutes: 45,
    included: [
      'SMPS power supply connection to UPS/raw power',
      'Camera DC power plug termination and insulation',
      'Power continuity and voltage stability test'
    ],
    exclusions: [
      'CCTV camera hardware, DVR/NVR setup, and network crimping',
      'Conduit trenching'
    ],
    active: true
  }
];

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find(s => s.slug === slug);
}

export function getServicesByCategory(categorySlug: string): Service[] {
  return SERVICES.filter(s => s.categorySlug === categorySlug && s.active);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find(c => c.slug === slug);
}
