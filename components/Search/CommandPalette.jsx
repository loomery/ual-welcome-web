'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalSearch } from '../../hooks/useGlobalSearch';
import {
  CalendarIcon,
  ChecklistIcon,
  CloseIcon,
  ExternalLinkIcon,
  HomeIcon,
  MapIcon,
  SearchIcon,
  SupportIcon,
} from '../Icon/NavIcons';

/**
 * A keyboard keycap. Rendered as a flat, square-cornered bordered chip (UAL DDS)
 * so the shortcut hints read as physical keys rather than inline text. `kbd` is
 * italic by default in some UAs, hence `not-italic`.
 *
 * @param {{ children: import('react').ReactNode }} props
 */
function Kbd({ children }) {
  return (
    <kbd className="text-step-d2 inline-flex min-w-6 items-center justify-center border border-ual-dark-90 bg-ual-light px-2xs py-3xs font-ual-bold text-ual-dark not-italic">
      {children}
    </kbd>
  );
}

/** Leading icon per entry type — purely decorative (aria-hidden at use site). */
const TYPE_ICON = {
  page: HomeIcon,
  task: ChecklistIcon,
  support: SupportIcon,
  event: CalendarIcon,
  info: SupportIcon,
  college: MapIcon,
};

/**
 * Bucket the flat, ranked results into display groups while preserving rank
 * order, and return both the grouped structure and a flat list in the exact
 * order they're rendered — so keyboard navigation (over the flat list) always
 * matches what the eye sees.
 *
 * @param {import('../../lib/search/score').SearchResult[]} results
 */
function groupResults(results) {
  /** @type {{ group: string, items: import('../../lib/search/score').SearchResult[] }[]} */
  const groups = [];
  for (const result of results) {
    let bucket = groups.find((g) => g.group === result.entry.group);
    if (!bucket) {
      bucket = { group: result.entry.group, items: [] };
      groups.push(bucket);
    }
    bucket.items.push(result);
  }
  const flat = groups.flatMap((g) => g.items);
  return { groups, flat };
}

