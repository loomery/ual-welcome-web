/**
 * Header block shared by all question steps in the onboarding flow.
 * Receives a ref so the parent can move focus to the heading on each
 * step transition.
 *
 * @param {Object} props
 * @param {{ current: HTMLHeadingElement | null }} props.headingRef
 * @param {string} [props.eyebrow]  Optional orange uppercase label above the title.
 * @param {string} props.title
 * @param {string} [props.body]     Optional standfirst paragraph below the title.
 */
export function StepHeader({ headingRef, eyebrow, title, body }) {
  return (
    <div className="space-y-2xs py-s">
      {eyebrow && (
        <p className="mb-2xs text-step-d1 font-ual-bold tracking-[0.06em] text-ual-orange uppercase">
          {eyebrow}
        </p>
      )}
      <h1 ref={headingRef} tabIndex={-1} className="outline-none">
        {title}
      </h1>
      {body && <p className="text-step-1 text-ual-medium">{body}</p>}
    </div>
  );
}
