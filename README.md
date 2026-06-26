# Weather Dashboard

A React weather dashboard built with Vite.

## Scripts

- `npm install`
- `npm run dev`
- `npm run lint`
- `npm run build`

## Deploy (GitHub Pages)

This repo includes a GitHub Actions workflow at `.github/workflows/deploy.yml`.

1. Push your code to the `main` branch.
2. In GitHub, open **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.

After that, every push to `main` deploys automatically.

## Architecture Rationale

See [RATIONALE.md](RATIONALE.md) for a summary of component hierarchy, state management, custom hook decisions, and routing/data-fetching approach.

## Data Source

Weather data and city lookup are provided by the public [Open-Meteo APIs](https://open-meteo.com/).
