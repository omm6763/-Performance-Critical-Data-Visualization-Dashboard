'use client';
import React, { useEffect, useRef, useState } from 'react';
import type { DataPoint } from '../../lib/types';
import { devicePixelRatioScale } from '../../lib/canvasUtils';
import { decimatePoints } from '../../lib/performanceUtils';

type Props = {
  data: DataPoint[];
  height?: number;
  color?: string;
  maxPoints?: number;
};

export const LineChart = React.memo(function LineChart({ data, height = 300, color = '#0ea5ff', maxPoints = 10000 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const [useOffscreen, setUseOffscreen] = useState(false);
  const transformRef = useRef({ offsetX: 0, scale: 1 });
  const dragging = useRef(false);
  const lastX = useRef<number | null>(null);

  // try to initialize offscreen worker once
  useEffect(() => {
    let mounted = true;
    async function initOffscreen() {
      try {
        if (!('OffscreenCanvas' in window)) return;
        const canvas = canvasRef.current!;
        const off = (canvas as any).transferControlToOffscreen?.();
        if (!off) return;
        const w = new Worker('/workers/offscreenRenderer.js');
        workerRef.current = w;
        w.postMessage({ type: 'INIT', canvas: off, width: canvas.clientWidth, height, dpr: window.devicePixelRatio || 1 }, [off]);
        setUseOffscreen(true);
      } catch (e) {
        // ignore fallback
      }
    }
    initOffscreen();
    return () => {
      mounted = false;
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [height]);

  // render fallback main-thread if offscreen not available
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.style.width = '100%';
    canvas.style.height = `${height}px`;
    let mounted = true;
    let raf = 0;
    const ctx = devicePixelRatioScale(canvas);

    function drawMain() {
      if (!mounted) return;
      // decimate for performance
      const pts = decimatePoints(data || [], maxPoints);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#071027';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const w = canvas.getBoundingClientRect().width;
      const h = height;
      const len = pts.length;
      if (len === 0) {
        raf = requestAnimationFrame(drawMain);
        return;
      }

      let min = Infinity, max = -Infinity;
      for (const p of pts) {
        if (p.value < min) min = p.value;
        if (p.value > max) max = p.value;
      }
      if (min === max) { min -= 1; max += 1; }
      const pad = (max - min) * 0.05 || 1;
      min -= pad;
      max += pad;

      const xs = len > 1 ? w / (len - 1) : w;

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = color;
      ctx.beginPath();
      for (let i = 0; i < len; i++) {
        const x = i * xs;
        const y = ((pts[i].value - min) / (max - min)) * h;
        const cy = h - y;
        if (i === 0) ctx.moveTo(x, cy);
        else ctx.lineTo(x, cy);
      }
      ctx.stroke();

      raf = requestAnimationFrame(drawMain);
    }

    if (!useOffscreen) raf = requestAnimationFrame(drawMain);

    return () => {
      mounted = false;
      if (raf) cancelAnimationFrame(raf);
    };
  }, [data, height, color, maxPoints, useOffscreen]);

  // send data to offscreen worker when available
  useEffect(() => {
    if (!useOffscreen || !workerRef.current) return;
    const w = workerRef.current;
    // decimate to reasonable size before sending
    const pts = decimatePoints(data || [], Math.max(1000, Math.min(maxPoints, 20000)));
    const values = pts.map((p) => ({ t: p.timestamp, v: p.value }));
    w.postMessage({ type: 'RENDER', payload: { values, color, height, transform: transformRef.current } });
  }, [data, useOffscreen, color, height, maxPoints]);

  // pointer handlers for zoom/pan
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      const delta = e.deltaY;
      const scaleFactor = 1 - delta * 0.001;
      transformRef.current.scale = Math.max(0.25, Math.min(8, transformRef.current.scale * scaleFactor));
      if (workerRef.current) {
        workerRef.current.postMessage({ type: 'SET_TRANSFORM', payload: transformRef.current });
      }
    }
    function onDown(e: PointerEvent) {
      dragging.current = true;
      canvas.setPointerCapture(e.pointerId);
      lastX.current = e.clientX;
    }
    function onMove(e: PointerEvent) {
      if (!dragging.current || lastX.current == null) return;
      const dx = e.clientX - lastX.current;
      lastX.current = e.clientX;
      transformRef.current.offsetX += dx;
      if (workerRef.current) workerRef.current.postMessage({ type: 'SET_TRANSFORM', payload: transformRef.current });
    }
    function onUp(e: PointerEvent) {
      dragging.current = false;
      lastX.current = null;
    }
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);

    return () => {
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100%', height: `${height}px`, borderRadius: 6, background: '#071027' }} />;
});