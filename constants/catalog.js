/**
 * SHERIYAKAM — Centralized Multi-Category Service Catalogue
 * Structured service hierarchy for Kerala's Home-Services Marketplace.
 * Supports deep electrical subcategories and extensible multi-category expansion.
 */

export const CATEGORIES = [
    {
        id: 'electrical',
        name: 'Electrician',
        shortName: 'Electrical',
        icon: 'Zap',
        tagline: 'Kerala Electrical Inspectorate Certified',
        description: 'Certified wiremen & supervisors for residential, commercial & emergency repairs.',
        isPrimary: true,
        available: true,
        subcategories: [
            {
                id: 'fan',
                name: 'Fan Services',
                description: 'Installation, capacitor repair, speed regulator fix & balancing.',
                services: [
                    {
                        id: 'fan-repair',
                        slug: 'fan-repair',
                        title: 'Ceiling & Exhaust Fan Repair',
                        category: 'electrical',
                        subcategory: 'fan',
                        startingPrice: 350,
                        duration: '30–60 mins',
                        rating: 4.9,
                        reviewsCount: 348,
                        completedJobs: '1,420+',
                        warrantyDays: 30,
                        description: 'Complete diagnosis and repair for noisy, slow, or vibrating ceiling and exhaust fans. Covers capacitor replacement, bearing lubrication check, and step regulator wiring.',
                        problemsCovered: [
                            'Fan running at very slow speed',
                            'Loud hum, squeak, or bearing noise',
                            'Fan not starting or regulator switch dead',
                            'Unbalanced wobbling blade vibration'
                        ],
                        inclusions: [
                            'Complete motor winding & bearing diagnosis',
                            'Capacitor voltage check & replacement labor',
                            'Regulator wiring & switchboard connection test',
                            'Blade balancing & safety downrod clamp inspection',
                            'Post-service 10-minute speed load test'
                        ],
                        exclusions: [
                            'Cost of new replacement fan (if motor coil is burnt)',
                            'Decorative chandelier rewiring',
                            'New ceiling hook anchoring & masonry chipping'
                        ],
                        materialsPolicy: 'Standard capacitors (2.5uF/3.15uF) & regulators provided at transparent MRP. Genuine ISI certified spares with manufacturer bill.',
                        addons: [
                            { id: 'add-fan-cap', title: 'Heavy-Duty 3.15uF ISI Capacitor', price: 95 },
                            { id: 'add-fan-reg', title: '5-Step Rotary Electronic Regulator', price: 185 },
                            { id: 'add-fan-rod', title: 'Heavy Gauge Downrod Extension (1.5 ft)', price: 140 }
                        ],
                        faqs: [
                            {
                                q: 'Why is my ceiling fan running so slowly even at maximum speed?',
                                a: 'In 90% of cases, a degraded start/run capacitor (loss of capacitance due to voltage fluctuations) is the culprit. Replacing it with a genuine 2.5uF or 3.15uF ISI capacitor restores full RPM immediately.'
                            },
                            {
                                q: 'Is spare part cost included in the ₹350 service fee?',
                                a: 'The service charge covers diagnosis, inspection, and repair labour. Any replacement parts (like capacitors or regulators) are billed transparently at official MRP.'
                            }
                        ]
                    },
                    {
                        id: 'fan-installation',
                        slug: 'fan-installation',
                        title: 'New Ceiling Fan Installation',
                        category: 'electrical',
                        subcategory: 'fan',
                        startingPrice: 299,
                        duration: '30–45 mins',
                        rating: 4.9,
                        reviewsCount: 280,
                        completedJobs: '1,150+',
                        warrantyDays: 30,
                        description: 'Professional assembly and secure mounting of new ceiling fans with downrod assembly, safety shackle installation, and step regulator wiring.',
                        problemsCovered: [
                            'Unbox and assemble new fan',
                            'Secure hook mounting & safety pin locking',
                            'Connect regulator and switch control'
                        ],
                        inclusions: [
                            'Blade assembly and angle alignment',
                            'Secure downrod mounting to ceiling hook',
                            'Switchboard connection and regulator calibration'
                        ],
                        exclusions: [
                            'New ceiling hook fabrication/drilling into concrete RCC slab'
                        ],
                        materialsPolicy: 'Anchor bolts and wire extensions charged at standard hardware store rates if needed.',
                        addons: []
                    },
                    {
                        id: 'fan-regulator',
                        slug: 'fan-regulator-replacement',
                        title: 'Fan Regulator Replacement',
                        category: 'electrical',
                        subcategory: 'fan',
                        startingPrice: 199,
                        duration: '20–30 mins',
                        rating: 4.8,
                        reviewsCount: 195,
                        completedJobs: '890+',
                        warrantyDays: 30,
                        description: 'Replace faulty, humming, or burnt step regulators with smooth, energy-saving rotary regulators.',
                        problemsCovered: ['Fan runs on single speed only', 'Regulator heating or sparking', 'Loose knob'],
                        inclusions: ['Old regulator removal', 'New module snap-in wiring', 'Speed variation test'],
                        exclusions: ['Switchboard plate replacement'],
                        materialsPolicy: 'Modular regulator available at MRP or provide your own.',
                        addons: []
                    },
                    {
                        id: 'exhaust-fan-install',
                        slug: 'exhaust-fan-installation',
                        title: 'Exhaust Fan Installation / Replacement',
                        category: 'electrical',
                        subcategory: 'fan',
                        startingPrice: 349,
                        duration: '30–45 mins',
                        rating: 4.8,
                        reviewsCount: 160,
                        completedJobs: '620+',
                        warrantyDays: 30,
                        description: 'Kitchen and bathroom exhaust fan mounting with secure wall bracket anchoring, louvre flap alignment, and power wiring.',
                        problemsCovered: ['Kitchen grease exhaust setup', 'Bathroom moisture ventilation', 'Vibrating exhaust replacement'],
                        inclusions: ['Wall frame mounting', 'Power line connection', 'Airflow direction verification'],
                        exclusions: ['Glass or concrete wall duct core cutting'],
                        materialsPolicy: 'Screws, rawl plugs & power cable included up to 1 meter.',
                        addons: []
                    },
                    {
                        id: 'fan-removal',
                        slug: 'fan-removal',
                        title: 'Fan Uninstallation / Removal',
                        category: 'electrical',
                        subcategory: 'fan',
                        startingPrice: 149,
                        duration: '15–20 mins',
                        rating: 4.8,
                        reviewsCount: 92,
                        completedJobs: '410+',
                        warrantyDays: 30,
                        description: 'Safe unmounting and packing of ceiling or exhaust fans with wire insulation capping.',
                        problemsCovered: ['Moving home / renovations', 'Replacing old fan'],
                        inclusions: ['Safe disconnect', 'Wire insulation cap', 'Careful blade dismantling'],
                        exclusions: ['Disposal of old metal'],
                        materialsPolicy: 'N/A',
                        addons: []
                    }
                ]
            },
            {
                id: 'switch-socket',
                name: 'Switch & Socket',
                description: 'Modular switch replacement, power socket fixes, AC 16A points & board rewiring.',
                services: [
                    {
                        id: 'switchboard-repair',
                        slug: 'switchboard-repair',
                        title: 'Switchboard Repair & Rewiring',
                        category: 'electrical',
                        subcategory: 'switch-socket',
                        startingPrice: 299,
                        duration: '30–60 mins',
                        rating: 4.9,
                        reviewsCount: 310,
                        completedJobs: '1,280+',
                        warrantyDays: 30,
                        description: 'Comprehensive switchboard troubleshooting for burnt connections, sparking terminals, loose wiring, and intermittent power supply.',
                        problemsCovered: ['Sparking inside switchboard', 'Burning smell or black marks', 'Switches not turning on', 'Loose internal wire loops'],
                        inclusions: ['Faceplate disassembly & terminal check', 'Tightening internal phase/neutral bus lines', 'Defective switch isolation & rewiring'],
                        exclusions: ['New conduit trenching'],
                        materialsPolicy: 'Genuine Anchor/Legrand/Havells modular switches billed at MRP if replacement required.',
                        addons: []
                    },
                    {
                        id: 'switch-replacement',
                        slug: 'switch-replacement',
                        title: 'Modular Switch Replacement',
                        category: 'electrical',
                        subcategory: 'switch-socket',
                        startingPrice: 199,
                        duration: '20–30 mins',
                        rating: 4.8,
                        reviewsCount: 220,
                        completedJobs: '940+',
                        warrantyDays: 30,
                        description: 'Replace broken or stiff modular 6A/16A switches with exact matching brands.',
                        problemsCovered: ['Stuck switch rocker', 'Switch not making contact', 'Physical cracked plate'],
                        inclusions: ['Old switch removal', 'New switch mounting', 'Polarity & load check'],
                        exclusions: ['Main conduit rewiring'],
                        materialsPolicy: 'Standard modular switch available at MRP.',
                        addons: []
                    },
                    {
                        id: 'socket-replacement',
                        slug: 'socket-replacement',
                        title: 'Power Socket Replacement (6A / 16A)',
                        category: 'electrical',
                        subcategory: 'switch-socket',
                        startingPrice: 249,
                        duration: '20–30 mins',
                        rating: 4.9,
                        reviewsCount: 275,
                        completedJobs: '1,050+',
                        warrantyDays: 30,
                        description: 'Fix loose, burnt, or non-working 3-pin plug sockets with safety shutter mechanisms and proper earth continuity.',
                        problemsCovered: ['Plug loose or falling out', 'No power in socket', 'Burnt terminal holes', 'Shutter stuck'],
                        inclusions: ['Socket replacement', 'Earth pin continuity test', 'Load capacity check'],
                        exclusions: [],
                        materialsPolicy: 'Heavy-duty 16A sockets available with technician.',
                        addons: []
                    },
                    {
                        id: 'ac-switch-install',
                        slug: 'ac-switch-installation',
                        title: 'Dedicated AC Switch & Heavy Socket Setup',
                        category: 'electrical',
                        subcategory: 'switch-socket',
                        startingPrice: 449,
                        duration: '45–60 mins',
                        rating: 4.9,
                        reviewsCount: 185,
                        completedJobs: '720+',
                        warrantyDays: 30,
                        description: 'Installation of high-load 20A/25A DP switches or starter boxes with 4 sq mm copper wiring for 1.5–2.0 Ton air conditioners.',
                        problemsCovered: ['New AC electrical point', 'AC plug melting under load', 'No starter switch for AC'],
                        inclusions: ['25A DP switch installation', 'Direct MCB feeder loop check', 'Earthing resistance test'],
                        exclusions: ['Long cable run through multiple rooms (billed per meter)'],
                        materialsPolicy: 'Finolex/Havells 4 sq mm FRLS wire and Crabtree/Legrand 25A DP switch at MRP.',
                        addons: []
                    }
                ]
            },
            {
                id: 'mcb-db',
                name: 'MCB & Distribution Board',
                description: 'MCB tripping, ELCB/RCCB earth leakage troubleshooting & DB board overhaul.',
                services: [
                    {
                        id: 'mcb-tripping-diagnosis',
                        slug: 'mcb-tripping-diagnosis',
                        title: 'MCB / ELCB Frequent Tripping Diagnosis',
                        category: 'electrical',
                        subcategory: 'mcb-db',
                        startingPrice: 450,
                        duration: '45–75 mins',
                        rating: 4.9,
                        reviewsCount: 412,
                        completedJobs: '1,680+',
                        warrantyDays: 30,
                        description: 'Specialized diagnostic using insulation testers (Megger) to pinpoint earth leakage, phase-to-neutral shorts, and overloaded circuit branches causing breakers to trip.',
                        problemsCovered: ['MCB trips repeatedly when turning on specific lights/appliances', 'ELCB trips during rain/monsoon moisture', 'Main breaker warm to touch'],
                        inclusions: ['Megger insulation resistance test per circuit', 'Isolation of faulty household loop', 'Neutral loop isolation & load balancing check'],
                        exclusions: ['Replacing entire underground buried cables'],
                        materialsPolicy: 'Type-C ISI MCBs (6A–32A) and 30mA RCCBs provided with warranty.',
                        addons: []
                    },
                    {
                        id: 'mcb-replacement',
                        slug: 'mcb-replacement',
                        title: 'Single Pole / Double Pole MCB Replacement',
                        category: 'electrical',
                        subcategory: 'mcb-db',
                        startingPrice: 349,
                        duration: '30–45 mins',
                        rating: 4.8,
                        reviewsCount: 230,
                        completedJobs: '890+',
                        warrantyDays: 30,
                        description: 'Replacement of weak, jammed, or charred miniature circuit breakers with exact curve rating (B-curve / C-curve).',
                        problemsCovered: ['MCB won’t stay in ON position', 'Internal trip mechanism burnt', 'Current leakage'],
                        inclusions: ['Busbar safety disconnection', 'New MCB DIN rail clip-on', 'Torque tightening of copper terminals'],
                        exclusions: [],
                        materialsPolicy: 'Schneider / Legrand / Havells MCB at MRP.',
                        addons: []
                    },
                    {
                        id: 'db-box-installation',
                        slug: 'db-box-installation',
                        title: 'Distribution Board (DB) Upgrade / Installation',
                        category: 'electrical',
                        subcategory: 'mcb-db',
                        startingPrice: 950,
                        duration: '2–3 hrs',
                        rating: 4.9,
                        reviewsCount: 145,
                        completedJobs: '430+',
                        warrantyDays: 30,
                        description: 'Full distribution board modernization: replace old fuse boards with 4-way to 12-way SPN/TPN modular enclosure with busbars and RCCB.',
                        problemsCovered: ['Old rewirable porcelain fuse replacement', 'Adding new sub-circuits for upper floor', 'Dangerous messy DB board cleanup'],
                        inclusions: ['Demounting old fuse board', 'DIN rail mounting & color-coded phase wiring', 'RCCB 30mA shock protection integration', 'Circuit labeling index'],
                        exclusions: ['External KSEB meter box shifting'],
                        materialsPolicy: 'Metal clad IP43/IP54 DB enclosures provided at wholesale partner prices.',
                        addons: []
                    }
                ]
            },
            {
                id: 'lighting',
                name: 'Lighting & Fixtures',
                description: 'LED lights, tube lights, chandeliers, spotlights & outdoor waterproof lights.',
                services: [
                    {
                        id: 'led-light-installation',
                        slug: 'led-light-installation',
                        title: 'LED Batten & Panel Light Installation',
                        category: 'electrical',
                        subcategory: 'lighting',
                        startingPrice: 199,
                        duration: '20–30 mins',
                        rating: 4.9,
                        reviewsCount: 390,
                        completedJobs: '1,560+',
                        warrantyDays: 30,
                        description: 'Precision mounting and electrical connection of surface or concealed LED panel lights, batten tube lights, and cove lighting.',
                        problemsCovered: ['New LED light fixture setup', 'Replacing old flickering fluorescent tubes', 'Adding ceiling surface lights'],
                        inclusions: ['Drilling and wall clip anchoring', 'Connector block safety wiring', 'Switch polarity check'],
                        exclusions: ['Gypsum false ceiling circular hole cutting'],
                        materialsPolicy: 'Wipro/Philips LED battens available upon request.',
                        addons: []
                    },
                    {
                        id: 'chandelier-installation',
                        slug: 'chandelier-installation',
                        title: 'Chandelier & Decorative Hanging Light Installation',
                        category: 'electrical',
                        subcategory: 'lighting',
                        startingPrice: 599,
                        duration: '45–90 mins',
                        rating: 4.9,
                        reviewsCount: 120,
                        completedJobs: '340+',
                        warrantyDays: 30,
                        description: 'Careful heavy-duty anchoring, crystal assembly, and balanced hanging of premium chandeliers, pendant lights, and staircase lights.',
                        problemsCovered: ['Heavy chandelier RCC ceiling anchoring', 'Multi-tier pendant light wiring', 'Dimmable controller setup'],
                        inclusions: ['Heavy-duty ceiling hook anchoring', 'Multi-wire circuit grouping', 'Safe bulb socket testing and balance adjustment'],
                        exclusions: ['Scaffolding for ceilings above 14 feet (charged separately)'],
                        materialsPolicy: 'Expansion metal anchor fasteners included.',
                        addons: []
                    },
                    {
                        id: 'outdoor-lighting',
                        slug: 'outdoor-lighting-setup',
                        title: 'Outdoor & Gate Light Waterproof Installation',
                        category: 'electrical',
                        subcategory: 'lighting',
                        startingPrice: 349,
                        duration: '30–60 mins',
                        rating: 4.8,
                        reviewsCount: 165,
                        completedJobs: '510+',
                        warrantyDays: 30,
                        description: 'IP65 waterproof garden, compound wall, and pillar gate light wiring with moisture-sealed junction boxes.',
                        problemsCovered: ['Gate pillar light setup', 'Garden floodlights with motion sensor', 'Water entering outdoor light causing tripping'],
                        inclusions: ['Waterproof gland sealing', 'Weatherproof switch connection', 'Earth continuity test'],
                        exclusions: ['Underground soil trenching beyond 5 meters'],
                        materialsPolicy: 'Weatherproof silicon seals and heavy rubber gaskets included.',
                        addons: []
                    }
                ]
            },
            {
                id: 'wiring',
                name: 'Wiring & Earthing',
                description: 'Full house rewiring, point extension, concealed conduit & copper safety earthing.',
                services: [
                    {
                        id: 'house-rewiring',
                        slug: 'complete-house-rewiring',
                        title: 'Complete House / Apartment Rewiring',
                        category: 'electrical',
                        subcategory: 'wiring',
                        startingPrice: 550,
                        duration: '1–3 days',
                        rating: 4.9,
                        reviewsCount: 290,
                        completedJobs: '810+',
                        warrantyDays: 90,
                        description: 'Comprehensive rewiring for aged or damaged electrical installations using FRLS (Flame Retardant Low Smoke) copper cables according to IS 732 standards.',
                        problemsCovered: ['Old aluminum wiring upgrade', 'Overloaded wiring heating in walls', 'Post-renovation circuit restructuring'],
                        inclusions: ['Full load estimation (kW) by licensed supervisor', 'Cable pulling through existing conduits', 'Phase-wise circuit segregation', 'Megger test certificate'],
                        exclusions: ['Major masonry wall wall-saw cutting (quoted per foot)'],
                        materialsPolicy: 'Finolex / RR Kabel / V-Guard 100% pure electrolytic copper wire billed transparently with invoice.',
                        addons: []
                    },
                    {
                        id: 'new-electrical-point',
                        slug: 'new-electrical-point',
                        title: 'Additional Electrical Point (Light / Fan / Socket)',
                        category: 'electrical',
                        subcategory: 'wiring',
                        startingPrice: 249,
                        duration: '30–45 mins',
                        rating: 4.8,
                        reviewsCount: 340,
                        completedJobs: '1,350+',
                        warrantyDays: 30,
                        description: 'Add a new switch/socket point, TV point, or study light point using concealed or neat PVC surface casing.',
                        problemsCovered: ['Need socket near study table or bed', 'Adding new balcony light point', 'Water purifier plug point'],
                        inclusions: ['Wiring up to 3 meters', 'Modular switch/socket installation', 'Connection to nearest phase loop'],
                        exclusions: ['Long cable run above 5 meters (nominal per meter rate)'],
                        materialsPolicy: '1.5 sq mm / 2.5 sq mm FRLS wire included for standard runs.',
                        addons: []
                    },
                    {
                        id: 'earthing-setup',
                        slug: 'safety-earthing-installation',
                        title: 'Safety Earthing Pit & Electrode Setup',
                        category: 'electrical',
                        subcategory: 'wiring',
                        startingPrice: 1200,
                        duration: '2–4 hrs',
                        rating: 5.0,
                        reviewsCount: 180,
                        completedJobs: '590+',
                        warrantyDays: 90,
                        description: 'Installation of copper-bonded chemical earthing electrodes with charcoal/salt or BFC compound to achieve safe earth resistance (< 2 Ohms).',
                        problemsCovered: ['Getting mild electric shock from refrigerator/washing machine metal body', 'ELCB not tripping during earth faults', 'Lightning arrestor earthing pit installation'],
                        inclusions: ['Earth pit digging & pipe driving', 'BFC conductive chemical compound filling', 'Main panel earth busbar connection', 'Earth resistance meter test (< 2 Ohms verified)'],
                        exclusions: ['Drilling through hard solid rock terrain'],
                        materialsPolicy: 'Pure copper earth plate / copper-bonded steel rod (10ft) provided at wholesale rate.',
                        addons: []
                    }
                ]
            },
            {
                id: 'inverter-power',
                name: 'Inverter & UPS',
                description: 'Inverter installation, battery water top-up, backup wiring & bypass switches.',
                services: [
                    {
                        id: 'inverter-installation',
                        slug: 'inverter-ups-installation',
                        title: 'Inverter & Battery System Installation',
                        category: 'electrical',
                        subcategory: 'inverter-power',
                        startingPrice: 499,
                        duration: '45–75 mins',
                        rating: 5.0,
                        reviewsCount: 260,
                        completedJobs: '1,020+',
                        warrantyDays: 30,
                        description: 'Safe installation and dedicated load segregation for home inverters (sine wave / UPS) with tubular battery terminal protection.',
                        problemsCovered: ['New inverter setup for Kerala power cuts', 'Connecting critical fan/light loads to inverter backup', 'Rotary bypass switch setup'],
                        inclusions: ['Inverter input/output terminal wiring', 'Battery lead-acid connector cleaning & petroleum jelly coating', 'Manual bypass switch connection', 'AC mains changeover test'],
                        exclusions: ['Supply of inverter unit or battery'],
                        materialsPolicy: 'Heavy battery copper lugs and 4 sq mm multi-strand cable included.',
                        addons: []
                    },
                    {
                        id: 'inverter-service',
                        slug: 'inverter-battery-health-service',
                        title: 'Inverter & Battery Comprehensive Health Service',
                        category: 'electrical',
                        subcategory: 'inverter-power',
                        startingPrice: 349,
                        duration: '30–45 mins',
                        rating: 4.9,
                        reviewsCount: 175,
                        completedJobs: '680+',
                        warrantyDays: 30,
                        description: 'Battery gravity test, terminal de-sulphation, distilled water top-up, and charging voltage calibration.',
                        problemsCovered: ['Inverter backup time drastically reduced', 'Battery emitting bad smell or boiling', 'Inverter beeping continuously on overload error'],
                        inclusions: ['Hydrometer specific gravity test per cell', 'Terminal corrosion cleaning', 'Distilled water top-up up to 2 liters', 'Inverter cut-off voltage testing'],
                        exclusions: ['Cost of new battery cells'],
                        materialsPolicy: 'Demineralized battery water supplied.',
                        addons: []
                    }
                ]
            },
            {
                id: 'appliances-other',
                name: 'Appliance Electrical Setup',
                description: 'Geyser points, doorbell, EV home chargers & CCTV electrical integration.',
                services: [
                    {
                        id: 'geyser-electrical-point',
                        slug: 'geyser-electrical-installation',
                        title: 'Geyser / Water Heater Electrical Point Installation',
                        category: 'electrical',
                        subcategory: 'appliances-other',
                        startingPrice: 399,
                        duration: '30–45 mins',
                        rating: 4.9,
                        reviewsCount: 215,
                        completedJobs: '840+',
                        warrantyDays: 30,
                        description: 'High-load 16A/20A waterproof socket point with dedicated earthing and miniature isolator switch for bathroom water heaters.',
                        problemsCovered: ['Installing power point for new water heater', 'Geyser tripping main ELCB', 'Burnt 16A socket replacement'],
                        inclusions: ['16A moisture-resistant socket box', 'Dedicated 2.5/4 sq mm copper wiring to DB', 'Earth continuity test (< 1 Ohm)'],
                        exclusions: ['Plumbing water inlet/outlet pipes'],
                        materialsPolicy: 'ISI 16A modular socket and MCB at MRP.',
                        addons: []
                    },
                    {
                        id: 'doorbell-installation',
                        slug: 'doorbell-installation',
                        title: 'Calling Bell & Video Doorbell Electrical Setup',
                        category: 'electrical',
                        subcategory: 'appliances-other',
                        startingPrice: 199,
                        duration: '20–30 mins',
                        rating: 4.8,
                        reviewsCount: 140,
                        completedJobs: '590+',
                        warrantyDays: 30,
                        description: 'Wired or wireless doorbell chime mounting with outdoor push-button wiring and transformer safety setup.',
                        problemsCovered: ['Doorbell not ringing', 'Continuous buzzing chime', 'Video doorbell 12V/24V power wiring'],
                        inclusions: ['Chime unit mounting', 'Bell push switch connection', 'Audibility test'],
                        exclusions: [],
                        materialsPolicy: 'Bell wire included up to 5 meters.',
                        addons: []
                    },
                    {
                        id: 'ev-charger-setup',
                        slug: 'ev-home-charger-installation',
                        title: 'EV (Electric Vehicle) 16A / 32A Home Charger Setup',
                        category: 'electrical',
                        subcategory: 'appliances-other',
                        startingPrice: 850,
                        duration: '1–2 hrs',
                        rating: 5.0,
                        reviewsCount: 88,
                        completedJobs: '240+',
                        warrantyDays: 60,
                        description: 'Certified 3.3kW / 7.2kW AC home charger power setup with dedicated 32A industrial socket, Type-A RCCB shock protector, and low-impedance earthing.',
                        problemsCovered: ['Safe home charging setup for 2-wheeler / 4-wheeler EV', 'Preventing overheating of standard wall plugs', 'Dedicated sub-meter setup for EV charging'],
                        inclusions: ['32A Industrial IP66 socket box', 'Dedicated feeder cable from main DB with 32A MCB + 30mA RCCB', 'Earth resistance verification (< 1 Ohm for EV safety)', 'Charging handshake test'],
                        exclusions: ['KSEB sanction load enhancement paperwork'],
                        materialsPolicy: '6 sq mm 3-core armored cable & industrial socket billed at wholesale rate.',
                        addons: []
                    }
                ]
            }
        ]
    },
    {
        id: 'ac',
        name: 'AC Service & Repair',
        shortName: 'AC Service',
        icon: 'Wind',
        tagline: 'Deep Foam Jet Pump Cleaning & Gas Refill',
        description: 'Certified HVAC technicians for indoor coil jet wash, cooling troubleshooting & gas top-up.',
        available: true,
        subcategories: [
            {
                id: 'ac-maintenance',
                name: 'AC Cleaning & Service',
                description: 'Pressure jet wash, filter cleaning and cooling optimization.',
                services: [
                    {
                        id: 'ac-jet-service',
                        slug: 'ac-jet-pump-service',
                        title: 'AC Deep Clean Foam Jet Pump Service',
                        category: 'ac',
                        subcategory: 'ac-maintenance',
                        startingPrice: 650,
                        duration: '45–60 mins',
                        rating: 4.8,
                        reviewsCount: 310,
                        completedJobs: '1,120+',
                        warrantyDays: 30,
                        description: 'High-pressure foam jet cleaning of indoor cooling coils, blower wheel, drain tray and outdoor condenser fins to eliminate mold, odors, and boost cooling.',
                        problemsCovered: ['AC throwing weak airflow', 'Foul damp smell from AC', 'High electricity bills due to choked condenser fins'],
                        inclusions: ['Indoor unit high pressure jet wash with waterproof jacket', 'Outdoor condenser fin chemical wash', 'Drain pipe flushing & anti-bacterial spray', 'Gas pressure & current draw (Ampere) test'],
                        exclusions: ['Gas refilling / compressor valve repair (charged separately)'],
                        materialsPolicy: 'Coil cleaning solution and anti-microbial spray included.',
                        addons: []
                    }
                ]
            }
        ]
    },
    {
        id: 'cctv',
        name: 'CCTV & Security',
        shortName: 'CCTV & Security',
        icon: 'Video',
        tagline: 'HD/IP Cameras, NVR Setup & Remote Mobile View',
        description: 'Professional surveillance camera cabling, angle positioning, and smartphone live feed configuration.',
        available: true,
        subcategories: [
            {
                id: 'cctv-setup',
                name: 'Camera Installation',
                description: 'IP & HD security camera setup for homes & shops.',
                services: [
                    {
                        id: 'cctv-installation',
                        slug: 'cctv-camera-setup',
                        title: 'CCTV Security Camera Installation & Mobile App Config',
                        category: 'cctv',
                        subcategory: 'cctv-setup',
                        startingPrice: 700,
                        duration: '1–2 hrs',
                        rating: 4.9,
                        reviewsCount: 195,
                        completedJobs: '670+',
                        warrantyDays: 30,
                        description: 'Mounting of bullet/dome HD/IP cameras with waterproof junction box, BNC/CAT6 termination, NVR/DVR connection, and mobile remote live view setup.',
                        problemsCovered: ['New home surveillance setup', 'Camera offline or blank screen', 'Configuring mobile phone viewing'],
                        inclusions: ['Camera mounting and angle alignment', 'CAT6 / 3+1 coaxial cable clipping up to 15m', 'Router port forwarding & mobile app configuration', 'Night vision IR check'],
                        exclusions: ['Cost of cameras, DVR/NVR, and hard drive'],
                        materialsPolicy: 'BNC connectors, DC pins, and PVC junction boxes included.',
                        addons: []
                    }
                ]
            }
        ]
    },
    {
        id: 'automation',
        name: 'Smart Home Automation',
        shortName: 'Home Automation',
        icon: 'Cpu',
        tagline: 'WiFi Smart Switches, Voice Relays & Mobile App Control',
        description: 'Transform existing switchboards into smartphone and Alexa/Google Home controlled smart systems without rewiring.',
        available: true,
        subcategories: [
            {
                id: 'smart-switches',
                name: 'Smart Switches',
                description: 'Retrofit WiFi relays behind existing switchboards.',
                services: [
                    {
                        id: 'smart-switch-setup',
                        slug: 'smart-home-switch-setup',
                        title: 'Smart Switch & WiFi Hub Automation (1-Room Setup)',
                        category: 'automation',
                        subcategory: 'smart-switches',
                        startingPrice: 1499,
                        duration: '1–2 hrs',
                        rating: 4.9,
                        reviewsCount: 140,
                        completedJobs: '420+',
                        warrantyDays: 60,
                        description: 'Retrofit smart WiFi relay modules behind your existing switchboard to control lights and fans via smartphone, scheduling, and voice assistants (Alexa/Google Home).',
                        problemsCovered: ['Wanting to control fans/lights via smartphone app', 'Setting automated timer for porch/gate lights at sunset', 'Voice control integration for elderly parents'],
                        inclusions: ['Concealed installation of smart relay modules behind existing switchboard', 'Neutral wire verification & safe capacitor loop integration', 'Mobile app setup (Smart Life / Tuya / Sonoff)', 'Alexa / Google Assistant voice linking', 'Family member app sharing & automation routines'],
                        exclusions: ['Cost of smart WiFi relay hardware modules (billed at MRP or supply your own)'],
                        materialsPolicy: 'Sonoff / Tuya / Oakter certified smart relays available with technician.',
                        addons: []
                    }
                ]
            }
        ]
    },
    {
        id: 'plumbing',
        name: 'Plumbing',
        shortName: 'Plumbing',
        icon: 'Droplet',
        tagline: 'Water Motor, Tap Leaks, Pipes & Sanitaryware',
        description: 'Verified plumbers for pipe leaks, water motor pumps, CP fittings & bathroom sanitaryware.',
        available: true,
        subcategories: []
    },
    {
        id: 'appliances',
        name: 'Appliance Repair',
        shortName: 'Appliance Repair',
        icon: 'WashingMachine',
        tagline: 'Washing Machine, Refrigerator & Microwave',
        description: 'Doorstep diagnosis and repair for domestic home appliances.',
        available: true,
        subcategories: []
    },
    {
        id: 'carpentry',
        name: 'Carpentry',
        shortName: 'Carpentry',
        icon: 'Hammer',
        tagline: 'Doors, Locks, Hinges & Furniture Assembly',
        description: 'Skilled carpenters for door repairs, new locks, and custom woodwork.',
        available: false,
        comingSoon: true,
        subcategories: []
    },
    {
        id: 'painting',
        name: 'Painting',
        shortName: 'Painting',
        icon: 'Paintbrush',
        tagline: 'Interior, Exterior & Monsoon Waterproofing',
        description: 'Professional home painting and anti-fungal wall waterproofing.',
        available: false,
        comingSoon: true,
        subcategories: []
    }
];

// Helper: Flat list of all available services across all categories
export const getAllServices = () => {
    const list = [];
    CATEGORIES.forEach(cat => {
        (cat.subcategories || []).forEach(sub => {
            (sub.services || []).forEach(s => {
                list.push({
                    ...s,
                    categoryName: cat.name,
                    subcategoryName: sub.name
                });
            });
        });
    });
    return list;
};

// Helper: Get single service by slug or id
export const getServiceBySlugOrId = (identifier) => {
    const all = getAllServices();
    return all.find(s => s.id === identifier || s.slug === identifier) || null;
};
