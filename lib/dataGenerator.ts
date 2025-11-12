import { DataPoint } from './types';

const categories = ['A', 'B', 'C', 'D'];

export function generateDataBatch(
  startTimestamp: number,
  count: number,
  freqMs = 10
): DataPoint[] {
  const out: DataPoint[] = new Array(count);
  for (let i = 0; i < count; i++) {
    const t = startTimestamp + i * freqMs;
    const value =
      Math.sin((t / 1000) * (0.5 + ((t / 60000) % 5))) * 20 +
      Math.cos(i * 0.001) * 5 +
      (Math.random() - 0.5) * 4;
    out[i] = {
      id: `${t}-${i}-${Math.floor(Math.random() * 10000)}`,
      timestamp: t,
      value,
      category: categories[i % categories.length],
    };
  }
  return out;
}

export function generateInitialDataset(
  now = Date.now(),
  points = 10000,
  freqMs = 10
): DataPoint[] {
  const start = now - points * freqMs;
  return generateDataBatch(start, points, freqMs);
}