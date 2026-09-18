import { PincodeArea } from '../types';

export interface ServiceAreaLocation {
  slug: string;
  name: string;
  pincode: string;
  district: string;
  landmarks: string[];
  description: string;
}

export const SERVICEABLE_AREAS: PincodeArea[] = [
  {
    pincode: '673001',
    areaName: 'Kozhikode Town & Mananchira',
    taluk: 'Kozhikode',
    district: 'Kozhikode',
    state: 'Kerala',
    serviceable: true,
    estimatedLeadTimeHours: 2
  },
  {
    pincode: '673002',
    areaName: 'Chalappuram & Francis Road',
    taluk: 'Kozhikode',
    district: 'Kozhikode',
    state: 'Kerala',
    serviceable: true,
    estimatedLeadTimeHours: 2
  },
  {
    pincode: '673004',
    areaName: 'Mavoor Road & Arayidathupalam',
    taluk: 'Kozhikode',
    district: 'Kozhikode',
    state: 'Kerala',
    serviceable: true,
    estimatedLeadTimeHours: 2
  },
  {
    pincode: '673006',
    areaName: 'Nadakkavu & Vandipetta',
    taluk: 'Kozhikode',
    district: 'Kozhikode',
    state: 'Kerala',
    serviceable: true,
    estimatedLeadTimeHours: 2
  },
  {
    pincode: '673011',
    areaName: 'West Hill & Chungam',
    taluk: 'Kozhikode',
    district: 'Kozhikode',
    state: 'Kerala',
    serviceable: true,
    estimatedLeadTimeHours: 2
  },
  {
    pincode: '673017',
    areaName: 'Chevayur & Kovoor',
    taluk: 'Kozhikode',
    district: 'Kozhikode',
    state: 'Kerala',
    serviceable: true,
    estimatedLeadTimeHours: 3
  },
  {
    pincode: '673020',
    areaName: 'Civil Station & Eranhipalam',
    taluk: 'Kozhikode',
    district: 'Kozhikode',
    state: 'Kerala',
    serviceable: true,
    estimatedLeadTimeHours: 2
  },
  {
    pincode: '673032',
    areaName: 'Calicut Beach & Vellayil',
    taluk: 'Kozhikode',
    district: 'Kozhikode',
    state: 'Kerala',
    serviceable: true,
    estimatedLeadTimeHours: 2
  },
  {
    pincode: '673008',
    areaName: 'Medical College & Pottammal',
    taluk: 'Kozhikode',
    district: 'Kozhikode',
    state: 'Kerala',
    serviceable: true,
    estimatedLeadTimeHours: 3
  },
  {
    pincode: '673631',
    areaName: 'Feroke & Cheruvannur',
    taluk: 'Kozhikode',
    district: 'Kozhikode',
    state: 'Kerala',
    serviceable: true,
    estimatedLeadTimeHours: 3
  },
  {
    pincode: '673019',
    areaName: 'Pantheeramkavu & Palazhi',
    taluk: 'Kozhikode',
    district: 'Kozhikode',
    state: 'Kerala',
    serviceable: true,
    estimatedLeadTimeHours: 3
  },
  {
    pincode: '673101',
    areaName: 'Vadakara Town',
    taluk: 'Vadakara',
    district: 'Kozhikode',
    state: 'Kerala',
    serviceable: true,
    estimatedLeadTimeHours: 4
  },
  {
    pincode: '673305',
    areaName: 'Koyilandy Town',
    taluk: 'Koyilandy',
    district: 'Kozhikode',
    state: 'Kerala',
    serviceable: true,
    estimatedLeadTimeHours: 4
  }
];

export const KOZHIKODE_SERVICE_AREAS = SERVICEABLE_AREAS;

export const TOP_LOCAL_AREAS: ServiceAreaLocation[] = [
  {
    slug: 'mavoor-road',
    name: 'Mavoor Road',
    pincode: '673004',
    district: 'Kozhikode',
    landmarks: ['Arayidathupalam', 'Focus Mall', 'KSRTC Bus Terminal', 'MIMS Hospital'],
    description: 'Serving residential flats, retail shops, and commercial offices across Mavoor Road and Arayidathupalam.'
  },
  {
    slug: 'nadakkavu',
    name: 'Nadakkavu',
    pincode: '673006',
    district: 'Kozhikode',
    landmarks: ['Vandipetta', 'CH Flyover', 'Bilathikulam', 'Christian College Junction'],
    description: 'Fast electrical doorstep fixes for apartments, villas, and boutique stores throughout Nadakkavu and Bilathikulam.'
  },
  {
    slug: 'calicut-beach',
    name: 'Calicut Beach',
    pincode: '673032',
    district: 'Kozhikode',
    landmarks: ['Beach Hospital', 'South Beach', 'Vellayil Harbor', 'Gandhi Park'],
    description: 'Specialized corrosion-resistant electrical repair and wiring solutions for coastal homes near Calicut Beach.'
  },
  {
    slug: 'civil-station',
    name: 'Civil Station',
    pincode: '673020',
    district: 'Kozhikode',
    landmarks: ['Eranhipalam Junction', 'Collectorate', 'Wayanad Road', 'Malaparamba'],
    description: 'Trusted electrical maintenance and switchboard wiring for government quarters and residential colonies around Civil Station.'
  },
  {
    slug: 'medical-college',
    name: 'Medical College Area',
    pincode: '673008',
    district: 'Kozhikode',
    landmarks: ['Calicut Medical College', 'Pottammal', 'Karanthur', 'Kovoor'],
    description: 'Professional electricians serving doctors quarters, hospitals, clinics, and residential layouts near Medical College.'
  },
  {
    slug: 'vadakara',
    name: 'Vadakara',
    pincode: '673101',
    district: 'Kozhikode',
    landmarks: ['Old Bus Stand', 'Nut Street', 'Chorode', 'Madappally'],
    description: 'Reliable doorstep electrical maintenance and emergency triage for homes and businesses across Vadakara taluk.'
  }
];

export function checkPincodeServiceability(pincode: string): {
  available: boolean;
  area?: PincodeArea;
  message: string;
} {
  const clean = pincode.trim().replace(/\D/g, '');
  if (clean.length !== 6) {
    return {
      available: false,
      message: 'Please enter a valid 6-digit Indian PIN code.'
    };
  }

  const match = SERVICEABLE_AREAS.find(a => a.pincode === clean && a.serviceable);
  if (match) {
    return {
      available: true,
      area: match,
      message: `Service is active in ${match.areaName} (${match.pincode}, ${match.district}).`
    };
  }

  return {
    available: false,
    message: `We currently do not have verified technician slots active for PIN code ${clean}. We are expanding across Malabar soon.`
  };
}

export function getAreaBySlug(slug: string): ServiceAreaLocation | undefined {
  return TOP_LOCAL_AREAS.find(a => a.slug === slug);
}
