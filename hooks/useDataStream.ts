'use client';
import { useEffect, useRef } from 'react';
import type { DataPoint } from '../lib/types';
import { useDataContext } from '../components/providers/DataProvider';

/**
 * Poll /api/data using current stress config from DataProvider.
 * pushBatch appends server batches to context.
 */
export function useDataStream() {
  const { pushBatch, stress } = useDataContext();
  const lastTs = useRef<number>(0);
  const running = useRef(true);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    running.current = true;

    async function fetchBatch(countOverride?: number) {
      try {
        const url = new URL('/api/data', location.origin);
        url.searchParams.set('mode', 'update');
        url.searchParams.set('since', String(lastTs.current));
        url.searchParams.set('count', String(countOverride ?? stress.batchSize ?? 100));
        const res = await fetch(url.toString());
        const json = await res.json();
        const batch: DataPoint[] = json.data ?? [];
        if (batch.length) {
          lastTs.current = batch[batch.length - 1].timestamp;
          pushBatch(batch);
        }
      } catch (e) {
        // silent retry
      }
    }

    // initial fetch
    (async () => {
      try {
        const url = new URL('/api/data', location.origin);
        url.searchParams.set('mode', 'initial');
        const res = await fetch(url.toString());
        const json = await res.json();
        const initial: DataPoint[] = json.data ?? [];
        if (initial.length) {
          lastTs.current = initial[initial.length - 1].timestamp;
          pushBatch(initial);
        }
      } catch (e) {}
    })();

    // set interval using stress.rateMs; clear/recreate on change
    function startInterval() {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = window.setInterval(() => {
        if (!running.current) return;
        void fetchBatch();
      }, Math.max(10, stress.rateMs || 100));
    }

    startInterval();

    return () => {
      running.current = false;
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [pushBatch, stress.rateMs, stress.batchSize]);
}