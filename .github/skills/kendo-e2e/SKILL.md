---
name: kendo-e2e
description: 'E2E testing with kendo-e2e CLI. Use when: writing Selenium E2E tests, automating browser interactions, testing Kendo UI components, generating test code, debugging UI issues, visual regression testing. Provides token-efficient browser automation via CLI commands.'
argument-hint: 'Describe the testing task or component to test'
---

# kendo-e2e CLI — AI Agent Testing Skill

Token-efficient browser automation for E2E test generation. All heavy output (DOM snapshots, screenshots, find results) is saved to `.kendo-e2e/` on disk instead of the context window.

## When to Use

- Writing or generating E2E tests for web applications
- Testing Kendo UI components (Grid, DatePicker, DropDownList, etc.)
- Debugging UI issues by inspecting live pages
- Visual regression testing with screenshots
- Exploring page structure to find stable selectors

## CLI Commands

All commands use `npx kendo-e2e <command>`. Use `-s <name>` for named sessions.

| Command | Purpose | Output |
|---------|---------|--------|
| `open <url>` | Navigate browser to URL | Confirmation (stdout) |
| `close [--all]` | Close session(s) | Confirmation (stdout) |
| `reload` | Reload the current page | Confirmation (stdout) |
| `snapshot [--root sel] [--depth n] [--filename name]` | DOM snapshot — always use `--root` to scope | File: `.kendo-e2e/<name>.yaml` |
| `screenshot [--selector sel] [--filename name]` | Page or element screenshot | File: `.kendo-e2e/<name>.png` |
| `click <selector> [--timeout ms]` | Click element (auto-wait, default 2s) | Confirmation (stdout) |
| `type <selector> <text> [--timeout ms]` | Clear field then type (auto-wait, default 2s) | Confirmation (stdout) |
| `press <key>` | Press keyboard key (Enter, Tab, Escape, Arrow…) | Confirmation (stdout) |
| `find <selector> [--all] [--filename name] [--timeout ms]` | Query element properties (auto-wait, default 2s) | File: `.kendo-e2e/<name>.json` |
| `page-info` | Title, URL, viewport, counts | One-line summary (stdout) |
| `eval [script] [--file path]` | Run JS in browser | Small: stdout. Large: file |
| `install --skills` | Install this skill file | Copies SKILL.md to workspace |

> **Timeout override:** `click`, `type`, and `find` wait 2s by default. Use `--timeout 8000` for slow async loads.

> **Named output files:** Use `--filename` on `snapshot`, `screenshot`, and `find` to write to a predictable path (e.g. `--filename grid-before`) instead of a timestamped one. This saves a shell command to discover the latest file.

### Examples

```bash
# Start a session and take a snapshot of a specific component (preferred — keeps output small)
npx kendo-e2e open https://demos.telerik.com/kendo-ui/grid/index
npx kendo-e2e snapshot --root ".k-grid" --filename grid
# → always writes to .kendo-e2e/grid.yaml — no need to discover the filename

# Shallow snapshot for orientation (fast, small), then drill into a specific element
npx kendo-e2e snapshot --depth 3 --filename overview
npx kendo-e2e snapshot --root ".k-dialog" --filename dialog

# Full-page snapshot only when discovering page structure for the first time
npx kendo-e2e snapshot

# Interact with elements
npx kendo-e2e click ".k-grid-header th:nth-child(2)"
npx kendo-e2e type "#search-input" "hello world"

# Keyboard keys — no eval needed
npx kendo-e2e press Enter
npx kendo-e2e press Escape
npx kendo-e2e press Tab
npx kendo-e2e press ArrowDown

# Reload page — no eval needed
npx kendo-e2e reload

# Override timeout for slow async operations
npx kendo-e2e click "#slow-button" --timeout 8000
npx kendo-e2e find ".async-result" --timeout 5000

# Named find output
npx kendo-e2e find ".k-grid-edit-command" --filename edit-btn
# → always writes to .kendo-e2e/edit-btn.json

# Run JS from a file (avoids shell escaping issues for multi-line scripts)
npx kendo-e2e eval --file ./my-script.js

# Named sessions for multi-user testing
npx kendo-e2e -s admin open https://app.example.com/admin
npx kendo-e2e -s user open https://app.example.com
npx kendo-e2e -s admin click "#approve-btn"

# Take screenshot for visual check
npx kendo-e2e screenshot --selector ".k-grid" --filename grid-state
```

