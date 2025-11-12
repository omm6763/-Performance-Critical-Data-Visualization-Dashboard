'use client';
import React, { useEffect, useRef } from 'react';
import type { DataPoint } from '../../lib/types';
import { devicePixelRatioScale } from '../../lib/canvasUtils';
import { decimatePoints } from '../../lib/performanceUtils';

export default function ScatterPlot({ data, height = 300, color = '#f97316', maxPoints = 20000 }: { data: DataPoint[]; height?: number; color?: string; maxPoints?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.style.width = '100%';
    canvas.style.height = `${height}px`;
    const ctx = devicePixelRatioScale(canvas);

    function render() {
      const d = data || [];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#071027';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const points = decimatePoints(d, maxPoints);
      if (points.length === 0) return;
      const w = canvas.getBoundingClientRect().width;
      const h = height;
      let min = Infinity, max = -Infinity;
      for (const p of points) {
        if (p.value < min) min = p.value;
        if (p.value > max) max = p.value;
      }
      if (min === max) { min -= 1; max += 1; }
      const range = max - min || 1;

      ctx.fillStyle = color;
      const radius = Math.max(1, Math.min(3, 20000 / points.length));
      for (let i = 0; i < points.length; i++) {
        const x = (i / Math.max(1, points.length - 1)) * w;
        const y = h - ((points[i].value - min) / range) * h;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    render();
  }, [data, height, color, maxPoints]);

  return <canvas ref={canvasRef} />;
}