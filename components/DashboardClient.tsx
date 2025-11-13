'use client';

import { useState } from 'react';
import { useData } from './providers/DataProvider';
import LineChart from './charts/LineChart';
import BarChart from './charts/BarChart';
import ScatterPlot from './charts/ScatterPlot';
import Heatmap from './charts/Heatmap';
import PerformanceMonitor from './ui/PerformanceMonitor';
import DataTable from './ui/DataTable';
import FilterPanel from './controls/FilterPanel';
import TimeRangeSelector from './controls/TimeRangeSelector';

export default function DashboardClient() {
  const { data, bounds } = useData(); // Get data from our provider
  const [activeChart, setActiveChart] = useState('line');

  // useTransition could be used here to change filters


  return (
    <div className="dashboard-container">
      <PerformanceMonitor />
      
      <header className="dashboard-header">
        <h1>Performance Dashboard</h1>
        <p>Rendering {data.length.toLocaleString()} data points.</p>
      </header>
      
      <div className="controls-bar">
        <FilterPanel />
        <TimeRangeSelector />
      </div>

      <div className="charts-grid">
        <div className="chart-main">
          {/* We only render the active chart */}
          {activeChart === 'line' && <LineChart data={data} bounds={bounds} />}
          {activeChart === 'bar' && <BarChart />}
          {activeChart === 'scatter' && <ScatterPlot />}
          {activeChart === 'heatmap' && <Heatmap />}
        </div>
        <div className="chart-sidebar">
          <DataTable />
        </div>
      </div>

      {/* Placeholder buttons to show chart switching */}
      <div className="chart-selector">
        <button onClick={() => setActiveChart('line')} disabled={activeChart === 'line'}>Line Chart</button>
        <button onClick={() => setActiveChart('bar')} disabled={activeChart === 'bar'}>Bar </button>
        <button onClick={() => setActiveChart('scatter')} disabled={activeChart === 'scatter'}>Scatter</button>
        <button onClick={() => setActiveChart('heatmap')} disabled={activeChart === 'heatmap'}>Heatmap</button>
      </div>
    </div>
  );
}