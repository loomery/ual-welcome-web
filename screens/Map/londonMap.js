import { CanvasTexture, SRGBColorSpace } from 'three';

/**
 * Central London projection + stylised map texture.
 *
 * The 3D map represents ~30 km of central London. 1 scene unit = 1 km.
 * Everything (Thames polyline, park patches, building positions) is
 * derived from real (lng, lat) via `geoToScene`, so the layout matches
 * the real geography and the texture aligns with the building meshes.
 */

// Centred near Waterloo so all six UAL colleges fit within the frame.
const CENTRE = { lng: -0.095, lat: 51.495 };
const KM_PER_DEG_LNG = 70; // approx at lat 51.5
const KM_PER_DEG_LAT = 111;

/** Half-extent of the textured map (scene units = km). 30km × 30km map. */
export const MAP_HALF = 15;
export const MAP_SIZE = MAP_HALF * 2;

/** Base tone of the map — scene background + fog use this too for seamless edges. */
export const MAP_BASE_COLOR = '#efefec';

/**
 * Project (lng, lat) into (x, z) scene coordinates. +x east, -z north.
 *
 * @param {number} lng
 * @param {number} lat
 * @returns {[number, number]}
 */
export function geoToScene(lng, lat) {
  const x = (lng - CENTRE.lng) * KM_PER_DEG_LNG;
  const z = -(lat - CENTRE.lat) * KM_PER_DEG_LAT;
  return [x, z];
}

/**
 * Hand-curated Thames centreline — realistic shape, incl. Isle of Dogs loop.
 * @type {Array<[number, number]>}
 */
const THAMES = [
  [-0.285, 51.47], // Richmond
  [-0.255, 51.476],
  [-0.23, 51.485], // Hammersmith
  [-0.215, 51.475],
  [-0.205, 51.465], // Putney bend
  [-0.185, 51.47],
  [-0.165, 51.478],
  [-0.148, 51.484], // Battersea / Chelsea
  [-0.128, 51.486],
  [-0.118, 51.487], // Vauxhall
  [-0.118, 51.498],
  [-0.12, 51.501], // Westminster
  [-0.115, 51.507], // Waterloo
  [-0.104, 51.509], // Blackfriars
  [-0.091, 51.508],
  [-0.078, 51.506], // Tower Bridge
  [-0.06, 51.505],
  [-0.04, 51.506],
  [-0.025, 51.505], // Canary Wharf north
  [-0.017, 51.496],
  [-0.011, 51.488], // Island Gardens (south tip of Isle of Dogs loop)
  [-0.007, 51.49],
  [0.0, 51.5], // around the O2
  [0.012, 51.503],
  [0.03, 51.5],
  [0.045, 51.502], // Thames Barrier
];

/**
 * Major parks as stylised rectangles. Width/height in km.
 * @type {Array<{ lng: number, lat: number, w: number, h: number, name: string }>}
 */
const PARKS = [
  { name: 'Hyde Park', lng: -0.165, lat: 51.507, w: 1.3, h: 0.7 },
  { name: 'Kensington Gardens', lng: -0.183, lat: 51.507, w: 0.9, h: 0.5 },
  { name: "Regent's Park", lng: -0.152, lat: 51.531, w: 1.0, h: 0.9 },
  { name: "St James's Park", lng: -0.133, lat: 51.502, w: 0.7, h: 0.3 },
  { name: 'Green Park', lng: -0.143, lat: 51.505, w: 0.4, h: 0.35 },
  { name: 'Battersea Park', lng: -0.1475, lat: 51.48, w: 0.85, h: 0.42 },
  { name: 'Victoria Park', lng: -0.038, lat: 51.536, w: 0.9, h: 0.7 },
  { name: 'Olympic Park', lng: -0.017, lat: 51.545, w: 1.4, h: 1.1 },
  { name: 'Greenwich Park', lng: 0.003, lat: 51.477, w: 0.6, h: 0.6 },
  { name: 'Hampstead Heath', lng: -0.165, lat: 51.562, w: 1.4, h: 1.1 },
  { name: 'Clapham Common', lng: -0.147, lat: 51.458, w: 0.7, h: 0.5 },
  { name: 'Brockwell Park', lng: -0.108, lat: 51.454, w: 0.65, h: 0.5 },
  { name: 'Richmond Park', lng: -0.27, lat: 51.44, w: 2.0, h: 1.8 },
];

