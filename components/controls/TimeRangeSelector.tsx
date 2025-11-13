
'use client';
export default function TimeRangeSelector() {
  return (
    <div className="time-range-selector">
      <strong>Time Range:</strong>
      <select>
        <option>Last 1 Min</option>
        <option>Last 5 Min</option>
        <option>Last 1 Hour</option>
      </select>
    </div>
  );
}