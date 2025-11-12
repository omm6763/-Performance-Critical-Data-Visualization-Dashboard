'use client';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { DataPoint } from '../../lib/types';

type StressConfig = { rateMs: number; batchSize: number };

type ContextValue = {
  data: DataPoint[];
  pushBatch: (b: DataPoint[]) => void;
  clear: () => void;
  // filters / time range
  filters: { categories: string[] };
  setFilters: (f: { categories: string[] }) => void;
  timeRange: 'live' | '1m' | '5m' | '1h';
  setTimeRange: (t: ContextValue['timeRange']) => void;
  // stress controls
  stress: StressConfig;
  setStress: (s: StressConfig) => void;
};

const DataContext = createContext<ContextValue | null>(null);

export function DataProvider({ children, initialData = [] as DataPoint[] }: any) {
  const [data, setData] = useState<DataPoint[]>(initialData);
  const [filters, setFilters] = useState<{ categories: string[] }>({ categories: [] });
  const [timeRange, setTimeRange] = useState<ContextValue['timeRange']>('live');
  const [stress, setStress] = useState<StressConfig>({ rateMs: 100, batchSize: 100 });

  const pushBatch = useCallback((batch: DataPoint[]) => {
    setData((prev) => {
      const merged = prev.concat(batch);
      // keep sliding window to avoid memory growth
      if (merged.length > 200000) {
        return merged.slice(merged.length - 200000);
      }
      return merged;
    });
  }, []);

  const clear = useCallback(() => setData([]), []);

  const value = useMemo(
    () => ({ data, pushBatch, clear, filters, setFilters, timeRange, setTimeRange, stress, setStress }),
    [data, pushBatch, clear, filters, timeRange, stress]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useDataContext() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useDataContext must be used inside DataProvider');
  return ctx;
}