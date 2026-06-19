/**
 * @typedef {{ name: string, walk: string }} TransportStop
 *
 * @typedef {Object} BuildingTransport
 * @property {TransportStop[]} stations   Closest tube/rail stations
 * @property {TransportStop[]} buses      Closest bus routes
 * @property {string} accessibilityNote   Plain-text accessibility summary
 * @property {string} accessibilityUrl   Link to full accessibility info
 *
 * @typedef {Object} Building
 * @property {string} id
 * @property {string} name
 * @property {string} college
 * @property {string} address
 * @property {[number, number]} size  Relative footprint [width, depth] in scene units (~km).
 * @property {number} height          Relative building height in scene units.
 * @property {string} description
 * @property {{ lat: number, lng: number }} geo  Real-world lat/lng — used to build map-directions links.
 * @property {BuildingTransport} [transport]
 *
 * @typedef {Object} FloorPlanImage
 * @property {string} id
 * @property {string} label            Floor name, e.g. 'Ground floor'.
 * @property {string} [image]          Single plan image (in /public) — used for PDF-derived
 *                                     campus maps where one render serves every screen size.
 * @property {string} [mobile]         Portrait plan image, shown on narrow screens (CSM-style).
 * @property {string} [desktop]        Landscape plan image, shown from md up (CSM-style).
 *
 * @typedef {FloorPlanImage[]} [floorPlans]  Per-floor plan images. When set, the map screen
 *                                    shows a gallery of these (thumbnails, or a dropdown when
 *                                    there are many) instead of the placeholder.
 */

