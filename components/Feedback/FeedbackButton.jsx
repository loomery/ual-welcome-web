'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { FeedbackIcon } from '../Icon/NavIcons';
import { FeedbackDialog } from './FeedbackDialog';

/**
 * Floating feedback trigger — present on every screen. Positioned to the
 * right, sitting just above the mobile bottom nav via the shared
 * --bottom-nav-height token so it never collides with the tab bar.
 *
 * Keeps its own focus-return logic: when the dialog closes we restore
 * focus to the button (WCAG 2.4.3 Focus Order).
 */
export function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const pathname = usePathname();

  // Restore focus to the trigger after the dialog closes.
  useEffect(() => {
    if (!open) triggerRef.current?.focus({ preventScroll: true });
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="fixed inset-e-s bottom-[calc(var(--bottom-nav-height)+var(--space-2xs)+env(safe-area-inset-bottom,0))] z-11 inline-flex min-h-11 cursor-pointer items-center gap-2xs rounded-full border border-ual-dark bg-ual-dark px-4 py-3 font-main text-step-d1/ual-single font-ual-bold text-ual-light shadow-[0_6px_18px_rgba(0,0,0,0.18)] transition-[background,transform] duration-150 hover:border-ual-orange hover:bg-ual-orange hover:text-ual-dark focus-visible:border-ual-orange focus-visible:bg-ual-orange focus-visible:text-ual-dark focus-visible:outline-2 focus-visible:outline-offset-[0.3ch] focus-visible:outline-ual-orange active:translate-y-px motion-reduce:transition-none nav:inset-e-m nav:bottom-m [body[data-onboarding]_&]:hidden"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <FeedbackIcon className="flex-none" aria-hidden="true" width={20} height={20} />
        <span>Feedback</span>
      </button>
      <FeedbackDialog open={open} onClose={() => setOpen(false)} currentPath={pathname} />
    </>
  );
}
