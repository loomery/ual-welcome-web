import { SmartHome } from '../components/SmartHome';

export const metadata = {
  // The root layout's `title.template` only applies to *child* segments, not
  // to this root-segment page, so a bare `title: 'Home'` would render without
  // the brand suffix. `absolute` opts out of the template and sets the full
  // tab title explicitly.
  title: { absolute: 'Home | UAL Student Centre' },
};

export default function HomePage() {
  return <SmartHome />;
}
