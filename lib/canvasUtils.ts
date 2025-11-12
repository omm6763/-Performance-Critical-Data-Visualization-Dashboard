export function devicePixelRatioScale(canvas: HTMLCanvasElement) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

// helper to debounce resize using ResizeObserver
export function observeResize(canvas: HTMLCanvasElement, cb: () => void) {
  if (!('ResizeObserver' in window)) return () => {};
  const ro = new (window as any).ResizeObserver(() => cb());
  ro.observe(canvas);
  return () => ro.disconnect();
}