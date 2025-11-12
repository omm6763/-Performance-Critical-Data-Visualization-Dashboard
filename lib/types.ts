export type DataPoint = {
  id: string;
  timestamp: number; // ms
  value: number;
  category?: string;
};

export type ChartConfig = {
  type: 'line' | 'bar' | 'scatter' | 'heatmap';
  color?: string;
  visible?: boolean;
};