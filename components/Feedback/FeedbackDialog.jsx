'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '../Button/Button';
import { CloseIcon } from '../Icon/NavIcons';
import { usePersistedState } from '../../hooks/usePersistedState';

/**
 * Destination address for the mailto fallback. In production this would
 * be a real endpoint — for the beta we route to a visible placeholder so
 * the demo works end-to-end without a backend.
 */
const FEEDBACK_EMAIL = 'welcomeweek@arts.ac.uk';

/**
 * Hard cap on the user-supplied message length. Mailto URIs become
 * unreliable above ~2KB on iOS Safari and several desktop mail clients
 * truncate silently — capping the body up front makes the failure mode
 * visible (counter goes red) instead of submitting a half-cut email.
 * Also a small belt-and-braces against pathological pastes.
 */
const MAX_MESSAGE_LENGTH = 1500;

/** @type {Record<number, string>} */
const RATING_LABELS = {
  1: 'Poor',
  2: 'Not great',
  3: 'Okay',
  4: 'Good',
  5: 'Great',
};

/**
 * @typedef {Object} FeedbackEntry
 * @property {string} at
 * @property {number | null} rating
 * @property {string} message
 * @property {string} email
 * @property {string} path
 */

/**
 * Accessible feedback modal built on the native <dialog> element so we get
 * focus trapping and Escape handling for free. We still wire up explicit
 * labelledby/describedby, a focus-return-on-close pattern, and a click-
 * outside-to-dismiss affordance on the backdrop.
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {string} props.currentPath  Pathname of the screen feedback was sent from, for context.
 */
