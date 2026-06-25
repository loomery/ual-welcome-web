'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function GTMRouteTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Ensure dataLayer exists
    window.dataLayer = window.dataLayer || [];

    // Push SPA navigation event
    window.dataLayer.push({
      event: 'clientSideNavigation',
      page_path: pathname,
      page_title: document.title,
    });

    // console.log('GTM push:', {
    //   event: 'clientSideNavigation',
    //   page_path: pathname,
    //   page_title: document.title,
    // });
  }, [pathname]);

  return null;
}
