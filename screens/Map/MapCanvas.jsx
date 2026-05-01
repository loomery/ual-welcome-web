'use client';

import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Html, OrbitControls } from '@react-three/drei';
import { Vector3 } from 'three';
import { BUILDINGS } from '../../data/buildings';
import { BuildingMesh } from './BuildingMesh';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import {
  createLondonMapTexture,
  geoToScene,
  MAP_BASE_COLOR,
  MAP_SIZE,
  NEIGHBOURHOODS,
  STATIONS,
} from './londonMap';

// Default perspective camera home — shared between initial spawn and the
// "return to 3D" animation so the two reads as one consistent vantage.
const STANDARD_CAMERA_POS = new Vector3(14, 13, 18);
const STANDARD_TARGET = new Vector3(0, 0.5, 0);

// Top-down vantage — straight down, looking at the map origin. A tiny
// forward offset (z = 0.001) avoids OrbitControls' gimbal lock when
// polar angle is exactly 0.
const TOPDOWN_CAMERA_POS = new Vector3(0, 32, 0.001);
const TOPDOWN_TARGET = new Vector3(0, 0, 0);

/**
 * Drives the camera + OrbitControls target.
 *
 * Two behaviours live here so they don't fight over the target Vector:
 *
 * 1. In standard mode, it lerps the orbit target toward the selected
 *    building (or the scene origin if nothing is selected), so tapping a
 *    college in the list below re-centres the 3D view.
 *
 * 2. When `topDown` flips, it runs a short eased transition of both the
 *    camera position and the orbit target to the mode's "home" pose, then
 *    hands control back to OrbitControls. The same transition plays on
 *    the way back to the standard vantage.
 *
 * @param {Object} props
 * @param {{ current: any }} props.controls
 * @param {boolean} props.topDown
 * @param {Vector3} props.target
 */
function CameraController({ controls, topDown, target }) {
  const { camera } = useThree();
  const lerpedTarget = useRef(new Vector3().copy(STANDARD_TARGET));

  // Animation state for mode transitions.
  const animating = useRef(false);
  const animStart = useRef(0);
  const fromPos = useRef(new Vector3());
  const fromTarget = useRef(new Vector3());
  const toPos = useRef(new Vector3());
  const toTarget = useRef(new Vector3());

  // When the mode flag changes, snapshot the current pose and tween to the
  // new home. useEffect (rather than tracking in useFrame) means we only
  // react to actual flips, not every frame.
  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    fromPos.current.copy(camera.position);
    fromTarget.current.copy(c.target);
    if (topDown) {
      toPos.current.copy(TOPDOWN_CAMERA_POS);
      toTarget.current.copy(TOPDOWN_TARGET);
    } else {
      toPos.current.copy(STANDARD_CAMERA_POS);
      toTarget.current.copy(STANDARD_TARGET);
    }
    animStart.current = performance.now();
    animating.current = true;
  }, [topDown, camera, controls]);

  useFrame(() => {
    const c = controls.current;
    if (!c) return;

    if (animating.current) {
      // Ease-out cubic over ~0.8s feels snappy without being jarring.
      const elapsed = (performance.now() - animStart.current) / 1000;
      const duration = 0.8;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      camera.position.lerpVectors(fromPos.current, toPos.current, eased);
      c.target.lerpVectors(fromTarget.current, toTarget.current, eased);
      lerpedTarget.current.copy(c.target);
      c.update();
      if (t >= 1) {
        animating.current = false;
      }
      return;
    }

    // Standard-mode selection targeting — only runs once transitions have
    // settled, and only when not in top-down (where the target stays on
    // the origin regardless of selection).
    if (!topDown) {
      lerpedTarget.current.lerp(target, 0.08);
      c.target.copy(lerpedTarget.current);
      c.update();
    }
  });

  return null;
}

/**
 * 3D campus map — stylised London with the real Thames and major parks
 * painted into a canvas texture on the floor. Buildings are projected
 * from their (lng, lat) so north/south-of-river relationships and
 * approximate distances match reality.
 *
 * Canvas is aria-hidden; the building list below the canvas is the
 * accessible source of truth.
 *
 * @param {Object} props
 * @param {string | null} props.selectedId
 * @param {(id: string) => void} props.onSelect
 * @param {boolean} props.showBuildingLabels
 * @param {boolean} props.showStationLabels
 * @param {boolean} props.topDown  When true, camera flips to a fixed top-down (plan) view.
 */
