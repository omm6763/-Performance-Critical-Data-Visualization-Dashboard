'use client';
import React, { useEffect, useRef, useState } from 'react';

export function PerformanceMonitor() {
  const [fps, setFps] = useState(0);
  const [mem, setMem] = useState<number | null>(null);
  const frames = useRef(0);
  const last = useRef(performance.now());

  useEffect(() => {
    let raf = 0;
    function tick() {
      frames.current++;
      const now = performance.now();
      if (now - last.current >= 1000) {
        setFps(frames.current);
        frames.current = 0;
        last.current = now;
        // memory (non-standard, Chrome)
        // @ts-ignore
        if (performance && (performance as any).memory) {
          // @ts-ignore
          setMem(Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024));
        }
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{ color: '#e6eef8', fontFamily: 'system-ui', padding: 8, fontSize: 13 }}>
      <div>FPS: {fps}</div>
      <div>Memory (MB): {mem ?? 'N/A'}</div>
    </div>
  );
}