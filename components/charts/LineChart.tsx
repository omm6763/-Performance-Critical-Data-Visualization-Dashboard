'use client';

import { useRef, useLayoutEffect, useState } from 'react';
import { DataPoint, DataBounds } from '@/lib/types';
import { useChartRenderer } from '@/hooks/useChartRenderer';

type LineChartProps = {
  data: DataPoint[];
  bounds: DataBounds;
};

export default function LineChart({ data, bounds }: LineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  // Measure the container size to make the canvas responsive
  useLayoutEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setSize({ width, height });
    }
  }, []);

  // Call the rendering hook
  useChartRenderer(canvasRef, data, bounds, size);

  return (
    <div ref={containerRef} className="chart-container">
      <canvas
        ref={canvasRef}
        width={size.width}
        height={size.height}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}