/**
 * Regent's Canal — flows west→east from Paddington through Camden and
 * Islington to Limehouse Basin. Helps orient the CSM / North London area.
 * @type {Array<[number, number]>}
 */
const REGENT_CANAL = [
  [-0.168, 51.52], // Paddington / Little Venice
  [-0.157, 51.533], // Maida Vale
  [-0.148, 51.536], // Regent's Park north
  [-0.133, 51.54], // Camden Town
  [-0.112, 51.544], // Caledonian Road
  [-0.097, 51.54], // Islington / Angel
  [-0.08, 51.534], // City Road Basin
  [-0.068, 51.53], // Haggerston
  [-0.054, 51.524], // Hackney / Shoreditch
  [-0.038, 51.515], // Victoria Park
  [-0.02, 51.513], // Mile End
  [-0.008, 51.511], // Limehouse Basin
];

/**
 * Neighbourhood labels used as <Html> anchors to help orientation.
 * @type {Array<{ name: string, lng: number, lat: number }>}
 */
export const NEIGHBOURHOODS = [
  { name: 'West End', lng: -0.135, lat: 51.514 },
  { name: 'The City', lng: -0.09, lat: 51.515 },
  { name: 'South Bank', lng: -0.102, lat: 51.505 },
  { name: 'Elephant & Castle', lng: -0.1, lat: 51.493 },
  { name: 'Battersea', lng: -0.155, lat: 51.471 },
  { name: 'Hackney', lng: -0.055, lat: 51.543 },
  { name: 'Canary Wharf', lng: -0.018, lat: 51.504 },
  { name: 'Greenwich', lng: 0.001, lat: 51.478 },
];

/**
 * Simplified TfL tube lines passing through or near the six UAL campuses.
 * Each path is a sequence of (lng, lat) points approximating the line —
 * realistic enough to orient the reader without overwhelming the canvas.
 * Colours match the official TfL palette.
 *
 * @type {Array<{ name: string, color: string, path: Array<[number, number]> }>}
 */
