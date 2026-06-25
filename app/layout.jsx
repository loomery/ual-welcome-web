import './globals.css';
import { AppShell } from '../components/Layout/AppShell';
import { ThemeProvider } from '../components/Theme/ThemeProvider';
import { GoogleTagManager } from '@next/third-parties/google';
import Script from 'next/script';

// Next does NOT prepend basePath to the `manifest` metadata field (unlike
// icons), so under a sub-path deploy (/student-centre) a root-absolute value
// 404s. Bake the basePath in to match next.config's basePath.
const basePath = process.env.DEPLOY_PATH ? `/${process.env.DEPLOY_PATH}` : '';

export const metadata = {
  // `default` is used when a route declares no title (and is the home/root
  // title); `template` wraps every page-level `title` so the product brand
  // lives in exactly one place. Pages set only their short title, e.g.
  // `title: 'College map'` → "College map | UAL Student Centre".
  title: {
    default: 'UAL Student Centre',
    template: '%s | UAL Student Centre',
  },
  description:
    'The University of the Arts London Student Centre — your induction checklist, explorable campus map, and events.',
  applicationName: 'UAL Student Centre',
  manifest: `${basePath}/manifest.webmanifest`,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'UAL Student Centre',
  },
  icons: {
    icon: `${basePath}/icon.svg`,
    apple: `${basePath}/icon.svg`,
  },
};

export const viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

/**
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-TV73ZQ6K" />
      <head>
        <Script
          src="https://integrations.arts.ac.uk/cookiecontrol/latest.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
