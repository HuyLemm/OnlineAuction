import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset scroll position to top when pathname changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Instant scroll, no smooth animation
    });
  }, [pathname]);

  return null;
}
