'use client';

import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

export default function PerformanceMonitor() {
  const metrics = usePerformanceMonitor();

  return (
    <div className="performance-monitor">
      <span>FPS: **{metrics.fps}**</span>
      <span>MEM: **{metrics.memory} MB**</span>
    </div>
  );
}