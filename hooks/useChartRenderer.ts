import { useEffect, useRef } from 'react';
import { devicePixelRatioScale } from '../lib/canvasUtils';

export function useChartRenderer(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  renderFn: (ctx: CanvasRenderingContext2D) => void,
  deps: any[] = []
) {
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let mounted = true;
    const ctx = devicePixelRatioScale(canvas);

    function loop() {
      if (!mounted) return;
      try {
        renderFn(ctx);
      } catch (e) {
        // swallow render errors
      }
      frameRef.current = requestAnimationFrame(loop);
    }

    frameRef.current = requestAnimationFrame(loop);
    return () => {
      mounted = false;
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}