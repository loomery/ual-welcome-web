import { Button } from '../../Button/Button';
import { ArrowRightIcon, SuccessIcon } from '../../Icon/NavIcons';

/**
 * Final step — confirms the profile is saved and offers the two Figma
 * actions: open the home page, or edit the profile.
 *
 * @param {Object} props
 * @param {{ current: HTMLHeadingElement | null }} props.headingRef
 * @param {() => void} props.onHome         Commit + go to the home page.
 * @param {() => void} props.onEditProfile  Commit + go to the profile page.
 */
export function FinishStep({ headingRef, onHome, onEditProfile }) {
  return (
    <div className="flex flex-col gap-6">
      <SuccessIcon className="size-16 text-ual-util-green" aria-hidden="true" />

      <div className="space-y-3">
        <h1 ref={headingRef} tabIndex={-1} className="outline-none">
          You&apos;re all set
        </h1>
        <p className="text-step-1 text-ual-medium">
          Your home page has been updated to show you content that&apos;s most relevant to you
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <Button
          weight="normal"
          className="w-full justify-between whitespace-nowrap md:w-auto md:min-w-[18rem]"
          onClick={onHome}
        >
          Take me to the home page
          <ArrowRightIcon aria-hidden="true" />
        </Button>
        <Button variant="outline" weight="normal" className="w-full md:w-auto" onClick={onEditProfile}>
          Edit profile
        </Button>
      </div>
    </div>
  );
}
