/**
 * @typedef {Object} Building
 * @property {string} id
 * @property {string} name
 * @property {string} college
 * @property {string} address
 * @property {[number, number]} size  Relative footprint [width, depth] in scene units (~km).
 * @property {number} height          Relative building height in scene units.
 * @property {string} description
 * @property {{ lat: number, lng: number }} geo  Real-world lat/lng — drives scene position via geoToScene.
 */

/**
 * The six UAL colleges. Scene positions are derived from `geo` at render
 * time via `geoToScene` so the 3D layout matches the stylised London map.
 *
 * @type {Building[]}
 */
export const BUILDINGS = [
  {
    id: 'csm',
    name: 'Central Saint Martins',
    college: 'CSM',
    address: '1 Granary Square, London N1C 4AA',
    size: [1.2, 0.9],
    height: 1.6,
    description:
      'Home to art, design, fashion, performance and communication courses at King’s Cross.',
    geo: { lat: 51.5378, lng: -0.1253 },
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
  },
  {
    id: 'lcc',
    name: 'London College of Communication',
    college: 'LCC',
    address: 'Elephant & Castle, London SE1 6SB',
    size: [1.1, 0.9],
    height: 1.4,
    description: 'Design, media and screen courses at Elephant & Castle.',
    geo: { lat: 51.4958, lng: -0.1001 },
  },
  {
    id: 'camberwell',
    name: 'Camberwell College of Arts',
    college: 'Camberwell',
    address: 'Peckham Road, London SE5 8UF',
    size: [0.9, 0.7],
    height: 1.1,
    description: 'Fine art, illustration, conservation and 3D design.',
    geo: { lat: 51.4738, lng: -0.0894 },
  },
  {
    id: 'chelsea',
    name: 'Chelsea College of Arts',
    college: 'Chelsea',
    address: '16 John Islip St, London SW1P 4JU',
    size: [0.9, 0.7],
    height: 1.2,
    description: 'Fine art, graphic design, interior and spatial design.',
    geo: { lat: 51.4906, lng: -0.1282 },
  },
  {
    id: 'wimbledon',
    name: 'Wimbledon College of Arts',
    college: 'Wimbledon',
    address: 'Merton Hall Road, London SW19 3QA',
    size: [0.9, 0.7],
    height: 1.0,
    description: 'Performance design, theatre and fine art.',
    geo: { lat: 51.4173, lng: -0.2075 },
  },
];