export function FeedbackDialog({ open, onClose, currentPath }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const descId = useId();
  const messageId = useId();
  const emailId = useId();
  const ratingGroupId = useId();

  const [rating, setRating] = useState(null);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  // Keep a lightweight log of submissions on-device — useful for the demo and
  // for diagnosing problems later. Never sent anywhere on its own.
  const [, setLog] = usePersistedState('ual:feedback:log:v1', /** @type {FeedbackEntry[]} */ ([]));

  // Open/close the native dialog when the `open` prop flips. Using
  // showModal() gives us the user-agent focus trap + Escape-to-close.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Mirror user-agent Escape close into our parent state, and reset the
  // form whenever the dialog is actually closed.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => {
      onClose();
      setRating(null);
      setMessage('');
      setEmail('');
      setStatus('idle');
    };
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  const handleBackdropClick = (e) => {
    // Clicks land on the <dialog> itself (not its content) when the user
    // clicks the backdrop area.
    if (e.target === dialogRef.current) closeDialog();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;
    if (trimmed.length > MAX_MESSAGE_LENGTH) return;

    /** @type {FeedbackEntry} */
    const entry = {
      at: new Date().toISOString(),
      rating,
      message: trimmed,
      email: email.trim(),
      path: currentPath,
    };
    setLog((prev) => [...prev, entry].slice(-20));

    const subject = `Welcome Week feedback${rating ? ` — ${rating}/5` : ''}`;
    const body = [
      trimmed,
      '',
      '---',
      `Rating: ${rating ? `${rating}/5 (${RATING_LABELS[rating]})` : 'not provided'}`,
      `From screen: ${currentPath}`,
      entry.email ? `Reply to: ${entry.email}` : 'No email provided',
      `Sent: ${new Date().toLocaleString('en-GB')}`,
    ].join('\n');

    const mailto = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    // Best-effort open. On devices without a mail client this silently no-ops,
    // so we still show the success state based on our local log above.
    window.location.href = mailto;
    setStatus('sent');
  };

  return (
    <dialog
      ref={dialogRef}
      className="inset-0 m-auto max-h-[calc(100dvh-var(--space-l))] w-[min(30rem,calc(100vw-var(--space-m)))] border-0 bg-transparent p-0 text-ual-dark backdrop:bg-black/50"
      aria-labelledby={titleId}
      aria-describedby={descId}
      onClick={handleBackdropClick}
    >
      <div className="relative space-y-4 border border-ual-dark bg-ual-light p-6">
        <button
          type="button"
          className="absolute inset-e-2 top-2 inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center border border-transparent bg-transparent p-2 text-ual-dark hover:bg-ual-dark-90 focus-visible:bg-ual-dark-90 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ual-orange"
          onClick={closeDialog}
          aria-label="Close feedback"
        >
          <CloseIcon aria-hidden="true" width={20} height={20} />
        </button>
        <div className="space-y-1 pe-[calc(44px+var(--space-2xs))]">
          <h2 id={titleId} className="m-0 text-step-1/ual-condensed">
            Send feedback
          </h2>
          <p id={descId} className="m-0 text-step-d1 text-ual-medium">
            Tell us what worked and what didn’t. This beta exists to be shaped by you.
          </p>
        </div>

        {status === 'sent' ? (
          <div className="space-y-4" role="status" aria-live="polite">
            <p>
              <strong>Thanks — your feedback is on its way.</strong>
            </p>
            <p>
              Your email app should have opened with a pre-filled message. If nothing happened,
              email us at <a href={`mailto:${FEEDBACK_EMAIL}`}>{FEEDBACK_EMAIL}</a>.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button onClick={closeDialog}>Close</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <fieldset className="m-0 border-0 p-0" aria-labelledby={ratingGroupId}>
              <legend id={ratingGroupId} className="mb-2 block text-step-d1/ual-condensed">
                How would you rate your experience?{' '}
                <span className="font-ual-normal text-ual-medium">Optional</span>
              </legend>
              <div
                className="mt-2 flex flex-wrap gap-2"
                role="radiogroup"
                aria-labelledby={ratingGroupId}
              >
                {[1, 2, 3, 4, 5].map((n) => {
                  const checked = rating === n;
                  return (
                    <label
                      key={n}
                      className={[
                        'inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center border border-ual-dark p-2 font-ual-bold transition-[background,color] duration-[120ms] hover:bg-ual-dark-90 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[0.3ch] has-[:focus-visible]:outline-ual-orange motion-reduce:transition-none',
                        checked ? 'bg-ual-dark text-ual-light' : 'bg-ual-light',
                      ].join(' ')}
                    >
                      <input
                        type="radio"
                        name="rating"
                        value={n}
                        checked={checked}
                        onChange={() => setRating(n)}
                        className="sr-only"
                      />
                      <span aria-hidden="true" className="text-step-0/ual-single">
                        {n}
                      </span>
                      <span className="sr-only">
                        {n} out of 5 — {RATING_LABELS[n]}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="space-y-1">
              <label htmlFor={messageId} className="mb-2 block text-step-d1/ual-condensed">
                What would you like to tell us?
              </label>
              <textarea
                id={messageId}
                name="message"
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full resize-y border border-ual-dark bg-ual-light px-3 py-2 font-main text-step-0/ual-default text-ual-dark focus-visible:outline-2 focus-visible:outline-offset-[0.3ch] focus-visible:outline-ual-orange"
                placeholder="e.g. The map was slow to load on my phone…"
                maxLength={MAX_MESSAGE_LENGTH}
                aria-describedby={`${messageId}-counter`}
              />
              <p
                id={`${messageId}-counter`}
                className={[
                  'mt-1 text-end text-step-d1',
                  message.length > MAX_MESSAGE_LENGTH * 0.9
                    ? 'font-ual-bold text-ual-orange'
                    : 'text-ual-medium',
                ].join(' ')}
                aria-live="polite"
              >
                <span className="sr-only">Characters used: </span>
                {message.length} / {MAX_MESSAGE_LENGTH}
              </p>
            </div>

            <div className="space-y-1">
              <label htmlFor={emailId} className="mb-2 block text-step-d1/ual-condensed">
                Your email{' '}
                <span className="font-ual-normal text-ual-medium">
                  Optional — if you’d like a reply
                </span>
              </label>
              <input
                id={emailId}
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-ual-dark bg-ual-light px-3 py-2 font-main text-step-0/ual-default text-ual-dark focus-visible:outline-2 focus-visible:outline-offset-[0.3ch] focus-visible:outline-ual-orange"
                placeholder="you@arts.ac.uk"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button variant="ghost" type="button" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={message.trim().length === 0}>
                Send feedback
              </Button>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
}
