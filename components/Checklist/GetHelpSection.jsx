import { ArrowRightIcon } from '../Icon/NavIcons';

/**
 * GetHelpSection — the contact block at the foot of a detail page: a heading,
 * an intro line and a row of contact cards (each a shade surface with a label,
 * its value and a bottom arrow), reusing the checklist card style.
 *
 * @param {Object} props
 * @param {string} [props.title='Get help']
 * @param {string} [props.intro]
 * @param {import('../../data/checklist').HelpChannel[]} props.channels
 */
export function GetHelpSection({ title = 'Get help', intro, channels }) {
  return (
    <section aria-labelledby="get-help-heading" className="flex flex-col gap-4">
      <h2 id="get-help-heading" className="text-step-3 font-bold tracking-ual-tight text-ual-dark">
        {title}
      </h2>
      {intro && <p className="max-w-200 text-step-0 text-ual-dark">{intro}</p>}
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
                {channel.note && (
                  <span className="text-step-d1 text-ual-medium">{channel.note}</span>
                )}
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
    </section>
  );
}
