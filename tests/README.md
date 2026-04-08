# Healthcare Sample App — E2E Tests

End-to-end test suite for the Healthcare Sample App (ASP.NET Core). Uses [Vitest](https://vitest.dev/) as the test runner and [`@progress/kendo-e2e`](https://www.npmjs.com/package/@progress/kendo-e2e) for browser automation.

## Requirements

- [Node.js](https://nodejs.org/) 18+
- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- Google Chrome (used by the browser automation driver)

---

## Setup

### 1. Start the app

From the repo root, start the ASP.NET Core application:

```bash
dotnet run
```

The app must be running at `https://localhost:7016` before tests are executed. The base URL is configured in [`src/config.ts`](src/config.ts).

### 2. Install test dependencies

From the `tests/` directory:

```bash
npm install
```

---

## Running Tests

All commands must be run from the `tests/` directory.

### Run all tests

```bash
npm test
```

### Run a single test file

```bash
npx vitest run src/home.test.ts
```

### Run with verbose output (show individual test names)

```bash
npx vitest run --reporter=verbose
```

### Run in watch mode (re-runs on file save)

```bash
npm run test:watch
```

---

## Test Files

| File | Page | Tests |
|------|------|-------|
| `src/home.test.ts` | Home — static structure | 42 |
| `src/home-interactions.test.ts` | Home — interactions & dialogs | 83 |
| `src/schedule.test.ts` | Scheduler — static structure | 24 |
| `src/schedule-interactions.test.ts` | Scheduler — interactions | 35 |
| `src/patients.test.ts` | Patients list | 34 |
| `src/patient-detail.test.ts` | Patient detail drilldown | 36 |
| `src/analytics.test.ts` | Analytics — static structure | 27 |
| `src/analytics-interactions.test.ts` | Analytics — interactions | 20 |
| `src/notifications.test.ts` | Notifications panel | 24 |
| `src/profile-and-search.test.ts` | Profile & global search | 19 |
| `src/navigation.test.ts` | Cross-page navigation | 9 |

**Total: 356 tests**

---

## Configuration

| File | Purpose |
|------|---------|
| `vitest.config.ts` | Vitest settings (timeout, parallelism, file patterns) |
| `src/config.ts` | Base URL (`http://localhost:5263`) |
| `tsconfig.json` | TypeScript compiler options |

### Key vitest settings

- `fileParallelism: false` / `maxWorkers: 1` — tests run sequentially to avoid browser session conflicts
- `testTimeout: 60000` — 60 s per test (allows for slow async UI operations)
- `hookTimeout: 30000` — 30 s for `beforeAll` / `afterAll` hooks

### Environment variables

The browser can be configured with environment variables before running tests:

```bash
BROWSER_NAME=chrome        # chrome (default), firefox, MicrosoftEdge
HEADLESS=true              # run without a visible browser window
BROWSER_WIDTH=1920
BROWSER_HEIGHT=1080
```

Example — run headless:

```bash
HEADLESS=true npm test
```

---

## Coverage Report

Per-page coverage details are in [`coverage/`](coverage/README.md).
