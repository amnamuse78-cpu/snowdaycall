/** Canonical location data. Coordinates are city/district centers used for NWS lookups. */

export interface District {
  slug: string;
  name: string;
  shortName: string;
  stateCode: string;
  stateSlug: string;
  citySlug: string;
  lat: number;
  lon: number;
  officialUrl: string;
  announceNote: string;
  students: string;
  indexed: boolean;
}

export const districts: District[] = [
  {
    slug: 'boston-public-schools',
    name: 'Boston Public Schools',
    shortName: 'Boston Public Schools',
    stateCode: 'MA',
    stateSlug: 'massachusetts',
    citySlug: 'boston-ma',
    lat: 42.3601,
    lon: -71.0589,
    officialUrl: 'https://www.bostonpublicschools.org',
    announceNote:
      'Boston Public Schools posts closure decisions on bostonpublicschools.org and notifies families through its alert system, typically in the early morning before school.',
    students: '≈ 46,000',
    indexed: true,
  },
  {
    slug: 'buffalo-public-schools',
    name: 'Buffalo Public Schools',
    shortName: 'Buffalo Public Schools',
    stateCode: 'NY',
    stateSlug: 'new-york',
    citySlug: 'buffalo-ny',
    lat: 42.8864,
    lon: -78.8784,
    officialUrl: 'https://www.buffaloschools.org',
    announceNote:
      'Buffalo Public Schools announces closures on buffaloschools.org and through local media, typically in the early morning. Lake-effect snow can trigger evening decisions.',
    students: '≈ 30,000',
    indexed: true,
  },
  {
    slug: 'cleveland-metropolitan-school-district',
    name: 'Cleveland Metropolitan School District',
    shortName: 'Cleveland Metro Schools',
    stateCode: 'OH',
    stateSlug: 'ohio',
    citySlug: 'cleveland-oh',
    lat: 41.4993,
    lon: -81.6944,
    officialUrl: 'https://www.clevelandmetroschools.org',
    announceNote:
      'Cleveland Metropolitan School District posts weather decisions on clevelandmetroschools.org and notifies families directly, typically in the early morning hours.',
    students: '≈ 36,000',
    indexed: true,
  },
];

export interface City {
  slug: string;
  name: string;
  state: string;
  stateCode: string;
  stateSlug: string;
  lat: number;
  lon: number;
  blurb: string;
  districts: { name: string; slug: string; stateSlug: string; note: string }[];
  faq: { q: string; a: string }[];
}

