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
 * @property {string} [floorPlan]     Path to the campus map PDF (in /public). When set, the
 *                                    map screen embeds this instead of the placeholder gallery.
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
    floorPlan: '/floorplans/Camberwell-Digital-Map2025.pdf',
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
    floorPlan: '/floorplans/Chelsea-Digital-Map2025.pdf',
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
