import { StepHeader } from '../StepHeader';

/**
 * Step 2 — ask for the student's first name.
 * Submits on Enter via the wrapping form so keyboard users can advance
 * without reaching the "Continue" button.
 *
 * @param {Object} props
 * @param {{ current: HTMLHeadingElement | null }} props.headingRef
 * @param {string} props.value
 * @param {(value: string) => void} props.onChange
 * @param {() => void} props.onSubmit  Called when the form is submitted with a valid name.
 */
export function NameStep({ headingRef, value, onChange, onSubmit }) {
  return (
    <div className="flow" data-flow="m">
      <StepHeader
        headingRef={headingRef}
        title="What should we call you?"
        body="We'll use it to greet you"
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (value.trim().length >= 1) onSubmit();
        }}
      >
        <label className="visually-hidden" htmlFor="onboarding-name">
          Your first name
        </label>
        <input
          id="onboarding-name"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="given-name"
          autoFocus
          maxLength={40}
          placeholder="Your first name"
          className="onboarding-input"
        />
      </form>
    </div>
  );
}
