# Innovation Project

The React application lives in `frontend/`. Backend source is maintained on the `backend` branch.

```text
frontend/
  public/              Static assets and HTML template
  src/
    assets/            Images and audio
    components/        Shared UI components
    pages/             Application pages and page tests
    App.js             Application entry component
    index.js           React entry point
  package.json         Dependencies and npm scripts
  package-lock.json    Locked dependency versions
  postcss.config.js    PostCSS configuration
  tailwind.config.js   Tailwind configuration
```

## Run the frontend

Create `frontend/.env.development` with `PORT=3001` before starting the app. This local configuration file is ignored by Git.

```bash
cd frontend
npm ci
npm start
```

The frontend runs at `http://localhost:3001`, configured in `frontend/.env.development`. The mission and game pages call the backend at `http://localhost:3000`.

## Validate the frontend

From the repository root:

```bash
npm --prefix frontend run build
CI=true npm --prefix frontend test -- --watchAll=false --runInBand --runTestsByPath src/pages/Mission.test.js
```

Generated directories such as `node_modules/`, `build/`, and `dist/` are ignored by Git and can remain on disk when switching branches.
