/**
 * Lightweight worker wrapper for public/workers/dataWorker.js
 * Provides simple request/response via incremental message ids.
 */
import { useEffect, useRef } from 'react';

export function useDataWorker() {
  const wRef = useRef<Worker | null>(null);
  const idRef = useRef(1);
  const resolvers = useRef(new Map<number, (v: any) => void>());

  useEffect(() => {
    // worker served from /workers/dataWorker.js (public)
    try {
      wRef.current = new Worker('/workers/dataWorker.js');
      wRef.current.onmessage = (e) => {
        const msg = e.data;
        // expect either { type, data, id }
        if (msg && msg.id && resolvers.current.has(msg.id)) {
          resolvers.current.get(msg.id)!(msg.data);
          resolvers.current.delete(msg.id);
        } else {
          // legacy messages without id (DECIMATED / AGGREGATED) - ignore here
        }
      };
    } catch (e) {
      wRef.current = null;
    }
    return () => {
      if (wRef.current) {
        wRef.current.terminate();
        wRef.current = null;
      }
    };
  }, []);

  function post(type: string, payload: any) {
    return new Promise<any>((resolve) => {
      const id = idRef.current++;
      resolvers.current.set(id, resolve);
      try {
        wRef.current?.postMessage({ id, type, payload });
      } catch (e) {
        // fallback: perform operation on main thread
        if (type === 'DECIMATE') {
          const { values, max } = payload;
          const len = values.length;
          if (len <= max) resolve(values.slice());
          else {
            const step = len / max;
            const out = [];
            for (let i = 0; i < max; i++) out.push(values[Math.floor(i * step)]);
            resolve(out);
          }
        } else if (type === 'AGGREGATE') {
          const { points, intervalMs } = payload;
          if (!points || points.length === 0) resolve([]);
          const start = points[0].timestamp;
          const bins: Record<number, { sum: number; count: number }> = {};
          for (let i = 0; i < points.length; i++) {
            const idx = Math.floor((points[i].timestamp - start) / intervalMs);
            bins[idx] = bins[idx] || { sum: 0, count: 0 };
            bins[idx].sum += points[i].value;
            bins[idx].count += 1;
          }
          const keys = Object.keys(bins).map(Number).sort((a, b) => a - b);
          const out = keys.map((k) => bins[k].sum / bins[k].count);
          resolve(out);
        } else {
          resolve(null);
        }
      }
    });
  }

  return { post };
}