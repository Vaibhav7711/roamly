# Roamly

Roamly is a visual itinerary workspace for planning thoughtful trips with friends. The demo follows a three-day Kyoto trip and combines discovery, scheduling, budgeting, and route context in one responsive UI.

## Highlights

- Drag-and-drop places between morning, afternoon, and evening
- Persistent itinerary state with add/remove workflows
- Schedule overload detection and planning-progress feedback
- Per-day and group activity budget calculations
- Interactive category/search filters and favorites
- Responsive slide-over panels for discovery and map views
- Unit-tested planning utilities and automated GitHub Pages deployment

## Stack

React · TypeScript · Vite · Lucide · Vitest · GitHub Actions

## Run locally

```bash
npm install
npm run dev
```

```bash
npm test
npm run build
```

## Architecture notes

The itinerary model is normalized by day and uses typed time slots. Budget, progress, and conflict calculations live in framework-independent utilities, making product rules easy to test. The map is a lightweight custom SVG that renders directly from the current schedule without an external map API.

## Resume bullet

> Designed and built a collaborative travel-planning interface in React and TypeScript with drag-and-drop scheduling, conflict detection, derived budgets, SVG route visualization, persistent state, tests, and CI/CD.
