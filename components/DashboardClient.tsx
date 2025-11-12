'use client';
import React from 'react';
import { useDataStream } from '../hooks/useDataStream';
import { useDataContext } from './providers/DataProvider';
import { LineChart } from './charts/LineChart';
import { PerformanceMonitor } from './ui/PerformanceMonitor';
import { DataTable } from './ui/DataTable';
import { FilterPanel } from './controls/FilterPanel';
import { TimeRangeSelector } from './controls/TimeRangeSelector';
import { PerformanceStressControls } from './ui/PerformanceStressControls';
import { useViewData } from '../hooks/useViewData';

export default function DashboardClient() {
  useDataStream();
  const { data } = useDataContext();
  const viewData = useViewData(); // filtered + aggregated when timeRange != live

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'start', marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <LineChart data={viewData.length ? viewData : data} height={320} maxPoints={10000} />
        </div>

        <div style={{ width: 260, display: 'flex', gap: 8, flexDirection: 'column' }}>
          <div style={{ background: '#021226', borderRadius: 8, padding: 8 }}>
            <FilterPanel />
            <div style={{ height: 8 }} />
            <TimeRangeSelector />
          </div>

          <div style={{ background: '#021226', borderRadius: 8, padding: 8 }}>
            <PerformanceStressControls />
          </div>

          <div style={{ width: '100%', background: '#021226', borderRadius: 8, padding: 8 }}>
            <PerformanceMonitor />
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <h2 style={{ color: '#cfe8ff' }}>Data Table (virtualized)</h2>
        <DataTable rows={data} rowHeight={28} height={300} />
      </div>
    </div>
  );
}