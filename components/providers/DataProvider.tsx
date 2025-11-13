'use client';

import { createContext, useContext, useMemo, ReactNode } from 'react';
import { DataPoint, DataBounds } from '@/lib/types';
import { useDataStream } from '@/hooks/useDataStream';
import { calculateBounds } from '@/lib/performanceUtils';
import { generateInitialDataset } from '@/lib/dataGenerator';

// 1. Define the context shape
type DataContextType = {
  data: DataPoint[];
  bounds: DataBounds;
};

// 2. Create the context
const DataContext = createContext<DataContextType | undefined>(undefined);

// 3. Create the provider component
type DataProviderProps = {
  children: ReactNode;
};

// We generate initial data here to avoid layout shifts
const initialData = generateInitialDataset(10000); // Start with 10k points
const initialBounds = calculateBounds(initialData);

export function DataProvider({ children }: DataProviderProps) {
  // The useDataStream hook manages the real-time updates
  const data = useDataStream(initialData);

  // useMemo prevents recalculating bounds on every render

  const bounds = useMemo(() => calculateBounds(data), [data]);

  // useMemo prevents consumers from re-rendering if
  // the context value object didn't *actually* change
  const value = useMemo(() => ({
    data,
    bounds,
  }), [data, bounds]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

// 4. Create the consumer hook
export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}