import { ArrowRightIcon } from '../Icon/NavIcons';

/**
 * A grid of contact cards (each a shade surface with a label, its value, an
 * optional note and a bottom arrow).
 *
 * @param {{ channels: import('../../data/checklist').HelpChannel[] }} props
 */
function ChannelGrid({ channels }) {
  return (
    <ul role="list" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {channels.map((channel) => {
        const external = channel.href.startsWith('http');
        return (
          <li key={channel.id}>
            <a
              href={channel.href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noreferrer' : undefined}
              className="group flex h-full flex-col gap-1 bg-ual-shade p-(--space-m) text-ual-dark no-underline transition-colors hover:text-ual-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange"
            >
              <span className="text-step-1/ual-condensed font-ual-normal tracking-ual-tight">
                {channel.label}
              </span>
              <span className="text-step-d1 text-ual-medium">{channel.value}</span>
              {channel.note && <span className="text-step-d1 text-ual-medium">{channel.note}</span>}
              <span
                className="mt-auto inline-flex size-11 items-center text-current [&>svg]:size-6"
                aria-hidden="true"
              >
                <ArrowRightIcon />
              </span>
              {external && <span className="sr-only"> (opens in a new tab)</span>}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * GetHelpSection — the contact block at the foot of a detail page: a heading,
 * an optional intro line and contact cards. Pass a flat `channels` list, or
 * `groups` (each with its own subheading) when the contacts are split into
 * labelled sets (e.g. "General enquiries" / "Mental health or wellbeing").
 *
 * @param {Object} props
 * @param {string} [props.title='Get help']
 * @param {string} [props.intro]
 * @param {import('../../data/checklist').HelpChannel[]} [props.channels]
 * @param {{ heading: string, channels: import('../../data/checklist').HelpChannel[] }[]} [props.groups]
 */
export function GetHelpSection({ title = 'Get help', intro, channels, groups }) {
  return (
    <section aria-labelledby="get-help-heading" className="flex flex-col gap-4">
      <h2 id="get-help-heading" className="text-step-3 font-bold tracking-ual-tight text-ual-dark">
        {title}
      </h2>
      {intro && <p className="max-w-200 text-step-0 text-ual-dark">{intro}</p>}
      {groups
        ? groups.map((group) => (
            <div key={group.heading} className="flex flex-col gap-3">
              <h3 className="text-step-1 font-ual-normal tracking-ual-tight text-ual-dark">
                {group.heading}
              </h3>
              <ChannelGrid channels={group.channels} />
            </div>
          ))
        : channels && <ChannelGrid channels={channels} />}
    </section>
  );
}
