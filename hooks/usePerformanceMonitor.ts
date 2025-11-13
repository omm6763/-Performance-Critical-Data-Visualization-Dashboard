
// Calculates FPS and monitors memory.

import { useState, useEffect, useRef } from 'react';
import { PerformanceMetrics } from '@/lib/types';

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({ fps: 0, memory: 0 });
  const lastTimeRef = useRef(performance.now());
  const frameCountRef = useRef(0);

  useEffect(() => {
    let animationFrameId: number;

    const measure = () => {
      const now = performance.now();
      frameCountRef.current++;

      // Update metrics every second
      if (now - lastTimeRef.current >= 1000) {
        const fps = frameCountRef.current;
        const memory = (performance as any).memory ? (performance as any).memory.usedJSHeapSize / 1048576 : 0; // MB

        setMetrics({
          fps: fps,
          memory: parseFloat(memory.toFixed(2)),
        });

        lastTimeRef.current = now;
        frameCountRef.current = 0;
      }

      animationFrameId = requestAnimationFrame(measure);
    };

    measure();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return metrics;
}