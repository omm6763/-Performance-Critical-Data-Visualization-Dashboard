import { useEffect, useMemo, useState } from 'react';

export function useVirtualization({ containerRef, itemCount, itemHeight, viewportHeight }: any) {
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    function onScroll() {
      setScrollTop(el.scrollTop);
    }
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, [containerRef]);

  const visibleCount = Math.ceil(viewportHeight / itemHeight) + 3;
  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - 1);
  const end = Math.min(itemCount, start + visibleCount);
  const offsetTop = start * itemHeight;

  return { start, end, offsetTop, visibleCount };
}