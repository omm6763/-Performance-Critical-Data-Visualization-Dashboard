import { useEffect, useState } from 'react';

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    fps: 0,
    longTasks: 0,
    memoryMB: null as number | null,
  });

  useEffect(() => {
    let rafId = 0;
    let frames = 0;
    let last = performance.now();

    function rafTick() {
      frames++;
      const now = performance.now();
      if (now - last >= 1000) {
        setMetrics((m) => ({ ...m, fps: frames }));
        frames = 0;
        last = now;
        // @ts-ignore
        if ((performance as any).memory) {
          // @ts-ignore
          setMetrics((m) => ({ ...m, memoryMB: Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024) }));
        }
      }
      rafId = requestAnimationFrame(rafTick);
    }
    rafId = requestAnimationFrame(rafTick);

    let observer: PerformanceObserver | null = null;
    try {
      observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const long = entries.filter((e) => e.entryType === 'longtask').length;
        if (long) setMetrics((m) => ({ ...m, longTasks: m.longTasks + long }));
      });
      observer.observe({ entryTypes: ['longtask'] });
    } catch {}

    return () => {
      cancelAnimationFrame(rafId);
      if (observer) observer.disconnect();
    };
  }, []);

  return metrics;
}