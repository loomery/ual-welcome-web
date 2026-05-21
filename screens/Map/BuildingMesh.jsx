'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Edges, Html } from '@react-three/drei';
import { geoToScene } from './londonMap';

// Three.js material colours mirror UAL DS tokens (CSS vars can't be used
// in r3f — hex values must be explicit).
const COLOR_SURFACE_DEFAULT = '#fafafa'; // near-white resting fill
const COLOR_SURFACE_HOVER = '#ffffff'; // --color-light lifted on hover
const COLOR_SURFACE_SELECTED = '#ff5000'; // --color-orange
const COLOR_SURFACE_DIMMED = '#c4c4c4'; // grey — all non-selected when a building is active
const COLOR_SURFACE_DIMMED_HOVER = '#d4d4d4'; // slightly lifted dimmed grey on hover
const COLOR_EDGE_DEFAULT = '#000000'; // --color-dark
const COLOR_EDGE_HOVER = '#ff5000'; // --color-orange
const COLOR_EDGE_SELECTED = '#000000'; // --color-dark
const COLOR_EDGE_DIMMED = '#999999'; // lighter edge for dimmed buildings

/**
 * @param {Object} props
 * @param {import('../../data/buildings').Building} props.building
 * @param {boolean} props.selected
 * @param {boolean} props.dimmed   True when another building is selected — greys out this mesh.
 * @param {(id: string) => void} props.onSelect
 * @param {boolean} props.showLabel
 */