export const cities: City[] = [
  {
    slug: 'boston-ma',
    name: 'Boston',
    state: 'Massachusetts',
    stateCode: 'MA',
    stateSlug: 'massachusetts',
    lat: 42.3601,
    lon: -71.0589,
    blurb:
      "Boston averages over 40 inches of snow a winter, and nor'easters can shut the region down with little warning. Boston Public Schools weighs snowfall timing against the morning commute on some of the country's oldest, narrowest streets.",
    districts: [
      { name: 'Boston Public Schools', slug: 'boston-public-schools', stateSlug: 'massachusetts', note: 'The city’s main district — ≈46,000 students.' },
      { name: 'Cambridge Public Schools', slug: '', stateSlug: 'massachusetts', note: 'Just across the river; often decides independently.' },
      { name: 'Newton Public Schools', slug: '', stateSlug: 'massachusetts', note: 'Suburban district west of Boston.' },
    ],
    faq: [
      { q: 'Will Boston schools close tomorrow?', a: 'Check the live prediction above — it updates as National Weather Service forecasts change. Boston Public Schools usually announces early in the morning.' },
      { q: 'How much snow does it take to close Boston schools?', a: 'There is no fixed number. Timing matters as much as totals — 4 inches overnight hits harder than 6 inches during the day. Districts also weigh ice, wind and temperature.' },
    ],
  },
  {
    slug: 'buffalo-ny',
    name: 'Buffalo',
    state: 'New York',
    stateCode: 'NY',
    stateSlug: 'new-york',
    lat: 42.8864,
    lon: -78.8784,
    blurb:
      'Buffalo is famous for lake-effect snow — narrow bands off Lake Erie can drop feet of snow on one neighborhood while another stays clear. That makes Buffalo one of the hardest school-closure calls in the country.',
    districts: [
      { name: 'Buffalo Public Schools', slug: 'buffalo-public-schools', stateSlug: 'new-york', note: 'The city district — ≈30,000 students.' },
      { name: 'Williamsville Central School District', slug: '', stateSlug: 'new-york', note: 'Northeastern suburbs; lake-effect bands hit unevenly.' },
      { name: 'Orchard Park Central School District', slug: '', stateSlug: 'new-york', note: 'Southtowns — often the snowiest part of the metro.' },
    ],
    faq: [
      { q: 'Why does Buffalo close schools when nearby towns stay open?', a: 'Lake-effect bands are extremely local. A band stalled over South Buffalo can bury city schools while suburbs 10 miles away see flurries — districts decide street by street, not region by region.' },
      { q: 'When does Buffalo announce school closings?', a: 'Typically early morning, but major lake-effect events sometimes trigger evening announcements. Watch the NWS alerts — a Winter Storm Warning usually means a decision is coming.' },
    ],
  },
  {
    slug: 'chicago-il',
    name: 'Chicago',
    state: 'Illinois',
    stateCode: 'IL',
    stateSlug: 'illinois',
    lat: 41.8781,
    lon: -87.6298,
    blurb:
      'Chicago Public Schools is one of the largest districts in the country, and it rarely closes — the city’s snow infrastructure is built for it. When Chicago does close, the storm is serious.',
    districts: [
      { name: 'Chicago Public Schools', slug: '', stateSlug: 'illinois', note: '≈320,000 students; closures are rare and newsworthy.' },
      { name: 'Evanston/Skokie District 65', slug: '', stateSlug: 'illinois', note: 'North Shore suburbs.' },
    ],
    faq: [
      { q: 'Does Chicago close schools for snow often?', a: 'Rarely. Chicago’s plowing capacity and the urban heat island mean it takes a major storm — or extreme cold — to close Chicago Public Schools.' },
      { q: 'What about extreme cold in Chicago?', a: 'Wind chill is Chicago’s real closure trigger. Sub-zero wind chills have closed schools with barely any snow on the ground.' },
    ],
  },
  {
    slug: 'detroit-mi',
    name: 'Detroit',
    state: 'Michigan',
    stateCode: 'MI',
    stateSlug: 'michigan',
    lat: 42.3314,
    lon: -83.0458,
    blurb:
      'Metro Detroit sits in the snow belt’s southern edge — lake-effect from Lake Michigan, system snow from the west, and ice storms from the south all take turns. Districts here close more readily than Chicago’s.',
    districts: [
      { name: 'Detroit Public Schools Community District', slug: '', stateSlug: 'michigan', note: 'The city district.' },
      { name: 'Dearborn Public Schools', slug: '', stateSlug: 'michigan', note: 'Large suburban district.' },
    ],
    faq: [
      { q: 'Will Detroit schools close tomorrow?', a: 'See the live prediction above. Detroit-area districts tend to decide early morning, and ice is a frequent trigger even with modest snowfall.' },
    ],
  },
  {
    slug: 'cleveland-oh',
    name: 'Cleveland',
    state: 'Ohio',
    stateCode: 'OH',
    stateSlug: 'ohio',
    lat: 41.4993,
    lon: -81.6944,
    blurb:
      'Cleveland gets hit from both sides: lake-effect snow off Lake Erie and system storms from the west. The east side routinely out-snows the west side, which is why neighboring districts often make different calls.',
    districts: [
      { name: 'Cleveland Metropolitan School District', slug: 'cleveland-metropolitan-school-district', stateSlug: 'ohio', note: 'The city district — ≈36,000 students.' },
      { name: 'Parma City School District', slug: '', stateSlug: 'ohio', note: 'Large suburban district southwest of the city.' },
      { name: 'Mentor Public Schools', slug: '', stateSlug: 'ohio', note: 'East side — prime lake-effect territory.' },
    ],
    faq: [
      { q: 'Why do Cleveland suburbs close when the city stays open?', a: 'Lake-effect snow is hyper-local. Mentor on the east side can get a foot while downtown Cleveland gets two inches — each district calls it based on its own streets.' },
    ],
  },
  {
    slug: 'minneapolis-mn',
    name: 'Minneapolis',
    state: 'Minnesota',
    stateCode: 'MN',
    stateSlug: 'minnesota',
    lat: 44.9778,
    lon: -93.265,
    blurb:
      'Minneapolis is built for winter — but extreme cold is the real story here. Wind chills of -30°F close schools with clear skies, and blizzards can still overwhelm even Minnesota-grade plowing.',
    districts: [
      { name: 'Minneapolis Public Schools', slug: '', stateSlug: 'minnesota', note: 'The city district.' },
      { name: 'Saint Paul Public Schools', slug: '', stateSlug: 'minnesota', note: 'Twin city district; often decides in tandem.' },
    ],
    faq: [
      { q: 'Does Minneapolis close schools for cold?', a: 'Yes — extreme wind chill is one of the most common closure reasons. Minnesota districts publish specific wind-chill thresholds.' },
    ],
  },
];

export interface StateHub {
  slug: string;
  name: string;
  code: string;
  blurb: string;
  cities: string[];
}

export const states: StateHub[] = [
  {
    slug: 'new-york',
    name: 'New York',
    code: 'NY',
    blurb:
      'From Buffalo’s lake-effect to New York City’s nor’easters, New York packs several different winter climates into one state — and districts in each react differently.',
    cities: ['buffalo-ny'],
  },
  {
    slug: 'michigan',
    name: 'Michigan',
    code: 'MI',
    blurb:
      'Lake-effect snow on both peninsulas plus system storms make Michigan one of the most closure-prone states in the country.',
    cities: ['detroit-mi'],
  },
  {
    slug: 'ohio',
    name: 'Ohio',
    code: 'OH',
    blurb:
      'Ohio winters swing between lake-effect snow in the north and ice storms in the south — districts here make some of the toughest calls in the Midwest.',
    cities: ['cleveland-oh'],
  },
  {
    slug: 'massachusetts',
    name: 'Massachusetts',
    code: 'MA',
    blurb:
      'Nor’easters define Massachusetts winters. Boston-area districts weigh storm timing against the morning commute on dense, narrow streets.',
    cities: ['boston-ma'],
  },
];