export const TUBE_LINES = [
  {
    name: 'Victoria',
    color: '#0098D4',
    path: [
      [-0.1145, 51.4627], // Brixton
      [-0.1226, 51.4726], // Stockwell
      [-0.1232, 51.4861], // Vauxhall
      [-0.134, 51.4892], // Pimlico
      [-0.1438, 51.4965], // Victoria
      [-0.1428, 51.5067], // Green Park
      [-0.1418, 51.5152], // Oxford Circus
      [-0.1384, 51.5243], // Warren Street
      [-0.1337, 51.5282], // Euston
      [-0.1238, 51.5308], // King's Cross
      [-0.103, 51.5461], // Highbury & Islington
    ],
  },
  {
    name: 'Northern',
    color: '#000000',
    // Bank branch — the one that connects King's Cross (CSM) to
    // Elephant & Castle (LCC) directly. The Charing Cross branch skips
    // King's Cross entirely, so the Bank branch is the correct choice.
    path: [
      [-0.1238, 51.5308], // King's Cross
      [-0.1058, 51.5322], // Angel
      [-0.0876, 51.526], // Old Street
      [-0.0887, 51.5185], // Moorgate
      [-0.0888, 51.5133], // Bank
      [-0.0863, 51.5049], // London Bridge
      [-0.0943, 51.5011], // Borough
      [-0.1001, 51.4943], // Elephant & Castle
      [-0.1063, 51.4884], // Kennington
      [-0.112, 51.4813], // Oval
      [-0.1142, 51.4719], // Stockwell
    ],
  },
  {
    name: 'Central',
    color: '#E32017',
    path: [
      [-0.1586, 51.5136], // Marble Arch
      [-0.1494, 51.5142], // Bond Street
      [-0.1418, 51.5152], // Oxford Circus
      [-0.1308, 51.5164], // Tottenham Ct Rd
      [-0.12, 51.5174], // Holborn
      [-0.0974, 51.5146], // St Paul's
      [-0.0888, 51.5133], // Bank
      [-0.0823, 51.5178], // Liverpool St
      [-0.055, 51.5269], // Bethnal Green
      [-0.0332, 51.5252], // Mile End
      [-0.0034, 51.5416], // Stratford
    ],
  },
  {
    name: 'District',
    color: '#00782A',
    path: [
      [-0.2063, 51.4214], // Wimbledon
      [-0.2066, 51.4454], // Southfields
      [-0.2089, 51.4682], // Putney Bridge
      [-0.1951, 51.4806], // Fulham Broadway
      [-0.1947, 51.4915], // Earl's Court
      [-0.1738, 51.4941], // South Kensington
      [-0.1565, 51.4925], // Sloane Sq
      [-0.1438, 51.4965], // Victoria
      [-0.1336, 51.4994], // St James's Park
      [-0.1246, 51.5012], // Westminster
      [-0.1141, 51.5111], // Temple
      [-0.1037, 51.5122], // Blackfriars
      [-0.0862, 51.5108], // Monument
      [-0.0766, 51.5098], // Tower Hill
    ],
  },
  {
    name: 'Jubilee',
    color: '#A0A5A9',
    path: [
      [-0.1246, 51.5012], // Westminster
      [-0.1143, 51.5036], // Waterloo
      [-0.0863, 51.5049], // London Bridge
      [-0.0637, 51.4979], // Bermondsey
      [-0.0502, 51.4982], // Canada Water
      [-0.0209, 51.5051], // Canary Wharf
      [0.004, 51.5005], // North Greenwich
      [0.0082, 51.5144], // Canning Town
      [-0.0034, 51.5416], // Stratford
    ],
  },
  {
    name: 'Overground',
    color: '#EE7C0E',
    // Windrush line (Highbury & Islington ↔ Clapham Junction via East London
    // Line) — the only line serving Denmark Hill, the nearest stop to Camberwell.
    path: [
      [-0.1702, 51.4644], // Clapham Junction
      [-0.1337, 51.4702], // Wandsworth Road
      [-0.132, 51.4654], // Clapham High Street
      [-0.0894, 51.4682], // Denmark Hill
      [-0.0694, 51.4699], // Peckham Rye
      [-0.0548, 51.4731], // Queens Road Peckham
      [-0.0478, 51.4933], // Surrey Quays
      [-0.0502, 51.4982], // Canada Water
      [-0.0595, 51.5194], // Whitechapel
      [-0.0749, 51.5233], // Shoreditch High Street
      [-0.0753, 51.5459], // Dalston Junction
      [-0.103, 51.5461], // Highbury & Islington
    ],
  },
];

/**
 * Nearest transit station to each UAL campus. Rendered as dots on the
 * texture and as <Html> labels above the plane so the names stay crisp.
 *
 * @type {Array<{ name: string, lng: number, lat: number, campus: string }>}
 */
export const STATIONS = [
  { name: "King's Cross St Pancras", lng: -0.1238, lat: 51.5308, campus: 'csm' },
  { name: 'Stratford', lng: -0.0034, lat: 51.5416, campus: 'lcf' },
  { name: 'Elephant & Castle', lng: -0.1001, lat: 51.4943, campus: 'lcc' },
  { name: 'Denmark Hill', lng: -0.0894, lat: 51.4682, campus: 'camberwell' },
  { name: 'Pimlico', lng: -0.134, lat: 51.4892, campus: 'chelsea' },
  { name: 'Wimbledon', lng: -0.2063, lat: 51.4214, campus: 'wimbledon' },
];

/**
 * Build a 2D canvas texture representing London's central map:
 * pale background, faint km grid, green park patches, blue-grey Thames.
 * Colours stay inside the UAL DS palette family (neutral greys + muted tints).
 *
 * @param {number} [pxSize]
 * @returns {import('three').Texture}
 */
