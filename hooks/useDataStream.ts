// This hook manages the real-time data simulation.

import { useState, useEffect } from 'react';
import { DataPoint } from '@/lib/types';
import { generateDataPoint, updateData } from '@/lib/dataGenerator';

const DATA_INTERVAL = 100; // New data every 100ms

export function useDataStream(initialData: DataPoint[]) {
  const [data, setData] = useState<DataPoint[]>(initialData);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newPoint = generateDataPoint();
      
      // We use a functional update to ensure we have the latest state
      // and to optimize the update process
      setData(currentData => updateData(currentData, newPoint));
      
    }, DATA_INTERVAL);

    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this runs only once

  return data;
}