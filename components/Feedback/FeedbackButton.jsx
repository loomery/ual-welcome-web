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
        className="feedback-fab"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <FeedbackIcon
          className="feedback-fab__icon"
          aria-hidden="true"
          width={20}
          height={20}
        />
        <span className="feedback-fab__label">Feedback</span>
      </button>
      <FeedbackDialog
        open={open}
        onClose={() => setOpen(false)}
        currentPath={pathname}
      />
    </>
  );
}
