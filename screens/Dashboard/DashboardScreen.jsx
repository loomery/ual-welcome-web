'use client';

import { useMemo } from 'react';
import { Card } from '../../components/Card/Card';
import { Countdown } from '../../components/Countdown/Countdown';
import { KeyInfoCard } from '../../components/Dashboard/KeyInfoCard';
import { NextStepCard } from '../../components/Dashboard/NextStepCard';
import { ViewToggle } from '../../components/Dashboard/ViewToggle';
import { visibleTasks } from '../../data/checklist';
import { USEFUL_INFO } from '../../data/usefulInfo';
import { COLLEGE_OPTIONS, STUDY_LEVEL_OPTIONS, YEAR_OPTIONS } from '../../data/onboardingOptions';
import { useOnboardingProfile } from '../../hooks/useOnboardingProfile';
import { usePersistedState } from '../../hooks/usePersistedState';

/**
 * Interest-driven optional sections. The order here determines render
 * order on the dashboard and is intentionally aligned with the Figma
 * "08 Personalised Home V1" frame.
 */
const OPTIONAL_SECTIONS = [
  { id: 'visa', label: 'Visa & immigration' },
  { id: 'social', label: 'Social' },
  { id: 'career', label: 'Jobs and opportunities' },
  { id: 'wellbeing', label: 'Wellbeing' },
  { id: 'creative', label: 'Workshops and studios' },
  { id: 'study', label: 'Study skills' },
  { id: 'tech', label: 'Tech setup' },
  { id: 'area', label: 'Area guide' },
];

const VIEW_OPTIONS = /** @type {const} */ ([
  { value: 'focus', label: 'My focus' },
  { value: 'all', label: 'Everything' },
]);

/**
 * Personalised dashboard.
 *
 * Layout (matches Figma "08 Personalised Home V1"):
 *   1. Hero            — countdown + greeting + course meta (always)
 *   2. Key information — always-on UAL resources from data/usefulInfo
 *   3. Get setup       — NextStepCard pointing to the next incomplete task
 *   4. View toggle     — My focus / Everything
 *   5. Optional sections — interest-driven simple link cards
 *
 * The checklist itself does not appear on this page — "View all tasks"
 * inside Get setup is the only entry point to /checklist.
 *
 * Optional sections behaviour:
 *   - "My focus":   shows only sections matching the student's interests.
 *                   With no interests selected, none are shown.
 *   - "Everything": shows every optional section regardless of interests.
 *
 * Toggle state is persisted so a refresh keeps the last choice.
 */
