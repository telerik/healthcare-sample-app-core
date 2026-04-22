---
description: "Healthcare app specialist. Use when: building new features, modifying pages, adding Kendo UI widgets, creating dialogs, writing E2E tests, debugging UI issues, exploring page DOM, understanding app architecture. Covers ASP.NET Core backend, Kendo UI jQuery frontend, and kendo-e2e test automation."
tools: [read, edit, search, execute, web, agent, todo]
---

# Healthcare App Agent

You are a specialist for the Healthcare Sample App — an ASP.NET Core (.NET 10) + Telerik UI for ASP.NET Core medical dashboard. You can build new features, modify existing pages, and write E2E tests.

**Always load the kendo-e2e skill** before writing or modifying tests:
- Read `.github/skills/kendo-e2e/SKILL.md` FIRST
- Then read `.github/skills/kendo-e2e/references/api-reference.md` and `.github/skills/kendo-e2e/references/patterns.md`

---

## Application Architecture

### Tech Stack

| Layer | Technology |
|---|---|
| Backend | ASP.NET Core .NET 10, EF Core SQLite |
| Frontend | Telerik UI for ASP.NET Core v2026.1.325, jQuery 3.7.1, `kendo.aspnetmvc.min.js` |
| Tests | vitest + TypeScript, `@progress/kendo-e2e` Browser class |
| Server URL | `https://localhost:7016` (also `http://localhost:5263`) |

### Project Structure

```
Program.cs                          # App setup, DI, middleware, routes, AddKendo()
Controllers/
  HomeController.cs                 # GET / (home page)
  PatientsController.cs             # GET /patients
  ScheduleController.cs             # GET /schedule + Scheduler CRUD actions
  AnalyticsController.cs            # GET /analytics + chart data actions
  ApiController.cs                  # REST API at /api/* (AJAX endpoints)
Models/
  PatientRecord.cs                  # Main entity with vitals, labs, meds, visits
  AppointmentModels.cs              # ScheduleAppointment, TodayAppointment, DailyTask
  PartialViewModels.cs              # AppointmentDialogViewModel and other partial view models
  PatientAnalytics.cs               # Analytics chart data models
  HealthcareDataStore.cs            # Scoped per-session data access (deep-copy from seed)
  HealthcareDataRepository.cs       # Static deterministic seed data
  HealthcareSeedStore.cs            # Singleton master data from SQLite
  UserDataCache.cs                  # ConcurrentDictionary session isolation
Views/
  Home/Index.cshtml                 # Dashboard: grid, alerts, quick actions, AI chat
  Patients/Index.cshtml             # Grid + drilldown detail with editor, labs
  Schedule/Index.cshtml             # Scheduler + tasks list
  Analytics/Index.cshtml            # Charts, gauges, bullet charts
  Shared/_Layout.cshtml             # AppBar, nav, search, notifications, profile
  Shared/_AppointmentDialog.cshtml  # Partial view for appointment dialog content
wwwroot/js/
  data.js                           # Shared constants, patient helpers (loaded globally)
  site.js                           # Navigation, page headers, search (loaded globally)
  profile.js                        # Profile window, notifications (loaded globally)
  app.js                            # Home page event handlers for Html Helper widgets
  patients.js                       # Patients grid, preview, drilldown, status change
  schedule.js                       # Scheduler, tasks, appointment dialog
  analytics.js                      # Charts, gauge, dropdown, PDF export
wwwroot/css/
  custom.css                        # All app-specific styles
  kendo-theme-overrides.css         # Kendo theme customizations
tests/
  vitest.config.ts                  # Sequential execution, 60s timeout
  src/config.ts                     # BASE_URL = https://localhost:7016
  src/global-teardown.ts            # Closes all kendo-e2e sessions after tests
  src/*.test.ts                     # 12 test files, 505 tests
  coverage/                          # Per-page test coverage reports
    README.md                        # Index with totals and links
    home.md                          # Home page (170 tests)
    schedule.md                      # Scheduler (87 tests)
    patients.md                      # Patients list (43 tests)
    patient-detail.md                # Patient detail drilldown (36 tests)
    analytics.md                     # Analytics (61 tests)
    profile-and-search.md            # Profile & search (21 tests)
    notifications.md                 # Notifications (24 tests)
    navigation.md                    # Cross-page navigation (13 tests)
    responsive.md                    # Responsive layout (50 tests)
```