/**
 * Global command palette. Built on the native <dialog> element so focus
 * trapping and Escape-to-close come from the user agent; on top of that we
 * implement the WAI-ARIA combobox + listbox pattern (arrow keys move the
 * active option, Enter activates it, aria-activedescendant tracks it).
 *
 * Styling follows the UAL DDS: flat surfaces, square corners, hairline
 * `--color-dark` border (like the feedback dialog), bordered list rows that
 * tint on hover/selection (like the help category list), and orange focus
 * outlines. Colour tokens auto-invert for dark mode — no `dark:` overrides.
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 */
export function CommandPalette({ open, onClose }) {
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();

  const listboxId = useId();
  const optionPrefix = useId();

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const { results, indexSize } = useGlobalSearch(query);
  const { groups, flat } = useMemo(() => groupResults(results), [results]);

  // Sync the native dialog with the `open` prop. showModal() gives us the
  // focus trap + Escape handling for free.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  // Focus the input once the palette opens. Query/selection state resets
  // for free because SearchProvider remounts this component on each open
  // (via a `key`), so there's no setState-in-effect here.
  useEffect(() => {
    if (!open) return;
    // Defer focus to after showModal has moved focus into the dialog.
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  // Mirror user-agent close (Escape / backdrop) back into parent state.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  // Clamp at render so the active option is always in range even if the
  // result set shrank — no effect needed (avoids a cascading re-render).
  const safeIndex = flat.length === 0 ? 0 : Math.min(activeIndex, flat.length - 1);

  /** Navigate to an entry's destination and close the palette. */
  function go(entry) {
    if (!entry) return;
    if (entry.to) {
      router.push(entry.to);
    } else if (entry.href) {
      if (/^https?:/i.test(entry.href)) {
        window.open(entry.href, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = entry.href; // mailto: / tel:
      }
    }
    dialogRef.current?.close();
  }

  function handleKeyDown(e) {
    if (flat.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % flat.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + flat.length) % flat.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      go(flat[safeIndex]?.entry);
    }
  }

  const activeId = flat[safeIndex] ? `${optionPrefix}-${safeIndex}` : undefined;

  return (
    <dialog
      ref={dialogRef}
      aria-label="Search the app"
      onClick={(e) => {
        if (e.target === dialogRef.current) dialogRef.current?.close();
      }}
      className="fixed top-[12vh] left-1/2 m-0 w-[min(36rem,calc(100vw-var(--space-m)))] -translate-x-1/2 overflow-hidden border border-ual-dark bg-ual-light p-0 text-ual-dark backdrop:bg-black/50"
    >
      {/* ── Search input row ─────────────────────────────────────────── */}
      <div className="flex items-center gap-s border-b border-ual-dark-90 px-m">
        <SearchIcon className="size-5 shrink-0 text-ual-medium" aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-controls={listboxId}
          aria-activedescendant={activeId}
          aria-autocomplete="list"
          autoComplete="off"
          spellCheck="false"
          placeholder="Search pages, tasks, support, events…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={handleKeyDown}
          // The global `:focus-visible` outline in globals.css is unlayered, so
          // it beats any Tailwind `outline-none` utility (layered). The input is
          // permanently focused while the palette is open and the dialog already
          // has a visible border + an active-row highlight, so we suppress its
          // own focus ring with an inline style — the only reliable override.
          style={{ outline: 'none' }}
          className="grow bg-transparent py-m text-step-0 text-ual-dark placeholder:text-ual-medium"
        />
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          aria-label="Close search"
          className="grid size-11 shrink-0 place-items-center text-ual-dark hover:bg-ual-dark-90 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ual-orange"
        >
          <CloseIcon className="size-4" aria-hidden="true" />
        </button>
      </div>

      {/* ── Results ──────────────────────────────────────────────────── */}
      <div className="max-h-[min(60vh,28rem)] overflow-y-auto py-xs">
        {flat.length === 0 ? (
          <p className="px-m py-l text-center text-step-d1 text-ual-medium">
            No results for <span className="font-ual-bold">“{query.trim()}”</span>
          </p>
        ) : (
          <ul
            id={listboxId}
            role="listbox"
            aria-label="Search results"
            className="m-0 list-none p-0"
          >
            {groups.map((group) => (
              <li key={group.group} role="presentation">
                <p className="px-m pt-m pb-2xs text-step-d1 font-ual-bold tracking-wider text-ual-medium uppercase">
                  {group.group}
                </p>
                <ul role="presentation" className="m-0 list-none p-0">
                  {group.items.map((result) => {
                    const { entry } = result;
                    const idx = flat.indexOf(result);
                    const active = idx === safeIndex;
                    const Icon = TYPE_ICON[entry.type] ?? HomeIcon;
                    const external = Boolean(entry.href);
                    return (
                      <li
                        key={entry.id}
                        id={`${optionPrefix}-${idx}`}
                        role="option"
                        aria-selected={active}
                        onClick={() => go(entry)}
                        onMouseMove={() => setActiveIndex(idx)}
                        data-active={active ? '' : undefined}
                        className="flex min-h-14 cursor-pointer items-center gap-s px-m py-xs data-active:bg-ual-shade"
                      >
                        <Icon className="size-5 shrink-0 text-ual-medium" aria-hidden="true" />
                        <span className="flex min-w-0 grow flex-col gap-3xs">
                          <span className="truncate text-step-0 font-ual-bold">{entry.title}</span>
                          {entry.subtitle && (
                            <span className="truncate text-step-d1/ual-condensed text-ual-medium">
                              {entry.subtitle}
                            </span>
                          )}
                        </span>
                        {external && (
                          <>
                            <ExternalLinkIcon
                              className="size-4 shrink-0 text-ual-medium"
                              aria-hidden="true"
                            />
                            <span className="sr-only">(opens in new tab)</span>
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Footer hint ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-t border-ual-dark-90 px-m py-s text-step-d1 text-ual-medium">
        <span className="flex flex-wrap items-center gap-2xs">
          <Kbd>↑↓</Kbd>
          <span>navigate</span>
          <Kbd>↵</Kbd>
          <span>open</span>
          <Kbd>esc</Kbd>
          <span>close</span>
        </span>
        <span className="shrink-0">{indexSize} indexed</span>
      </div>
    </dialog>
  );
}