## Writing Tests with kendo-e2e

Tests use the `Browser` class from `@progress/kendo-e2e`. Key principle: **automatic waiting is built into every method** — no manual waits needed.

### Test Structure

```typescript
import { Browser } from '@progress/kendo-e2e';

describe('Component Test', () => {
    let browser: Browser;

    beforeAll(async () => {
        browser = new Browser();
    });

    afterAll(async () => {
        await browser.close();
    });

    it('should work', async () => {
        await browser.navigateTo('https://example.com');
        await browser.click('#button');
        await browser.expect('.result').toHaveText('Success');
    });
});
```

### Core API (most-used methods)

```typescript
// Navigation
await browser.navigateTo(url);

// Finding elements (auto-wait)
const el = await browser.find('#selector');
const els = await browser.findAll('.items');

// Interactions (auto-wait)
await browser.click('#btn');
await browser.type('#input', 'text');           // clears the field first, then types
await browser.type('#input', 'text', { clear: false }); // append without clearing
await browser.hover('#element');

// Expect API (auto-retry assertions)
await browser.expect('#el').toBeVisible();
await browser.expect('#el').not.toBeVisible();
await browser.expect('#el').toHaveText('expected');
await browser.expect('#el').toContainText('partial');
await browser.expect('#el').toHaveValue('input-value');  // for input/textarea current value
await browser.expect('#el').toHaveAttribute('class', 'active');
await browser.expect('#el').toHaveCount(5);
await browser.expect('#el').toBeEnabled();
await browser.expect('#el').toBeDisabled();
await browser.expect('#el').toBeChecked();
await browser.expect('#el').not.toBeEnabled();
await browser.expect('#el').not.toBeDisabled();
await browser.expect('#el').not.toBeChecked();
```

> **Always prefer `expect()` assertions over calling `el.getAttribute()` directly.**  
> `expect()` retries automatically — `getAttribute()` is a one-shot read that can fail on values that arrive after a short delay.
> ```typescript
> // ✅ Correct — retries until the value matches or timeout
> await browser.expect('#name-input').toHaveValue('Chai');
> await browser.expect('#price-input').toHaveValue('19');
> 
> // ❌ Avoid — reads the attribute once, no retry
> const el = await browser.find('#name-input');
> expect(await el.getAttribute('value')).toBe('Chai');
> ```

### Kendo UI Selectors

Kendo components use `data-role` attributes. Prefer these for stable selectors:

```typescript
// Grid
await browser.find('[data-role="grid"]');
await browser.find('.k-grid-header th');
await browser.find('.k-grid-content td');

// Form inputs
await browser.find('[data-role="datepicker"]');
await browser.find('[data-role="dropdownlist"]');
await browser.find('[data-role="combobox"]');
await browser.find('[data-role="numerictextbox"]');

// Navigation
await browser.find('[data-role="tabstrip"]');
await browser.find('[data-role="menu"]');
await browser.find('[data-role="treeview"]');

// Common Kendo CSS classes
// .k-grid, .k-calendar, .k-dialog, .k-dropdown,
// .k-button, .k-input, .k-checkbox, .k-radio
// .k-pager, .k-tabstrip, .k-menu, .k-treeview
```

### Environment Variables

```bash
BROWSER_NAME=chrome        # chrome, firefox, safari, MicrosoftEdge
HEADLESS=true              # Run without visible browser
BROWSER_WIDTH=1920         # Window width
BROWSER_HEIGHT=1080        # Window height
```

## Workflow: Generate Tests from Live Page

1. `npx kendo-e2e open <url>` — open the target page
2. `npx kendo-e2e snapshot --root "<component-selector>"` — scope the snapshot to the component you're testing (keeps the file small and focused)
3. Full-page `npx kendo-e2e snapshot` only when discovering overall page structure for the first time
4. Write test code using selectors found in the snapshot
5. `npx kendo-e2e screenshot --selector "<component>"` — capture visual state if needed
6. `npx kendo-e2e close` — clean up

## Reference

For the full API, see [API Reference](./references/api-reference.md).
For common patterns, see [Patterns](./references/patterns.md).
