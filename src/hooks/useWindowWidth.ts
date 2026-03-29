/**
 * useWindowWidth — returns the current window inner width,
 * updating on resize. Used for JS-based responsive styling
 * since we use inline styles (no CSS media queries).
 *
 * Usage:
 *   const width = useWindowWidth();
 *   const isMobile = width < 768;
 */

import { useEffect, useState } from 'react';

export function useWindowWidth(): number {
  const [width, setWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1024,
  );

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return width;
}
