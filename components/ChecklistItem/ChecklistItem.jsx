'use client';

import { useId } from 'react';
import { Checkbox } from '../Checkbox/Checkbox';
import { ExternalLinkIcon } from '../Icon/NavIcons';

/**
 * One row in the induction checklist. Composes the existing accessible
 * Checkbox with a richer body + external CTA + optional dependency hint.
 *
 * Why a wrapper instead of expanding Checkbox? Keeping Checkbox dumb
 * preserves its reuse value (it's already used by the feedback dialog
 * and could be reused elsewhere). The richer composition lives here.
 *
 * Accessibility:
 *  - The checkbox label remains the item title — screen readers
 *    announce just that when toggling, which is the right primary
 *    action. Body + CTA are siblings under the row, not nested in the
 *    label, so the announce stays short.
 *  - When `dependsOnLabel` is set, we render an aria-describedby hint
 *    so SR users hear the prerequisite alongside the title.
 *  - External CTA uses rel="noreferrer" + visually-hidden "(opens in
 *    new tab)" — see WCAG 3.2.5 (Change on Request).
 *
 * @param {Object} props
 * @param {import('../../data/checklist').ChecklistItem} props.item
 * @param {boolean} props.checked
 * @param {() => void} props.onToggle
 * @param {boolean} [props.blocked]            True when dependsOn parent is not yet checked.
 * @param {string}  [props.dependsOnLabel]     Title of the parent task, for the hint.
 */
export function ChecklistItem({ item, checked, onToggle, blocked, dependsOnLabel }) {
  const rowId = useId();
  const hintId = `${rowId}-hint`;
  const blockedHintId = `${rowId}-blocked`;

  return (
    <div
      className="checklist-item flow"
      data-flow="2xs"
      data-checked={checked ? '' : undefined}
      data-blocked={blocked ? '' : undefined}
    >
      <Checkbox
        id={rowId}
        checked={checked}
        onChange={onToggle}
        label={item.title}
        aria-describedby={[hintId, blocked ? blockedHintId : null].filter(Boolean).join(' ')}
      />

      <div className="checklist-item__detail flow" data-flow="2xs">
        <p id={hintId} className="checklist-item__body">
          {item.body}
        </p>

        {blocked && dependsOnLabel && (
          <p id={blockedHintId} className="checklist-item__blocked-hint">
            <span aria-hidden="true">↑</span> Complete <strong>{dependsOnLabel}</strong> first.
          </p>
        )}

        <a
          href={item.cta.href}
          className="checklist-item__cta"
          target="_blank"
          rel="noreferrer"
        >
          {item.cta.label}
          <ExternalLinkIcon aria-hidden="true" width={16} height={16} />
          <span className="visually-hidden"> (opens in new tab)</span>
        </a>
      </div>
    </div>
  );
}
