

import { DataPoint, DataBounds } from "./types";


export function calculateBounds(data: DataPoint[]): DataBounds {
  if (data.length === 0) {
    const now = Date.now();
    return { minTime: now - 10000, maxTime: now, minValue: 0, maxValue: 100 };
  }

  let minTime = data[0].timestamp;
  let maxTime = data[data.length - 1].timestamp;
  let minValue = Infinity;
  let maxValue = -Infinity;

  for (const point of data) {
    if (point.value < minValue) minValue = point.value;
    if (point.value > maxValue) maxValue = point.value;
  }

  // Add padding to min/max value for better visualization
  const valueRange = maxValue - minValue;
  if (valueRange === 0) {
    // Handle case where all values are the same
    return {
      minTime,
      maxTime,
      minValue: minValue - 10, // Default padding
      maxValue: maxValue + 10, // Default padding
    };
  }

  return {
    minTime,
    maxTime,
    minValue: minValue - valueRange * 0.1, // 10% padding
    maxValue: maxValue + valueRange * 0.1, // 10% padding
  };
}