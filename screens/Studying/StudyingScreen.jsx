import { STUDYING_LANDING } from '../../data/studying';
import { TopicLandingScreen } from '../../components/Topic/TopicLandingScreen';

/**
 * "Studying" (/studying) — grids of service cards grouped by theme (Your
 * college, Online study tools, IT services), each with an optional "View more
 * services" link. Not cohort-gated — renders STUDYING_LANDING as-is.
 */
export function StudyingScreen() {
  return (
    <TopicLandingScreen
      title="Studying"
      intro="Tools, services and guides to support you throughout your academic year."
      groups={STUDYING_LANDING}
    />
  );
}
