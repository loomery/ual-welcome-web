'use client';

import { STUDYING_TOPICS, visibleTopicSections } from '../../data/studying';
import { TopicScreen } from '../../components/Topic/TopicScreen';

/**
 * A Studying topic page (/studying/{id}). Thin wrapper over the shared
 * TopicScreen, bound to the Studying dataset and its section-gating helper.
 *
 * @param {{ topicId: string }} props
 */
export function StudyingTopicScreen({ topicId }) {
  return (
    <TopicScreen
      topics={STUDYING_TOPICS}
      topicId={topicId}
      getVisibleSections={visibleTopicSections}
    />
  );
}
