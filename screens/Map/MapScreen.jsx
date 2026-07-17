'use client';

import { useEffect, useMemo, useState } from 'react';
import { BUILDINGS } from '../../data/buildings';
import { directionsUrl } from '../../utils/directions';
import { useOnboardingProfile } from '../../hooks/useOnboardingProfile';
import {
  ArrowRightIcon,
  ChevronDownIcon,
  CloseIcon,
  ExternalLinkIcon,
  NationalRailIcon,
  UndergroundIcon,
} from '../../components/Icon/NavIcons';
import { asset } from '../../utils/asset';

/** Placeholder floor plans shown for colleges without real plans yet. */
const FLOOR_PLAN = asset('/images/floorplan-placeholder.svg');
const PLACEHOLDER_PLANS = [
  { id: 'ground', label: 'Ground floor' },
  { id: 'first', label: 'First floor' },
  { id: 'second', label: 'Second floor' },
];

/**
 * A single floor-plan image. Real plans ship a portrait (mobile) and a landscape
 * (desktop) variant, swapped via <picture>; colleges without plans fall back to
 * the placeholder SVG. Plans are dark-on-white, so the container stays white in
 * dark mode to keep them legible.
 *
 * @param {{ plan: object, hasImages: boolean, alt: string, className: string }} props
 */
function PlanGraphic({ plan, hasImages, alt, className }) {
  if (!hasImages) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={FLOOR_PLAN} alt={alt} className={className} />;
  }
  // Single-image plans use one PNG for all screen sizes; multi-image plans
  // ship separate portrait/landscape crops swapped via <picture>.
  if (plan.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={asset(plan.image)} alt={alt} className={className} />;
  }
  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={asset(plan.desktop)} />
      <img src={asset(plan.mobile)} alt={alt} className={className} />
    </picture>
  );
}

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
 * "Getting around" — your college's address and directions, a floor-plan
 * gallery (large plan + thumbnails, click to expand) with a compact college
 * picker, transport info and accessibility guidance. Pick a different college
 * from the Floor plan dropdown to see its details.
 */
