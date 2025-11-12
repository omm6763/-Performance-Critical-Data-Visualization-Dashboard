/*
 Offscreen canvas renderer worker.
 Listens for:
 - { type: 'INIT', canvas, width, height, dpr }
 - { type: 'RENDER', payload: { values: [{t,v}], color, height, transform } }
 - { type: 'SET_TRANSFORM', payload: { offsetX, scale } }
*/
let ctx = null;
let canvasWidth = 0;
let canvasHeight = 0;
let dpr = 1;
let transform = { offsetX: 0, scale: 1 };

onmessage = function (e) {
  const { type, canvas, width, height, dpr: workerDpr, payload } = e.data;
  if (type === 'INIT' && canvas) {
    try {
      const off = canvas;
      off.width = Math.round(width * (workerDpr || 1));
      off.height = Math.round(height * (workerDpr || 1));
      ctx = off.getContext('2d');
      canvasWidth = width;
      canvasHeight = height;
      dpr = workerDpr || 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return;
    } catch (err) {
      ctx = null;
    }
  } else if (type === 'RENDER' && ctx) {
    const { values, color, height: h } = payload;
    render(values, color, h);
  } else if (type === 'SET_TRANSFORM') {
    transform = payload || transform;
  }
};

function render(values, color, height) {
  if (!ctx) return;
  // clear
  ctx.fillStyle = '#071027';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  if (!values || values.length === 0) return;

  const len = values.length;
  let min = Infinity, max = -Infinity;
  for (let i = 0; i < values.length; i++) {
    const v = values[i].v;
    if (v < min) min = v;
    if (v > max) max = v;
  }
  if (min === max) { min -= 1; max += 1; }
  const pad = (max - min) * 0.05 || 1;
  min -= pad;
  max += pad;

  const w = canvasWidth;
  const h = canvasHeight / dpr;

  // apply simple transform to mapping: offsetX and scale (pan/zoom)
  const scale = transform.scale || 1;
  const offsetX = transform.offsetX || 0;

  const xs = len > 1 ? (w * scale) / (len - 1) : w;
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = color || '#0ea5ff';
  ctx.beginPath();
  for (let i = 0; i < len; i++) {
    const x = i * xs + offsetX;
    const y = ((values[i].v - min) / (max - min)) * h;
    const cy = h - y;
    if (i === 0) ctx.moveTo(x, cy);
    else ctx.lineTo(x, cy);
  }
  ctx.stroke();
}