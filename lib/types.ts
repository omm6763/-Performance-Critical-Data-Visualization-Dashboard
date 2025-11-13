

export type DataPoint = {
  timestamp: number; // Unix timestamp (ms)
  value: number;
};

export type DataBounds = {
  minTime: number;
  maxTime: number;
  minValue: number;
  maxValue: number;
};

export type PerformanceMetrics = {
  fps: number;
  memory: number; // in MB
};

export type ChartRendererProps = {
  data: DataPoint[];
  bounds: DataBounds;
  width: number;
  height: number;
};