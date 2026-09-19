/**
 * SHERIYAKAM — Centralized Multi-Category Service Catalogue
 * Structured service hierarchy for Kerala's Home-Services Marketplace.
 * Granular priced sub-services across Electrical, AC, Plumbing, CCTV, Commercial & AMC.
 */

export const CATEGORIES = [
    {
        id: 'electrical',
        name: 'Electrician',
        shortName: 'Electrical',
        icon: 'Zap',
        tagline: 'Kerala Electrical Inspectorate Certified Wiremen',
        description: 'Certified wiremen & supervisors for residential, commercial & emergency repairs.',
        isPrimary: true,
        available: true,
        subcategories: [
            {
                id: 'diagnostic',
                name: 'Inspection & Consultation',
                description: 'Low-cost fault diagnosis with upfront quote before repair.',
                services: [
                    {
                        id: 'diagnostic-visit',
                        slug: 'doorstep-diagnostic-visit',
                        title: 'Book a Diagnostic & Fault Inspection Visit',
                        category: 'electrical',
                        subcategory: 'diagnostic',
                        startingPrice: 49,
                        price: 49,
                        duration: '30–45 mins',
                        rating: 5.0,
                        reviewsCount: 412,
                        completedJobs: '1,890+',
                        warrantyDays: 30,
                        description: 'Low-cost doorstep diagnostic visit for ambiguous faults. Master electrician inspects the fault on-site, isolates the issue, and provides a clear itemized quote before work starts. If you proceed with the repair, the ₹49 fee is fully adjusted against your final bill.',
                        problemsCovered: [
                            'Not sure what is causing the electrical trip or burning smell',
                            'Multiple switchboards or appliances malfunctioning simultaneously',
                            'Need on-site assessment for full house rewiring or renovation quote',
                            'Pre-purchase electrical health check for rented flat/house'
                        ],
                        inclusions: [
                            'Complete doorstep arrival by KSELB licensed electrician within 90 mins',
                            'Digital multimeter voltage, phase & earth leakage test',
                            'Fault isolation & safety advisory report',
                            'Upfront transparent price estimate before any repair commences',
                            '100% inspection fee waiver when service is approved'
                        ],
                        exclusions: [
                            'Physical component replacement labor (quoted on arrival based on rate card)'
                        ],
                        materialsPolicy: 'Genuine ISI certified replacement spares provided with bill at MRP.',
                        addons: []
                    }
                ]
            },
            {
                id: 'switch-socket',
                name: 'Switches, Sockets & MCB',
                description: 'Repair burned switches, 16A power plugs, tripping breakers & DB boards.',
                services: [
                    {
                        id: 'switch-socket-repair',
                        slug: 'switch-socket-replacement',
                        title: 'Switch & 16A Power Socket Replacement',
                        category: 'electrical',
                        subcategory: 'switch-socket',
                        startingPrice: 149,
                        price: 149,
                        duration: '20–30 mins',
                        rating: 4.9,
                        reviewsCount: 520,
                        completedJobs: '2,150+',
                        warrantyDays: 30,
                        description: 'Safe replacement and wiring of loose, sparking, or burned 6A/16A modular and non-modular switches, power sockets, and AC/geyser points.',
                        problemsCovered: [
                            'Switchboard sparking or loose contact',
                            'Heavy appliance 16A plug melted or burned',
                            'Switch button stuck or not turning on'
                        ],
                        inclusions: [
                            'Switchboard faceplate unscrewing and line testing',
                            'Phase, neutral & ground terminal screw tightening',
                            'Replacement switch/socket mounting and load test'
                        ],
                        exclusions: ['Chipping wall for new gang box'],
                        materialsPolicy: 'Modular switches (Roma, Legrand, Crabtree) supplied at transparent MRP.',
                        addons: []
                    },
                    {
                        id: 'mcb-fuse-tripping',
                        slug: 'mcb-tripping-db-repair',
                        title: 'MCB / RCCB Tripping & DB Overhaul',
                        category: 'electrical',
                        subcategory: 'switch-socket',
                        startingPrice: 349,
                        price: 349,
                        duration: '45–60 mins',
                        rating: 4.9,
                        reviewsCount: 680,
                        completedJobs: '2,740+',
                        warrantyDays: 30,
                        description: 'Detailed circuit isolation for persistent MCB or RCCB earth-leakage trips, busbar burnouts, and distribution board short-circuit troubleshooting.',
                        problemsCovered: [
                            'RCCB trips immediately when power is turned on',
                            'MCB breaker getting extremely hot or buzzing',
                            'Neutral link burn out in distribution box'
                        ],
                        inclusions: [
                            'Insulation resistance megger test per sub-circuit',
                            'Earth leakage isolation and neutral fault clearance',
                            'MCB terminal tightening and load balancing across phases'
                        ],
                        exclusions: ['Underground cable trenching'],
                        materialsPolicy: 'Havells / Schneider / L&T C-curve MCBs at official MRP.',
                        addons: []
                    }
                ]
            },
            {
                id: 'fan',
                name: 'Fan Services',
                description: 'Installation, capacitor repair, speed regulator fix & balancing.',
                services: [
                    {
                        id: 'fan-repair',
                        slug: 'fan-repair',
                        title: 'Ceiling & Exhaust Fan Repair / Capacitor Fix',
                        category: 'electrical',
                        subcategory: 'fan',
                        startingPrice: 199,
                        price: 199,
                        duration: '30–45 mins',
                        rating: 4.9,
                        reviewsCount: 890,
                        completedJobs: '3,420+',
                        warrantyDays: 30,
                        description: 'Complete diagnosis and repair for noisy, slow, or vibrating ceiling and exhaust fans. Covers capacitor replacement, bearing lubrication check, and step regulator wiring.',
                        problemsCovered: [
                            'Fan running at very slow speed even on speed 5',
                            'Loud hum, squeak, or bearing friction noise',
                            'Fan not starting or regulator switch dead'
                        ],
                        inclusions: [
                            'Capacitor voltage check & replacement labor',
                            'Regulator wiring & switchboard connection test',
                            'Blade balancing & safety downrod clamp inspection'
                        ],
                        exclusions: ['Motor rewind if copper coils are burnt'],
                        materialsPolicy: 'Heavy-duty 2.5uF/3.15uF ISI capacitors provided at MRP (₹80–120).',
                        addons: []
                    },
                    {
                        id: 'fan-installation',
                        slug: 'fan-installation',
                        title: 'New Ceiling Fan Installation & Regulator Wiring',
                        category: 'electrical',
                        subcategory: 'fan',
                        startingPrice: 299,
                        price: 299,
                        duration: '30–45 mins',
                        rating: 4.9,
                        reviewsCount: 420,
                        completedJobs: '1,650+',
                        warrantyDays: 30,
                        description: 'Professional assembly and secure ceiling mounting of standard and BLDC remote fans with downrod assembly, safety shackle installation, and step regulator wiring.',
                        problemsCovered: [
                            'Unbox and assemble new fan',
                            'Secure hook mounting & safety pin locking',
                            'Connect regulator and switch control'
                        ],
                        inclusions: [
                            'Blade assembly and pitch angle alignment',
                            'Secure downrod mounting to ceiling hook',
                            'Switchboard connection and calibration'
                        ],
                        exclusions: ['Ceiling hook masonry drilling'],
                        materialsPolicy: 'Extension wires and anchor fasteners charged at store rate if needed.',
                        addons: []
                    }
                ]
            },
            {
                id: 'wiring',
                name: 'Wiring & Cable Pulling',
                description: 'Point wiring, short circuit isolation & conduit cabling.',
                services: [
                    {
                        id: 'conduit-point-wiring',
                        slug: 'conduit-point-wiring',
                        title: 'New Point Wiring & Concealed Conduit (Per Point)',
                        category: 'electrical',
                        subcategory: 'wiring',
                        startingPrice: 299,
                        price: 299,
                        duration: '45–60 mins',
                        rating: 4.8,
                        reviewsCount: 310,
                        completedJobs: '1,280+',
                        warrantyDays: 60,
                        description: 'Complete new electrical point installation through existing PVC conduits with 1.5 sq mm / 2.5 sq mm FRLS fire-retardant copper wires from DB to switchbox.',
                        problemsCovered: [
                            'Adding extra light, socket or TV point in room',
                            'Replacing old degraded wires inside conduit',
                            'Dedicated power circuit for microwave or computer setup'
                        ],
                        inclusions: [
                            'Fish-tape wire pulling through PVC pipe conduits',
                            'Phase, neutral, and dedicated earthing wire termination',
                            'Switchboard connection and load testing'
                        ],
                        exclusions: ['Concrete wall chipping / plastering'],
                        materialsPolicy: 'Finolex / RR Kabel 100% pure electrolytic copper wire at market price.',
                        addons: []
                    },
                    {
                        id: 'house-rewiring-meter',
                        slug: 'complete-house-rewiring',
                        title: 'Full House Rewiring & Safety Earthing (Per Room)',
                        category: 'electrical',
                        subcategory: 'wiring',
                        startingPrice: 1499,
                        price: 1499,
                        duration: '2–4 hrs',
                        rating: 4.9,
                        reviewsCount: 210,
                        completedJobs: '740+',
                        warrantyDays: 90,
                        description: 'Comprehensive rewiring for aged Kerala homes. Includes circuit separation for heavy appliances, chemical earth pit resistance optimization (<1 Ohm), and modern DB layout.',
                        problemsCovered: [
                            'Old aluminum or single-insulated wires causing constant tripping',
                            'Electric shock sensations on metal taps and geysers',
                            'KSEB meter upgrade load certification requirement'
                        ],
                        inclusions: [
                            'Complete room wire extraction and FRLS copper pulling',
                            'Chemical earth pit resistance measurement & earthing connection',
                            'Circuit segregation with individual MCBs'
                        ],
                        exclusions: ['Masonry wall chasing civil labor'],
                        materialsPolicy: 'Complete transparent material estimation prior to job.',
                        addons: []
                    }
                ]
            },
            {
                id: 'power-backup',
                name: 'Inverters & 3-Phase DB',
                description: 'Home power backup, UPS changeover & 3-phase load balancing.',
                services: [
                    {
                        id: 'inverter-ups-setup',
                        slug: 'inverter-ups-installation',
                        title: 'Inverter, Battery & Bypass Changeover Switch Setup',
                        category: 'electrical',
                        subcategory: 'power-backup',
                        startingPrice: 499,
                        price: 499,
                        duration: '60 mins',
                        rating: 4.9,
                        reviewsCount: 350,
                        completedJobs: '1,490+',
                        warrantyDays: 30,
                        description: 'Pure sine wave inverter connection, tubular battery acid/gravity terminal maintenance, safety bypass changeover switch wiring, and dedicated essential load circuit separation.',
                        problemsCovered: [
                            'Inverter not switching over during KSEB power cut',
                            'Battery backup lasting only few minutes',
                            'Adding manual bypass rotary switch for emergencies'
                        ],
                        inclusions: [
                            'Inverter DC cable terminal crimping and petroleum jelly coating',
                            'AC input/output wiring to main distribution box',
                            'Rotary manual bypass switch integration'
                        ],
                        exclusions: ['Inverter motherboard bench repair'],
                        materialsPolicy: 'Bypass switches and 10 sq mm battery cables available at MRP.',
                        addons: []
                    },
                    {
                        id: 'three-phase-load-balance',
                        slug: 'three-phase-load-balancing',
                        title: '3-Phase Neutral Load Balancing & Main DB Overhaul',
                        category: 'electrical',
                        subcategory: 'power-backup',
                        startingPrice: 899,
                        price: 899,
                        duration: '90 mins',
                        rating: 5.0,
                        reviewsCount: 180,
                        completedJobs: '620+',
                        warrantyDays: 60,
                        description: 'Equal distribution of household single-phase electrical loads across R-Y-B phases to prevent neutral wire burnout, low voltage dips, and frequent KSEB fuse blows.',
                        problemsCovered: [
                            'One phase showing low voltage (dim lights) while other phases are fine',
                            'Main neutral link melting inside energy meter panel',
                            'Frequent tripping of 63A 4-pole main isolator'
                        ],
                        inclusions: [
                            'Clamp-meter live current draw measurement across all 3 phases',
                            'Sub-circuit rewiring and re-allocation on busbars',
                            'Phase indicator LED lamp installation & neutral tightness test'
                        ],
                        exclusions: ['KSEB overhead service line repair'],
                        materialsPolicy: '4-pole isolators and copper busbars billed at standard rate.',
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
                        startingPrice: 649,
                        price: 649,
                        duration: '45–60 mins',
                        rating: 4.8,
                        reviewsCount: 520,
                        completedJobs: '2,120+',
                        warrantyDays: 30,
                        description: 'High-pressure foam jet cleaning of indoor cooling coils, blower wheel, drain tray and outdoor condenser fins to eliminate mold, odors, and boost cooling efficiency.',
                        problemsCovered: [
                            'AC throwing weak airflow or reduced cooling',
                            'Foul damp smell when AC is switched on',
                            'High electricity bills due to choked condenser fins'
                        ],
                        inclusions: [
                            'Indoor unit high pressure jet wash with waterproof apron jacket',
                            'Outdoor condenser fin chemical wash',
                            'Drain pipe flushing & anti-bacterial spray',
                            'Gas pressure & current draw (Ampere) test'
                        ],
                        exclusions: ['Refrigerant gas refill labor and material'],
                        materialsPolicy: 'Coil cleaning solution and anti-microbial spray included.',
                        addons: []
                    },
                    {
                        id: 'ac-anti-fungal-service',
                        slug: 'ac-anti-microbial-service',
                        title: 'AC Anti-Microbial Jet Wash + Drain Sanitation',
                        category: 'ac',
                        subcategory: 'ac-maintenance',
                        startingPrice: 799,
                        price: 799,
                        duration: '60 mins',
                        rating: 4.9,
                        reviewsCount: 230,
                        completedJobs: '890+',
                        warrantyDays: 45,
                        description: 'Hospital-grade disinfectant foam treatment designed for coastal Kerala high-humidity environments. Removes toxic black mold, dust mites, and bacteria from the blower barrel.',
                        problemsCovered: [
                            'Allergy/sneezing triggered when turning on bedroom AC',
                            'Heavy slimy algae buildup inside drain tray',
                            'Sluggish airflow and whistling fan sound'
                        ],
                        inclusions: [
                            'Dual-chemical foam application & high-pressure rinse',
                            'Complete blower fan dismantle & disinfection',
                            'Drain line vacuum purge & tablet anti-clog treatment'
                        ],
                        exclusions: ['Compressor replacement'],
                        materialsPolicy: 'Eco-friendly non-corrosive chemical foam included.',
                        addons: []
                    }
                ]
            },
            {
                id: 'ac-repairs',
                name: 'Repairs & Gas Refilling',
                description: 'Water leakage, gas top-up, wall uninstallation & PCB diagnostics.',
                services: [
                    {
                        id: 'ac-water-leakage',
                        slug: 'ac-water-leakage-fix',
                        title: 'AC Indoor Water Leakage & Choked Drain Fix',
                        category: 'ac',
                        subcategory: 'ac-repairs',
                        startingPrice: 399,
                        price: 399,
                        duration: '30–45 mins',
                        rating: 4.8,
                        reviewsCount: 340,
                        completedJobs: '1,310+',
                        warrantyDays: 30,
                        description: 'Immediate resolution of water dripping from indoor AC unit over walls, beds, or flooring. Clears drain pipe blockages, fixes slope issues, and re-seals tray cracks.',
                        problemsCovered: [
                            'Water overflowing from indoor unit front panel',
                            'Algae / dust blockage inside 1/2 inch PVC drain line',
                            'Improper wall slope causing backflow'
                        ],
                        inclusions: [
                            'High-pressure water purge through full drain line',
                            'Drain pan inspection and sealant application',
                            'Indoor backplate leveling adjustment'
                        ],
                        exclusions: ['New drain pipe routing through wall chipping'],
                        materialsPolicy: 'Flexible drain pipe extensions provided at MRP if needed.',
                        addons: []
                    },
                    {
                        id: 'ac-gas-leak-topup',
                        slug: 'ac-gas-leak-and-refill',
                        title: 'AC Gas Leak Test & Refrigerant (R32/R410A) Top-Up',
                        category: 'ac',
                        subcategory: 'ac-repairs',
                        startingPrice: 1499,
                        price: 1499,
                        duration: '60–90 mins',
                        rating: 4.9,
                        reviewsCount: 410,
                        completedJobs: '1,640+',
                        warrantyDays: 60,
                        description: 'Nitrogen pressure leak detection, copper flare nut tightening, deep vacuuming, and 100% pure genuine refrigerant charging for optimum ice-cold cooling.',
                        problemsCovered: [
                            'AC running but room not getting cold at all',
                            'Ice forming on thin copper pipe near outdoor unit',
                            'Hissing gas leak sound from indoor flare nuts'
                        ],
                        inclusions: [
                            'Soap bubble & electronic halogen leak check',
                            'Flare joint re-flaring and copper brazing if minor leak',
                            'Vacuum pump evacuation (-30 inHg) and digital scale gas charging'
                        ],
                        exclusions: ['Condenser coil replacement if completely rusted'],
                        materialsPolicy: 'Certified DuPont / Chemours R32, R410A, or R22 refrigerant.',
                        addons: []
                    },
                    {
                        id: 'ac-uninstallation-reinstallation',
                        slug: 'ac-uninstallation-reinstallation',
                        title: 'Split AC Dismantling & Wall Mounting Setup',
                        category: 'ac',
                        subcategory: 'ac-repairs',
                        startingPrice: 899,
                        price: 899,
                        duration: '60–90 mins',
                        rating: 4.9,
                        reviewsCount: 280,
                        completedJobs: '980+',
                        warrantyDays: 30,
                        description: 'Careful pump-down gas locking, electrical decoupling, outdoor bracket mounting, core hole copper routing, and balanced indoor unit hanging.',
                        problemsCovered: [
                            'Relocating AC to new room or shifting house',
                            'Upgrading to new inverter AC and removing old unit'
                        ],
                        inclusions: [
                            'Safe refrigerant gas pump-down into compressor',
                            'Bracket anchor bolting on brick/concrete wall',
                            'Copper line connection and leak vacuum check'
                        ],
                        exclusions: ['Extra copper pipe beyond 3 meters'],
                        materialsPolicy: 'Heavy-duty powder coated outdoor wall brackets at MRP.',
                        addons: []
                    },
                    {
                        id: 'ac-pcb-repair',
                        slug: 'ac-pcb-circuit-diagnosis',
                        title: 'AC Inverter PCB Motherboard Circuit Troubleshooting',
                        category: 'ac',
                        subcategory: 'ac-repairs',
                        startingPrice: 499,
                        price: 499,
                        duration: '45–60 mins',
                        rating: 4.7,
                        reviewsCount: 190,
                        completedJobs: '670+',
                        warrantyDays: 30,
                        description: 'Diagnosis of inverter AC error codes (E1, E6, F3), communication faults between indoor/outdoor units, sensor failures, and power supply relay faults.',
                        problemsCovered: [
                            'AC display flashing error codes and shutting down',
                            'Outdoor compressor motor fan not starting',
                            'Remote control signals not responding'
                        ],
                        inclusions: [
                            'Microcontroller & IPM module voltage testing',
                            'Temperature thermistor sensor calibration',
                            'Bench repair pickup & reinstallation service'
                        ],
                        exclusions: ['Cost of IC replacement parts if burnt'],
                        materialsPolicy: 'Itemized component estimate provided before bench repair.',
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
        subcategories: [
            {
                id: 'taps-fittings',
                name: 'Taps & Sanitary Fittings',
                description: 'Tap leaks, flush tanks, angle valves & mixer cartridges.',
                services: [
                    {
                        id: 'plumbing-tap-leak',
                        slug: 'tap-leak-spindle-repair',
                        title: 'Tap Leak, Mixer Spindle & Angle Valve Replacement',
                        category: 'plumbing',
                        subcategory: 'taps-fittings',
                        startingPrice: 149,
                        price: 149,
                        duration: '20–30 mins',
                        rating: 4.8,
                        reviewsCount: 430,
                        completedJobs: '1,890+',
                        warrantyDays: 30,
                        description: 'Quick resolution of non-stop dripping taps, stuck quarter-turn cartridges, leaking kitchen sink mixers, and broken brass angle valves.',
                        problemsCovered: [
                            'Tap continuously dripping water wasting tank capacity',
                            'Water leaking from mixer handle or swivel spout',
                            'Corroded geyser inlet angle valve broken at thread'
                        ],
                        inclusions: [
                            'Teflon tape sealing and spindle removal',
                            'New ceramic cartridge / angle valve installation',
                            'Water pressure leak test'
                        ],
                        exclusions: ['Concealed diverter body replacement inside wall'],
                        materialsPolicy: 'Jaquar / Hindware / Cera genuine CP fittings provided at MRP.',
                        addons: []
                    },
                    {
                        id: 'plumbing-flush-cistern',
                        slug: 'toilet-flush-tank-repair',
                        title: 'Toilet Flush Tank / Cistern Leakage & Syphon Repair',
                        category: 'plumbing',
                        subcategory: 'taps-fittings',
                        startingPrice: 299,
                        price: 299,
                        duration: '30–45 mins',
                        rating: 4.7,
                        reviewsCount: 290,
                        completedJobs: '1,150+',
                        warrantyDays: 30,
                        description: 'Fixing continuous water trickling into toilet commode, stuck push buttons, faulty ball valves, and loose flush tank flapper valves.',
                        problemsCovered: [
                            'Flush tank constantly overflowing or not filling up',
                            'Dual-flush top button broken or sunken',
                            'Water continuously leaking into closet bowl'
                        ],
                        inclusions: [
                            'Inlet ball cock & syphon mechanism adjustment',
                            'Rubber washer replacement & scale removal',
                            'Flush discharge and water level calibration'
                        ],
                        exclusions: ['Ceramic commode replacement'],
                        materialsPolicy: 'Universal syphon kits & dual-flush buttons at store rates.',
                        addons: []
                    }
                ]
            },
            {
                id: 'pumps-drainage',
                name: 'Water Pumps & Tank Cleaning',
                description: 'Well motors, booster pumps, drain clearing & tank hygiene.',
                services: [
                    {
                        id: 'plumbing-pump-starter',
                        slug: 'water-motor-pump-repair',
                        title: 'Water Motor / Booster Pump Starter & Air-Lock Fix',
                        category: 'plumbing',
                        subcategory: 'pumps-drainage',
                        startingPrice: 399,
                        price: 399,
                        duration: '45 mins',
                        rating: 4.9,
                        reviewsCount: 360,
                        completedJobs: '1,470+',
                        warrantyDays: 30,
                        description: 'Troubleshooting self-priming motors, openwell submersibles, pressure booster pumps, foot valve priming issues, and starter capacitor problems.',
                        problemsCovered: [
                            'Motor running but no water pumping to overhead tank',
                            'Motor humming loudly without spinning',
                            'Pressure pump cycling ON and OFF every few seconds'
                        ],
                        inclusions: [
                            'Suction pipe air-lock priming & foot valve check',
                            'Starter box relay & capacitor test',
                            'Pressure switch diaphragm adjustment'
                        ],
                        exclusions: ['Deep well physical extraction below 40 feet'],
                        materialsPolicy: 'Start capacitors and foot valves supplied at MRP.',
                        addons: []
                    },
                    {
                        id: 'plumbing-drain-blockage',
                        slug: 'drain-pipe-blockage-clearing',
                        title: 'Kitchen Sink & Bathroom Drain Blockage Clearing',
                        category: 'plumbing',
                        subcategory: 'pumps-drainage',
                        startingPrice: 349,
                        price: 349,
                        duration: '45 mins',
                        rating: 4.8,
                        reviewsCount: 410,
                        completedJobs: '1,680+',
                        warrantyDays: 30,
                        description: 'Mechanical snake wire drain clearing to remove hair, grease, soap scum, and solid clogs from kitchen waste pipes and bathroom floor traps.',
                        problemsCovered: [
                            'Kitchen sink water pooling and draining very slowly',
                            'Bathroom floor trap overflowing into bedroom',
                            'Foul sewage smell rising from drain outlets'
                        ],
                        inclusions: [
                            'Heavy gauge drain auger / snake clearing',
                            'P-trap dismantling and grease sludge removal',
                            'High-volume water flow flushing test'
                        ],
                        exclusions: ['Main road underground sewer line excavation'],
                        materialsPolicy: 'Drain unblocking enzymes included in service.',
                        addons: []
                    },
                    {
                        id: 'plumbing-tank-clean',
                        slug: 'overhead-water-tank-cleaning',
                        title: 'Overhead Water Tank Mechanized Chemical Cleaning',
                        category: 'plumbing',
                        subcategory: 'pumps-drainage',
                        startingPrice: 699,
                        price: 699,
                        duration: '60–90 mins',
                        rating: 4.9,
                        reviewsCount: 220,
                        completedJobs: '840+',
                        warrantyDays: 30,
                        description: '6-stage deep tank sanitization: sludge extraction, high-pressure rotary jet wash, chemical algae descaling, UV antibacterial spray, and float valve inspection.',
                        problemsCovered: [
                            'Reddish mud/sediment coming out of bathroom taps',
                            'Algae and green fungus coating internal tank walls',
                            'Float valve malfunctioning causing daily tank overflow'
                        ],
                        inclusions: [
                            'Submersible sludge pump dewatering',
                            'Manual rotary scrubbing of corners and walls',
                            'Food-grade hydrogen peroxide / UV sanitization spray',
                            'Automatic mechanical float valve check'
                        ],
                        exclusions: ['RCC underground sump exceeding 2,000 liters'],
                        materialsPolicy: 'Food-safe eco-friendly sanitizing agents included.',
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
                id: 'camera-setup',
                name: 'Camera Installation & Config',
                description: 'IP & HD cameras, multi-channel NVRs, offline repairs & video doorbells.',
                services: [
                    {
                        id: 'cctv-camera-single',
                        slug: 'single-cctv-camera-mounting',
                        title: 'Single HD/IP Bullet / Dome Camera Mounting & Wiring',
                        category: 'cctv',
                        subcategory: 'camera-setup',
                        startingPrice: 399,
                        price: 399,
                        duration: '45 mins',
                        rating: 4.9,
                        reviewsCount: 280,
                        completedJobs: '1,180+',
                        warrantyDays: 30,
                        description: 'Precision mounting of outdoor weatherproof bullet or indoor dome cameras with junction box, BNC/RJ45 termination, and optimal blindspot-free angle alignment.',
                        problemsCovered: [
                            'Adding extra camera to porch, gate, or backyard',
                            'Fixing camera loose mounting or wrong angle',
                            'Replacing faulty camera lens with new HD unit'
                        ],
                        inclusions: [
                            'Waterproof IP66 PVC junction box mounting',
                            'Coaxial 3+1 or Cat6 cable termination with BNC/DC pins',
                            'Day/Night infrared vision calibration'
                        ],
                        exclusions: ['Cost of camera hardware'],
                        materialsPolicy: 'Waterproof connectors and junction boxes included.',
                        addons: []
                    },
                    {
                        id: 'cctv-dvr-nvr-live',
                        slug: 'dvr-nvr-mobile-app-configuration',
                        title: '4/8 Channel DVR/NVR Setup + Mobile App Live Remote Stream',
                        category: 'cctv',
                        subcategory: 'camera-setup',
                        startingPrice: 1199,
                        price: 1199,
                        duration: '90 mins',
                        rating: 4.9,
                        reviewsCount: 340,
                        completedJobs: '1,420+',
                        warrantyDays: 60,
                        description: 'Complete centralized setup of Hikvision / CP Plus / Dahua DVR or NVR recorders, hard disk initialization, motion alert scheduling, and live streaming to smartphones worldwide.',
                        problemsCovered: [
                            'Setting up live camera viewing on family smartphones',
                            'Hard drive not recording or showing HDD Error',
                            'Connecting DVR to WiFi router via LAN cable'
                        ],
                        inclusions: [
                            'DVR/NVR firmware configuration and password reset',
                            'Surveillance HDD formatting and continuous loop recording setup',
                            'Mobile app pairing (Hik-Connect / gCMOB / DMSS)',
                            'Motion detection alert zones configuration'
                        ],
                        exclusions: ['Cost of NVR/DVR hardware and surveillance hard disk'],
                        materialsPolicy: 'HDMI cables and patch cords provided at MRP.',
                        addons: []
                    },
                    {
                        id: 'cctv-offline-fix',
                        slug: 'cctv-offline-power-supply-repair',
                        title: 'Camera Video Loss, Power Supply & Connector Fix',
                        category: 'cctv',
                        subcategory: 'camera-setup',
                        startingPrice: 299,
                        price: 299,
                        duration: '30 mins',
                        rating: 4.8,
                        reviewsCount: 190,
                        completedJobs: '760+',
                        warrantyDays: 30,
                        description: 'Rapid troubleshooting for "No Video", black screens, rolling horizontal line interference, blown 12V SMPS power supplies, and chewed cabling.',
                        problemsCovered: [
                            'One or multiple cameras showing black screen / video loss',
                            'Night vision IR LEDs not glowing in dark',
                            'Smell of burning from centralized CCTV power supply box'
                        ],
                        inclusions: [
                            '12V DC power supply voltage drop multimeter test',
                            'BNC/DC jack re-crimping and continuity check',
                            'Video balun replacement if long-distance cable signal dropped'
                        ],
                        exclusions: ['Replacing entire underground cable line'],
                        materialsPolicy: '4-channel / 8-channel SMPS power supply units at MRP.',
                        addons: []
                    },
                    {
                        id: 'cctv-video-doorbell',
                        slug: 'video-door-phone-intercom-setup',
                        title: 'Video Door Phone (VDP) Intercom Installation',
                        category: 'cctv',
                        subcategory: 'camera-setup',
                        startingPrice: 799,
                        price: 799,
                        duration: '60 mins',
                        rating: 4.9,
                        reviewsCount: 160,
                        completedJobs: '540+',
                        warrantyDays: 30,
                        description: 'Installation of high-definition outdoor bell camera with 7-inch indoor color monitor, electronic lock integration, and 2-way audio communication.',
                        problemsCovered: [
                            'Installing secure front door video visitor verification',
                            'Electric gate lock release from inside home',
                            'Replacing old non-working doorbell'
                        ],
                        inclusions: [
                            'Outdoor camera unit weather shield mounting',
                            'Indoor TFT monitor bracket hanging and power supply wiring',
                            'Two-way crystal audio and electric strike lock handshake test'
                        ],
                        exclusions: ['Electronic door lock hardware (charged extra)'],
                        materialsPolicy: 'Shielded 4-core communication wire at store rates.',
                        addons: []
                    }
                ]
            }
        ]
    },
    {
        id: 'commercial',
        name: 'Commercial Electrical',
        shortName: 'Commercial',
        icon: 'Building2',
        tagline: 'KSELB Class-A Corporate Fitouts & Compliance Audits',
        description: '3-phase industrial switchgear, corporate IT office wiring, load enhancement & safety certifications.',
        available: true,
        subcategories: [
            {
                id: 'corporate-projects',
                name: 'Corporate & Industrial',
                description: 'Safety audits, 3-phase APFC panels, clean UPS cabling & retail fitouts.',
                services: [
                    {
                        id: 'commercial-safety-audit',
                        slug: 'corporate-electrical-safety-audit',
                        title: 'Corporate & IT Office Electrical Safety Audit (SAC 9987)',
                        category: 'commercial',
                        subcategory: 'corporate-projects',
                        startingPrice: 1999,
                        price: 1999,
                        duration: '2 hrs',
                        rating: 5.0,
                        reviewsCount: 120,
                        completedJobs: '490+',
                        warrantyDays: 90,
                        description: 'Comprehensive CEA 2010 safety regulation audit for commercial offices, clinics, and IT facilities. Includes thermal infrared busbar imaging, earth pit resistance testing, and formal sign-off report for building insurance.',
                        problemsCovered: [
                            'Annual mandatory electrical safety inspection for commercial insurance',
                            'Investigating frequent server room MCB tripping',
                            'Assessing existing electrical load capacity for office expansion'
                        ],
                        inclusions: [
                            'Thermal infrared camera scan of DB boards for loose overheating terminals',
                            'Digital earth tester pit resistance measurement (< 1 Ohm)',
                            'Harmonic distortion, power factor, and phase balance inspection',
                            'Official KSELB Class-A signed electrical inspection certificate'
                        ],
                        exclusions: ['Physical rewiring rectification labor'],
                        materialsPolicy: 'Itemized SAC 9987 GST tax invoice issued for corporate filing.',
                        addons: []
                    },
                    {
                        id: 'commercial-apfc-panel',
                        slug: 'apfc-panel-power-factor-maintenance',
                        title: '3-Phase APFC Panel & Power Factor Capacitor Overhaul',
                        category: 'commercial',
                        subcategory: 'corporate-projects',
                        startingPrice: 2499,
                        price: 2499,
                        duration: '3 hrs',
                        rating: 4.9,
                        reviewsCount: 95,
                        completedJobs: '380+',
                        warrantyDays: 60,
                        description: 'Maintenance of Automatic Power Factor Correction (APFC) panels to maintain power factor above 0.98, preventing heavy KSEB low-power-factor penalties for commercial LT-IV/LT-VII connections.',
                        problemsCovered: [
                            'KSEB electricity bill showing thousands of rupees in low PF penalties',
                            'APFC controller relay not switching capacitor banks',
                            'Bulging or ruptured power capacitors in main panel'
                        ],
                        inclusions: [
                            'Capacitance microfarad (kVAR) test for every capacitor step',
                            'Microprocessor APFC relay programming and CT coil ratio check',
                            'Heavy duty capacitor switching contactor terminal cleaning'
                        ],
                        exclusions: ['Cost of new heavy-duty kVAR capacitors'],
                        materialsPolicy: 'L&T / Epcos / Schneider industrial capacitors at wholesale rates.',
                        addons: []
                    },
                    {
                        id: 'commercial-ups-server',
                        slug: 'ups-server-rack-cabling',
                        title: 'Dedicated Clean-Power UPS Rack Cabling & Isolation DB',
                        category: 'commercial',
                        subcategory: 'corporate-projects',
                        startingPrice: 1899,
                        price: 1899,
                        duration: '2 hrs',
                        rating: 4.9,
                        reviewsCount: 110,
                        completedJobs: '430+',
                        warrantyDays: 60,
                        description: 'Dedicated 3-phase online UPS output distribution, isolated neutral grounding, server rack PDU wiring, and surge protection device (SPD) installation for IT facilities.',
                        problemsCovered: [
                            'Server rebooting during KSEB-to-Generator grid changeover',
                            'Neutral-to-earth voltage higher than 2 Volts damaging IT hardware',
                            'Workstation circuits tripping when heavy air-conditioner compressors start'
                        ],
                        inclusions: [
                            'Dedicated clean neutral busbar separation',
                            'Type-2 Surge Protection Device (SPD) integration in server DB',
                            'PDU circuit load balancing and live changeover drill'
                        ],
                        exclusions: ['UPS battery replacement'],
                        materialsPolicy: 'FRLS multi-strand cables and industrial sockets at wholesale price.',
                        addons: []
                    },
                    {
                        id: 'commercial-retail-lights',
                        slug: 'retail-lighting-led-track-maintenance',
                        title: 'Retail Showroom LED Track Light & Driver Replacement',
                        category: 'commercial',
                        subcategory: 'corporate-projects',
                        startingPrice: 899,
                        price: 899,
                        duration: '60 mins',
                        rating: 4.8,
                        reviewsCount: 140,
                        completedJobs: '610+',
                        warrantyDays: 30,
                        description: 'Fast repair and re-alignment of commercial track lights, architectural profile lights, COB spotlights, and constant-current LED drivers for retail showrooms and boutiques.',
                        problemsCovered: [
                            'Showroom display track lights flickering or completely off',
                            'LED power supply driver smoking or clicking',
                            'Re-aiming spotlight beams on seasonal clothing/jewelry displays'
                        ],
                        inclusions: [
                            'Track connector voltage test and copper strip re-tensioning',
                            'Constant-current driver replacement and heat-sink paste application',
                            'Illuminance Lux level verification'
                        ],
                        exclusions: ['Cost of replacement track light heads'],
                        materialsPolicy: 'Philips / Wipro commercial grade LED drivers at MRP.',
                        addons: []
                    }
                ]
            }
        ]
    },
    {
        id: 'amc',
        name: 'Care AMC Plans',
        shortName: 'Care AMC',
        icon: 'ShieldCheck',
        tagline: 'Annual Electrical Maintenance & Zero-Cost Breakdown Cover',
        description: 'Scheduled quarterly preventive inspections, earth pit tests & priority 45-min emergency dispatch.',
        available: true,
        subcategories: [
            {
                id: 'annual-plans',
                name: 'Annual Maintenance Contracts',
                description: 'Preventive care, zero-visit fees & priority hotline.',
                services: [
                    {
                        id: 'amc-residential-home',
                        slug: 'residential-home-care-amc',
                        title: 'Residential Home Care AMC (4 Scheduled Visits/Year)',
                        category: 'amc',
                        subcategory: 'annual-plans',
                        startingPrice: 1999,
                        price: 1999,
                        duration: 'Yearly Plan',
                        rating: 4.9,
                        reviewsCount: 380,
                        completedJobs: '1,560+',
                        warrantyDays: 365,
                        description: 'Complete peace of mind for Kerala villas and apartments. 4 scheduled preventive audit visits (every 3 months), RCCB leakage test, unlimited breakdown visits with zero callout fee, and 15% discount on all spare parts.',
                        problemsCovered: [
                            'Preventing monsoon short circuits and electrical fire risks',
                            'Eliminating paying separate visit fees for small monthly repairs',
                            'Ensuring inverter, water motor & geysers run at peak efficiency year-round'
                        ],
                        inclusions: [
                            '4 Comprehensive quarterly health audits with digital report',
                            'Full DB terminal tightening and thermal hotspot scan',
                            'Unlimited emergency breakdown visits with priority 45-min SLA',
                            '15% flat discount on all genuine ISI replacement parts'
                        ],
                        exclusions: ['Cost of major hardware spares (fans, motors)'],
                        materialsPolicy: 'All spares provided at manufacturer MRP less 15% subscriber discount.',
                        addons: []
                    },
                    {
                        id: 'amc-commercial-store',
                        slug: 'commercial-retail-care-amc',
                        title: 'Commercial & Retail Store Care AMC (6 Audits/Year)',
                        category: 'amc',
                        subcategory: 'annual-plans',
                        startingPrice: 4999,
                        price: 4999,
                        duration: 'Yearly Plan',
                        rating: 5.0,
                        reviewsCount: 150,
                        completedJobs: '540+',
                        warrantyDays: 365,
                        description: 'Tailored for retail showrooms, corporate offices, clinics, and restaurants. 6 bi-monthly audits, 3-phase load balancing, power factor monitoring, dedicated licensed supervisor, and SAC 9987 tax invoicing.',
                        problemsCovered: [
                            'Ensuring 99.9% power uptime and preventing business disruptions',
                            'Eliminating KSEB low power factor penalty charges',
                            'Full building insurance compliance sign-off'
                        ],
                        inclusions: [
                            '6 Bi-monthly comprehensive electrical inspections',
                            '3-Phase load balancing and APFC capacitor bank health check',
                            'Dedicated senior supervisor direct phone number',
                            '20% discount on industrial switchgear and lighting'
                        ],
                        exclusions: ['Underground line excavation'],
                        materialsPolicy: 'SAC 9987 GST input tax credit invoice provided.',
                        addons: []
                    },
                    {
                        id: 'amc-apartment-community',
                        slug: 'gated-community-apartment-amc',
                        title: 'Gated Community & Apartment Complex AMC (12 Audits/Year)',
                        category: 'amc',
                        subcategory: 'annual-plans',
                        startingPrice: 12499,
                        price: 12499,
                        duration: 'Yearly Plan',
                        rating: 5.0,
                        reviewsCount: 60,
                        completedJobs: '190+',
                        warrantyDays: 365,
                        description: 'Centralized maintenance for Resident Welfare Associations (RWA) and gated apartment complexes. Covers common area switchgear, Automatic Mains Failure (AMF) DG panels, booster pumps, and annual chemical earth pit testing.',
                        problemsCovered: [
                            'DG generator automatic transfer switch failure during power cut',
                            'Water pump starter burning out leaving residents without water',
                            'High earth pit resistance creating dangerous shock hazards in common areas'
                        ],
                        inclusions: [
                            '12 Monthly preventive inspections of common facilities',
                            'AMF panel & DG synchronization health check',
                            'Chemical earth pit resistance testing with certified meter (< 1 Ohm)',
                            '24/7 Dedicated RWA escalation helpline'
                        ],
                        exclusions: ['Cost of commercial DG generator replacement parts'],
                        materialsPolicy: 'Quarterly compliance certificate issued for association records.',
                        addons: []
                    }
                ]
            }
        ]
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
    if (!identifier) return null;
    const all = getAllServices();
    const clean = String(identifier).toLowerCase().trim();
    return all.find(s => s.id.toLowerCase() === clean || s.slug.toLowerCase() === clean) || null;
};