---

## Pages & Widgets Reference

### Home Page (`/`, JS: `app.js`)

| Widget | Element ID | Type |
|---|---|---|
| Appointments Grid | `#appointments-grid` | kendoGrid (Html Helper) |
| New Clinical Note | `#dialog-new-note` | kendoDialog (Html Helper) |
| Request Lab Tests | `#dialog-lab-test` | kendoDialog (Html Helper) |
| Message Nurse | `#dialog-nurse-chat` | kendoDialog (Html Helper) |
| Alert Review | `#dialog-alert-review` | kendoDialog (Html Helper) |
| Reason for Visit | `#dialog-reason-visit` | kendoDialog (Html Helper) |
| Allergy Details | `#dialog-allergy-details` | kendoDialog (Html Helper) |
| AI Assistant | `#dialog-ai-assistant` | kendoDialog (Html Helper, non-modal) |
| AI Chat | `#ai-chat` | kendoChat (Html Helper) |
| AI FAB | `#ai-float-btn` | kendoFloatingActionButton (Html Helper) |

**Triggers:**
- `#btn-new-note` → calls `onNewNoteClick()` → opens `#dialog-new-note`
- `#btn-lab-test` → calls `onLabTestClick()` → opens `#dialog-lab-test`
- `#btn-nurse-chat` → calls `onNurseChatClick()` → opens `#dialog-nurse-chat`
- `.alert-review` click → opens `#dialog-alert-review`
- `#link-reason-details` → opens `#dialog-reason-visit`
- `#link-allergy-details` → opens `#dialog-allergy-details`
- `#ai-float-btn` → calls `onAiFloatBtnClick()` → toggles `#dialog-ai-assistant`
- `.ar-profile-link` → navigates to `/patients` (stores patientId in sessionStorage)
- `.view-profile-link` → navigates to `/patients` (stores patientId in sessionStorage)

### Schedule Page (`/schedule`, JS: `schedule.js`)

| Widget | Element ID | Type |
|---|---|---|
| Scheduler | `#scheduler` | kendoScheduler (Html Helper) |
| Tasks List | `#tasks-list` | kendoListView (Html Helper) |
| Priority Filter | `#tasks-priority-filter` | kendoButtonGroup |
| Add Task | `#add-task-dialog` | kendoDialog (Html Helper) |
| View Task | `#view-task-dialog` | kendoDialog (Html Helper) |
| Appointment Detail | `#appointment-dialog` | kendoDialog (Html Helper, expand/collapse) |

**Triggers:**
- `#btn-add-task` → opens `#add-task-dialog`
- `.task-text` click → opens `#view-task-dialog`
- Scheduler event double-click → opens `#appointment-dialog` (loads `_AppointmentDialog` partial via AJAX)
- `.appt-expand-btn` → toggles patient info section in appointment dialog

### Patients Page (`/patients`, JS: `patients.js`)

| Widget | Element ID | Type |
|---|---|---|
| Patients Grid | `#patients-grid` | kendoGrid (Html Helper) |
| AI Chat | `#list-ai-chat` | kendoChat (Html Helper) |
| Change Status | `#change-status-dialog` | kendoDialog (Html Helper) |
| Patient Notes Editor | `#patient-notes-editor` | kendoEditor (Html Helper, in drilldown) |
| Patient Labs Grid | `#patient-labs-grid` | kendoGrid (Html Helper, in drilldown) |

**Triggers:**
- `.btn-view-patient` click → opens patient drilldown (`#patients-detail-view`)
- `.patient-name-cell` dblclick → opens preview panel (`#patient-preview-panel`)
- `#btn-ai-assistance` → toggles `#list-ai-dialog` (Kendo Dialog, not a panel div)
- `#btn-export-patients` → Excel export
- `#breadcrumb-back` → returns to grid

### Analytics Page (`/analytics`, JS: `analytics.js`)

