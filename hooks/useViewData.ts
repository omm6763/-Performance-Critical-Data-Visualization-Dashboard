import { useMemo, useState, useEffect } from 'react';
import { useDataContext } from '../components/providers/DataProvider';
import { useDataWorker } from './useDataWorker';
import type { DataPoint } from '../lib/types';

/**
 * Returns view data based on filters and timeRange.
 * For non-live ranges uses worker aggregation to reduce number of points.
 */
export function useViewData() {
  const { data, filters, timeRange } = useDataContext();
  const { post } = useDataWorker();
  const [viewData, setViewData] = useState<DataPoint[]>([]);

  useEffect(() => {
    if (!data || data.length === 0) {
      setViewData([]);
      return;
    }

    // apply filters first (categories)
    let filtered = data;
    if (filters.categories && filters.categories.length > 0) {
      filtered = data.filter((d) => filters.categories.includes(d.category ?? 'unknown'));
    }

    // live -> return raw (but limit to last 100k)
    if (timeRange === 'live') {
      setViewData(filtered.slice(Math.max(0, filtered.length - 200000)));
      return;
    }

    // map timeRange to intervalMs
    const map: Record<string, number> = { '1m': 60000, '5m': 300000, '1h': 3600000 };
    const intervalMs = map[timeRange] || 60000;

    // aggregate via worker (AGGREGATE). Worker returns averaged values per bin.
    let cancelled = false;
    (async () => {
      try {
        const agg: number[] = await post('AGGREGATE', { points: filtered, intervalMs });
        if (cancelled) return;
        // convert aggregated numbers to DataPoint[] across a synthetic timeframe
        const start = filtered[0].timestamp;
        const step = Math.max(1, Math.floor((filtered[filtered.length - 1].timestamp - start) / Math.max(1, agg.length)));
        const pts: DataPoint[] = agg.map((v, i) => ({
          id: `agg-${i}-${start + i * step}`,
          timestamp: start + i * step,
          value: v,
        }));
        setViewData(pts);
      } catch (e) {
        // fallback: simple binning on main thread
        const pts: DataPoint[] = [];
        const bins: Record<number, { sum: number; count: number }> = {};
        const s = filtered[0].timestamp;
        for (const p of filtered) {
          const idx = Math.floor((p.timestamp - s) / intervalMs);
          bins[idx] = bins[idx] || { sum: 0, count: 0 };
          bins[idx].sum += p.value;
          bins[idx].count += 1;
        }
        const keys = Object.keys(bins).map(Number).sort((a, b) => a - b);
        for (const k of keys) {
          const v = bins[k].sum / bins[k].count;
          pts.push({ id: `agg-${k}`, timestamp: s + k * intervalMs, value: v });
        }
        setViewData(pts);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, JSON.stringify(filters), timeRange]);

  return viewData;
}