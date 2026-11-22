# Roamly

A local-first trip planner for organizing activities, saved places and a group budget. [Live demo](https://vaibhav7711.github.io/roamly/) · [Repository](https://github.com/Vaibhav7711/roamly)

## What it does

- Create, edit and delete trips with a destination, date range, traveler count and budget.
- Create, edit, delete and reorder daily activities with time, duration, location, notes, category and cost.
- Detect overlapping activity intervals, including intervals crossing midnight, and flag a budget overrun.
- Search and filter activities and saved places; add saved places to a day.
- Review an ordered, explicitly illustrative route list and move activities using keyboard-accessible buttons.
- Export, validate and import a versioned JSON backup; reset the demo workspace.

## Run locally

```bash
npm ci
npm run dev
```

Run `npm run lint`, `npm test`, and `npm run build` for the checks used by CI. The project uses React, TypeScript, Vite, Vitest, and GitHub Actions. Pushes to `main` deploy to GitHub Pages.

## Architecture and limitations

`src/domain.ts` owns the trip model, overlap detection, date generation, budget calculation and backup validation. The React view owns navigation and form state. Data is stored in localStorage under a versioned key. Costs and budgets are for the entire group, in JPY. The initial Kyoto trip is sample data. The route is an ordered list, not a geographic map or travel-time estimate. There is no account, live data, booking, synchronization or shared editing; export a backup before clearing browser data.

Potential next steps include multi-currency budgets, real maps and geocoding, server synchronization, drag-and-drop alongside the existing reorder buttons, end-to-end automated browser tests, and accessible focus management for dialogs.