| Widget | Element ID | Type |
|---|---|---|
| Patient Selector | `#patient-select` | kendoDropDownList (Html Helper) |
| Vitals Chart | `#vitals-chart` | kendoChart (Html Helper, line) |
| Alerts Column | `#alerts-column-chart` | kendoChart (Html Helper, stacked column) |
| Alerts Donut | `#alerts-donut-chart` | kendoChart (Html Helper, donut) |
| Risk Gauge | `#risk-gauge` | kendoArcGauge (Html Helper) |
| Export PDF | `#btn-export-analytics` | kendoButton (Html Helper) |

### Global (all pages, JS: `site.js` + `profile.js`)

| Widget | Element ID | Type |
|---|---|---|
| Navigation | `#appbar-nav` | kendoSegmentedControl (Html Helper) |
| Patient Search | `#appbar-search` | kendoAutoComplete (Html Helper) |
| Profile Window | `#profile-window` | kendoWindow (Html Helper, modal) |
| Notifications | `#np-dropdown` | kendoWindow (Html Helper, non-modal) |
| Notification Badge | `#notif-badge` | kendoBadge |

---

## API Endpoints

### REST API (ApiController — `/api/*`)

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/patients` | All patient records |
| POST | `/api/patients/update` | Update patient (status, notes, doctor) |
| POST | `/api/patients/{id}/notes` | Replace patient notes |
| POST | `/api/patients/{id}/add-note` | Prepend a note entry |
| POST | `/api/patients/{id}/status` | Update patient status |
| GET | `/api/alerts` | Daily alerts |
| GET | `/api/today-appointments` | Home grid data |
| GET | `/api/appointments` | Scheduler read (raw JSON) |
| POST | `/api/appointments/create` | Scheduler create |
| POST | `/api/appointments/update` | Scheduler update |
| POST | `/api/appointments/destroy` | Scheduler delete |
| GET | `/api/analytics` | All patient analytics |
| GET | `/api/analytics/{patientId}` | Single patient analytics |
| GET | `/api/event-types` | Scheduler event type options |
| GET | `/api/rooms` | Room options |
| GET | `/api/tasks` | Daily tasks |
| POST | `/api/tasks/create` | Create task |
| POST | `/api/tasks/update` | Update task |
| GET | `/api/profile` | Doctor profile |
| POST | `/api/profile/update` | Update profile |
| POST | `/api/profile/avatar` | Update avatar (base64) |
| POST | `/api/profile/avatar-upload` | Upload avatar (form file) |

### Schedule Controller Actions (Kendo MVC DataSource)

| Method | Route | Purpose |
|---|---|---|
| POST | `/schedule/appointments-read` | Scheduler DataSource read (ToDataSourceResult) |
| POST | `/schedule/appointments-create` | Scheduler DataSource create |
| POST | `/schedule/appointments-update` | Scheduler DataSource update |
| POST | `/schedule/appointments-destroy` | Scheduler DataSource destroy |
| POST | `/schedule/tasks-read` | Tasks ListVIew DataSource read |
| GET | `/schedule/appointment-dialog-partial` | Load `_AppointmentDialog` partial view |

### Analytics Controller Actions

| Method | Route | Purpose |
|---|---|---|
| GET | `/analytics/vitals-history?patientId=...` | Vitals chart data |
| GET | `/analytics/alerts-over-time?patientId=...` | Alerts column chart data |
| GET | `/analytics/alerts-by-category?patientId=...` | Alerts donut chart data |
| GET | `/analytics/lab-results?patientId=...` | Lab results chart data |
| GET | `/analytics/risk-score?patientId=...` | Risk gauge score |

---

## Building New Features

### Widget Initialization Pattern

Widgets are declared in `.cshtml` files using ASP.NET Core Html Helpers and automatically initialized by `kendo.aspnetmvc.min.js`. JavaScript in `wwwroot/js/` provides event handler callbacks.

**View (Index.cshtml):**
```csharp
@(Html.Kendo().Dialog()
    .Name("dialog-my-feature")
    .Title("My Feature")
    .Width(480)
    .Modal(true)
    .Visible(false)
    .Actions(a =>
    {
        a.Add().Text("Cancel");
        a.Add().Text("Save").Primary(true).Action("onMyFeatureSave");
    })
    .Content("<div class='dialog-field'>...</div>")
)

