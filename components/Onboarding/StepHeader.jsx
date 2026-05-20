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
    <div className="flow py-s" data-flow="2xs">
      {eyebrow && <p className="onboarding-eyebrow">{eyebrow}</p>}
      <h1 ref={headingRef} tabIndex={-1} style={{ outline: 'none' }}>
        {title}
      </h1>
      {body && <p className="standfirst">{body}</p>}
    </div>
  );
}
