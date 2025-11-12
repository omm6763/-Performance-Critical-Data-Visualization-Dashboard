'use client';
import React, { useEffect, useRef } from 'react';
import type { DataPoint } from '../../lib/types';
import { devicePixelRatioScale } from '../../lib/canvasUtils';
import { heatmapBins } from '../../lib/performanceUtils';

function colorFor(value: number, max: number) {
  const t = Math.min(1, value / (max || 1));
  // simple blue->yellow->red palette
  const r = Math.round(255 * Math.min(1, t * 2));
  const g = Math.round(255 * Math.min(1, (1 - Math.abs(t - 0.5) * 2)));
  const b = Math.round(255 * Math.max(0, (1 - t) * 2));
  return `rgb(${r},${g},${b})`;
}

export default function Heatmap({ data, height = 240, bins = 100 }: { data: DataPoint[]; height?: number; bins?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.style.width = '100%';
    canvas.style.height = `${height}px`;
    const ctx = devicePixelRatioScale(canvas);

    function render() {
      const arr = heatmapBins(data, bins);
      const w = canvas.getBoundingClientRect().width;
      const h = height;
      const bw = Math.max(1, Math.floor(w / arr.length));
      const max = Math.max(...arr, 1);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < arr.length; i++) {
        ctx.fillStyle = colorFor(arr[i], max);
        ctx.fillRect(i * bw, 0, bw, h);
      }
    }

    render();
  }, [data, height, bins]);

  return <canvas ref={canvasRef} />;
}