export function MapScreen() {
  const { profile, hydrated } = useOnboardingProfile();
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

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen]);

  const hasImages = Array.isArray(building.floorPlans) && building.floorPlans.length > 0;
  const plans = hasImages ? building.floorPlans : PLACEHOLDER_PLANS;
  const safeActive = Math.min(activePlan, plans.length - 1);
  const activePlanData = plans[safeActive];
  const activeLabel = activePlanData.label;

  return (
    <article className="flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <h1 className="text-step-4/ual-condensed font-bold tracking-ual-tight text-ual-dark">
          Getting around
        </h1>
        <p className="text-step-1 text-ual-medium">
          Key services, building information, and how to get to college.
        </p>
      </header>

      <section className="flex flex-col gap-2" aria-labelledby="address-heading">
        <h2 id="address-heading" className="text-step-2 font-bold tracking-ual-tight text-ual-dark">
          Address
        </h2>
        <p className="text-step-1 font-bold text-ual-dark">{building.name}</p>
        <p className="text-step-d1 text-ual-medium">{building.address}</p>
        <p className="mt-2 text-step-d1 font-bold text-ual-dark">Get directions</p>
        <div className="flex flex-wrap gap-6">
          <DirectionLink href={directionsUrl(building)} label="Google maps" />
          <DirectionLink href={citymapperUrl(building)} label="Citymapper" />
          <DirectionLink href={appleMapsUrl(building)} label="Apple maps" />
        </div>
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="floorplan-heading">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2
            id="floorplan-heading"
            className="text-step-2 font-bold tracking-ual-tight text-ual-dark"
          >
            Floor plan
          </h2>
          {hydrated && (
            <div className="group relative">
              <label className="sr-only" htmlFor="college-select">
                Choose a college
              </label>
              <select
                id="college-select"
                value={collegeId}
                onChange={(e) => handleSelectCollege(e.target.value)}
                className="w-full cursor-pointer appearance-none bg-ual-dark py-2 pr-10 pl-4 text-step-d1 font-bold text-ual-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange"
              >
                {BUILDINGS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              <ChevronDownIcon
                width={18}
                height={18}
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ual-light transition-transform duration-200 group-focus-within:rotate-180"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-stretch">
          <div className="md:relative md:w-64 md:shrink-0">
            <ul
              role="list"
              className="flex max-h-64 flex-col gap-1 overflow-y-auto md:absolute md:inset-0 md:max-h-none md:w-auto"
            >
              {plans.map((plan, i) => {
                const selected = i === safeActive;
                return (
                  <li key={plan.id}>
                    <button
                      type="button"
                      onClick={() => setActivePlan(i)}
                      aria-pressed={selected}
                      aria-label={`Show ${plan.label} plan`}
                      className={[
                        'flex w-full items-center gap-3 p-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange',
                        selected ? 'bg-ual-shade' : 'hover:bg-ual-shade',
                      ].join(' ')}
                    >
                      <span
                        className={[
                          'aspect-4/3 w-20 shrink-0 overflow-hidden bg-ual-light',
                          selected ? 'outline-2 outline-ual-dark' : 'opacity-70',
                        ].join(' ')}
                      >
                        <PlanGraphic
                          plan={plan}
                          hasImages={hasImages}
                          alt=""
                          className="size-full object-contain"
                        />
                      </span>
                      <span className="text-step-d1 font-bold text-ual-dark">{plan.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label={`Expand ${activeLabel} plan`}
            className="aspect-3/4 w-full shrink-0 cursor-zoom-in overflow-hidden bg-ual-light p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange md:aspect-3/2 md:flex-1"
          >
            <PlanGraphic
              plan={activePlanData}
              hasImages={hasImages}
              alt={`${building.name} — ${activeLabel} plan`}
              className="size-full object-contain"
            />
          </button>
        </div>
      </section>

      {building.transport && (
        <section className="flex flex-col gap-6" aria-labelledby="transport-heading">
          <h2
            id="transport-heading"
            className="text-step-2 font-bold tracking-ual-tight text-ual-dark"
          >
            Transport
          </h2>

          <div className="flex flex-col gap-4">
            <h3 className="text-step-1 tracking-ual-tight text-ual-dark">Public transport</h3>
            <div className="grid gap-8 md:grid-cols-2">
              <TransportTable
                title="Train, underground and overground"
                header="Closest station"
                stops={building.transport.stations}
              />
              <TransportTable
                title="Buses"
                header="Closest bus"
                stops={building.transport.buses.slice(0, 4)}
              />
            </div>
          </div>

          {building.transport.taxi && (
            <div className="flex flex-col gap-2">
              <h3 className="text-step-1 tracking-ual-tight text-ual-dark">Taxi drop-off</h3>
              <p className="max-w-200 text-step-d1 text-ual-medium">{building.transport.taxi}</p>
            </div>
          )}

          {building.transport.parking && (
            <div className="flex flex-col gap-2">
              <h3 className="text-step-1 tracking-ual-tight text-ual-dark">Accessible parking</h3>
              <p className="max-w-200 text-step-d1 text-ual-medium">{building.transport.parking}</p>
            </div>
          )}
        </section>
      )}

      {building.transport?.accessibilityNote && (
        <section className="flex flex-col gap-2" aria-labelledby="accessibility-heading">
          <h2
            id="accessibility-heading"
            className="text-step-2 font-bold tracking-ual-tight text-ual-dark"
          >
            Accessibility
          </h2>
          <p className="max-w-200 text-step-d1 text-ual-medium">
            {building.transport.accessibilityNote.replace(/on AccessAble\.?$/, '')}
            <a
              href={building.transport.accessibilityUrl}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-ual-dark underline underline-offset-2 hover:text-ual-orange"
            >
              AccessAble
            </a>
            .<span className="sr-only"> (opens in a new tab)</span>
          </p>
        </section>
      )}

      {building.areaUrl && (
        <a
          href={building.areaUrl}
          target="_blank"
          rel="noreferrer"
          className="group flex w-full max-w-200 items-center justify-between gap-4 bg-ual-dark p-8 text-step-2 font-bold tracking-ual-tight text-ual-light no-underline transition-colors hover:text-ual-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange [&>svg]:size-8"
        >
          Read more about your college area
          <ArrowRightIcon aria-hidden="true" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      )}

      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${building.name} — ${activeLabel} plan`}
          className="fixed inset-0 z-400 flex items-center justify-center bg-ual-dark/90 p-6"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close floor plan"
            className="absolute top-6 right-6 flex size-11 items-center justify-center bg-ual-light text-ual-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange"
          >
            <CloseIcon aria-hidden="true" width={22} height={22} />
          </button>
          <div
            className="max-h-full w-full max-w-grid bg-ual-light p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <PlanGraphic
              plan={activePlanData}
              hasImages={hasImages}
              alt={`${building.name} — ${activeLabel} plan`}
              className="mx-auto max-h-[85vh] w-auto object-contain"
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
      className="inline-flex items-center gap-1.5 text-step-d1 font-bold text-ual-dark underline underline-offset-2 hover:text-ual-orange [&>svg]:size-4"
    >
      {label}
      <ExternalLinkIcon aria-hidden="true" />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

/**
 * @param {{ title: string, header: string, stops: import('../../data/buildings').TransportStop[] }} props
 */
function TransportTable({ title, header, stops }) {
  const hasModes = stops.some((s) => s.modes?.length);
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-step-d1 font-bold text-ual-dark">{title}</h4>
      <table className="w-full border-collapse text-step-d1">
        <thead>
          <tr className="border-b border-ual-dark/15 text-ual-medium">
            <th scope="col" className="py-2 text-left font-ual-normal">
              {header}
            </th>
            {hasModes && <th aria-hidden="true" className="w-14" />}
            <th scope="col" className="py-2 text-right font-ual-normal">
              Distance to uni
            </th>
          </tr>
        </thead>
        <tbody>
          {stops.map((stop) => (
            <tr key={stop.name} className="border-b border-ual-dark/15">
              <td className="py-2 text-ual-dark">{stop.name}</td>
              {hasModes && (
                <td className="py-2">
                  <span className="flex items-center gap-1.5 text-ual-dark [&>svg]:size-4">
                    {stop.modes?.includes('rail') && (
                      <NationalRailIcon aria-label="National Rail" role="img" />
                    )}
                    {stop.modes?.includes('tube') && (
                      <UndergroundIcon aria-label="London Underground" role="img" />
                    )}
                  </span>
                </td>
              )}
              <td className="py-2 text-right text-ual-medium">{stop.walk}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
