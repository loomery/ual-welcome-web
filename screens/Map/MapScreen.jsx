'use client';

import { useEffect, useMemo, useState } from 'react';
import { BUILDINGS } from '../../data/buildings';
import { directionsUrl } from '../../utils/directions';
import { useOnboardingProfile } from '../../hooks/useOnboardingProfile';
import { CloseIcon } from '../../components/Icon/NavIcons';
import { asset } from '../../utils/asset';

/** Placeholder floor plans shown for every college until real plans land. */
const FLOOR_PLAN = asset('/images/floorplan-placeholder.svg');
const FLOOR_PLANS = [
  { id: 'ground', label: 'Ground floor' },
  { id: 'first', label: 'First floor' },
  { id: 'second', label: 'Second floor' },
];

/** @param {import('../../data/buildings').Building} b */
function citymapperUrl(b) {
  // Citymapper web URL — endcoord must use a literal comma (not %2C).
  if (b.geo) {
    return `https://citymapper.com/directions?endcoord=${b.geo.lat},${b.geo.lng}&endname=${encodeURIComponent(b.name)}`;
  }
  return `https://citymapper.com/directions?endaddress=${encodeURIComponent(b.address)}`;
}

/** @param {import('../../data/buildings').Building} b */
function appleMapsUrl(b) {
  return b.geo
    ? `https://maps.apple.com/?ll=${b.geo.lat},${b.geo.lng}&q=${encodeURIComponent(b.name)}`
    : `https://maps.apple.com/?q=${encodeURIComponent(b.address)}`;
}

/**
 * "Find your campus" — pick a college, browse its floor plans in an
 * Amazon-style gallery (large plan + thumbnails, click to expand), and read
 * its address, transport and accessibility info. Replaces the old 3D scene.
 */