export function MapCanvas({
  selectedId,
  onSelect,
  showBuildingLabels,
  showStationLabels,
  topDown,
}) {
  const reducedMotion = usePrefersReducedMotion();
  const controls = useRef(null);

  // One-off expensive texture — cached for the component's lifetime.
  const londonTexture = useMemo(() => createLondonMapTexture(1024), []);

  const selected = selectedId ? BUILDINGS.find((b) => b.id === selectedId) : undefined;

  const target = selected
    ? (() => {
        const [x, z] = geoToScene(selected.geo.lng, selected.geo.lat);
        return new Vector3(x, selected.height / 2, z);
      })()
    : new Vector3(0, 0.5, 0);

  return (
    <Canvas
      camera={{ position: [14, 13, 18], fov: 42 }}
      // three@0.184 deprecated PCFSoftShadowMap (the default that
      // r3f's `shadows` boolean enables). We pin the renderer to VSM
      // (Variance Shadow Maps) which is the modern soft-shadow path
      // — same blurred look as PCFSoft, no console warning.
      shadows="variance"
      dpr={[1, 2]}
      aria-hidden="true"
      gl={{ antialias: true }}
    >
      <color attach="background" args={[MAP_BASE_COLOR]} />
      <fog attach="fog" args={[MAP_BASE_COLOR, 28, 55]} />

      <directionalLight
        position={[10, 18, 6]}
        intensity={1.15}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <ambientLight intensity={0.7} />
      <directionalLight position={[-10, 8, -8]} intensity={0.25} color="#ff5000" />

      {/* Infinite-feel ground — single oversized plane in the shared base tone.
          The textured map sits on top with a radial alpha fade, so the
          transition between "map" and "endless floor" is imperceptible. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color={MAP_BASE_COLOR} roughness={1} metalness={0} />
      </mesh>

      {/* Stylised London map — textured plane fades at its edges. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]} receiveShadow>
        <planeGeometry args={[MAP_SIZE, MAP_SIZE]} />
        <meshStandardMaterial map={londonTexture} roughness={1} metalness={0} transparent />
      </mesh>

      <ContactShadows position={[0, 0.02, 0]} opacity={0.3} scale={50} blur={2.5} far={10} />

      {/* Neighbourhood labels — anchored to real geo positions */}
      {NEIGHBOURHOODS.map((n) => {
        const [x, z] = geoToScene(n.lng, n.lat);
        return (
          <Html
            key={n.name}
            position={[x, 0.2, z]}
            distanceFactor={14}
            center
            zIndexRange={[3, 0]}
            style={{ pointerEvents: 'none' }}
          >
            <span className="map-place-label" aria-hidden="true">
              {n.name}
            </span>
          </Html>
        );
      })}

      {/* Nearest-station markers — a pure TfL roundel icon (red ring + blue
          bar through its middle) anchored exactly on the station, and a
          separate name pill to its right. The outer flex container is
          translated by half a roundel so the ring's centre — not the whole
          composition's — sits precisely on the station's lat/lng. */}
      {showStationLabels &&
        STATIONS.map((s) => {
          const [x, z] = geoToScene(s.lng, s.lat);
          return (
            <Html
              key={s.name}
              position={[x, 0.01, z]}
              distanceFactor={10}
              zIndexRange={[4, 0]}
              style={{ pointerEvents: 'none' }}
            >
              <div className="map-station" aria-hidden="true">
                <span className="map-station__roundel" />
                <span className="map-station__name">{s.name}</span>
              </div>
            </Html>
          );
        })}

      <Suspense fallback={null}>
        {BUILDINGS.map((b) => (
          <BuildingMesh
            key={b.id}
            building={b}
            selected={selectedId === b.id}
            onSelect={onSelect}
            showLabel={showBuildingLabels}
          />
        ))}
      </Suspense>

      <CameraController controls={controls} topDown={topDown} target={target} />

      {/* OrbitControls: in top-down mode we freeze rotation and the auto-spin
          so the map reads like a fixed floor plan — pan + zoom stay enabled
          so users can still explore. Standard mode keeps the orbit controls
          fully live. */}
      <OrbitControls
        ref={controls}
        enablePan
        enableZoom
        enableRotate={!topDown}
        enableDamping
        dampingFactor={0.08}
        autoRotate={!topDown && !reducedMotion && selectedId === null}
        autoRotateSpeed={0.3}
        minDistance={12}
        maxDistance={topDown ? 60 : 36}
        maxPolarAngle={topDown ? 0.0001 : Math.PI / 2.25}
        minPolarAngle={topDown ? 0 : 0}
      />
    </Canvas>
  );
}
