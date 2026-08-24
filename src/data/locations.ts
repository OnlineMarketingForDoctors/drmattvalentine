/**
 * Clinic lists, transcribed from drmattvalentine.com.au/vasectomy.
 *
 * Two doctors appear here on purpose. A referring GP's first question is
 * "where is the nearest one", and the honest answer spans the whole
 * Vasectomy Australia network — but they also need to know whether their
 * patient will be seen by Dr Valentine himself or by Dr Cashion.
 *
 * Dr Valentine flies three states from a Brisbane base. The order below is
 * the order he covers them, not alphabetical.
 */

export interface Clinic {
  area: string;
  clinic: string;
  /** His home base — he practises here between trips. */
  base?: boolean;
}

export interface StateGroup {
  code: string;
  name: string;
  clinics: Clinic[];
}

/** Dr Valentine — 19 clinics, three states. */
export const valentineStates: StateGroup[] = [
  {
    code: 'QLD',
    name: 'Queensland',
    clinics: [
      { area: 'Brisbane', clinic: 'Vasectomy Clinic Brisbane', base: true },
      { area: 'Gold Coast', clinic: 'Robina Medical and Dental Centre' },
      { area: 'Sunshine Coast', clinic: 'Ochre Medical Centre Sippy Downs' },
      { area: 'Springfield', clinic: 'Springfield Doctors' },
      { area: 'Toowoomba', clinic: 'Ochre Medical Centre Wyalla' },
      { area: 'Hervey Bay', clinic: 'Eli Waters Medical Centre' },
      { area: 'Gladstone', clinic: 'Vitality Solutions' },
      { area: 'Rockhampton', clinic: 'CQ Doctors, 24 Upper Dawson Rd' },
      { area: 'Townsville', clinic: 'SmartClinics Annandale Medical Centre' },
    ],
  },
  {
    code: 'VIC',
    name: 'Victoria',
    clinics: [
      { area: 'Melbourne CBD', clinic: 'Melbourne Vasectomy Centre' },
      { area: 'Casey / Mornington Peninsula', clinic: 'Melbourne Vasectomy Centre' },
      { area: 'Geelong', clinic: 'Vasectomy Australia Geelong' },
      { area: 'Ballarat', clinic: 'Carn Brae Clinic' },
      { area: 'Bendigo', clinic: 'Emu Creek Health Professionals' },
    ],
  },
  {
    code: 'WA',
    name: 'Western Australia',
    clinics: [
      { area: 'Perth — Kiara', clinic: 'Perth Vasectomy Centre' },
      { area: 'Perth — Hillarys / North', clinic: 'Hillarys Plaza Medical Centre' },
      { area: 'Perth — Nedlands', clinic: 'Hollywood GP' },
      { area: 'Perth — Rockingham', clinic: 'Rockingham Medical & Dental Centre' },
      { area: 'Perth — Thornlie', clinic: 'Westcare Medical Centre' },
    ],
  },
];

/** Dr Geoff Cashion — the rest of the network, for patients outside the three. */
export const cashionStates: StateGroup[] = [
  {
    code: 'NSW',
    name: 'Sydney',
    clinics: [
      { area: 'Inner West / CBD', clinic: 'Enmore Medical Practice' },
      { area: 'Eastern Suburbs', clinic: 'Maroubra Medical and Dental Centre' },
      { area: 'North Shore', clinic: 'Chatswood Medical & Dental Centre' },
      { area: 'Northern Beaches', clinic: 'Warringah Medical & Dental Centre, Brookvale' },
      { area: 'The Hills District', clinic: 'The Hills Medical and Dental Centre, Baulkham Hills' },
      { area: 'Blacktown', clinic: 'Pacific Medical Centre Blacktown' },
      { area: 'Penrith / Blue Mountains', clinic: 'Penrith Medical Centre' },
      { area: 'Sutherland Shire', clinic: 'Kingsway Specialist Medical Centre, Miranda' },
      { area: 'Macarthur', clinic: 'Campbelltown Medical and Dental Centre' },
    ],
  },
  {
    code: 'NSW',
    name: 'Regional New South Wales',
    clinics: [
      { area: 'Central Coast', clinic: 'Wyoming Medical and Dental Centre' },
      { area: 'Newcastle / Hunter Valley', clinic: 'Cooks Hill Health Hub, 235 Darby St' },
      { area: 'Wollongong / Illawarra', clinic: 'Dapto Medical Centre' },
      { area: 'Orange', clinic: 'Orange Family Medical Centre' },
      { area: 'Dubbo / Western Plains', clinic: 'Western Plains Medical Centre' },
      { area: 'Port Macquarie / Mid North Coast', clinic: 'Port Macquarie Medical and Dental Centre' },
      { area: 'Tamworth / New England', clinic: 'Regional Medical Specialists Tamworth' },
      { area: 'Albury', clinic: 'Elmwood Medical Centre' },
      { area: 'Wagga Wagga', clinic: 'Wagga Wagga Medical Centre' },
    ],
  },
  {
    code: 'VIC',
    name: 'Victoria',
    clinics: [
      { area: 'Melbourne North', clinic: 'Gladstone Park Superclinic' },
      { area: 'Wodonga', clinic: 'Elmwood Medical Centre' },
    ],
  },
  {
    code: 'SA',
    name: 'South Australia',
    clinics: [{ area: 'Adelaide', clinic: 'Trinity Gardens Medical Centre' }],
  },
  {
    code: 'TAS',
    name: 'Tasmania',
    clinics: [
      { area: 'Hobart', clinic: 'Clarence GP Super Clinic' },
      { area: 'Launceston', clinic: 'Family Planning Tasmania' },
    ],
  },
];

export const valentineCount = valentineStates.reduce((n, s) => n + s.clinics.length, 0);
export const cashionCount = cashionStates.reduce((n, s) => n + s.clinics.length, 0);
