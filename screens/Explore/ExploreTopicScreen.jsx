'use client';

import { EXPLORE_TOPICS, visibleTopicSections } from '../../data/explore';
import { TopicScreen } from '../../components/Topic/TopicScreen';

/**
 * An Explore topic page (/explore/{id}). Thin wrapper over the shared
 * TopicScreen, bound to the Explore dataset and its section-gating helper.
 *
 * @param {{ topicId: string }} props
 */
export function ExploreTopicScreen({ topicId }) {
  return (
    <TopicScreen
      topics={EXPLORE_TOPICS}
      topicId={topicId}
      getVisibleSections={visibleTopicSections}
    />
  );
}
