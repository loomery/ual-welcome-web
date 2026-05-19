'use client';

import { useEffect, useId, useRef, useState } from 'react';

/**
 * Multi-select campus dropdown — used on /events to narrow the list to
 * specific colleges. Sits next to the category filter buttons.
 *
 * Markup choice: the panel is a `role="group"` with `<label>`-wrapped
 * checkboxes (one per campus). We deliberately don't use `<ul><li>`
 * here — the `.prose li` rule on the parent EventsScreen would force
 * list markers onto each row, and the listbox/option ARIA pattern
 * doesn't pair cleanly with native checkboxes. The checkboxes are the
 * multi-select mechanism, so a flat group of labels reads correctly to
 * screen readers without extra ceremony.
 *
 * Behaviour:
 *   - Trigger button styled to match the existing `.button` family.
 *     Ghost variant when no campuses are selected; filled when one or
 *     more are. Label shifts from "Campus" to "Campus (N)".
 *   - Clicking the trigger toggles the popover.
 *   - The popover closes on outside click and on Escape; Escape returns
 *     focus to the trigger.
 *   - "Clear all" link at the bottom resets to none.
 *
 * @param {Object} props
 * @param {Array<{ id: string, name: string, short: string }>} props.campuses
 * @param {string[]} props.selected   Array of campus `name`s (not ids)
 * @param {(next: string[]) => void} props.onChange
 */
export function CampusFilter({ campuses, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(/** @type {HTMLDivElement|null} */ (null));
  const triggerRef = useRef(/** @type {HTMLButtonElement|null} */ (null));
  const panelId = useId();

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e) {
      if (!wrapperRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  // Close on Escape — return focus to the trigger so keyboard users
  // don't lose their place.
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus({ preventScroll: true });
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  function toggleCampus(name) {
    onChange(selected.includes(name) ? selected.filter((c) => c !== name) : [...selected, name]);
  }

  const count = selected.length;
  const label = count === 0 ? 'Campus' : `Campus (${count})`;
  const isFilled = count > 0;

  return (
    <div className="campus-filter" ref={wrapperRef}>
      <button
        ref={triggerRef}
        type="button"
        className="button campus-filter__trigger"
        data-ghost-button={isFilled ? undefined : ''}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <ChevronDownIcon aria-hidden="true" data-open={open || undefined} />
      </button>

      {open && (
        <div
          id={panelId}
          role="group"
          aria-label="Filter events by campus"
          className="campus-filter__panel"
        >
          <div className="campus-filter__options">
            {campuses.map((c) => {
              const isChecked = selected.includes(c.name);
              return (
                <label key={c.id} className="campus-filter__option">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCampus(c.name)}
                    className="campus-filter__checkbox"
                  />
                  <span className="campus-filter__option-text">{c.name}</span>
                </label>
              );
            })}
          </div>
          {count > 0 && (
            <button type="button" className="campus-filter__clear" onClick={() => onChange([])}>
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Inline chevron — `data-open` rotates 180° via CSS so the trigger
 * gives a clear "open/closed" affordance.
 */
function ChevronDownIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      {...props}
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