@(Html.Kendo().Button()
    .Name("btn-my-feature")
    .Content("My Feature")
    .Icon("plus")
    .Events(e => e.Click("onMyFeatureClick"))
)
```

**JavaScript (app.js or page JS file):**
```javascript
function onMyFeatureClick() {
    $("#dialog-my-feature").data("kendoDialog").open();
}
function onMyFeatureSave() {
    // save logic
    return true; // close dialog
}
```

**API** (if needed) — add action to `ApiController.cs`:
```csharp
[HttpPost("my-feature")]
public IActionResult MyFeature([FromBody] MyModel model) { ... }
```

**CSS**: Add styles in `wwwroot/css/custom.css` following existing patterns.

### Adding a Grid Column

1. Add field to model in `Models/`
2. Add seed data in `HealthcareDataRepository.cs`
3. Add `.Columns(c => c.Bound(m => m.NewField).Title("New Field"))` to the HTML Helper in the view
4. Update E2E tests for the grid (column count, column name assertions)

### Cross-Page Navigation Pattern

The app uses `sessionStorage` to pass state between pages:
```javascript
sessionStorage.setItem("openPatientId", patientId);
window.location.href = navRoutes.Patients;
```
On the target page, `sessionStorage.getItem("openPatientId")` is read on grid load to auto-open drilldown.

---

## E2E Testing Conventions

### Test File Structure

```typescript
import { Browser, Grid, Pager, DropDownList, Key } from '@progress/kendo-e2e';
import BASE_URL from './config';

describe('Page Name — Feature', () => {
    let browser: Browser;
    let grid: Grid; // when page has a kendoGrid

    beforeAll(async () => {
        browser = new Browser();
        grid = new Grid(browser, '#my-grid');
        await browser.navigateTo(`${BASE_URL}/page`);
    });

    afterAll(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        expect(await browser.getErrorLogs()).toEqual([]);
    });

    afterEach(async () => {
        expect(await browser.getErrorLogs()).toEqual([]);
    });

    it('should do something', async () => {
        await browser.expect('#element').toBeVisible();
    });
});
```

### Dialog Close Pattern

All dialogs use this close selector:
```typescript
await browser.click('#dialog-id ~ .k-dialog-actions .k-button');
```

### Grid / Pager / DropDownList Abstractions

Use higher-level classes instead of raw selectors for grid assertions:

```typescript
// Grid row counts
const grid = new Grid(browser, '#my-grid');
expect(await grid.masterRowsCount()).toBe(10);
await grid.waitForRows(20);   // waits until exactly 20 rows
await grid.isEmpty();          // checks .k-grid-norecords (not pager "no items")

// Pager
const pager = await grid.pager();
expect(await pager.infoText()).toBe('1 - 10 of 30 items');
expect(await pager.selectedPage()).toBe('1');
await browser.click(await pager.pageButton(2)); // 1-indexed
await browser.click(await pager.firstPage());
const pages = await pager.pageButtons();
expect(pages.length).toBe(3);

// Page size DropDownList (via pager)
const ddl = await pager.dropDownList();
expect(await ddl.getText()).toBe('10'); // getText() returns displayed value
// ddl.getValue() reads hidden input attribute → returns null for Kendo DDL, avoid it

// Visibility checks: use CSS string, NOT await pager.root() / await ddl.root()
// root() returns WebElement, browser.expect() requires a string selector
await browser.expect('#my-grid .k-pager').toBeVisible();
await browser.expect('#my-grid .k-pager-sizes .k-dropdownlist').toBeVisible();
await browser.expect('#my-grid .k-pager-sizes .k-input-value-text').toHaveText('10');

// Pager DDL selection
await ddl.selectItemByText('20');   // triggers proper select + waitToCollapse

