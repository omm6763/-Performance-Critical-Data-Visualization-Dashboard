import { DataPoint, DataBounds } from "./types";

const MARGIN = { top: 20, right: 20, bottom: 30, left: 40 };
const AXIS_COLOR = "#888888";
const LINE_COLOR = "#007AFF";
const LINE_WIDTH = 2;


export function drawLineChart(
  ctx: CanvasRenderingContext2D,
  data: DataPoint[],
  bounds: DataBounds,
  width: number,
  height: number
) {
  ctx.clearRect(0, 0, width, height);
  if (data.length === 0) return;

  const chartWidth = width - MARGIN.left - MARGIN.right;
  const chartHeight = height - MARGIN.top - MARGIN.bottom;

  // --- Scaling Functions ---
  // These map data coordinates to canvas coordinates
  const xScale = (timestamp: number) => {
    return MARGIN.left + ((timestamp - bounds.minTime) / (bounds.maxTime - bounds.minTime)) * chartWidth;
  };
  
  const yScale = (value: number) => {
    return MARGIN.top + chartHeight - ((value - bounds.minValue) / (bounds.maxValue - bounds.minValue)) * chartHeight;
  };

  // --- Draw Axes ---
  ctx.beginPath();
  ctx.moveTo(MARGIN.left, MARGIN.top);
  ctx.lineTo(MARGIN.left, MARGIN.top + chartHeight);
  ctx.lineTo(MARGIN.left + chartWidth, MARGIN.top + chartHeight);
  ctx.strokeStyle = AXIS_COLOR;
  ctx.stroke();

  // --- Draw Line ---
  ctx.beginPath();
  ctx.strokeStyle = LINE_COLOR;
  ctx.lineWidth = LINE_WIDTH;

  let firstPoint = true;
  for (const point of data) {
    const x = xScale(point.timestamp);
    const y = yScale(point.value);

    
    if (x < MARGIN.left) continue; 
    
    if (firstPoint) {
      ctx.moveTo(x, y);
      firstPoint = false;
    } else {
      ctx.lineTo(x, y);
    }
    
    // Stop drawing if we go off-screen to the right
    if (x > width - MARGIN.right) break;
  }
  
  ctx.stroke();
}