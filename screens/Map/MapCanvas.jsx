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
 * Three animated behaviours share the same ease-out cubic tween so every
 * transition feels part of the same motion language:
 *
 * 1. **topDown toggle** — flies to/from the bird's-eye vantage.
 * 2. **Building selection** — flies the camera close to the selected
 *    building so the user immediately understands *where* on the map it
 *    sits. Uses a fixed offset that mirrors the default viewing direction
 *    ([14, 13, 18] → normalised ≈ [0.53, 0.49, 0.68]), scaled to ~13
 *    scene units from the building centre.
 * 3. **Deselection** — returns to the standard overview vantage.
 *
 * A `targetRef` keeps the latest `target` prop always accessible inside
 * the `selectedId` effect without adding `target` to its dependency array
 * (which would re-trigger the effect on every render because `target` is
 * a new Vector3 on every render when nothing is selected).
 *
 * @param {Object} props
 * @param {{ current: any }} props.controls
 * @param {boolean} props.topDown
 * @param {Vector3} props.target   Building centre (or scene origin when nothing selected).
 * @param {string | null} props.selectedId
 */
function CameraController({ controls, topDown, target, selectedId }) {
  const { camera } = useThree();
  const reducedMotion = usePrefersReducedMotion();

  // Always-current copy of the target prop — updated before each effect runs.
  const targetRef = useRef(target);
  useEffect(() => {
    targetRef.current = target;
  });

  // Shared tween state — only one animation plays at a time; the last
  // effect to fire wins (React runs effects in declaration order).
  const animating = useRef(false);
  const animStart = useRef(0);
  const fromPos = useRef(new Vector3());
  const fromTarget = useRef(new Vector3());
  const toPos = useRef(new Vector3());
  const toTarget = useRef(new Vector3());

  /** Snapshot current pose and begin a tween toward destPos / destTarget. */
  function startAnim(destPos, destTarget) {
    const c = controls.current;
    if (!c) return;
    fromPos.current.copy(camera.position);
    fromTarget.current.copy(c.target);
    toPos.current.copy(destPos);
    toTarget.current.copy(destTarget);
    animStart.current = performance.now();
    animating.current = true;
  }

  // 1. Top-down toggle — flies to/from bird's-eye.
  useEffect(() => {
    if (topDown) {
      startAnim(TOPDOWN_CAMERA_POS, TOPDOWN_TARGET);
    } else {
      // Return to overview; the selectedId effect (below) may immediately
      // override this if a building is still selected — that's intentional.
      startAnim(STANDARD_CAMERA_POS, STANDARD_TARGET);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topDown]);

  // 2. Building selection — zoom in; deselection — return to overview.
  useEffect(() => {
    if (topDown) return; // let the topDown effect own the camera in that mode
    const t = targetRef.current;
    if (selectedId) {
      // Close-up offset: mirrors the standard [14, 13, 18] viewing direction
      // scaled to ~13 units from the building centre so it lands above minDistance.
      const camPos = new Vector3(t.x + 7, t.y + 7, t.z + 9);
      startAnim(camPos, t.clone());
    } else {
      startAnim(STANDARD_CAMERA_POS, STANDARD_TARGET);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, topDown]);

  useFrame(() => {
    const c = controls.current;
    if (!c) return;

    if (animating.current) {
      if (reducedMotion) {
        // Honour prefers-reduced-motion: snap to destination instantly.
        camera.position.copy(toPos.current);
        c.target.copy(toTarget.current);
        c.update();
        animating.current = false;
        return;
      }
      // Ease-out cubic over 0.85 s — snappy but not jarring.
      const elapsed = (performance.now() - animStart.current) / 1000;
      const duration = 0.85;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      camera.position.lerpVectors(fromPos.current, toPos.current, eased);
      c.target.lerpVectors(fromTarget.current, toTarget.current, eased);
      c.update();
      if (t >= 1) animating.current = false;
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

  // Stable Vector3 — only recreated when the selected building actually changes,
  // so the CameraController's targetRef stays accurate without spurious re-renders.
  const target = useMemo(() => {
    if (!selected) return new Vector3(0, 0.5, 0);
    const [x, z] = geoToScene(selected.geo.lng, selected.geo.lat);
    return new Vector3(x, selected.height / 2, z);
  }, [selected]);

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
      {/* UAL orange (#ff5000 = --color-orange) warms the secondary fill light,
          adding a subtle brand-coloured bounce to building surfaces. */}
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
            className="pointer-events-none"
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
              className="pointer-events-none"
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

      <CameraController
        controls={controls}
        topDown={topDown}
        target={target}
        selectedId={selectedId}
      />

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
        minDistance={selectedId ? 4 : 12}
        maxDistance={topDown ? 60 : 36}
        maxPolarAngle={topDown ? 0.0001 : Math.PI / 2.25}
        minPolarAngle={topDown ? 0 : 0}
      />
    </Canvas>
  );
}
