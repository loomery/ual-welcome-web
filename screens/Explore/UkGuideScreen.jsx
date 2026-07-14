import { ArrowRightIcon } from '../../components/Icon/NavIcons';

// TODO(UAL): confirm the canonical UAL destinations for these links.
const MOVING_TO_UK_URL = 'https://www.arts.ac.uk/study-at-ual/international/moving-to-the-uk';
const WEATHER_URL = 'https://www.metoffice.gov.uk/weather/guides/what-to-wear';
const CLOCKS_URL = 'https://www.gov.uk/when-do-the-clocks-change';

/** British customs shown as a grid under "Do as the British do". */
const CUSTOMS = [
  {
    label: 'Be polite',
    body: 'British people like to say ‘please’ and ‘thank you’ often and appreciate when others do too.',
  },
  {
    label: 'Line up',
    body: 'People in the UK ‘queue’ (or line up) when waiting for a service — it’s considered rude to ‘push in’ ahead of people who were there before you.',
  },
  {
    label: 'Look after your town',
    body: 'It’s considered bad manners and, in some areas, a punishable offence to spit or to throw rubbish (litter) in the streets.',
  },
  {
    label: 'Be timely',
    body: 'It’s expected that people will arrive on time for meetings, appointments and classes. If you’re going to be late, let someone know beforehand, and apologise for being late when you arrive.',
  },
  {
    label: 'Keep to the right',
    body: 'If you are standing on an escalator, make sure you stand on the right-hand-side. People walk up on the left-hand side.',
  },
  {
    label: 'Driving on the right',
    body: 'If you are driving in the UK, remember that you drive on the left-hand-side of the road.',
  },
];

/**
 * Arrow link — matches the Figma "→" links (text + arrow with a full-width rule
 * beneath). External, so it opens in a new tab.
 *
 * @param {{ href: string, children: import('react').ReactNode }} props
 */
function ArrowLink({ href, children }) {
  return (
    <div className="max-w-200 border-b border-ual-dark-90 pb-4">
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-3 text-step-0 text-ual-dark no-underline hover:text-ual-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange [&>svg]:size-5"
      >
        {children}
        <ArrowRightIcon aria-hidden="true" />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  );
}

/**
 * "UK guide" (/explore/moving-to-the-uk/uk-guide) — a content page on British
 * culture, weather and Daylight Saving Time, built 1:1 from the Figma.
 */
export function UkGuideScreen() {
  return (
    <article className="flex flex-col gap-10">
      <header className="flex flex-col gap-6">
        <h1 className="text-step-4/ual-condensed font-bold tracking-ual-tight text-ual-dark">
          UK guide
        </h1>
        <p className="max-w-200 text-step-2 text-ual-dark">
          Tips to know about British culture during your studies.
        </p>
      </header>

      <section className="flex flex-col gap-6" aria-labelledby="culture-heading">
        <h2 id="culture-heading" className="text-step-3 font-bold tracking-ual-tight text-ual-dark">
          British culture
        </h2>
        <p className="max-w-200 text-step-0 text-ual-dark">
          Culturally, the UK is welcoming of all people and London is especially diverse and
          inclusive. Although you may find the pace of life fast in London, people are mostly
          friendly and willing to help if you ask. A few British customs:
        </p>

        <h3 className="text-step-2 font-ual-normal tracking-ual-tight text-ual-dark">
          Do as the British do
        </h3>
        <ul role="list" className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {CUSTOMS.map((custom) => (
            <li key={custom.label} className="flex flex-col gap-2">
              <h4 className="text-step-0 font-ual-bold text-ual-dark">{custom.label}</h4>
              <p className="text-step-d1 text-ual-medium">{custom.body}</p>
            </li>
          ))}
        </ul>

        <h3 className="text-step-2 font-ual-normal tracking-ual-tight text-ual-dark">
          What you are not allowed to do
        </h3>
        <p className="max-w-200 text-step-0 text-ual-dark">
          Smoking in all public enclosed places, public buildings or on public transport is illegal
          in the UK. This also applies to e-cigarettes and vapes, so always look for a designated
          smoking area.
        </p>
      </section>

      <section className="flex flex-col gap-6" aria-labelledby="weather-heading">
        <h2 id="weather-heading" className="text-step-3 font-bold tracking-ual-tight text-ual-dark">
          British weather
        </h2>
        <p className="max-w-200 text-step-0 text-ual-dark">
          British people famously love the weather, especially talking about it, maybe it is because
          we have so much of it!
        </p>

        <h3 className="text-step-2 font-ual-normal tracking-ual-tight text-ual-dark">
          Clothing options
        </h3>
        <p className="max-w-200 text-step-0 text-ual-dark">
          Although London’s climate is moderate, it’s often changeable and difficult to predict. We
          advise bringing clothing for a variety of conditions, including rain. The coldest months
          tend to be November to February and warm clothing is needed for these months of the year.
        </p>
        <ArrowLink href={WEATHER_URL}>Get some tips on preparing for British weather</ArrowLink>
      </section>

      <section className="flex flex-col gap-6" aria-labelledby="dst-heading">
        <h2 id="dst-heading" className="text-step-3 font-bold tracking-ual-tight text-ual-dark">
          Daylight Saving Time
        </h2>
        <p className="max-w-200 text-step-0 text-ual-dark">
          To make the most of daylight, the clocks change twice a year in the UK.
        </p>
        <p className="max-w-200 text-step-0 text-ual-dark">
          They are moved forward by 1 hour in March, for what is known as British Summer Time (BST),
          and are turned back by 1 hour in October.
        </p>
        <ArrowLink href={CLOCKS_URL}>Find out when the clocks change.</ArrowLink>
      </section>

      <a
        href={MOVING_TO_UK_URL}
        target="_blank"
        rel="noreferrer"
        className="group flex w-full max-w-200 items-center justify-between gap-4 bg-ual-dark p-8 text-step-2 font-bold tracking-ual-tight text-ual-light no-underline transition-colors hover:text-ual-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange [&>svg]:size-8"
      >
        Read more about moving to the UK
        <ArrowRightIcon aria-hidden="true" />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </article>
  );
}