export function DashboardScreen() {
  const { profile, reset } = useOnboardingProfile();
  const [taskStatuses] = usePersistedState('ual:task:status:v1', {});
  const [view, setView] = usePersistedState(
    'ual:dash:view:v1',
    /** @type {'focus'|'all'} */ ('focus'),
  );

  const college = useMemo(
    () => COLLEGE_OPTIONS.find((c) => c.id === profile?.collegeId),
    [profile?.collegeId],
  );

  const studyLevel = useMemo(
    () => STUDY_LEVEL_OPTIONS.find((s) => s.id === profile?.studyLevel),
    [profile?.studyLevel],
  );

  const year = useMemo(() => YEAR_OPTIONS.find((y) => y.id === profile?.year), [profile?.year]);

  const interests = useMemo(() => profile?.interests ?? [], [profile?.interests]);

  const visibleSections = useMemo(() => {
    if (view === 'all') return OPTIONAL_SECTIONS;
    if (interests.length === 0) return [];
    return OPTIONAL_SECTIONS.filter((s) => interests.includes(s.id));
  }, [view, interests]);

  const nextTask = useMemo(
    () => visibleTasks(profile?.studentType).find((t) => taskStatuses[t.id] !== 'complete') ?? null,
    [taskStatuses, profile?.studentType],
  );

  const firstName = (profile?.name ?? '').split(' ')[0] || 'there';

  // Compact meta line shown under the greeting
  // (e.g. "Central Saint Martins · 1st year · Undergrad")
  const heroMeta = useMemo(() => {
    const parts = [];
    if (college) parts.push(college.name);
    if (year) parts.push(year.label);
    if (studyLevel) parts.push(studyLevel.label);
    return parts.join(' · ');
  }, [college, studyLevel, year]);

  function handleReset() {
    if (typeof window === 'undefined') return;
    if (window.confirm('Reset your hub? This clears your answers from this device.')) {
      reset();
      window.location.assign('/onboarding');
    }
  }

  return (
    <article className="flow" data-flow="l">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="home-hero flow" data-flow="m" aria-labelledby="dash-greeting">
        <Countdown />
        <h1 id="dash-greeting" className="home-hero__title">
          Hi, {firstName}
        </h1>
        {heroMeta && <p className="home-hero__lede">{heroMeta}</p>}
      </section>

      {/* ── KEY INFORMATION ──────────────────────────────────────── */}
      <section className="flow" data-flow="s" aria-labelledby="dash-key-info">
        <h2 id="dash-key-info">Key information</h2>
        <div className="grid">
          {USEFUL_INFO.map((item) => (
            <KeyInfoCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* ── GET SETUP — black "Your next step" card ──────────────── */}
      {nextTask && (
        <section className="flow" data-flow="s" aria-labelledby="dash-get-setup">
          <h2 id="dash-get-setup">Get setup</h2>
          <NextStepCard
            title={nextTask.title}
            body={nextTask.shortDescription}
            primary={{
              label: nextTask.cta?.label ?? 'View task',
              href: `/checklist/${nextTask.id}`,
            }}
            secondary={{ label: 'View all tasks', href: '/checklist' }}
          />
        </section>
      )}

      {/* ── VIEW TOGGLE ──────────────────────────────────────────── */}
      <ViewToggle value={view} onChange={setView} options={VIEW_OPTIONS} />

      {/* ── OPTIONAL SECTIONS (interest-driven simple cards) ─────── */}
      {visibleSections.map((section) => (
        <OptionalSection key={section.id} section={section} />
      ))}

      {/* ── NO-INTERESTS PROMPT (My focus, nothing selected) ─────── */}
      {view === 'focus' && interests.length === 0 && (
        <section className="flow" data-flow="s" aria-labelledby="dash-empty">
          <h2 id="dash-empty">Nothing selected yet</h2>
          <p>
            Switch to <strong>Everything</strong> to browse all sections, or{' '}
            <button type="button" onClick={handleReset} className="link-button">
              update your interests
            </button>{' '}
            to personalise this view.
          </p>
        </section>
      )}

      {/* ── PROFILE FOOTER ───────────────────────────────────────── */}
      <section className="flow" data-flow="2xs" aria-label="Profile">
        <p>
          <span className="step--1">Saved on this device. </span>
          <button type="button" onClick={handleReset} className="link-button">
            Edit your answers
          </button>
        </p>
      </section>
    </article>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * OptionalSection
 * Renders one interest-driven section. Each section displays a heading
 * and one or more simple link cards. Event date-cards have been removed
 * from this page — students go to /events for those.
 * ───────────────────────────────────────────────────────────────────────── */

/** @type {Record<string, { cards: Array<{ title: string, body: string, to?: string, href?: string }> }>} */
const SECTION_CONTENT = {
  visa: {
    cards: [
      {
        title: 'Visa & immigration support',
        body: 'Student visa guidance, documents and next steps for international students.',
        to: '/help/immigration-visas',
      },
    ],
  },
  social: {
    cards: [
      {
        title: 'Welcome events',
        body: 'See what is going on across the UAL campuses during welcome week.',
        to: '/events',
      },
      {
        title: 'Ask a buddy',
        body: 'Ask a student anything you like about studying at UAL.',
        href: 'https://www.arts.ac.uk/students/student-union',
      },
      {
        title: 'Find a community',
        body: 'Meet people who have the same interests and beliefs as you.',
        href: 'https://www.arts.ac.uk/students/student-union',
      },
    ],
  },
  career: {
    cards: [
      {
        title: 'Student Careers',
        body: 'Find out how Careers and Employability at UAL can support you with your career and job search.',
        href: 'https://www.arts.ac.uk/students/careers-and-employability',
      },
    ],
  },
  wellbeing: {
    cards: [
      {
        title: 'Wellbeing Hub',
        body: 'Find the advice and support you need to look after your health and wellbeing while studying.',
        href: 'https://www.arts.ac.uk/students/student-services/health-wellbeing-and-support-for-students',
      },
    ],
  },
  creative: {
    cards: [
      {
        title: 'Facilities',
        body: "Technical facilities, workshops and shared spaces at our King's Cross and Archway campuses.",
        href: 'https://www.arts.ac.uk/students/welcome/your-journey-to-UAL/get-connected',
      },
    ],
  },
  study: {
    cards: [
      {
        title: 'Academic support',
        body: 'Academic Support at UAL for all students.',
        href: 'https://www.arts.ac.uk/students/welcome/your-journey-to-UAL/get-support/skills',
      },
    ],
  },
  tech: {
    cards: [
      {
        title: 'IT Services',
        body: 'IT systems and support.',
        href: 'https://www.arts.ac.uk/students/welcome/your-journey-to-UAL/get-connected',
      },
    ],
  },
  area: {
    cards: [
      {
        title: "King's Cross guide",
        body: 'Find listings of local shops, restaurants, parks, galleries and theatres, all within walking distance of Central Saint Martins.',
        to: '/map',
      },
    ],
  },
};

/**
 * @param {{ section: { id: string, label: string } }} props
 */
function OptionalSection({ section }) {
  const content = SECTION_CONTENT[section.id];
  const sectionId = `dash-section-${section.id}`;
  if (!content?.cards?.length) return null;

  return (
    <section className="flow" data-flow="s" aria-labelledby={sectionId}>
      <h2 id={sectionId}>{section.label}</h2>
      <div className="grid">
        {content.cards.map((card) => (
          <Card
            key={card.title}
            title={card.title}
            to={card.to}
            external={card.href}
            body={<p>{card.body}</p>}
          />
        ))}
      </div>
    </section>
  );
}