// Standalone page DDL (e.g., analytics #patient-select)
// Use expand() + setFilter() + waitForItems(count === 1) + getItemByIndex(0).click() for filtered selection
// Use selectItemByIndex(n) for positional selection (0-based, skips <div> optionLabel)
const analyticsDdl = new DropDownList(browser, '.analytics-header-controls .k-dropdownlist');
await analyticsDdl.selectItemByIndex(0);          // select first item
await analyticsDdl.expand();
await analyticsDdl.waitToExpand();
await analyticsDdl.setFilter('Olivia Davis');
await browser.wait(async () => (await analyticsDdl.getItems({ waitForItems: false })).length === 1);
await (await analyticsDdl.getItemByIndex(0)).click();
await analyticsDdl.waitToCollapse();
```

### Known Gotchas

| Issue | Solution |
|---|---|
| Kendo DropDownList selection | Use `executeScript` with widget API: `var ddl = $('#id').data('kendoDropDownList'); ddl.select(1); ddl.trigger('change');` |
| Window close button overlap | Use `executeScript`: `document.querySelector('.k-window-titlebar-action[aria-label="Close"]').click()` |
| Partial CSS class matching | Use `toHaveClass('k-selected', { exactMatch: false })` |
| Element below viewport | Call `browser.scrollIntoView('.selector')` before assertion |
| Uppercase CSS text | Assert with `toBeVisible()` instead of `toContainText()` when CSS `text-transform: uppercase` is applied |
| jQuery event delegation | `widget.tbody.on("dblclick", ...)` does not respond to Selenium `doubleClick()` — test via alternative button instead |
| Lab test item selection | Class is `selected` not `checked`: `toHaveClass('selected', { exactMatch: false })` |
| `executeScript` jQuery access | Use `kendo.jQuery(...)` not `$()` — `$` may not be globally available in script context |
| `root()` on widget abstractions | `pager.root()` / `ddl.root()` return `WebElement`, not a CSS string — never pass to `browser.expect()` |
| `ddl.getValue()` returns null | Reads hidden `<select>` element's `value` attribute (not set by Kendo) — use `ddl.getText()` or `browser.expect('.k-input-value-text')` |
| `browser.expect().toHaveCount()` vs `findAll()` | `toHaveCount()` auto-retries (async-safe); `findAll()` is a one-shot snapshot — prefer `toHaveCount()` for assertions that may need to wait |
| DDL item count | Use `dataSource.total()` via `executeScript` for reliable item counts; DOM option count may lag after re-render |
| DDL scope must be `.k-dropdownlist` wrapper | `new DropDownList(browser, selector)` scope must point to the `.k-dropdownlist` wrapper element, NOT the hidden `<input>` or `<select>` id (e.g., use `'.analytics-header-controls .k-dropdownlist'` not `'#patient-select'`) |
| DDL inside dialogs with focus timers | Avoid `selectItemByIndex`/`selectItemByText` for DDLs inside dialogs that steal focus via `setTimeout(...focus(), 100)` — use `executeScript` Kendo API instead (`ddl.select(n); ddl.trigger('change')`) |
| DDL `setFilter` + click filtered item | After `setFilter(text)`, wait for `items.length === 1` using `getItems({waitForItems: false})` before clicking — the default `getItems()` returns immediately (items already exist before filter applies) |
| `selectItemByText` requires exact match | Uses XPath `li[.="text"]` — full visible text including templates (e.g., `'Olivia Davis (P-1003)'` not just `'Olivia Davis'`) |
| HTML Helper widget IDs | Html Helpers render the same element IDs as raw JS init — CSS selectors like `#appointments-grid` work identically in tests |
| `kendo.aspnetmvc.min.js` DataSource format | Scheduler and Grid DataSources using `ToDataSourceResult()` return wrapped `{ Data: [...], Total: N }` — handle via the MVC binding, not raw fetch |

### DOM Exploration with CLI

Before writing tests for new features, explore the live DOM:
```bash
npx kendo-e2e open https://localhost:7016
npx kendo-e2e snapshot --root "#my-widget" --filename my-widget
npx kendo-e2e find ".my-selector" --all --filename my-elements
npx kendo-e2e close
```

### Running Tests

```bash
cd tests
npx vitest run --reporter=verbose           # Full suite
npx vitest run src/home.test.ts             # Single file
```

