
// This hook encapsulates the core canvas drawing logic.
import { RefObject, useEffect, useRef } from 'react';
import { DataPoint, DataBounds } from '@/lib/types';
import { drawLineChart } from '@/lib/canvasUtils';

export function useChartRenderer(
  canvasRef: RefObject<HTMLCanvasElement>,
  data: DataPoint[],
  bounds: DataBounds,
  size: { width: number; height: number }
) {
  // We used refs to pass data to the rAF loop without
  // re-triggering the useEffect hook, which would
  // constantly tear down and set up the animation loop.
  const dataRef = useRef(data);
  const boundsRef = useRef(bounds);

  // Keep refs updated with the latest data
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    boundsRef.current = bounds;
  }, [bounds]);

  useEffect(() => {
    if (!canvasRef.current || size.width === 0 || size.height === 0) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      // Access the latest data from refs inside the loop
      drawLineChart(
        ctx,
        dataRef.current,
        boundsRef.current,
        size.width,
        size.height
      );
      animationFrameId = requestAnimationFrame(render);
    };

    render(); // Start the rendering loop

    return () => {
      cancelAnimationFrame(animationFrameId); // Cleanup
    };
  }, [canvasRef, size]); // Re-run only if canvas or size changes
}