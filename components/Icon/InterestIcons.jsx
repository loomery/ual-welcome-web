/**
 * Interest icons for the onboarding flow.
 *
 * Stroke-based, single-colour, viewBox 24×24 — matches NavIcons. Use
 * `currentColor` for the stroke so each icon inherits text colour from
 * its parent (works with the selected/unselected tile inversion).
 */

const STROKE = 1.5;

export function CommunityIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth={STROKE} />
      <path
        d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"
        stroke="currentColor"
        strokeWidth={STROKE}
        strokeLinecap="round"
      />
      <circle cx="17" cy="9.5" r="2.4" stroke="currentColor" strokeWidth={STROKE} />
      <path
        d="M15 20c.3-2.5 2-4.5 4.5-5"
        stroke="currentColor"
        strokeWidth={STROKE}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PaletteIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M12 3a9 9 0 1 0 0 18c1.1 0 1.7-.7 1.7-1.6 0-.6-.3-1-.3-1.4 0-1 .7-1.5 1.6-1.5h2A4 4 0 0 0 21 12.5 8 8 0 0 0 12 3Z"
        stroke="currentColor"
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
      <circle cx="7.5" cy="11" r="1.1" fill="currentColor" />
      <circle cx="11" cy="7.5" r="1.1" fill="currentColor" />
      <circle cx="15.5" cy="8" r="1.1" fill="currentColor" />
      <circle cx="17" cy="12" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function BookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M4 4.5c2.5-1 5.5-1 8 .5v15c-2.5-1.5-5.5-1.5-8-.5v-15Z"
        stroke="currentColor"
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
      <path
        d="M20 4.5c-2.5-1-5.5-1-8 .5v15c2.5-1.5 5.5-1.5 8-.5v-15Z"
        stroke="currentColor"
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeartIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M12 20.5s-7.5-4.7-7.5-10.7a4.5 4.5 0 0 1 7.5-3.4 4.5 4.5 0 0 1 7.5 3.4c0 6-7.5 10.7-7.5 10.7Z"
        stroke="currentColor"
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BriefcaseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect
        x="3"
        y="7"
        width="18"
        height="13"
        stroke="currentColor"
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
      <path
        d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"
        stroke="currentColor"
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M3 13h18" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" />
    </svg>
  );
}

export function MonitorIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect
        x="3"
        y="4"
        width="18"
        height="12"
        stroke="currentColor"
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
      <path
        d="M9 20h6M12 16v4"
        stroke="currentColor"
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Lookup map by interest id — keeps the JSX clean in InterestsStep
 * and other consumers (dashboard recap pills if needed later).
 */
export const INTEREST_ICONS = {
  social: CommunityIcon,
  creative: PaletteIcon,
  study: BookIcon,
  wellbeing: HeartIcon,
  career: BriefcaseIcon,
  tech: MonitorIcon,
};