export function MapScreen() {
  const { profile } = useOnboardingProfile();
  // `override` is set only when the student picks a college from the dropdown;
  // otherwise we follow their profile college (or the first building). Deriving
  // the active id this way avoids syncing profile → state inside an effect.
  const [override, setOverride] = useState(/** @type {string | null} */ (null));
  const [activePlan, setActivePlan] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const profileCollegeId = BUILDINGS.some((b) => b.id === profile?.collegeId)
    ? profile.collegeId
    : null;
  const collegeId = override ?? profileCollegeId ?? BUILDINGS[0].id;

  const building = useMemo(
    () => BUILDINGS.find((b) => b.id === collegeId) ?? BUILDINGS[0],
    [collegeId],
  );

  function handleSelectCollege(id) {
    setOverride(id);
    setActivePlan(0);
    setLightboxOpen(false);
  }

  // Close the lightbox on Escape.
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen]);

  const activeLabel = FLOOR_PLANS[activePlan].label;
  // Some campuses ship a real PDF map; when present we embed it instead of the
  // placeholder per-floor gallery.
  const floorPlanPdf = building.floorPlan ? asset(building.floorPlan) : null;

  return (
    <article className="flex flex-col gap-l">
      <header className="flex flex-col gap-xs">
        <h1 className="text-step-4/ual-condensed font-bold tracking-ual-tight text-ual-dark dark:text-ual-light">
          Find your campus
        </h1>
        <p className="text-step-1 text-ual-medium">
          Key services, building information, and how to get to campus
        </p>
      </header>

      {/* ── COLLEGE SELECTOR ─────────────────────────────────────────── */}
      <section className="flex flex-col gap-s" aria-labelledby="campus-heading">
        <h2
          id="campus-heading"
          className="text-step-2 font-bold tracking-ual-tight text-ual-dark dark:text-ual-light"
        >
          Your campus
        </h2>
        <label className="flex flex-col gap-2xs">
          <span className="sr-only">Choose a college</span>
          <select
            value={collegeId}
            onChange={(e) => handleSelectCollege(e.target.value)}
            className="w-full appearance-none bg-ual-dark px-m py-s text-step-1 font-bold text-ual-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange dark:bg-ual-light dark:text-ual-dark"
          >
            {BUILDINGS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </label>
      </section>

      {/* ── FLOOR-PLAN GALLERY ───────────────────────────────────────── */}
      <section className="flex flex-col gap-s" aria-label={`${building.name} campus map`}>
        {floorPlanPdf ? (
          <>
            <iframe
              src={floorPlanPdf}
              title={`${building.name} campus map`}
              className="aspect-4/3 w-full bg-ual-shade dark:bg-ual-dark-95"
            />
            <a
              href={floorPlanPdf}
              target="_blank"
              rel="noreferrer"
              className="w-fit text-step-d1 font-bold text-ual-dark underline underline-offset-2 hover:text-ual-orange dark:text-ual-light"
            >
              Open campus map (PDF)
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-s md:flex-row-reverse md:items-start">
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label={`Expand ${activeLabel} plan`}
                className="aspect-4/3 w-full grow cursor-zoom-in overflow-hidden bg-ual-shade focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange dark:bg-ual-dark-95"
              >
                {/* Plain <img>: static export + dummy placeholder SVG — no next/image. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={FLOOR_PLAN}
                  alt={`${building.name} — ${activeLabel} plan`}
                  className="size-full object-contain"
                />
              </button>

              <ul role="list" className="flex gap-2xs md:w-30 md:shrink-0 md:flex-col">
                {FLOOR_PLANS.map((plan, i) => {
                  const selected = i === activePlan;
                  return (
                    <li key={plan.id} className="grow md:grow-0">
                      <button
                        type="button"
                        onClick={() => setActivePlan(i)}
                        aria-pressed={selected}
                        aria-label={`Show ${plan.label} plan`}
                        className={[
                          'aspect-4/3 w-full cursor-pointer overflow-hidden bg-ual-shade focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange dark:bg-ual-dark-95',
                          selected
                            ? 'outline-2 outline-ual-dark dark:outline-ual-light'
                            : 'opacity-70 hover:opacity-100',
                        ].join(' ')}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={FLOOR_PLAN} alt="" className="size-full object-contain" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            <p className="text-step-d1 text-ual-medium">{activeLabel}</p>
          </>
        )}
      </section>

      {/* ── ADDRESS ──────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-2xs" aria-labelledby="address-heading">
        <h2
          id="address-heading"
          className="text-step-2 font-bold tracking-ual-tight text-ual-dark dark:text-ual-light"
        >
          Address
        </h2>
        <p className="text-step-1 font-bold text-ual-dark dark:text-ual-light">{building.name}</p>
        <p className="text-step-d1 text-ual-medium">{building.address}</p>
        <p className="mt-2xs text-step-d1 font-bold text-ual-dark dark:text-ual-light">
          Get directions to campus
        </p>
        <div className="flex flex-wrap gap-l">
          <DirectionLink href={citymapperUrl(building)} label="Citymapper" />
          <DirectionLink href={appleMapsUrl(building)} label="Apple maps" />
          <DirectionLink href={directionsUrl(building)} label="Google maps" />
        </div>
      </section>

      {/* ── TRANSPORT ────────────────────────────────────────────────── */}
      {building.transport && (
        <section className="flex flex-col gap-s" aria-labelledby="transport-heading">
          <h2
            id="transport-heading"
            className="text-step-2 font-bold tracking-ual-tight text-ual-dark dark:text-ual-light"
          >
            Transport
          </h2>
          <div className="grid gap-m md:grid-cols-2">
            <TransportTable
              caption="Closest stations"
              distanceHeader="Distance to uni"
              stops={building.transport.stations}
            />
            <TransportTable
              caption="Closest buses"
              distanceHeader="Distance to uni"
              stops={building.transport.buses.slice(0, 4)}
            />
          </div>
        </section>
      )}

      {/* ── ACCESSIBILITY ────────────────────────────────────────────── */}
      {building.transport?.accessibilityNote && (
        <section className="flex flex-col gap-2xs" aria-labelledby="accessibility-heading">
          <h2
            id="accessibility-heading"
            className="text-step-2 font-bold tracking-ual-tight text-ual-dark dark:text-ual-light"
          >
            Accessibility
          </h2>
          <p className="text-step-d1 text-ual-medium">
            {building.transport.accessibilityNote.replace(/on AccessAble\.?$/, '')}
            <a
              href={building.transport.accessibilityUrl}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-ual-dark underline underline-offset-2 hover:text-ual-orange dark:text-ual-light"
            >
              AccessAble
            </a>
            .<span className="sr-only"> (opens in a new tab)</span>
          </p>
        </section>
      )}

      {/* ── LIGHTBOX ─────────────────────────────────────────────────── */}
      {!floorPlanPdf && lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${building.name} — ${activeLabel} plan`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ual-dark/90 p-m"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close floor plan"
            className="absolute top-m right-m flex size-11 items-center justify-center bg-ual-light text-ual-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange"
          >
            <CloseIcon aria-hidden="true" width={22} height={22} />
          </button>
          <div className="aspect-4/3 w-full max-w-grid" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={FLOOR_PLAN}
              alt={`${building.name} — ${activeLabel} plan`}
              className="size-full object-contain"
            />
          </div>
        </div>
      )}
    </article>
  );
}

/**
 * @param {{ href: string, label: string }} props
 */
function DirectionLink({ href, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-step-d1 font-bold text-ual-dark underline underline-offset-2 hover:text-ual-orange dark:text-ual-light"
    >
      {label}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

/**
 * @param {{ caption: string, distanceHeader: string, stops: import('../../data/buildings').TransportStop[] }} props
 */
function TransportTable({ caption, distanceHeader, stops }) {
  return (
    <table className="w-full border-collapse text-step-d1">
      <caption className="mb-2xs text-left font-bold text-ual-dark dark:text-ual-light">
        {caption}
      </caption>
      <thead className="sr-only">
        <tr>
          <th scope="col">{caption}</th>
          <th scope="col">{distanceHeader}</th>
        </tr>
      </thead>
      <tbody>
        {stops.map((stop) => (
          <tr key={stop.name} className="border-b border-ual-dark/10 dark:border-ual-light/15">
            <td className="py-2xs text-ual-dark dark:text-ual-light">{stop.name}</td>
            <td className="py-2xs text-right text-ual-medium">{stop.walk}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
