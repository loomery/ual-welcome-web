import './globals.css';
import { AppShell } from '../components/Layout/AppShell';
import { ThemeProvider } from '../components/Theme/ThemeProvider';

// Next does NOT prepend basePath to the `manifest` metadata field (unlike
// icons), so under a sub-path deploy (/student-centre) a root-absolute value
// 404s. Bake the basePath in to match next.config's basePath.
const basePath = process.env.DEPLOY_PATH ? `/${process.env.DEPLOY_PATH}` : '';

export const metadata = {
  title: 'UAL Welcome Week',
  description:
    'Your first week at the University of the Arts London — induction checklist, explorable campus map, and Welcome Week events.',
  applicationName: 'UAL Welcome Week',
  manifest: `${basePath}/manifest.webmanifest`,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'UAL Welcome',
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
      <body>
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
