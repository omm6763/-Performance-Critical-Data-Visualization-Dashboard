self.onmessage = function (e) {
  const { id, type, payload } = e.data;
  if (type === 'DECIMATE') {
    const { values, max } = payload;
    const len = values.length;
    if (len <= max) {
      self.postMessage({ id, data: values });
      return;
    }
    const step = len / max;
    const out = [];
    for (let i = 0; i < max; i++) out.push(values[Math.floor(i * step)]);
    self.postMessage({ id, data: out });
  } else if (type === 'AGGREGATE') {
    const { points, intervalMs } = payload;
    if (!points || points.length === 0) {
      self.postMessage({ id, data: [] });
      return;
    }
    const start = points[0].timestamp;
    const bins = {};
    for (let i = 0; i < points.length; i++) {
      const idx = Math.floor((points[i].timestamp - start) / intervalMs);
      if (!bins[idx]) bins[idx] = { sum: 0, count: 0 };
      bins[idx].sum += points[i].value;
      bins[idx].count += 1;
    }
    const out = [];
    const keys = Object.keys(bins).map((k) => Number(k)).sort((a, b) => a - b);
    for (const k of keys) out.push(bins[k].sum / bins[k].count);
    self.postMessage({ id, data: out });
  }
};