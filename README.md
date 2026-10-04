# GreenPace city console

## Local development

Start the backend in a separate PowerShell terminal:

```powershell
cd "C:\Users\user\Downloads\smartcity\SmartCity-BE\HackYeahBackend"
dotnet run --project .\HackYeahBackend.csproj --launch-profile http -- --Seed:Enabled=true --Seed:Trips=400
```

The backend listens on http://localhost:5156 and seeds simulated trips, locations and rewards at startup. Its state is held in memory and is reset on restart.

From this frontend directory:

```powershell
npm.cmd ci
npm.cmd run dev:api
```

Open the URL printed by Vite. **City Impact** reads `/api/city/summary`, `/api/city/impact` and `/api/city/intersections`; its export downloads `/api/city/reports/intersections.csv`. **Live Traffic** reads `/api/city/traffic` through Vite's development proxy. The /api/ prefix is preserved. Errors, timeout (10 seconds by default), retry, loading and empty data are handled explicitly; API mode never falls back to mock traffic.

## Data modes

- `npm.cmd run dev` or `npm.cmd run dev:mock`: mock traffic; no backend requests, no API proxy.
- `npm.cmd run dev:api`: dashboard and traffic data from the backend. Seeded backend data is still labelled as simulated.
- `npm.cmd run build`: default mock build.
- `npm.cmd run build:api`: API build. In deployment, the web server must route /api/ to the backend; Vite's development proxy is not included in the build.

**City Impact** and **Live Traffic** are integrated in API mode. Mock mode preserves the illustrative dashboard without backend requests. API City Impact replaces the unsupported adoption chart, district breakdown and city score with computed metrics, modelled impact and an intersection ranking. Missing comparison data and per-section errors are shown explicitly. The demo traffic assistant is only shown in mock mode. Missing NO2 readings are displayed as missing data, and the air-pollution layer is hidden when no measurements exist.

Optional settings are documented in `.env.example`. Put overrides in `.env.local` and restart Vite. Mode-specific `.env.api` and `.env.mock` files set VITE_USE_MOCK. Existing shell environment variables and mode-specific local env files can override these settings.

## Checks

```powershell
npm.cmd test
npm.cmd run lint
npm.cmd run build
npm.cmd run build:api
```

The API client is shared in `src/services/api.js`; `src/hooks/useApiResource.js` handles loading, retry and cancellation on unmount.

In API mode, Live Traffic refreshes automatically every five seconds. Existing map data, zoom and layer selection remain visible while an update is fetched. Failed updates display a warning and retain the last successful data; polling retries automatically. Requests do not overlap, and polling stops when the page is closed. Mock mode does not poll the API. Road colours follow the selected metric so changes are visible along the corridors as well as at intersections.

## Backend Docker configuration

The backend repository at `C:\Users\user\Downloads\smartcity\SmartCity-BE` contains its own Dockerfile. It belongs to the backend repository and is not copied into this frontend repository.

That container listens on port 8080. Once the backend image is built and published as `8080:8080`, use this development proxy target:

```powershell
$env:API_PROXY_TARGET = 'http://localhost:8080'
npm.cmd run dev:api
```

With `dotnet run --launch-profile http`, retain the default target `http://localhost:5156`. The frontend always requests relative `/api/` URLs. For a deployed static frontend, configure the hosting server to forward `/api/` to the backend container.

The backend Dockerfile builds `HackYeahBackend/HackYeahBackend.csproj` and runs `HackYeahBackend.dll`. Build it from the backend repository root. The live traffic generator runs in the container by default, updating simulated driver observations every five seconds.
