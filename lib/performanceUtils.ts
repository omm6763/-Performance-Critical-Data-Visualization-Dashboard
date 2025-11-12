import type { DataPoint } from './types';

// decimate scalar array to max length using simple stride sampling
export function decimate(values: number[], max = 1000) {
  if (values.length <= max) return values.slice();
  const step = values.length / max;
  const out: number[] = [];
  for (let i = 0; i < max; i++) {
    out.push(values[Math.floor(i * step)]);
  }
  return out;
}

// decimate points preserving values (returns subset)
export function decimatePoints(points: DataPoint[], max = 10000) {
  if (points.length <= max) return points.slice();
  const step = points.length / max;
  const out: DataPoint[] = [];
  for (let i = 0; i < max; i++) out.push(points[Math.floor(i * step)]);
  return out;
}

// aggregate into equal-time bins; returns averaged value per bin
export function aggregateByInterval(points: DataPoint[], intervalMs: number) {
  if (!points || points.length === 0) return [];
  const start = points[0].timestamp;
  const bins: { sum: number; count: number }[] = [];
  for (const p of points) {
    const idx = Math.floor((p.timestamp - start) / intervalMs);
    if (!bins[idx]) bins[idx] = { sum: 0, count: 0 };
    bins[idx].sum += p.value;
    bins[idx].count += 1;
  }
  return bins.map((b) => (b ? b.sum / Math.max(1, b.count) : 0));
}

// produce heatmap bins of length `bins` along time dimension
export function heatmapBins(points: DataPoint[], bins = 100) {
  if (!points || points.length === 0) return new Array(bins).fill(0);
  const start = points[0].timestamp;
  const end = points[points.length - 1].timestamp || start + 1;
  const span = Math.max(1, end - start);
  const out = new Array(bins).fill(0);
  for (const p of points) {
    const t = Math.min(bins - 1, Math.floor(((p.timestamp - start) / span) * bins));
    out[t] += Math.abs(p.value);
  }
  return out;
}