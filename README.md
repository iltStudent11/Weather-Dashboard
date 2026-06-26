# Weather Dashboard

A React weather dashboard built with Vite.

## Setup

- `npm install`

## Tech Stack

- **Frontend:** React 19 + TypeScript
- **Build Tool:** Vite
- **Routing:** React Router
- **State Management:** React Context + custom hooks
- **Testing:** Vitest + React Testing Library
- **Linting:** Oxlint
- **Deployment:** GitHub Pages via GitHub Actions

## Available Scripts

- `npm run dev` - start the Vite development server
- `npm run build` - create a production build in `dist/`
- `npm run preview` - preview the production build locally
- `npm run lint` - run lint checks with Oxlint
- `npm run test` - run the Vitest test suite once
- `npm run test:watch` - run Vitest in watch mode

## Routes

- `/` - locations list page
- `/search` - add/edit location form
- `/location/:query` - weather detail page for a city or zip query
- `*` - not found fallback page

## Testing

This project uses **Vitest** and **React Testing Library**.

- Test command: `npm run test`
- Watch mode: `npm run test:watch`
- Current test files:
	- `src/pages/LocationsPage.test.tsx`
	- `src/pages/SearchLocationPage.test.tsx`

## Deploy (GitHub Pages)

This repo includes a GitHub Actions workflow at `.github/workflows/deploy.yml`.

1. Push your code to the `main` branch.
2. In GitHub, open **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.

After that, every push to `main` deploys automatically.

## Architecture Rationale

See [RATIONALE.md](RATIONALE.md) for a summary of component hierarchy, state management, custom hook decisions, and routing/data-fetching approach.

## Requirements Checklist

- [x] React + TypeScript application with Vite and 2–3 routes (`/`, `/search`, `/location/:query`, plus `*` fallback)
- [x] Component hierarchy with typed props and a composition pattern using `children`
- [x] Hooks: `useState`, `useEffect` (with cleanup), `useContext`, and a custom hook (`useWeather`)
- [x] Data fetching with loading, success, and error states
- [x] At least one form with controlled inputs and validation
- [x] At least 2–3 tests with React Testing Library (3 tests total)
- [x] Written architecture rationale (200–400 words) in [RATIONALE.md](RATIONALE.md)

## Data Source

Weather data and city lookup are provided by the public [Open-Meteo APIs](https://open-meteo.com/).
