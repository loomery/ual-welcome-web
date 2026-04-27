'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Edges, Html } from '@react-three/drei';
import { geoToScene } from './londonMap';

const FILL_DEFAULT = '#fafafa';
const FILL_HOVER = '#ffffff';
const FILL_SELECTED = '#ff5000';
const EDGE_DEFAULT = '#000000';
const EDGE_HOVER = '#ff5000';
const EDGE_SELECTED = '#000000';

/**
 * @param {Object} props
 * @param {import('../../data/buildings').Building} props.building
 * @param {boolean} props.selected
 * @param {(id: string) => void} props.onSelect
 * @param {boolean} props.showLabel
 */
export function BuildingMesh({ building, selected, onSelect, showLabel }) {
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

  const fill = selected ? FILL_SELECTED : hovered ? FILL_HOVER : FILL_DEFAULT;
  const edge = selected ? EDGE_SELECTED : hovered ? EDGE_HOVER : EDGE_DEFAULT;

  const [w, d] = building.size;
  const h = building.height;
  const hasRooftop = h > 1.8;
  const [bx, bz] = geoToScene(building.geo.lng, building.geo.lat);

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
      {/* Main volume */}
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={fill} roughness={0.85} metalness={0} />
        <Edges color={edge} threshold={15} />
      </mesh>

      {/* Rooftop accent — adds silhouette variety for taller buildings */}
      {hasRooftop && (
        <mesh position={[w * 0.15, h + 0.2, d * 0.1]} castShadow>
          <boxGeometry args={[w * 0.35, 0.4, d * 0.35]} />
          <meshStandardMaterial color={fill} roughness={0.85} />
          <Edges color={edge} threshold={15} />
        </mesh>
      )}

      {/* College label — HTML portal so it uses the UAL DS typography.
          Hidden when the "Buildings" layer toggle is off, except for the
          currently selected building, which always shows its label so
          users retain context after tapping through the list below. */}
      {(showLabel || selected) && (
        <Html
          position={[0, h + 0.9, 0]}
          center
          distanceFactor={9}
          style={{ pointerEvents: 'none' }}
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
