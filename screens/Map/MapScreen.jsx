'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { BUILDINGS } from '../../data/buildings';
import { Button } from '../../components/Button/Button';
import { directionsUrl } from '../../utils/directions';
import { ArrowRightIcon, CloseIcon } from '../../components/Icon/NavIcons';

// next/dynamic with ssr: false ensures three.js + canvas-only code
// never runs on the server. Same effect as React.lazy in the Vite app
// but Next-aware, so the server bundle stays clean.
const MapCanvas = dynamic(
  () => import('./MapCanvas').then((m) => m.MapCanvas),
  { ssr: false, loading: () => <p className="map-hint">Loading 3D view…</p> }
);

export function MapScreen() {
  const [selectedId, setSelectedId] = useState(null);
  const [show3D, setShow3D] = useState(true);
  /**
   * Layer toggles — lets users declutter the scene on small screens by
   * hiding either the UAL college labels or the nearest-tube-station
   * roundels. Both default to on.
   */
  const [showBuildingLabels, setShowBuildingLabels] = useState(true);
  const [showStationLabels, setShowStationLabels] = useState(true);
  /**
   * Top-down mode — clicking the compass flips the camera to a static
   * straight-down view (autorotate off, rotate locked). Clicking again
   * returns to the standard 3D perspective. Useful as an "orient myself"
   * affordance and for users who prefer a floor-plan read of the map.
   */
  const [topDown, setTopDown] = useState(false);
  const itemRefs = useRef(new Map());

  const selected = BUILDINGS.find((b) => b.id === selectedId);

  /**
   * Escape clears the in-canvas selection — consistent with the banner's
   * explicit Close affordance and with typical dismiss patterns.
   */
  useEffect(() => {
    if (!selectedId) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setSelectedId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId]);

  return (
    <article className="prose has-lead flow" data-flow="l">
      <div className="flow" data-flow="s">
        <h1>Campus map</h1>
        <p className="standfirst">
          UAL is made up of six colleges spread across London. Tap any building
          below or in the 3D view — you can grab directions to each college.
        </p>
      </div>

      <div className="cluster">
        <Button ghost onClick={() => setShow3D((s) => !s)} aria-pressed={show3D}>
          {show3D ? 'Hide 3D view' : 'Show 3D view'}
        </Button>
      </div>

      {show3D && (
        <div
          className="map-canvas-wrapper"
          role="region"
          aria-label="Interactive 3D map preview. Use the list below for an accessible version."
        >
          <Suspense fallback={<p className="map-hint">Loading 3D view…</p>}>
            <MapCanvas
              selectedId={selectedId}
              onSelect={setSelectedId}
              showBuildingLabels={showBuildingLabels}
              showStationLabels={showStationLabels}
              topDown={topDown}
            />
          </Suspense>
          <p className="map-hint">
            {topDown
              ? 'Top-down view · pan to explore · tap the compass to return to 3D'
              : 'Drag to orbit · pinch or scroll to zoom · tap a building'}
          </p>
          {/* Compass doubles as a view-mode toggle: click to flip between the
              standard orbiting 3D view and a fixed top-down (plan) view. */}
          <button
            type="button"
            className="map-compass"
            aria-pressed={topDown}
            aria-label={topDown ? 'Return to 3D view' : 'Switch to top-down view'}
            onClick={() => setTopDown((v) => !v)}
          >
            <span aria-hidden="true">N</span>
          </button>

          {/* Layer toggles — keep the mobile view readable by letting users
              hide either the building labels or the tube-station roundels. */}
          <div
            className="map-toggles"
            role="group"
            aria-label="Toggle map layers"
          >
            <button
              type="button"
              className="map-toggle"
              aria-pressed={showBuildingLabels}
              onClick={() => setShowBuildingLabels((v) => !v)}
            >
              <span className="map-toggle__swatch map-toggle__swatch--building" aria-hidden="true" />
              Buildings
            </button>
            <button
              type="button"
              className="map-toggle"
              aria-pressed={showStationLabels}
              onClick={() => setShowStationLabels((v) => !v)}
            >
              <span className="map-toggle__swatch map-toggle__swatch--tube" aria-hidden="true" />
              Tube
            </button>
          </div>

          {selected && (
            <div
              className="map-banner flow"
              data-flow="2xs"
              role="region"
              aria-label={`${selected.name} — quick info`}
            >
              <button
                type="button"
                className="map-banner__close"
                onClick={() => setSelectedId(null)}
                aria-label="Close building info"
              >
                <CloseIcon aria-hidden="true" width={18} height={18} />
              </button>
              <span className="map-banner__tag">{selected.college}</span>
              <p className="map-banner__title">{selected.name}</p>
              <p className="map-banner__meta">{selected.address}</p>
              <p className="map-banner__body">{selected.description}</p>
              <a
                className="button"
                href={directionsUrl(selected)}
                target="_blank"
                rel="noreferrer"
              >
                Directions
                <ArrowRightIcon aria-hidden="true" />
              </a>
            </div>
          )}
        </div>
      )}

      <section aria-labelledby="buildings-heading" className="flow" data-flow="s">
        <h2 id="buildings-heading">Colleges &amp; buildings</h2>
        <ul className="flow" data-flow="s" role="list">
          {BUILDINGS.map((b) => {
            const isSelected = b.id === selectedId;
            return (
              <li key={b.id}>
                <div
                  className="building-item"
                  data-selected={isSelected ? '' : undefined}
                >
                  <button
                    type="button"
                    ref={(el) => {
                      if (el) itemRefs.current.set(b.id, el);
                      else itemRefs.current.delete(b.id);
                    }}
                    className="building-item__toggle flow"
                    data-flow="2xs"
                    aria-pressed={isSelected}
                    aria-expanded={isSelected}
                    aria-controls={`building-detail-${b.id}`}
                    onClick={() => setSelectedId(isSelected ? null : b.id)}
                  >
                    <span className="step--1 event__meta">{b.college}</span>
                    <span className="building-item__name">{b.name}</span>
                    <span className="event__meta">{b.address}</span>
                  </button>
                  {isSelected && (
                    <div
                      id={`building-detail-${b.id}`}
                      className="building-item__detail flow"
                      data-flow="s"
                    >
                      <p>{b.description}</p>
                      <a
                        className="button"
                        href={directionsUrl(b)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Directions
                        <ArrowRightIcon aria-hidden="true" />
                      </a>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <div
        className="visually-hidden"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {selected ? `Selected ${selected.name}` : ''}
      </div>
    </article>
  );
}
