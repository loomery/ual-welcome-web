'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '../Button/Button';
import { LinkButton } from '../Button/LinkButton';
import { ChevronDownIcon } from '../Icon/NavIcons';

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
    <div className="relative" ref={wrapperRef}>
      <Button
        ref={triggerRef}
        variant={isFilled ? 'solid' : 'ghost'}
        className="[&>svg]:transition-transform [&>svg]:duration-150"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <ChevronDownIcon aria-hidden="true" className={open ? 'rotate-180' : undefined} />
      </Button>

      {open && (
        <div
          id={panelId}
          role="group"
          aria-label="Filter events by campus"
          className="absolute top-[calc(100%+var(--space-2xs))] left-0 z-20 flex min-w-72 flex-col gap-2 border-2 border-ual-dark bg-ual-light p-4 text-ual-dark max-[30rem]:right-0 max-[30rem]:left-auto"
        >
          <div className="flex flex-col gap-1">
            {campuses.map((c) => {
              const isChecked = selected.includes(c.name);
              return (
                <label
                  key={c.id}
                  className="flex cursor-pointer items-center gap-2 py-1 text-step-d1 hover:text-ual-orange"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCampus(c.name)}
                    onKeyDown={(e) => {
                      // Native checkboxes respond to Space but not Enter.
                      // Map Enter → toggle so keyboard users can select
                      // with either key (matches ARIA checkbox pattern).
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        toggleCampus(c.name);
                      }
                    }}
                    className="size-4 flex-none cursor-pointer accent-ual-dark"
                  />
                  <span>{c.name}</span>
                </label>
              );
            })}
          </div>
          {count > 0 && (
            <LinkButton
              className="mt-2 self-start text-step-d1 font-ual-bold"
              onClick={() => onChange([])}
            >
              Clear all
            </LinkButton>
          )}
        </div>
      )}
    </div>
  );
}
