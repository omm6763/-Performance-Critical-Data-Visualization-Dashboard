import { DataPoint } from "./types";

const MAX_POINTS = 10000; // The maximum number of points to keep
const STARTING_VALUE = 50;
const MAX_VARIATION = 0.5;

let lastValue = STARTING_VALUE;

/** Generates a single new data point */
export function generateDataPoint(): DataPoint {
  const newVariation = (Math.random() - 0.5) * 2 * MAX_VARIATION; // -0.5 to +0.5
  lastValue += newVariation;

  // Clamp values to a reasonable range
  if (lastValue > 100) lastValue = 99.5;
  if (lastValue < 0) lastValue = 0.5;

  return {
    timestamp: Date.now(),
    value: lastValue,
  };
}

/** Generates a large initial dataset */
export function generateInitialDataset(count = 1000): DataPoint[] {
  const data: DataPoint[] = [];
  const startTime = Date.now() - count * 100; // Go back in time
  
  for (let i = 0; i < count; i++) {
    const newVariation = (Math.random() - 0.5) * 2 * MAX_VARIATION;
    lastValue += newVariation;
    if (lastValue > 100) lastValue = 99.5;
    if (lastValue < 0) lastValue = 0.5;
    
    data.push({
      timestamp: startTime + i * 100,
      value: lastValue,
    });
  }
  return data;
}

export function updateData(currentData: DataPoint[], newPoint: DataPoint): DataPoint[] {
  if (currentData.length < MAX_POINTS) {
    return [...currentData, newPoint];
  }
  
  // More performant than shift() + push() for large arrays
  const newData = new Array(MAX_POINTS);
  for (let i = 0; i < MAX_POINTS - 1; i++) {
    newData[i] = currentData[i + 1];
  }
  newData[MAX_POINTS - 1] = newPoint;
  return newData;
}