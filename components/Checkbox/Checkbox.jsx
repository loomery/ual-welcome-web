'use client';

import { useId } from 'react';

/**
 * UAL DS-styled accessible checkbox.
 * Wraps a real <input type="checkbox"> — no ARIA role hacks, full keyboard + SR support.
 * Label is programmatically associated via id/htmlFor.
 *
 * Keyboard:
 *  - Space toggles (native HTML behaviour)
 *  - Enter also toggles (added for UX — many keyboard users expect it
 *    and it's recommended in most design-system patterns)
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.label
 * @param {import('react').ReactNode} [props.hint]
 * @param {string} [props.id]
 */
export function Checkbox({ label, hint, id, onKeyDown, ...rest }) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const hintId = hint ? `${inputId}-hint` : undefined;

  const handleKeyDown = (e) => {
    // Native checkboxes ignore Enter; we synthesise a click so the
    // checked state flips AND the change event fires exactly once,
    // carrying the correct `checked` value to React's onChange.
    if (e.key === 'Enter' && !e.repeat) {
      e.preventDefault();
      e.currentTarget.click();
    }
    onKeyDown?.(e);
  };

  return (
    <label className="checkbox" htmlFor={inputId}>
      <input
        id={inputId}
        type="checkbox"
        className="checkbox__input"
        aria-describedby={hintId}
        onKeyDown={handleKeyDown}
        {...rest}
      />
      <span className="flow" data-flow="3xs">
        <span className="checkbox__label">{label}</span>
        {hint && (
          <span id={hintId} className="event__meta">
            {hint}
          </span>
        )}
      </span>
    </label>
  );
}
