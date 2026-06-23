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
    <label
      htmlFor={inputId}
      className="grid min-h-11 cursor-pointer grid-cols-[auto_1fr] items-start gap-s py-xs"
    >
      <input
        id={inputId}
        type="checkbox"
        className="peer m-0 grid size-6 shrink-0 cursor-pointer appearance-none place-content-center border-2 border-ual-dark bg-ual-light outline-offset-2 before:size-4 before:scale-0 before:bg-ual-light before:transition-transform before:duration-100 before:ease-in-out before:content-[''] before:[clip-path:polygon(14%_44%,0_65%,50%_100%,100%_16%,80%_0%,43%_62%)] checked:bg-ual-dark checked:before:scale-100 focus-visible:outline-2 focus-visible:outline-ual-orange"
        aria-describedby={hintId}
        onKeyDown={handleKeyDown}
        {...rest}
      />
      <span className="flex flex-col gap-3xs">
        <span className="text-step-0/ual-default peer-checked:text-ual-medium peer-checked:line-through">
          {label}
        </span>
        {hint && (
          <span id={hintId} className="text-step-d1 text-ual-medium">
            {hint}
          </span>
        )}
      </span>
    </label>
  );
}