/** @type {Building[]} */
export const BUILDINGS = [
  {
    id: 'csm',
    name: 'Central Saint Martins',
    college: 'CSM',
    address: '1 Granary Square, London N1C 4AA',
    size: [1.8, 0.58],
    height: 1.0,
    description:
      'Home to art, design, fashion, performance and communication courses at King’s Cross.',
    geo: { lat: 51.5378, lng: -0.1253 },
    floorPlans: [
      {
        id: 'ground',
        label: 'Ground floor',
        mobile: '/floorplans/csm/floor-0-mobile.png',
        desktop: '/floorplans/csm/floor-0-desktop.png',
      },
      {
        id: 'first',
        label: 'First floor',
        mobile: '/floorplans/csm/floor-1-mobile.png',
        desktop: '/floorplans/csm/floor-1-desktop.png',
      },
      {
        id: 'second',
        label: 'Second floor',
        mobile: '/floorplans/csm/floor-2-mobile.png',
        desktop: '/floorplans/csm/floor-2-desktop.png',
      },
      {
        id: 'third',
        label: 'Third floor',
        mobile: '/floorplans/csm/floor-3-mobile.png',
        desktop: '/floorplans/csm/floor-3-desktop.png',
      },
    ],
    transport: {
      stations: [
        { name: 'Kings Cross', walk: '10 min walk' },
        { name: 'St Pancras', walk: '10 min walk' },
      ],
      buses: [
        { name: '10', walk: '5 min walk' },
        { name: '17', walk: '3 min walk' },
        { name: '30', walk: '5 min walk' },
        { name: '46', walk: '5 min walk' },
      ],
      accessibilityNote:
        'Full access and route guides to Central Saint Martins are available on AccessAble.',
      accessibilityUrl: 'https://www.accessable.co.uk/university-of-the-arts-london',
    },
  },
  {
    id: 'lcf',
    name: 'London College of Fashion',
    college: 'LCF',
    address: 'East Bank, Stratford, London E20',
    size: [1.0, 0.9],
    height: 1.9,
    description: 'New campus at East Bank, Queen Elizabeth Olympic Park.',
    geo: { lat: 51.5454, lng: -0.0102 },
    floorPlans: [
      { id: 'lcf-east-bank-00', label: 'Overview', image: '/floorplans/lcf-east-bank/00.png' },
      { id: 'lcf-east-bank-01', label: 'Mezzanine', image: '/floorplans/lcf-east-bank/01.png' },
      { id: 'lcf-east-bank-02', label: 'Ground', image: '/floorplans/lcf-east-bank/02.png' },
      { id: 'lcf-east-bank-03', label: '1st floor', image: '/floorplans/lcf-east-bank/03.png' },
      { id: 'lcf-east-bank-04', label: '2nd floor', image: '/floorplans/lcf-east-bank/04.png' },
      { id: 'lcf-east-bank-05', label: '4th floor', image: '/floorplans/lcf-east-bank/05.png' },
      { id: 'lcf-east-bank-06', label: '5th floor', image: '/floorplans/lcf-east-bank/06.png' },
      { id: 'lcf-east-bank-07', label: '6th floor', image: '/floorplans/lcf-east-bank/07.png' },
      { id: 'lcf-east-bank-08', label: '7th floor', image: '/floorplans/lcf-east-bank/08.png' },
      { id: 'lcf-east-bank-09', label: '8th floor', image: '/floorplans/lcf-east-bank/09.png' },
      { id: 'lcf-east-bank-10', label: '9th floor', image: '/floorplans/lcf-east-bank/10.png' },
      { id: 'lcf-east-bank-11', label: '10th floor', image: '/floorplans/lcf-east-bank/11.png' },
      { id: 'lcf-east-bank-12', label: '11th floor', image: '/floorplans/lcf-east-bank/12.png' },
      { id: 'lcf-east-bank-13', label: '12th floor', image: '/floorplans/lcf-east-bank/13.png' },
      { id: 'lcf-east-bank-14', label: '13th floor', image: '/floorplans/lcf-east-bank/14.png' },
    ],
    transport: {
      stations: [
        { name: 'Stratford', walk: '5 min walk' },
        { name: 'Stratford International', walk: '8 min walk' },
      ],
      buses: [
        { name: '25', walk: '5 min walk' },
        { name: '97', walk: '5 min walk' },
      ],
      accessibilityNote:
        'Full access and route guides to London College of Fashion are available on AccessAble.',
      accessibilityUrl: 'https://www.accessable.co.uk/university-of-the-arts-london',
    },
  },
  {
    id: 'lcc',
    name: 'London College of Communication',
    college: 'LCC',
    address: 'Elephant & Castle, London SE1 6SB',
    size: [1.1, 1.0],
    height: 1.5,
    description: 'Design, media and screen courses at Elephant & Castle.',
    geo: { lat: 51.4958, lng: -0.1001 },
    transport: {
      stations: [
        { name: 'Elephant & Castle', walk: '5 min walk' },
        { name: 'Borough', walk: '15 min walk' },
      ],
      buses: [
        { name: '1', walk: '3 min walk' },
        { name: '12', walk: '3 min walk' },
        { name: '45', walk: '5 min walk' },
      ],
      accessibilityNote:
        'Full access and route guides to London College of Communication are available on AccessAble.',
      accessibilityUrl: 'https://www.accessable.co.uk/university-of-the-arts-london',
    },
  },
  {
    id: 'camberwell',
    name: 'Camberwell College of Arts',
    college: 'Camberwell',
    address: 'Peckham Road, London SE5 8UF',
    size: [1.5, 0.65],
    height: 0.95,
    description: 'Fine art, illustration, conservation and 3D design.',
    geo: { lat: 51.4738, lng: -0.0894 },
    floorPlans: [
      { id: 'camberwell-00', label: 'Overview', image: '/floorplans/camberwell/00.png' },
      { id: 'camberwell-01', label: 'Ground', image: '/floorplans/camberwell/01.png' },
      { id: 'camberwell-02', label: 'Level 1', image: '/floorplans/camberwell/02.png' },
      { id: 'camberwell-03', label: 'Level 2', image: '/floorplans/camberwell/03.png' },
      { id: 'camberwell-04', label: 'Level 3', image: '/floorplans/camberwell/04.png' },
      { id: 'camberwell-05', label: 'Level 4', image: '/floorplans/camberwell/05.png' },
      { id: 'camberwell-06', label: 'Level 5', image: '/floorplans/camberwell/06.png' },
      { id: 'camberwell-07', label: 'Basement', image: '/floorplans/camberwell/07.png' },
      { id: 'camberwell-08', label: 'Courses & staff', image: '/floorplans/camberwell/08.png' },
      { id: 'camberwell-09', label: 'Ground', image: '/floorplans/camberwell/09.png' },
      { id: 'camberwell-10', label: 'Level 1', image: '/floorplans/camberwell/10.png' },
      { id: 'camberwell-11', label: 'Level 2', image: '/floorplans/camberwell/11.png' },
      { id: 'camberwell-12', label: 'Ground', image: '/floorplans/camberwell/12.png' },
      { id: 'camberwell-13', label: 'Level 1', image: '/floorplans/camberwell/13.png' },
      { id: 'camberwell-14', label: 'Level 2', image: '/floorplans/camberwell/14.png' },
      { id: 'camberwell-15', label: 'Level 3', image: '/floorplans/camberwell/15.png' },
      { id: 'camberwell-16', label: 'Basement', image: '/floorplans/camberwell/16.png' },
      { id: 'camberwell-17', label: 'Courses & staff', image: '/floorplans/camberwell/17.png' },
      { id: 'camberwell-18', label: 'Ground', image: '/floorplans/camberwell/18.png' },
      { id: 'camberwell-19', label: 'Level 1', image: '/floorplans/camberwell/19.png' },
      { id: 'camberwell-20', label: 'Level 1', image: '/floorplans/camberwell/20.png' },
      { id: 'camberwell-21', label: 'Courses & staff', image: '/floorplans/camberwell/21.png' },
    ],
    transport: {
      stations: [
        { name: 'Denmark Hill', walk: '15 min walk' },
        { name: 'Loughborough Junction', walk: '15 min walk' },
      ],
      buses: [
        { name: '12', walk: '1 min walk' },
        { name: '36', walk: '1 min walk' },
        { name: '171', walk: '1 min walk' },
      ],
      accessibilityNote:
        'Full access and route guides to Camberwell College of Arts are available on AccessAble.',
      accessibilityUrl: 'https://www.accessable.co.uk/university-of-the-arts-london',
    },
  },
  {
    id: 'chelsea',
    name: 'Chelsea College of Arts',
    college: 'Chelsea',
    address: '16 John Islip St, London SW1P 4JU',
    size: [1.5, 0.58],
    height: 0.8,
    description: 'Fine art, graphic design, interior and spatial design.',
    geo: { lat: 51.4906, lng: -0.1282 },
    floorPlans: [
      { id: 'chelsea-00', label: 'Overview', image: '/floorplans/chelsea/00.png' },
      { id: 'chelsea-01', label: 'A&B Block – Lower ground', image: '/floorplans/chelsea/01.png' },
      { id: 'chelsea-02', label: 'A&B Block – Ground', image: '/floorplans/chelsea/02.png' },
      { id: 'chelsea-03', label: 'A&B Block – Level 1', image: '/floorplans/chelsea/03.png' },
      { id: 'chelsea-04', label: 'A&B Block – Level 2', image: '/floorplans/chelsea/04.png' },
      { id: 'chelsea-05', label: 'A&B Block – Level 3', image: '/floorplans/chelsea/05.png' },
      { id: 'chelsea-06', label: 'B Block – Courses & staff', image: '/floorplans/chelsea/06.png' },
      { id: 'chelsea-07', label: 'B Block – Courses & staff', image: '/floorplans/chelsea/07.png' },
      { id: 'chelsea-08', label: 'C Block – Lower ground', image: '/floorplans/chelsea/08.png' },
      { id: 'chelsea-09', label: 'C Block – Ground', image: '/floorplans/chelsea/09.png' },
      { id: 'chelsea-10', label: 'C Block – Level 1', image: '/floorplans/chelsea/10.png' },
      { id: 'chelsea-11', label: 'C Block – Level 2', image: '/floorplans/chelsea/11.png' },
      { id: 'chelsea-12', label: 'C Block – Level 3', image: '/floorplans/chelsea/12.png' },
      { id: 'chelsea-13', label: 'C Block – Courses & staff', image: '/floorplans/chelsea/13.png' },
      { id: 'chelsea-14', label: 'D Block – Ground', image: '/floorplans/chelsea/14.png' },
      { id: 'chelsea-15', label: 'D Block – Level 1', image: '/floorplans/chelsea/15.png' },
      { id: 'chelsea-16', label: 'D Block – Level 2', image: '/floorplans/chelsea/16.png' },
      { id: 'chelsea-17', label: 'D Block – Level 3', image: '/floorplans/chelsea/17.png' },
      { id: 'chelsea-18', label: 'D Block – Courses & staff', image: '/floorplans/chelsea/18.png' },
    ],
    transport: {
      stations: [
        { name: 'Pimlico', walk: '10 min walk' },
        { name: 'Victoria', walk: '15 min walk' },
      ],
      buses: [
        { name: '2', walk: '5 min walk' },
        { name: '36', walk: '5 min walk' },
        { name: '185', walk: '5 min walk' },
      ],
      accessibilityNote:
        'Full access and route guides to Chelsea College of Arts are available on AccessAble.',
      accessibilityUrl: 'https://www.accessable.co.uk/university-of-the-arts-london',
    },
  },
  {
    id: 'wimbledon',
    name: 'Wimbledon College of Arts',
    college: 'Wimbledon',
    address: 'Merton Hall Road, London SW19 3QA',
    size: [1.6, 0.8],
    height: 0.72,
    description: 'Performance design, theatre and fine art.',
    geo: { lat: 51.4173, lng: -0.2075 },
    floorPlans: [
      { id: 'wimbledon-00', label: 'Overview', image: '/floorplans/wimbledon/00.png' },
      { id: 'wimbledon-01', label: 'A Block – D&A', image: '/floorplans/wimbledon/01.png' },
      {
        id: 'wimbledon-02',
        label: 'A Block – Courses & staff',
        image: '/floorplans/wimbledon/02.png',
      },
      { id: 'wimbledon-03', label: 'B Block – B&C', image: '/floorplans/wimbledon/03.png' },
      { id: 'wimbledon-04', label: 'B Block – B&C', image: '/floorplans/wimbledon/04.png' },
      { id: 'wimbledon-05', label: 'B Block – Basement', image: '/floorplans/wimbledon/05.png' },
      {
        id: 'wimbledon-06',
        label: 'B Block – Courses & staff',
        image: '/floorplans/wimbledon/06.png',
      },
      { id: 'wimbledon-07', label: 'E&F', image: '/floorplans/wimbledon/07.png' },
      { id: 'wimbledon-08', label: 'Courses & staff', image: '/floorplans/wimbledon/08.png' },
    ],
    transport: {
      stations: [
        { name: 'Wimbledon', walk: '15 min walk' },
        { name: 'Wimbledon Chase', walk: '5 min walk' },
      ],
      buses: [
        { name: '163', walk: '3 min walk' },
        { name: '200', walk: '5 min walk' },
      ],
      accessibilityNote:
        'Full access and route guides to Wimbledon College of Arts are available on AccessAble.',
      accessibilityUrl: 'https://www.accessable.co.uk/university-of-the-arts-london',
    },
  },
];
