'use client';
import React from 'react';
import { useDataContext } from '../providers/DataProvider';

export function TimeRangeSelector() {
  const { timeRange, setTimeRange } = useDataContext();
  const options = [
    { id: 'live', label: 'Live' },
    { id: '1m', label: '1 min' },
    { id: '5m', label: '5 min' },
    { id: '1h', label: '1 hour' },
  ];

  return (
    <div style={{ padding: 8, background: '#021226', borderRadius: 6 }}>
      <div style={{ color: '#cfe8ff', marginBottom: 6 }}>Time Range</div>
      <select value={timeRange} onChange={(e) => setTimeRange(e.target.value as any)} style={{ width: '100%', padding: 6 }}>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}