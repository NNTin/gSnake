# External Integrations

**Analysis Date:** 2026-02-09

## APIs & External Services

**Internal APIs:**
- Test Level API (gsnake-editor) - Stores and retrieves custom game levels for testing
  - SDK/Client: Express.js server at `localhost:3001/api/test-level`
  - Methods: POST (store level), GET (retrieve level)
  - CORS: Configured to allow localhost origins only for development

**Game Level Storage:**
- In-memory storage in gsnake-editor server (`/home/nntin/git/gSnake/gsnake-editor/server.ts`)
  - Expiration: 1 hour (EXPIRATION_TIME = 60 * 60 * 1000 ms)
  - Format: JSON with level definition (grid, snake position, food, obstacles, exit)

## Data Storage

**Databases:**
- Not applicable - No persistent database integration

**File Storage:**
- Local filesystem only - Level definitions stored in git (`gsnake-specs` submodule)
- WASM package distributed via local file dependency: `file:../gsnake-core/engine/bindings/wasm/pkg`

**Caching:**
- None detected - In-memory storage in Express server for test levels only
- CDN: GitHub Pages serves static assets from `gh-pages` branch

## Authentication & Identity

**Auth Provider:**
- None - Project is a public game with no user authentication
- CORS policy allows all localhost origins for local development

## Monitoring & Observability

**Error Tracking:**
- None detected - No external error tracking service integration

**Logs:**
- Console logging in Express server (`console.log` in `server.ts`)
- Playwright test logging and reporting
  - HTML reports: `artifacts/playwright-report`
  - Allure reports: `artifacts/allure-results`
- CI workflow logs via GitHub Actions

## CI/CD & Deployment

**Hosting:**
- GitHub Pages - Static site hosting at `nntin.xyz/gSnake`
- Deployment workflow: `.github/workflows/deploy.yml`
- Supports versioned deployments: `/gSnake/main/` and `/gSnake/v{version}/`

**CI Pipeline:**
- GitHub Actions
- Workflows:
  - `deploy.yml` - Triggered on push to main or version tags
  - `ci.yml` - Runs on push to main and pull requests
  - `settings.yml` - Repository settings configuration

**Build Process:**
- Validates Rust code via `cargo test contract_tests` and `cargo test generate_contract_fixtures`
- Builds WASM via `python3 scripts/build_wasm.py`
- TypeScript type checking via svelte-check
- Web tests via `npm --prefix gsnake-web test`
- E2E tests via Playwright in CI environment
- Version management: Updates package.json on version tags via git workflow

## Environment Configuration

**Required env vars:**
- `CI=true` - Set in CI workflows to disable test retries and force single worker
- `VITE_BASE_PATH` - Deployment path (set to `/gSnake/main/` or `/gSnake/{version}/`)
- `VITE_GSNAKE_WEB_URL` - E2E test config, defaults to `http://localhost:3000`

**Secrets location:**
- GitHub Secrets (if needed for submodules): `secrets.SUBMODULE_SSH_KEY`
- No `.env` file detected in repository

## Webhooks & Callbacks

**Incoming:**
- GitHub webhook (implicit via Actions trigger)
- Test level API accepts POST requests from editor UI
  - Endpoint: `POST http://localhost:3001/api/test-level`
  - Origin: CORS-restricted to localhost origins

**Outgoing:**
- GitHub Pages deployment triggered via `peaceiris/actions-gh-pages` action
- No external API calls detected in application code

## Port Configuration

**Local Development Ports:**
- **3000** - gsnake-web (Vite dev server, production preview)
- **3001** - gsnake-editor API server (Express, `/api/test-level` endpoint)
- **3003** - gsnake-editor (Vite dev server)

**Server Startup in CI:**
- Web preview: `nohup npm --prefix gsnake-web run preview -- --port 3000 --strictPort`
- Editor UI: `nohup npm --prefix gsnake-editor run dev:editor`
- Editor API: `nohup npm --prefix gsnake-editor run dev:server`

## Cross-Origin Resource Sharing (CORS)

**Configuration in Express:**
- Location: `/home/nntin/git/gSnake/gsnake-editor/server.ts` (lines 10-26)
- Policy:
  - Allows requests with no origin (e.g., CLI, mobile apps)
  - Allows all `http://localhost:*` and `http://127.0.0.1:*` origins
  - Blocks all other origins
- Methods: GET, POST
- Credentials: true

---

*Integration audit: 2026-02-09*
