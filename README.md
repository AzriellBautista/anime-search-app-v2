# Anime Search App

A single-page anime search SPA built with React + Mantine UI + Vite, powered by the [Tenrai API](https://tenrai.org/). Deployed on GitHub Pages.

## Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8
- **UI Library**: Mantine v9 (`@mantine/core`, `@mantine/hooks`, `@mantine/dates`, `@mantine/charts`)
- **HTTP Client**: `ky`
- **Icons**: `@tabler/icons-react`
- **Charts**: recharts (via `@mantine/charts`)
- **Dates**: `dayjs`

## Features

- Search anime by title with advanced filters (genre, type, status, rating, score, year, etc.)
- URL-persisted search state (query, filters, page) — back/forward and refresh preserve results
- Responsive card grid with skeleton loading states
- Full-detail modal with tabs: Details, Characters, Pictures, Statistics, Relations, Recommendations
- Lazy-loaded character, picture, statistics, relations, and recommendation data
- Dark/light theme toggle (persisted in localStorage)
- Back-to-top button, keyboard shortcut (Ctrl+K to focus search)
- Pagination with custom controls
- Mobile responsive

## Build & Deploy

```bash
npm install     # install dependencies
npm run dev     # dev server with HMR
npm run build   # type-check + production build to dist/
npm run preview # preview production build locally
npm run deploy  # deploy to GitHub Pages
```

## Live

[Here](https://azriellbautista.github.io/anime-search-app-v2/)
