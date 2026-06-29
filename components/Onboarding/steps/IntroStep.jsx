import { Button } from '../../Button/Button';
import { ArrowRightIcon } from '../../Icon/NavIcons';
import { asset } from '../../../utils/asset';

const BENEFITS = [
  'View what you need to do to prep for your first week',
  'Find key info, support and services for your college',
  'See upcoming social and creative events happening at your college',
];

/**
 *
 * @param {Object} props
 * @param {{ current: HTMLHeadingElement | null }} props.headingRef
 * @param {boolean} props.hasExistingProfile
 * @param {() => void} props.onResume            Open the hub (already set up).
 * @param {() => void} props.onStartOver         Wipe the draft and restart.
 * @param {() => void} props.onNewStudent        Begin the questionnaire.
 * @param {() => void} props.onReturningStudent  Skip setup, go to the hub.
 */
export function IntroStep({
  headingRef,
  hasExistingProfile,
  onResume,
  onStartOver,
  onNewStudent,
  onReturningStudent,
}) {
  return (
    <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
      <div className="md:order-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset('/images/onboarding-intro.png')}
          alt=""
          width={634}
          height={633}
          className="aspect-square w-full bg-ual-shade object-cover"
        />
      </div>

      <div className="space-y-6 md:order-2">
        <div className="space-y-2">
          <h1 ref={headingRef} tabIndex={-1} className="outline-none">
            Let&apos;s get you ready for term
          </h1>
          <p className="text-step-1 text-ual-medium">
            Everything you need to access before term in one place
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-step-0 text-ual-dark">
            Answer a few questions to see content you&apos;re interested in
          </p>
          <ul className="list-disc space-y-2 ps-5 text-step-0 text-ual-dark">
            {BENEFITS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        {hasExistingProfile ? (
          <div className="space-y-2 border-s-4 border-ual-orange bg-ual-shade p-4">
            <p className="text-step-d1 text-ual-medium">You&apos;ve already set up your hub.</p>
            <div className="flex flex-wrap gap-2">
              <Button onClick={onResume}>Open my hub</Button>
              <Button variant="ghost" onClick={onStartOver}>
                Start over
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 md:flex-row">
            <Button className="min-w-[18rem] justify-between" onClick={onNewStudent}>
              I&apos;m a new student
              <ArrowRightIcon aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              className="min-w-[18rem] justify-between"
              onClick={onReturningStudent}
            >
              I&apos;m a returning student
              <ArrowRightIcon aria-hidden="true" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
