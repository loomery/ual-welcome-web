'use client';

import { useOnboardingProfile } from '../../hooks/useOnboardingProfile';
import { GetHelpSection } from '../Checklist/GetHelpSection';
import { RichText } from '../Checklist/RichText';
import { InterestTile } from '../Dashboard/InterestTile';
import { Button } from '../Button/Button';
import { ArrowRightIcon, ExternalLinkIcon } from '../Icon/NavIcons';

/**
 * One ordered content block within a topic section (paragraph, bullets, an
 * inline link, a sub-heading, a dark CTA button, or a grid of service cards).
 *
 * @param {{ block: object }} props
 */
function SectionBlock({ block }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className="max-w-200 text-step-0 text-ual-dark">
          <RichText text={block.text} />
        </p>
      );
    case 'subHeading':
      return (
        <h3 className="mt-2 text-step-1 font-bold tracking-ual-tight text-ual-dark">
          {block.text}
        </h3>
      );
    case 'bullets':
      return (
        <ul className="flex max-w-200 list-disc flex-col gap-2 pl-6 text-step-0 text-ual-dark">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case 'link': {
      const external = !block.href.startsWith('/');
      return (
        <a
          href={block.href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noreferrer' : undefined}
          className="w-fit text-step-0 text-ual-dark underline underline-offset-2 hover:text-ual-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange"
        >
          {block.label}
          {external && <span className="sr-only"> (opens in a new tab)</span>}
        </a>
      );
    }
    case 'button': {
      const external = !block.href.startsWith('/');
      return (
        <Button
          variant="solid"
          weight="normal"
          href={block.href}
          className="w-fit"
          target={external ? '_blank' : undefined}
          rel={external ? 'noreferrer' : undefined}
        >
          {block.label}
          <ArrowRightIcon aria-hidden="true" />
          {external && <span className="sr-only"> (opens in a new tab)</span>}
        </Button>
      );
    }
    case 'cards':
      return (
        <ul role="list" className="grid gap-4 sm:grid-cols-2">
          {block.cards.map((card) => (
            <li key={card.id}>
              <InterestTile label={card.label} body={card.body} href={card.href} />
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

/**
 * Shared topic-page composition for the Explore and Studying sections: title +
 * intro, then cohort-gated content sections (paragraphs, bullets, links,
 * buttons, sub-headings and card grids), an optional dark read-more banner and
 * a contact block. The caller supplies its own topic list and section-gating
 * helper so the same layout serves both datasets.
 *
 * @param {Object} props
 * @param {Array<object>} props.topics  topic list to resolve `topicId` against
 * @param {string} props.topicId
 * @param {(topic: object, studentType?: string, studentStatus?: string) => object[]} props.getVisibleSections
 */
export function TopicScreen({ topics, topicId, getVisibleSections }) {
  const { profile, hydrated } = useOnboardingProfile();

  const topic = topics.find((t) => t.id === topicId);
  if (!topic || !hydrated) return null;

  const sections = getVisibleSections(topic, profile?.studentType, profile?.studentStatus);

  return (
    <article className="flex flex-col gap-10">
      <header className="flex flex-col gap-6">
        <h1 className="text-step-4/ual-condensed font-bold tracking-ual-tight text-ual-dark">
          {topic.title}
        </h1>
        <p className="max-w-200 text-step-2 text-ual-dark">{topic.intro}</p>
      </header>

      {sections.map((section, i) => (
        <section key={section.heading ?? i} className="flex flex-col gap-4">
          {section.heading && (
            <h2 className="text-step-3 font-bold tracking-ual-tight text-ual-dark">
              {section.heading}
            </h2>
          )}
          {section.blocks?.map((block, bi) => (
            <SectionBlock key={bi} block={block} />
          ))}
          {section.description && (
            <p className="max-w-200 text-step-0 text-ual-dark">{section.description}</p>
          )}
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph} className="max-w-200 text-step-0 text-ual-dark">
              <RichText text={paragraph} />
            </p>
          ))}
          {section.lead && <p className="max-w-200 text-step-0 text-ual-dark">{section.lead}</p>}
          {section.bullets && (
            <ul className="flex max-w-200 list-disc flex-col gap-2 pl-6 text-step-0 text-ual-dark">
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          )}
          {section.cards && (
            <ul role="list" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.cards.map((card) => (
                <li key={card.id}>
                  <InterestTile label={card.label} body={card.body} href={card.href} />
                </li>
              ))}
            </ul>
          )}
          {section.link &&
            (section.link.href.startsWith('/') ? (
              <a
                href={section.link.href}
                className="inline-flex w-fit items-center gap-2 text-step-0 text-ual-dark underline underline-offset-2 hover:text-ual-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange [&>svg]:size-5"
              >
                {section.link.label}
                <ArrowRightIcon aria-hidden="true" />
              </a>
            ) : (
              <a
                href={section.link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 text-step-0 text-ual-dark underline underline-offset-2 hover:text-ual-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange [&>svg]:size-5"
              >
                {section.link.label}
                <ExternalLinkIcon aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ))}
        </section>
      ))}

      {topic.readMore && (
        <a
          href={topic.readMore.href}
          target="_blank"
          rel="noreferrer"
          className="group flex w-full max-w-200 items-center justify-between gap-4 bg-ual-dark p-8 text-step-2 font-bold tracking-ual-tight text-ual-light no-underline transition-colors hover:text-ual-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange [&>svg]:size-8"
        >
          {topic.readMore.label}
          <ArrowRightIcon aria-hidden="true" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      )}

      {topic.contact && (
        <GetHelpSection
          title={topic.contact.title}
          intro={topic.contact.intro}
          channels={topic.contact.channels}
        />
      )}
    </article>
  );
}
