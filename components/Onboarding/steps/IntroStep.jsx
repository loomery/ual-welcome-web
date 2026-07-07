import { Button } from '../../Button/Button';
import { ArrowRightIcon } from '../../Icon/NavIcons';
import { asset } from '../../../utils/asset';

const BENEFITS = [
  'View what you need to do to prep for your first week',
  'Find key info, support and services for your college',
  'See upcoming social and creative events happening at your college',
];

/**
 * @param {Object} props
 * @param {{ current: HTMLHeadingElement | null }} props.headingRef
 * @param {boolean} props.hasExistingProfile
 * @param {() => void} props.onResume
 * @param {() => void} props.onStartOver
 * @param {() => void} props.onNewStudent
 * @param {() => void} props.onReturningStudent
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

      <div className="flex flex-col gap-8 md:order-2 md:gap-14.5">
        <div className="flex flex-col gap-3 md:gap-7">
          <h1 ref={headingRef} tabIndex={-1} className="outline-none">
            Let&apos;s get you ready for term
          </h1>
          <p className="text-step-1/ual-condensed text-(--color-copy-headings)">
            Everything you need to access before term in one place
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-base/ual-default font-ual-bold text-(--color-copy-headings)">
            Answer a few questions to see content you&apos;re interested in
          </p>
          <ul className="list-disc space-y-2 ps-6 text-base/ual-default text-(--color-copy-headings)">
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
          <div className="flex flex-col gap-4 md:flex-row md:gap-14.5">
            <Button
              weight="normal"
              className="w-full justify-between whitespace-nowrap md:w-auto md:min-w-[18rem]"
              onClick={onNewStudent}
            >
              I&apos;m a new student
              <ArrowRightIcon aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              weight="normal"
              className="w-full justify-between whitespace-nowrap md:w-auto md:min-w-[18rem]"
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
