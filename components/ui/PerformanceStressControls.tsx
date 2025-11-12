'use client';
import React from 'react';
import { useDataContext } from '../../components/providers/DataProvider';

export function PerformanceStressControls() {
  const { stress, setStress } = useDataContext();

  return (
    <div style={{ padding: 8, background: '#021226', borderRadius: 6 }}>
      <div style={{ color: '#cfe8ff', marginBottom: 6 }}>Stress Controls</div>

      <label style={{ color: '#dbeafe', display: 'block', marginBottom: 6 }}>
        Rate (ms)
        <input
          type="range"
          min={10}
          max={1000}
          value={stress.rateMs}
          onChange={(e) => setStress({ ...stress, rateMs: Number(e.target.value) })}
        />
        <div style={{ fontSize: 12 }}>{stress.rateMs} ms</div>
      </label>

      <label style={{ color: '#dbeafe', display: 'block', marginBottom: 6 }}>
        Batch size
        <input
          type="range"
          min={1}
          max={2000}
          value={stress.batchSize}
          onChange={(e) => setStress({ ...stress, batchSize: Number(e.target.value) })}
        />
        <div style={{ fontSize: 12 }}>{stress.batchSize} pts</div>
      </label>
    </div>
  );
}