Tests run with `fileParallelism: true`, `maxWorkers: 2`. All tests run at **1920×1080** (set via `env: { BROWSER_WIDTH: '1920', BROWSER_HEIGHT: '1080' }` in `vitest.config.ts`). Server must be running on port 7016 (HTTPS) or 5263 (HTTP).

### Starting the Server

```bash
# From the project root
dotnet run --launch-profile https
# or
dotnet run --launch-profile http
```

---

## Writing Test Coverage Reports

Coverage reports live in `tests/coverage/`. Each file documents all test scenarios for a page.

### Format

```markdown
# [Page Name] — Test Coverage

**[N] tests** in `src/[file].test.ts`

## [Feature Area]

| Test | What it verifies |
|---|---|
| should render the widget | Widget is visible on page load |
| should do X when Y | Behavior description |
```

Follow the existing coverage files (e.g., `home.md`, `patients.md`) as format templates.

---

## Responsive Layout

### CSS Breakpoints

| Breakpoint | Viewport | Key Behaviors |
|---|---|---|
| `max-width: 1439px` | 900–1439px | Icon-only nav (`font-size: 0`), search icon toggle, `page-body` single-column when page has `.col-side`, schedule/patients/analytics headers stack vertically |
| `max-width: 900px` | 576–900px | Compact logo (`.logo-compact` shown, `.logo-full` hidden), fullscreen chat dialogs, `page-body` always single-column |
| `max-width: 575px` | 360–575px | Hamburger menu (`#hamburger-btn`) visible, segmented nav hidden |

### Search Icon Toggle (≤ 1439px)

At this breakpoint the inline autocomplete is hidden and a search icon button appears:
- `#btn-search-toggle` click adds class `search-open` to `#appbar`
- When `search-open`, the autocomplete expands as a full-width overlay
- Clicking outside (any element outside `#appbar` / `.k-autocomplete-popup`) removes `search-open`
- Do **not** use `Key.ESCAPE` to close — it may not trigger the jQuery outside-click handler reliably

### Responsive Test Configuration

- **All existing tests** run at **1920×1080** via `vitest.config.ts` `env: { BROWSER_WIDTH: '1920', BROWSER_HEIGHT: '1080' }`
- **`responsive.test.ts`** calls `browser.resizeWindow(1200, 900)` in `beforeAll` — covers the `max-width: 1439px` breakpoint
- One browser instance per file; resized once, navigates across pages with `beforeAll` blocks per describe

### Key DOM Checks at 1200×900

| Behavior | Check |
|---|---|
| Search icon visible | `#btn-search-toggle` visible |
| Inline search hidden | `.appbar-right .k-autocomplete` not visible |
| Search overlay open | `#appbar` has class `search-open` |
| Nav icon-only | `getComputedStyle('.appbar-nav .k-segmented-control-button').fontSize === '0px'` |
| Hamburger hidden | `#hamburger-btn` not visible |
| Full logo visible | `.logo-full` visible; `.logo-compact` not visible |
| Schedule stacks | `getComputedStyle('.schedule-body').flexDirection === 'column'` |
| Patients header stacks | `getComputedStyle('.patients-page-header').flexDirection === 'column'` |
| Analytics header stacks | `getComputedStyle('.analytics-page-header').flexDirection === 'column'` |
| Home body single-column | `getComputedStyle('.page-body').gridTemplateColumns` does not contain `480px` |

### Responsive Known Gotchas

| Issue | Solution |
|---|---|
| DDL filter input closes popup when cleared | Use `browser.type(selector, text, { clear: false })` — default `clear: true` sends a clear event that closes the Kendo popup |
| ESC after DDL popup leaves widget state out of sync | Close popup by clicking outside (e.g. a page header element) instead of `sendKey(Key.ESCAPE)` — ESC leaves internal widget state inconsistent for subsequent `expand()` calls |
| AJAX re-render race with `findAll()` | Use `browser.expect(selector).toHaveCount(n)` (auto-retries) instead of `findAll()` when content re-renders via AJAX (e.g. notifications mark-all-read) |
