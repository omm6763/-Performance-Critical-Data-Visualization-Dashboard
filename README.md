# My Next.js App

This is a Next.js application that serves as a template for building modern web applications. 

## Features

- Server-side rendering and static site generation
- API routes for backend functionality
- Custom hooks for reusable logic
- Modular components for better organization

## Getting Started

To get started with this project, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd my-nextjs-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000` to see your application in action.

## Project Structure

- `app/`: Contains the main application files including layout and pages.
- `components/`: Contains reusable components like Header and Footer.
- `lib/`: Contains utility functions for API calls.
- `hooks/`: Contains custom hooks for shared logic.
- `public/`: Contains static files like images and robots.txt.
- `.vscode/`: Contains settings for the development environment.
- `.eslintrc.json`: ESLint configuration for code linting.
- `next.config.js`: Configuration file for Next.js.
- `package.json`: Lists project dependencies and scripts.
- `tsconfig.json`: TypeScript configuration file.

## Performance Dashboard (Next.js + TypeScript) — Phase‑Extended

This repository is a Phase‑1 → Phase‑2 scaffold implementing a performant real‑time visualization. Add the new files from this paste into the project.

Quick start (Windows PowerShell)
1. cd "c:\Users\beher\Desktop\dashboard\my-nextjs-app"
2. npm install
3. npm run dev
4. Open http://localhost:3000/dashboard

What was added in this step
- Charts: BarChart, ScatterPlot, Heatmap (canvas implementations)
- Controls: FilterPanel, TimeRangeSelector, PerformanceStressControls
- Hooks: useChartRenderer, usePerformanceMonitor
- Lib: performanceUtils, canvasUtils
- Worker: public/workers/dataWorker.js (decimation/aggregation)
- README & PERFORMANCE.md updates

How to use Worker (example)
- new Worker('/workers/dataWorker.js') and post messages with { type: 'DECIMATE', payload: { values, max } } etc.

Next recommended steps
- Wire the new controls into DashboardClient (hook up onChange)
- Replace any heavy client aggregation with worker calls and use OffscreenCanvas where available
- Add automated benchmarking (Puppeteer) and CI

Notes
- Keep imports relative; this scaffold uses simple sampling decimation and sliding window to avoid memory growth.
- For production, build and profile with the Chrome Performance panel; OffscreenCanvas + worker combination yields the best main-thread relief.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.