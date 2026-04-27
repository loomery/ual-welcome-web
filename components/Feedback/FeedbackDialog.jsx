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
      className="feedback-dialog"
      aria-labelledby={titleId}
      aria-describedby={descId}
      onClick={handleBackdropClick}
    >
      <div className="feedback-dialog__panel flow" data-flow="s">
        <button
          type="button"
          className="feedback-dialog__close"
          onClick={closeDialog}
          aria-label="Close feedback"
        >
          <CloseIcon aria-hidden="true" width={20} height={20} />
        </button>
        <div className="flow feedback-dialog__header" data-flow="3xs">
          <h2 id={titleId} className="feedback-dialog__title">
            Send feedback
          </h2>
          <p id={descId} className="feedback-dialog__lead">
            Tell us what worked and what didn’t. This beta exists to be shaped
            by you.
          </p>
        </div>

        {status === 'sent' ? (
          <div className="flow" data-flow="s" role="status" aria-live="polite">
            <p>
              <strong>Thanks — your feedback is on its way.</strong>
            </p>
            <p>
              Your email app should have opened with a pre-filled message. If
              nothing happened, email us at{' '}
              <a href={`mailto:${FEEDBACK_EMAIL}`}>{FEEDBACK_EMAIL}</a>.
            </p>
            <div className="cluster" data-justify="end">
              <Button onClick={closeDialog}>Close</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flow" data-flow="s" noValidate>
            <fieldset className="feedback-rating" aria-labelledby={ratingGroupId}>
              <legend id={ratingGroupId} className="label">
                How would you rate your experience?{' '}
                <span className="feedback-rating__hint">Optional</span>
              </legend>
              <div className="feedback-rating__options" role="radiogroup" aria-labelledby={ratingGroupId}>
                {[1, 2, 3, 4, 5].map((n) => {
                  const checked = rating === n;
                  return (
                    <label
                      key={n}
                      className="feedback-rating__option"
                      data-checked={checked ? '' : undefined}
                    >
                      <input
                        type="radio"
                        name="rating"
                        value={n}
                        checked={checked}
                        onChange={() => setRating(n)}
                        className="visually-hidden"
                      />
                      <span aria-hidden="true" className="feedback-rating__number">
                        {n}
                      </span>
                      <span className="visually-hidden">
                        {n} out of 5 — {RATING_LABELS[n]}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="flow" data-flow="3xs">
              <label htmlFor={messageId} className="label">
                What would you like to tell us?
              </label>
              <textarea
                id={messageId}
                name="message"
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="feedback-dialog__textarea"
                placeholder="e.g. The map was slow to load on my phone…"
                maxLength={MAX_MESSAGE_LENGTH}
                aria-describedby={`${messageId}-counter`}
              />
              <p
                id={`${messageId}-counter`}
                className="feedback-dialog__counter"
                data-near-limit={message.length > MAX_MESSAGE_LENGTH * 0.9 ? '' : undefined}
                aria-live="polite"
              >
                <span className="visually-hidden">Characters used: </span>
                {message.length} / {MAX_MESSAGE_LENGTH}
              </p>
            </div>

            <div className="flow" data-flow="3xs">
              <label htmlFor={emailId} className="label">
                Your email <span className="feedback-rating__hint">Optional — if you’d like a reply</span>
              </label>
              <input
                id={emailId}
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="feedback-dialog__input"
                placeholder="you@arts.ac.uk"
              />
            </div>

            <div className="cluster" data-justify="end">
              <Button ghost type="button" onClick={closeDialog}>
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