export function BuildingMesh({ building, selected, dimmed, onSelect, showLabel }) {
  const groupRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  /**
   * Subtle lift + scale on hover/select. Uses direct lerp on the group
   * (no react state in the frame loop → 60fps smooth).
   */
  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;
    const targetY = selected ? 0.18 : hovered ? 0.08 : 0;
    g.position.y += (targetY - g.position.y) * 0.18;
    const targetScale = selected ? 1.04 : hovered ? 1.015 : 1;
    g.scale.x += (targetScale - g.scale.x) * 0.18;
    g.scale.y += (targetScale - g.scale.y) * 0.18;
    g.scale.z += (targetScale - g.scale.z) * 0.18;
  });

  const fill = selected
    ? COLOR_SURFACE_SELECTED
    : dimmed
      ? hovered
        ? COLOR_SURFACE_DIMMED_HOVER
        : COLOR_SURFACE_DIMMED
      : hovered
        ? COLOR_SURFACE_HOVER
        : COLOR_SURFACE_DEFAULT;
  const edge = selected
    ? COLOR_EDGE_SELECTED
    : dimmed
      ? COLOR_EDGE_DIMMED
      : hovered
        ? COLOR_EDGE_HOVER
        : COLOR_EDGE_DEFAULT;

  const [w, d] = building.size;
  const h = building.height;
  const [bx, bz] = geoToScene(building.geo.lng, building.geo.lat);

  // ── CSM / Granary Building special case ─────────────────────────────────
  // The real building is a converted 6-storey Victorian granary: a wide, flat
  // rectangular mass with four prominent vertical pilaster piers and a heavy
  // projecting cornice — no setbacks or stepped profile.
  if (building.id === 'csm') {
    // Pilasters at four evenly-spaced positions across the width (five bays).
    const pilasterXs = [-0.33, -0.11, 0.11, 0.33].map((f) => f * w);
    const corniceSlab = 0.09; // height of the rooftop cornice
    return (
      <group
        ref={groupRef}
        position={[bx, 0, bz]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = '';
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(building.id);
        }}
      >
        {/* Main body — flat warehouse box, full height */}
        <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
          <Edges color={edge} threshold={15} />
        </mesh>

        {/* Cornice — heavy projecting slab capping the roofline */}
        <mesh position={[0, h + corniceSlab / 2, 0]} castShadow>
          <boxGeometry args={[w + 0.06, corniceSlab, d + 0.05]} />
          <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
          <Edges color={edge} threshold={15} />
        </mesh>

        {/* 4 vertical pilasters — project from both long facades, run full height */}
        {pilasterXs.map((px, i) => (
          <group key={i}>
            <mesh position={[px, (h + corniceSlab) / 2, -(d / 2 + 0.022)]} castShadow>
              <boxGeometry args={[0.058, h + corniceSlab, 0.044]} />
              <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
              <Edges color={edge} threshold={15} />
            </mesh>
            <mesh position={[px, (h + corniceSlab) / 2, d / 2 + 0.022]} castShadow>
              <boxGeometry args={[0.058, h + corniceSlab, 0.044]} />
              <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
              <Edges color={edge} threshold={15} />
            </mesh>
          </group>
        ))}

        {(selected || (showLabel && !dimmed)) && (
          <Html
            position={[0, h + 0.9, 0]}
            center
            distanceFactor={9}
            className="pointer-events-none"
            zIndexRange={[5, 0]}
          >
            <span
              className={selected ? 'map-label map-label--selected' : 'map-label'}
              aria-hidden="true"
            >
              <span className="map-label__badge">UAL</span>
              <span className="map-label__name">{building.college}</span>
            </span>
          </Html>
        )}
      </group>
    );
  }

  // ── LCF / East Bank special case ────────────────────────────────────────
  // Distinctive contemporary tower: raised on pilotis (open ground floor),
  // three pronounced stepped tiers, and vertical fins on all facades.
  if (building.id === 'lcf') {
    const plinthH = 0.055;
    const colH = h * 0.15;
    const bodyBase = plinthH + colH;
    // Remaining height split across three tiers.
    const rem = h - bodyBase;
    const lowerH = rem * 0.52;
    const midH = rem * 0.3;
    const topH = rem * 0.18;
    const midW = w * 0.8,
      midD = d * 0.8;
    const topW = w * 0.62,
      topD = d * 0.62;
    // 8 pilotis columns in a 4 × 2 grid under the main body.
    const colXs = [-0.34, -0.11, 0.11, 0.34].map((f) => f * w);
    const colZs = [-0.32 * d, 0.32 * d];
    return (
      <group
        ref={groupRef}
        position={[bx, 0, bz]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = '';
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(building.id);
        }}
      >
        {/* Ground plinth — wide concrete slab at street level */}
        <mesh position={[0, plinthH / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[w + 0.12, plinthH, d + 0.1]} />
          <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
          <Edges color={edge} threshold={15} />
        </mesh>

        {/* Pilotis — 8 square-section concrete columns (4 × 2 grid) */}
        {colXs.flatMap((cx, xi) =>
          colZs.map((cz, zi) => (
            <mesh key={`${xi}-${zi}`} position={[cx, plinthH + colH / 2, cz]} castShadow>
              <boxGeometry args={[0.075, colH, 0.075]} />
              <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
              <Edges color={edge} threshold={15} />
            </mesh>
          )),
        )}

        {/* Lower body — full footprint, largest tier */}
        <mesh position={[0, bodyBase + lowerH / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[w, lowerH, d]} />
          <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
          <Edges color={edge} threshold={15} />
        </mesh>

        {/* Mid body — pronounced setback (~10% per side) */}
        <mesh position={[0, bodyBase + lowerH + midH / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[midW, midH, midD]} />
          <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
          <Edges color={edge} threshold={15} />
        </mesh>

        {/* Top section — further setback, darker crown */}
        <mesh position={[0, bodyBase + lowerH + midH + topH / 2, 0]} castShadow>
          <boxGeometry args={[topW, topH, topD]} />
          <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
          <Edges color={edge} threshold={15} />
        </mesh>

        {(selected || (showLabel && !dimmed)) && (
          <Html
            position={[0, h + 0.9, 0]}
            center
            distanceFactor={9}
            className="pointer-events-none"
            zIndexRange={[5, 0]}
          >
            <span
              className={selected ? 'map-label map-label--selected' : 'map-label'}
              aria-hidden="true"
            >
              <span className="map-label__badge">UAL</span>
              <span className="map-label__name">{building.college}</span>
            </span>
          </Html>
        )}
      </group>
    );
  }

  // ── Chelsea / Millbank special case ─────────────────────────────────────
  // A symmetrical three-storey Georgian palace: wide low mass, projecting
  // central risalit with triangular pediment and cupola, two end risalits,
  // roofline balustrade, and rows of chimneys flanking the central bay.
  if (building.id === 'chelsea') {
    const pedW = w * 0.26; // central pediment width
    const pedH = 0.175; // triangle height
    const pedAngle = Math.atan2(pedH, pedW / 2);
    const pedHyp = Math.sqrt((pedW / 2) ** 2 + pedH ** 2);
    const zPed = -(d / 2 + 0.045); // front face of central projection
    return (
      <group
        ref={groupRef}
        position={[bx, 0, bz]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = '';
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(building.id);
        }}
      >
        {/* Main body — wide, low, three-storey block */}
        <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
          <Edges color={edge} threshold={15} />
        </mesh>

        {/* Central risalit — slight forward projection under the pediment */}
        <mesh position={[0, h / 2, -(d / 2 + 0.025)]} castShadow receiveShadow>
          <boxGeometry args={[pedW + 0.05, h, 0.05]} />
          <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
          <Edges color={edge} threshold={15} />
        </mesh>

        {/* End risalits — shallow projections at each end of the facade */}
        {[-1, 1].map((side, i) => (
          <mesh
            key={i}
            position={[side * w * 0.43, h / 2, -(d / 2 + 0.016)]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[w * 0.12, h, 0.032]} />
            <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
            <Edges color={edge} threshold={15} />
          </mesh>
        ))}

        {/* Balustrade — low parapet running the full roofline */}
        <mesh position={[0, h + 0.032, 0]} castShadow>
          <boxGeometry args={[w + 0.04, 0.064, d + 0.04]} />
          <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
          <Edges color={edge} threshold={15} />
        </mesh>

        {/* Pediment — horizontal base moulding */}
        <mesh position={[0, h + 0.02, zPed]} castShadow>
          <boxGeometry args={[pedW + 0.04, 0.04, 0.05]} />
          <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
          <Edges color={edge} threshold={15} />
        </mesh>
        {/* Left raking cornice */}
        <mesh position={[-pedW / 4, h + pedH / 2, zPed]} rotation={[0, 0, pedAngle]} castShadow>
          <boxGeometry args={[pedHyp, 0.034, 0.048]} />
          <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
          <Edges color={edge} threshold={15} />
        </mesh>
        {/* Right raking cornice */}
        <mesh position={[pedW / 4, h + pedH / 2, zPed]} rotation={[0, 0, -pedAngle]} castShadow>
          <boxGeometry args={[pedHyp, 0.034, 0.048]} />
          <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
          <Edges color={edge} threshold={15} />
        </mesh>

        {/* Cupola — small drum cylinder + dome above pediment apex */}
        <mesh position={[0, h + pedH + 0.055, zPed]} castShadow>
          <cylinderGeometry args={[0.045, 0.055, 0.11, 10]} />
          <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
          <Edges color={edge} threshold={15} />
        </mesh>
        <mesh position={[0, h + pedH + 0.11, zPed]} castShadow>
          <sphereGeometry args={[0.048, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
          <Edges color={edge} threshold={15} />
        </mesh>

        {/* Chimneys — 3 each side of the central bay */}
        {[-0.38, -0.27, -0.16, 0.16, 0.27, 0.38].map((fx, i) => (
          <mesh key={i} position={[fx * w, h + 0.07, 0]} castShadow>
            <boxGeometry args={[0.044, 0.14, 0.044]} />
            <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
            <Edges color={edge} threshold={15} />
          </mesh>
        ))}

        {(selected || (showLabel && !dimmed)) && (
          <Html
            position={[0, h + 0.9, 0]}
            center
            distanceFactor={9}
            className="pointer-events-none"
            zIndexRange={[5, 0]}
          >
            <span
              className={selected ? 'map-label map-label--selected' : 'map-label'}
              aria-hidden="true"
            >
              <span className="map-label__badge">UAL</span>
              <span className="map-label__name">{building.college}</span>
            </span>
          </Html>
        )}
      </group>
    );
  }

  // ── LCC / Elephant & Castle special case ────────────────────────────────
  // Near-cubic dark tower with dense vertical fins on all four facades, a
  // chamfered SE corner, and a rooftop plant room — the defining features
  // visible in architectural renders of the building.
  if (building.id === 'lcc') {
    const chamfer = w * 0.2; // size of the chamfered corner cut
    // Thin vertical fin: width along facade, projection outward.
    const FIN_W = 0.022;
    const FIN_P = 0.034;
    // Helper — evenly spaced positions across a given span.
    const finPts = (count, span) =>
      Array.from({ length: count }, (_, i) => -span / 2 + (i + 0.5) * (span / count));
    return (
      <group
        ref={groupRef}
        position={[bx, 0, bz]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = '';
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(building.id);
        }}
      >
        {/* Main body — near-cubic dark block */}
        <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
          <Edges color={edge} threshold={15} />
        </mesh>

        {/* Chamfer face — 45° panel at the SE corner */}
        <mesh
          position={[w / 2 - chamfer / 2, h / 2, -(d / 2 - chamfer / 2)]}
          rotation={[0, -Math.PI / 4, 0]}
          castShadow
        >
          <boxGeometry args={[chamfer * Math.SQRT2, h, 0.03]} />
          <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
          <Edges color={edge} threshold={15} />
        </mesh>

        {/* Fins — south face */}
        {finPts(9, w * 0.86).map((x, i) => (
          <mesh key={`s${i}`} position={[x, h / 2, -(d / 2 + FIN_P / 2)]} castShadow>
            <boxGeometry args={[FIN_W, h + 0.04, FIN_P]} />
            <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
          </mesh>
        ))}

        {/* Fins — north face */}
        {finPts(9, w * 0.86).map((x, i) => (
          <mesh key={`n${i}`} position={[x, h / 2, d / 2 + FIN_P / 2]} castShadow>
            <boxGeometry args={[FIN_W, h + 0.04, FIN_P]} />
            <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
          </mesh>
        ))}

        {/* Fins — west face */}
        {finPts(9, d * 0.86).map((z, i) => (
          <mesh key={`w${i}`} position={[-(w / 2 + FIN_P / 2), h / 2, z]} castShadow>
            <boxGeometry args={[FIN_P, h + 0.04, FIN_W]} />
            <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
          </mesh>
        ))}

        {/* Fins — east face (north portion only, south end cut by chamfer) */}
        {finPts(6, d * 0.55).map((z, i) => (
          <mesh key={`e${i}`} position={[w / 2 + FIN_P / 2, h / 2, z + d * 0.18]} castShadow>
            <boxGeometry args={[FIN_P, h + 0.04, FIN_W]} />
            <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
          </mesh>
        ))}

        {/* Rooftop plant room — flat slab with mechanical equipment suggestion */}
        <mesh position={[w * 0.05, h + 0.08, -d * 0.04]} castShadow>
          <boxGeometry args={[w * 0.58, 0.16, d * 0.5]} />
          <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
          <Edges color={edge} threshold={15} />
        </mesh>

        {(selected || (showLabel && !dimmed)) && (
          <Html
            position={[0, h + 0.9, 0]}
            center
            distanceFactor={9}
            className="pointer-events-none"
            zIndexRange={[5, 0]}
          >
            <span
              className={selected ? 'map-label map-label--selected' : 'map-label'}
              aria-hidden="true"
            >
              <span className="map-label__badge">UAL</span>
              <span className="map-label__name">{building.college}</span>
            </span>
          </Html>
        )}
      </group>
    );
  }

  // ── Camberwell / Peckham Road special case ──────────────────────────────
  // Wide, low modernist block: two horizontal tiers separated by a projecting
  // fascia ledge. The upper tier is set back from the street face. The most
  // distinctive feature is a 6×4 perforated brise-soleil screen panel on the
  // left half of the lower-tier south facade.
  if (building.id === 'camberwell') {
    const lowerH = h * 0.52;
    const upperH = h - lowerH;
    const upperD = d * 0.86; // upper tier set back from street face
    const fasciaH = 0.048;
    // Brise-soleil screen: 6 cols × 4 rows of square bosses on south face.
    const COLS = 6,
      ROWS = 4;
    const scW = w * 0.52; // screen width (left ~half of facade)
    const scH = lowerH * 0.55; // screen height
    const scX0 = -w / 2 + scW / 2; // screen centre x (left-aligned)
    const scY0 = lowerH * 0.58; // screen centre y (above the glazed GF)
    const cW = scW / COLS,
      cH = scH / ROWS;
    return (
      <group
        ref={groupRef}
        position={[bx, 0, bz]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = '';
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(building.id);
        }}
      >
        {/* Lower block — glazed ground floor + brise-soleil mid level */}
        <mesh position={[0, lowerH / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[w, lowerH, d]} />
          <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
          <Edges color={edge} threshold={15} />
        </mesh>

        {/* Horizontal fascia ledge / overhang between tiers */}
        <mesh position={[0, lowerH + fasciaH / 2, 0]} castShadow>
          <boxGeometry args={[w + 0.05, fasciaH, d + 0.05]} />
          <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
          <Edges color={edge} threshold={15} />
        </mesh>

        {/* Upper block — ribbon windows, set back from street face */}
        <mesh
          position={[0, lowerH + fasciaH + upperH / 2, (d - upperD) / 2]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[w, upperH, upperD]} />
          <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
          <Edges color={edge} threshold={15} />
        </mesh>

        {/* Brise-soleil screen — 6×4 grid of square bosses on south face */}
        {Array.from({ length: COLS }, (_, col) =>
          Array.from({ length: ROWS }, (_, row) => (
            <mesh
              key={`${col}-${row}`}
              position={[
                scX0 - scW / 2 + (col + 0.5) * cW,
                scY0 - scH / 2 + (row + 0.5) * cH,
                -(d / 2 + 0.022),
              ]}
              castShadow
            >
              <boxGeometry args={[cW * 0.56, cH * 0.56, 0.044]} />
              <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
            </mesh>
          )),
        )}

        {(selected || (showLabel && !dimmed)) && (
          <Html
            position={[0, h + 0.9, 0]}
            center
            distanceFactor={9}
            className="pointer-events-none"
            zIndexRange={[5, 0]}
          >
            <span
              className={selected ? 'map-label map-label--selected' : 'map-label'}
              aria-hidden="true"
            >
              <span className="map-label__badge">UAL</span>
              <span className="map-label__name">{building.college}</span>
            </span>
          </Html>
        )}
      </group>
    );
  }

  // ── Wimbledon / Merton Hall Road special case ───────────────────────────
  // A low, wide campus building best known for its three prominent gabled
  // roofs: dark, steeply pitched triangular volumes sitting on the main body.
  // An entrance pavilion with a flat roof occupies the left quarter.
  if (building.id === 'wimbledon') {
    // Entrance pavilion on the left (flat roof, slightly taller).
    const pavW = w * 0.22;
    const pavH = h * 1.35;
    const pavX = -w / 2 + pavW / 2;
    // Three gabled bays across the remaining 78% of the width.
    const gablesW = w * 0.78;
    const gableW = gablesW / 3;
    const gableX0 = -w / 2 + pavW; // left edge of the gabled section
    const slopeRun = gableW / 2;
    const ridgeH = gableW * 0.82; // steeply pitched, matching the photo
    const slopeLen = Math.sqrt(slopeRun ** 2 + ridgeH ** 2);
    const slopeAngle = Math.atan2(ridgeH, slopeRun);
    const ROOF_THICK = 0.038;
    return (
      <group
        ref={groupRef}
        position={[bx, 0, bz]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = '';
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(building.id);
        }}
      >
        {/* Main body — low rectangular base for the whole building */}
        <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
          <Edges color={edge} threshold={15} />
        </mesh>

        {/* Entrance pavilion — flat-roofed box, taller than the main body */}
        <mesh position={[pavX, pavH / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[pavW, pavH, d]} />
          <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
          <Edges color={edge} threshold={15} />
        </mesh>

        {/* Three gabled roofs */}
        {[0, 1, 2].map((gi) => {
          const cx = gableX0 + gi * gableW + gableW / 2; // centre x of this bay
          const leftX = cx - slopeRun / 2; // centre x of left panel
          const rightX = cx + slopeRun / 2; // centre x of right panel
          const panelY = h + ridgeH / 2; // vertical centre of each panel
          return (
            <group key={gi}>
              {/* Left roof panel — slopes up toward the ridge */}
              <mesh position={[leftX, panelY, 0]} rotation={[0, 0, slopeAngle]} castShadow>
                <boxGeometry args={[slopeLen, ROOF_THICK, d]} />
                <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
                <Edges color={edge} threshold={15} />
              </mesh>
              {/* Right roof panel — mirror slope down from ridge */}
              <mesh position={[rightX, panelY, 0]} rotation={[0, 0, -slopeAngle]} castShadow>
                <boxGeometry args={[slopeLen, ROOF_THICK, d]} />
                <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
                <Edges color={edge} threshold={15} />
              </mesh>
            </group>
          );
        })}

        {(selected || (showLabel && !dimmed)) && (
          <Html
            position={[0, h + ridgeH + 0.7, 0]}
            center
            distanceFactor={9}
            className="pointer-events-none"
            zIndexRange={[5, 0]}
          >
            <span
              className={selected ? 'map-label map-label--selected' : 'map-label'}
              aria-hidden="true"
            >
              <span className="map-label__badge">UAL</span>
              <span className="map-label__name">{building.college}</span>
            </span>
          </Html>
        )}
      </group>
    );
  }

  // Stepped-profile geometry: podium (full footprint) + tower setback(s).
  // Each tier sets back ~14% per side, giving a recognisable urban silhouette.
  const podiumH = h * 0.28;
  const towerH = h - podiumH;
  const towerW = w * 0.86;
  const towerD = d * 0.86;

  // Taller buildings (h > 1.3) get a second upper setback for skyline variety —
  // shorter/suburban campuses keep the simpler two-tier profile.
  const hasMidStep = h > 1.3;
  const lowerH = hasMidStep ? towerH * 0.62 : towerH;
  const upperH = hasMidStep ? towerH * 0.38 : 0;
  const upperW = towerW * 0.84;
  const upperD = towerD * 0.84;

  // Rooftop mechanical penthouse sits on the highest tier, offset to one side
  // so the silhouette reads as a real building rather than a perfect block.
  const roofW = hasMidStep ? upperW : towerW;
  const roofD = hasMidStep ? upperD : towerD;

  return (
    <group
      ref={groupRef}
      position={[bx, 0, bz]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = '';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(building.id);
      }}
    >
      {/* Podium — full footprint, 28% of total height */}
      <mesh position={[0, podiumH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, podiumH, d]} />
        <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
        <Edges color={edge} threshold={15} />
      </mesh>

      {/* Lower tower — sets back ~14% per side from podium */}
      <mesh position={[0, podiumH + lowerH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[towerW, lowerH, towerD]} />
        <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
        <Edges color={edge} threshold={15} />
      </mesh>

      {/* Upper setback — only for taller urban campuses */}
      {hasMidStep && (
        <mesh position={[0, podiumH + lowerH + upperH / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[upperW, upperH, upperD]} />
          <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
          <Edges color={edge} threshold={15} />
        </mesh>
      )}

      {/* Rooftop penthouse — mechanical room offset for silhouette detail */}
      <mesh position={[roofW * 0.18, h + 0.13, roofD * 0.1]} castShadow>
        <boxGeometry args={[roofW * 0.38, 0.26, roofD * 0.32]} />
        <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
        <Edges color={edge} threshold={15} />
      </mesh>

      {/* College label — HTML portal so it uses the UAL DS typography.
          Hidden when the "Buildings" layer toggle is off, except for the
          currently selected building, which always shows its label so
          users retain context after tapping through the list below. */}
      {(selected || (showLabel && !dimmed)) && (
        <Html
          position={[0, h + 0.9, 0]}
          center
          distanceFactor={9}
          className="pointer-events-none"
          zIndexRange={[5, 0]}
        >
          <span
            className={selected ? 'map-label map-label--selected' : 'map-label'}
            aria-hidden="true"
          >
            <span className="map-label__badge">UAL</span>
            <span className="map-label__name">{building.college}</span>
          </span>
        </Html>
      )}
    </group>
  );
}
