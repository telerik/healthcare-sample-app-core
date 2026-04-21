# Responsive Layout — Test Coverage

**50 tests** in `src/responsive.test.ts`

All tests run at **1200×900** viewport (`< 1440px` breakpoint): icon-only nav, search icon toggle, single-column page layouts.

## AppBar — Responsive Navigation

| Test | What it verifies |
|---|---|
| should display the app bar | `#appbar` is visible at 1200×900 |
| should display the full logo (not compact) | `.logo-full` visible; `.logo-compact` hidden (compact shows only below 900px) |
| should show the navigation segmented control with 4 buttons | Segmented control visible with 4 buttons |
| should hide navigation button text (icon-only mode) | Computed `font-size` on nav buttons is `0px` |
| should show icons on navigation buttons | `.k-svg-icon` inside nav buttons is visible |
| should have Dashboard selected by default | 2nd button has `aria-pressed="true"` |
| should display the notification badge | `#notif-btn .k-badge` visible |
| should display the profile avatar | `#profile-trigger` visible |
| should hide the hamburger menu | `#hamburger-btn` not visible (hamburger only at `< 575px`) |

## AppBar — Search Icon Toggle

| Test | What it verifies |
|---|---|
| should hide the inline search autocomplete | `.appbar-right .k-autocomplete` not visible by default |
| should show the search icon button | `#btn-search-toggle` visible |
| should open search overlay when search icon is clicked | Clicking toggle adds `search-open` class to `#appbar` |
| should show search input with placeholder text | Autocomplete input visible with expected placeholder text |
| should show autocomplete suggestions when typing | Typing 'Emma' opens `.k-autocomplete-popup` |
| should close search overlay when clicking outside | ESC key removes `search-open` class from `#appbar` |

## AppBar — Search Functionality in Overlay

| Test | What it verifies |
|---|---|
| should open the search overlay via search icon | Search icon click opens overlay |
| should show matching suggestions when typing a patient name | Typing 'Emma' shows matching list items in popup |
| should clear the search input | Clearing input empties the autocomplete value |
| should show no data when typing a non-matching query | Typing 'ZZZNOMATCH999' shows `.k-no-data` with "No data found" |
| should close the overlay by clicking outside | Clicking `.home-greeting` closes the `search-open` overlay |

## Cross-Page Navigation — Icon-Only

| Test | What it verifies |
|---|---|
| should navigate to Schedule page via icon button | Clicking 3rd nav button loads the scheduler |
| should have Schedule button selected after navigation | 3rd button has `aria-pressed="true"` |
| should navigate to Patients page via icon button | Clicking 4th nav button loads the patients grid |
| should have Patients button selected after navigation | 4th button has `aria-pressed="true"` |
| should navigate to Analytics page via icon button | Clicking 5th nav button loads the vitals chart |
| should have Analytics button selected after navigation | 5th button has `aria-pressed="true"` |
| should navigate back to Dashboard via icon button | Clicking 2nd nav button returns to home (Quick Actions visible) |

## Home Page — Responsive Layout

| Test | What it verifies |
|---|---|
| should display the greeting | `.home-greeting` visible |
| should display the quick actions card | `.quick-actions-card` visible |
| should display the appointments grid | `#appointments-grid` visible |
| should stack page body to single column at this breakpoint | Computed `gridTemplateColumns` of `.page-body` does not contain `480px` |

## Schedule Page — Responsive Layout

| Test | What it verifies |
|---|---|
| should display the scheduler | `#scheduler[data-role="scheduler"]` visible |
| should display the tasks list | `#tasks-list[data-role="listview"]` visible |
| should stack the schedule body to column layout | Computed `flexDirection` of `.schedule-body` is `column` |
| should display the Daily Tasks card | `.tasks-card` visible |

## Patients Page — Responsive Layout

| Test | What it verifies |
|---|---|
| should display the patients grid | `#patients-grid[data-role="grid"]` visible |
| should stack patients page header to column layout | Computed `flexDirection` of `.patients-page-header` is `column` |
| should display the search icon button on Patients page | `#btn-search-toggle` visible on Patients page |
| should display the patients page title | `.patients-page-title` visible |

## Analytics Page — Responsive Layout

| Test | What it verifies |
|---|---|
| should display the vitals chart | `#vitals-chart[data-role="chart"]` visible |
| should display the risk gauge | `#risk-gauge[data-role="arcgauge"]` visible |
| should stack analytics page header to column layout | Computed `flexDirection` of `.analytics-page-header` is `column` |
| should display the patient selector dropdown | `.analytics-header-controls .k-dropdownlist` visible |

## Profile — Responsive

| Test | What it verifies |
|---|---|
| should open the profile window when avatar is clicked | Clicking `#profile-trigger` shows `#profile-window` |
| should display the profile title | Window title is "Profile Management" |
| should close the profile window | Close button via `executeScript` hides the window |

## Notifications — Responsive

| Test | What it verifies |
|---|---|
| should display the notification bell button | `#notif-btn` visible |
| should open notifications dropdown when bell is clicked | Clicking bell shows `#np-dropdown` |
| should display 7 notification cards | 7 `.np-card` elements rendered |
| should close the notifications dropdown | Clicking bell again hides `#np-dropdown` |