export function createLondonMapTexture(pxSize = 1024) {
  const canvas = document.createElement('canvas');
  canvas.width = pxSize;
  canvas.height = pxSize;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  const toPx = (sceneX) => ((sceneX + MAP_HALF) / MAP_SIZE) * pxSize;
  const toPy = (sceneZ) => ((sceneZ + MAP_HALF) / MAP_SIZE) * pxSize;
  const kmToPx = (km) => (km / MAP_SIZE) * pxSize;

  // Base — light warm grey (matches DS neutral tones)
  ctx.fillStyle = '#efefec';
  ctx.fillRect(0, 0, pxSize, pxSize);

  // Faint km grid — gives map-like rhythm without dominating
  ctx.strokeStyle = '#e3e3df';
  ctx.lineWidth = 1;
  for (let i = -MAP_HALF; i <= MAP_HALF; i++) {
    const px = toPx(i);
    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, pxSize);
    ctx.stroke();
    const py = toPy(i);
    ctx.beginPath();
    ctx.moveTo(0, py);
    ctx.lineTo(pxSize, py);
    ctx.stroke();
  }

  // Stronger every-5km section lines
  ctx.strokeStyle = '#d4d4ce';
  ctx.lineWidth = 1.5;
  for (let i = -MAP_HALF; i <= MAP_HALF; i += 5) {
    const px = toPx(i);
    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, pxSize);
    ctx.stroke();
    const py = toPy(i);
    ctx.beginPath();
    ctx.moveTo(0, py);
    ctx.lineTo(pxSize, py);
    ctx.stroke();
  }

  // Parks — readable sage green that clearly stands out on the warm-grey base
  ctx.fillStyle = '#bcd6a6';
  PARKS.forEach((p) => {
    const [cx, cz] = geoToScene(p.lng, p.lat);
    const x = toPx(cx) - kmToPx(p.w) / 2;
    const y = toPy(cz) - kmToPx(p.h) / 2;
    // Rounded corners for a softer "park" feel
    const r = Math.min(kmToPx(p.w), kmToPx(p.h)) * 0.25;
    const w = kmToPx(p.w);
    const h = kmToPx(p.h);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.fill();
  });

  // Thames — clearly-blue river (cleaner tone, reads as water at a glance)
  ctx.strokeStyle = '#97bcd0';
  ctx.lineWidth = kmToPx(0.5); // ~500m wide, a touch bolder for legibility
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  THAMES.forEach(([lng, lat], i) => {
    const [sx, sz] = geoToScene(lng, lat);
    const x = toPx(sx);
    const y = toPy(sz);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Subtle darker edge — gives the river a touch of definition
  ctx.strokeStyle = '#6f9db3';
  ctx.lineWidth = kmToPx(0.05);
  ctx.stroke();

  // Regent's Canal — thinner, lighter blue than the Thames so it reads as a
  // secondary waterway without competing with the river.
  ctx.strokeStyle = '#a8c8dc';
  ctx.lineWidth = kmToPx(0.1);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  REGENT_CANAL.forEach(([lng, lat], i) => {
    const [sx, sz] = geoToScene(lng, lat);
    const x = toPx(sx);
    const y = toPy(sz);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // ---- Tube lines — white underlay + full-strength coloured stroke ----
  // The underlay pass gives overlapping lines clear separation (like the
  // real TfL map when two lines share a corridor).
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = kmToPx(0.3);
  TUBE_LINES.forEach((line) => {
    ctx.beginPath();
    line.path.forEach(([lng, lat], i) => {
      const [sx, sz] = geoToScene(lng, lat);
      const x = toPx(sx);
      const y = toPy(sz);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  });

  TUBE_LINES.forEach((line) => {
    ctx.strokeStyle = line.color;
    ctx.lineWidth = kmToPx(0.2);
    ctx.beginPath();
    line.path.forEach(([lng, lat], i) => {
      const [sx, sz] = geoToScene(lng, lat);
      const x = toPx(sx);
      const y = toPy(sz);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  });
  ctx.restore();

  // ---- Interchange dots at nearest stations (the roundels overlay these) ----
  STATIONS.forEach((s) => {
    const [sx, sz] = geoToScene(s.lng, s.lat);
    const x = toPx(sx);
    const y = toPy(sz);
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(x, y, kmToPx(0.22), 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, kmToPx(0.14), 0, Math.PI * 2);
    ctx.fill();
  });

  // Edge fade — radial alpha mask so the texture blends seamlessly into fog,
  // erasing any visible boundary between the map and the surrounding plane.
  const cx = pxSize / 2;
  const cy = pxSize / 2;
  const rInner = pxSize * 0.42;
  const rOuter = pxSize * 0.52;
  const fade = ctx.createRadialGradient(cx, cy, rInner, cx, cy, rOuter);
  fade.addColorStop(0, 'rgba(239, 239, 236, 0)');
  fade.addColorStop(1, 'rgba(239, 239, 236, 1)');
  ctx.fillStyle = fade;
  ctx.fillRect(0, 0, pxSize, pxSize);

  const texture = new CanvasTexture(canvas);
  texture.anisotropy = 8;
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}
