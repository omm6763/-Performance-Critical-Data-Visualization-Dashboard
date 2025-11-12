# PERFORMANCE — Extended Notes

This document lists the steps to measure and improve performance, plus the utilities added.

Benchmarks to run
- Open dashboard, view FPS widget.
- Use Chrome DevTools Performance trace (30s) to confirm stable 60fps under 10k points.
- Run memory snapshots to verify no growth after prolonged runs.

What was added
- Decimation utilities (lib/performanceUtils.ts) for LOD downsampling
- Worker (public/workers/dataWorker.js) to offload decimation/aggregation
- Canvas utilities (lib/canvasUtils.ts) for DPR-aware drawing
- Multiple canvas-based charts (Line, Bar, Scatter, Heatmap)

How to measure with Puppeteer (example)
- Write a small script to open /dashboard, wait for elements, and record performance metrics. (Add scripts/benchmark.js in future.)

Next optimizations
- OffscreenCanvas in worker where supported
- WebAssembly for heavy aggregation on very large datasets
- Incremental dirty-region redrawing and tiled rendering for >50k points