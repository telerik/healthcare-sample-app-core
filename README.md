# Healthcare Sample App

A clinical dashboard single-page application built with **ASP.NET Core (.NET 10)** and **Telerik UI for ASP.NET Core**. It demonstrates a realistic healthcare workflow — patient management, appointment scheduling, clinical analytics, and AI-assisted notes — using a broad set of Kendo UI components declared via ASP.NET Core Html Helpers.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | ASP.NET Core MVC, .NET 10 |
| ORM / Database | Entity Framework Core 9 + SQLite |
| Frontend | jQuery 3.7.1 |
| UI Components | Telerik UI for ASP.NET Core v2026.1.325 |
| MVC Binding | `kendo.aspnetmvc.min.js` |
| Theme | Kendo UI Default Theme v13.1.1 |
| Fonts | Google Fonts — Poppins |

Widgets are declared in `.cshtml` views using **ASP.NET Core Html Helpers** (`Html.Kendo().Grid()`, `Html.Kendo().Dialog()`, etc.) and automatically initialized by `kendo.aspnetmvc.min.js`. JavaScript files in `wwwroot/js/` provide event handler callbacks and client-side logic.

The app uses a **PJAX-style navigation model**: page content swaps in-place without full reloads. Each page's JavaScript is loaded once and state is preserved in memory across navigation events.

Session isolation is handled server-side — each browser session gets a deep-copied dataset, so actions (adding notes, resolving alerts) don't affect other users.

---

## Pages

| Page | Route | Description |
|---|---|---|
| **Home** | `/` | Today's overview — appointments grid, next patient card, daily alerts, quick actions (FAB, AI chat) |
| **Schedule** | `/Schedule` | Appointment scheduler with week/day/agenda views |
| **Patients** | `/Patients` | Patient list grid with search, sorting, grouping, export; AI Assistance panel; patient detail drilldown |
| **Clinical Analytics** | `/Analytics` | Per-patient vitals chart, alerts charts, risk gauge, PDF export |

---

## Kendo UI Components

### Navigation & Layout
| Component | Where used |
|---|---|
| **AppBar** | Top navigation bar across all pages |
| **SegmentedControl** | Page navigation tabs in the app bar |
| **FloatingActionButton** | AI chat trigger on Home page |
| **Button** | Action buttons throughout (quick actions, export, close) |

### Data Display
| Component | Where used |
|---|---|
| **Grid** | Appointments (Home), Patients list, Labs (Patient detail) |
| **Scheduler** | Schedule page — week/day/month/agenda views |
| **Chart** | Vitals over time (line), alerts over time (column), alerts by type (donut) |
| **ArcGauge** | Patient risk score on Analytics page |
| **Chip** | Allergy indicators, status tags in patient cards |

### Forms & Input
| Component | Where used |
|---|---|
| **DropDownList** | Patient selectors in New Note and Request Lab dialogs; Analytics patient picker |
| **ComboBox** | Nurse recipient selector in Message Nurse dialog |
| **AutoComplete** | Global patient search in the app bar |

### Overlays & Feedback
| Component | Where used |
|---|---|
| **Dialog** | Quick Action dialogs (New Clinical Note, Request Lab Test, Message Nurse), Alert Review, Reason for Visit, Allergy Details, Appointment Detail |
| **Notification** | Save confirmation in the Profile settings panel |

### AI
| Component | Where used |
|---|---|
| **Chat** | AI Assistant on Home page (home-level FAB); AI Assistance panel on Patients page |

---

## How to Run

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- A modern browser (Chrome recommended)

### Start

```bash
# From the repository root
dotnet run
```

The app starts at **`http://localhost:5263/`**.

> The SQLite database (`healthcare.db`) is created and seeded automatically on first run. No setup steps are needed.

### HTTPS profile

```bash
dotnet run --launch-profile https
```

Starts at `https://localhost:7016/` (and `http://localhost:5263/`).

---

## Project Structure

```
Controllers/
  HomeController.cs          # Home page + session bootstrap
  PatientsController.cs      # Patients page
  ScheduleController.cs      # Schedule page + Scheduler DataSource actions
  AnalyticsController.cs     # Analytics page + chart data actions
  ApiController.cs           # REST API endpoints (/api/...)

Models/
  HealthcareDbContext.cs      # EF Core DbContext
  HealthcareDbSeeder.cs       # Seeds SQLite with demo data
  HealthcareDataStore.cs      # Per-session data store (scoped)
  HealthcareSeedStore.cs      # Master read-only data (singleton)
  PatientRecord.cs            # Patient domain model
  AppointmentModels.cs        # Appointment + scheduler models
  PartialViewModels.cs        # View models for partial views
  PatientAnalytics.cs         # Analytics view models

Views/
  Home/Index.cshtml
  Patients/Index.cshtml
  Schedule/Index.cshtml
  Analytics/Index.cshtml
  Shared/_Layout.cshtml            # App bar, page headers, CDN script tags
  Shared/_AppointmentDialog.cshtml # Partial view for appointment detail dialog

wwwroot/js/
  site.js                    # App bar, navigation, PJAX routing
  app.js                     # Home page Html Helper event handlers
  patients.js                # Patients grid, detail view, AI chat
  schedule.js                # Scheduler
  analytics.js               # Charts, gauge, export
  profile.js                 # Profile panel, notifications
  data.js                    # Shared data helpers and chip init
```

---

## E2E Tests

A full Selenium-based E2E test suite lives in [`tests/`](tests/README.md).
