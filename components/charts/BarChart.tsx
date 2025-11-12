'use client';
import React, { useEffect, useRef } from 'react';
import type { DataPoint } from '../../lib/types';
import { devicePixelRatioScale } from '../../lib/canvasUtils';
import { decimate } from '../../lib/performanceUtils';

export default function BarChart({ data, height = 300, color = '#60a5fa', maxBars = 2000 }: { data: DataPoint[]; height?: number; color?: string; maxBars?: number }) {
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

      const bars = decimate(d.map((p) => p.value), maxBars);
      if (bars.length === 0) return;
      const w = canvas.getBoundingClientRect().width;
      const h = height;
      const bw = Math.max(1, w / bars.length);
      let min = Math.min(...bars);
      let max = Math.max(...bars);
      if (min === max) { min -= 1; max += 1; }
      const range = max - min || 1;

      ctx.fillStyle = color;
      for (let i = 0; i < bars.length; i++) {
        const v = bars[i];
        const norm = (v - min) / range;
        const bh = Math.round(norm * h);
        const x = i * bw;
        ctx.fillRect(x, h - bh, bw - 1, bh);
      }
    }

    render();
  }, [data, height, color, maxBars]);

  return <canvas ref={canvasRef} />;
}