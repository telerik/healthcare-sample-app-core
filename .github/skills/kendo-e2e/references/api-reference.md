# API Reference

Complete reference for kendo-e2e Browser API.

## Table of Contents

- [Browser Class](#browser-class)
- [Element Finding](#element-finding)
- [Element Interaction](#element-interaction)
- [Keyboard Input](#keyboard-input)
- [Waiting and Conditions](#waiting-and-conditions)
- [Expect API](#expect-api)
- [Navigation](#navigation)
- [Window Management](#window-management)
- [Testing Utilities](#testing-utilities)

---

## Browser Class

Main class for browser automation with automatic waiting.

### Constructor

```typescript
new Browser(options?: BrowserOptions | ThenableWebDriver)
```

Create a new Browser instance.

**Parameters:**
- `options` - Configuration object or existing WebDriver instance

**BrowserOptions:**
```typescript
{
    driver?: ThenableWebDriver;          // Use existing driver
    mobileEmulation?: {                   // Mobile device emulation
        deviceName: string                // e.g., 'iPhone 14 Pro Max'
    } | {
        width: number;
        height: number;
        pixelRatio: number;
    };
    enableBidi?: boolean;                 // Enable BiDi protocol
}
```

**Examples:**
```typescript
// Default browser
const browser = new Browser();

// With mobile emulation
const mobile = new Browser({
    mobileEmulation: { deviceName: 'iPhone 14 Pro Max' }
});

// Custom dimensions
const custom = new Browser({
    mobileEmulation: { width: 390, height: 844, pixelRatio: 3 }
});

// With BiDi enabled
const advanced = new Browser({ enableBidi: true });

// With existing driver
const browser = new Browser(existingDriver);
```

### close()

```typescript
await browser.close(): Promise<void>
```

Closes the browser and ends the WebDriver session. Always call this to clean up resources.

**Example:**
```typescript
afterAll(async () => {
    await browser.close();
});
```

---

## Element Finding

Methods for locating elements with automatic waiting.

### find()

```typescript
await browser.find(
    locator: By | string,
    options?: { timeout?: number; pollTimeout?: number }
): Promise<WebElement>
```

Finds a single element with automatic waiting. **This is the foundation** - most methods use this internally.

**Parameters:**
- `locator` - CSS selector string or Selenium By locator
- `options.timeout` - Max wait time in ms (default: 10000)
- `options.pollTimeout` - Retry interval in ms (default: 25)

**Returns:** Promise resolving to WebElement

**Examples:**
```typescript
// CSS selector
const button = await browser.find('#submit-button');
const header = await browser.find('.page-header');
const input = await browser.find('input[name="email"]');

// By locator
const element = await browser.find(By.xpath('//div[@data-test="value"]'));
const link = await browser.find(By.linkText('Click here'));

// With custom timeout
const slowElement = await browser.find('#async-content', { timeout: 20000 });
```

### findAll()

```typescript
await browser.findAll(locator: By | string): Promise<WebElement[]>
```

Finds all matching elements **without waiting**. Returns empty array if none found.

**Example:**
```typescript
const items = await browser.findAll('.list-item');
console.log(`Found ${items.length} items`);

for (const item of items) {
    const text = await item.getText();
    console.log(text);
}
```

### findAllWithTimeout()

```typescript
await browser.findAllWithTimeout(
    locator: By | string,
    options?: { timeout?: number; pollTimeout?: number }
): Promise<WebElement[]>
```

Finds all matching elements, **waiting for at least one** to appear.

**Example:**
```typescript
// Wait for search results to load
const results = await browser.findAllWithTimeout('.search-result');

// With custom timeout
const items = await browser.findAllWithTimeout('.async-item', { timeout: 15000 });
```

### findChild()

```typescript
await browser.findChild(
    rootElement: WebElement | By | string,
    locator: By | string,
    options?: { waitForChild?: boolean; timeout?: number; pollTimeout?: number }
): Promise<WebElement>
```

Finds a child element within a parent element with automatic waiting.

**Example:**
```typescript
// Find button within dialog
const dialog = await browser.find('.modal-dialog');
const closeBtn = await browser.findChild(dialog, '.close-button');

// Or find child directly using parent selector
const button = await browser.findChild('.modal-dialog', 'button.submit');
```

### findChildren()

```typescript
await browser.findChildren(
    rootElement: WebElement | By | string,
    locator: By | string,
    options?: { waitForChild?: boolean; timeout?: number; pollTimeout?: number }
): Promise<WebElement[]>
```

Finds all child elements within a parent.

**Example:**
```typescript
// Find all rows in specific table
const table = await browser.find('#data-table');
const rows = await browser.findChildren(table, 'tr');

// Or directly
const items = await browser.findChildren('.dropdown-menu', 'li');
```

---

## Element Interaction

Methods for interacting with elements (all with automatic waiting).

### click()

```typescript
await browser.click(
    element: WebElement | By | string,
    options?: { timeout?: number; pollTimeout?: number }
): Promise<void>
```

Clicks an element. **Automatically waits** for element to be present, visible, and enabled.

**Example:**
```typescript
await browser.click('#submit-button');
await browser.click(By.xpath('//button[text()="Submit"]'));

// With custom timeout
await browser.click('.slow-loading-btn', { timeout: 15000 });
```

### type()

```typescript
await browser.type(
    element: WebElement | By | string,
    text: string,
    options?: { clear?: boolean; sendEnter?: boolean }
): Promise<void>
```

Types text into an input element.

**Parameters:**
- `element` - Element to type into
- `text` - Text to type
- `options.clear` - Clear existing text first (default: true)
- `options.sendEnter` - Press Enter after typing (default: false)

**Example:**
```typescript
// Type into input (clears existing text)
await browser.type('#username', 'testuser');

// Type and submit
await browser.type('#search', 'search query', { sendEnter: true });

// Type without clearing
await browser.type('#notes', 'additional text', { clear: false });
```

### hover()

```typescript
await browser.hover(
    element: WebElement | By | string,
    options?: { timeout?: number; pollTimeout?: number }
): Promise<void>
```

Moves mouse over an element (hover action).

**Example:**
```typescript
// Hover to reveal dropdown
await browser.hover('.menu-item');
await browser.click('.submenu-option');

// Hover to show tooltip
await browser.hover('#info-icon');
const tooltip = await browser.find('.tooltip');
```

### focus()

```typescript
await browser.focus(
    element: WebElement | By | string,
    options?: { timeout?: number; pollTimeout?: number }
): Promise<void>
```

Sets keyboard focus on an element.

**Example:**
```typescript
// Focus input field
await browser.focus('#email');

// Focus before typing
await browser.focus('#search-box');
await browser.type('#search-box', 'test query');
```

### doubleClick()

```typescript
await browser.doubleClick(
    element: WebElement | By | string,
    options?: { timeout?: number; pollTimeout?: number }
): Promise<void>
```

Performs a double-click on an element.

**Example:**
```typescript
// Double-click to open file
await browser.doubleClick('.file-icon');

// Double-click to select word
await browser.doubleClick('.text-content');
```

### contextClick()

```typescript
await browser.contextClick(
    element: WebElement | By | string,
    options?: { timeout?: number; pollTimeout?: number }
): Promise<void>
```

Performs a right-click (context menu).

**Example:**
```typescript
// Open context menu
await browser.contextClick('.file-item');
await browser.click('.context-menu-delete');
```

### scrollAndClick()

```typescript
await browser.scrollAndClick(
    element: WebElement | By | string,
    options?: { timeout?: number; pollTimeout?: number }
): Promise<void>
```

Scrolls element into view and then clicks it. Use for off-screen elements.

**Example:**
```typescript
// Click element at bottom of page
await browser.scrollAndClick('#footer-button');
```

### scrollIntoView()

```typescript
await browser.scrollIntoView(
    locator: By | string,
    options?: { timeout?: number; pollTimeout?: number }
): Promise<void>
```

Scrolls element into viewport without clicking.

**Example:**
```typescript
// Scroll to element for screenshot
await browser.scrollIntoView('#chart');
const screenshot = await browser.getScreenshot();
```

### waitForAnimationAndClick()

```typescript
await browser.waitForAnimationAndClick(
    element: WebElement | By | string,
    options?: { timeout?: number; pollTimeout?: number }
): Promise<void>
```

Waits for element to stop animating, then clicks it.

**Example:**
```typescript
// Click button that slides into view
await browser.waitForAnimationAndClick('.animated-button');
```

### dragTo()

```typescript
await browser.dragTo(
    source: WebElement | By | string,
    target: WebElement | By | string
): Promise<void>
```

Drags source element and drops it on target element. Accepts CSS selector strings, By locators, or WebElements.

**Example:**
```typescript
// Drag using CSS selectors
await browser.dragTo('#card-1', '#column-done');

// Drag using By locators
await browser.dragTo(
    By.css('.list-item:nth-child(1)'),
    By.css('.list-item:nth-child(3)')
);

// Mix WebElement and CSS selector
const file = await browser.find('.file-icon');
await browser.dragTo(file, '.upload-dropzone');
```

### dragByOffset()

```typescript
await browser.dragByOffset(
    element: WebElement | By | string,
    offsetX: number,
    offsetY: number
): Promise<void>
```

Drags an element by pixel offset.

**Parameters:**
- `element` - Element to drag
- `offsetX` - Horizontal offset (positive = right, negative = left)
- `offsetY` - Vertical offset (positive = down, negative = up)

**Example:**
```typescript
// Drag slider to the right
await browser.dragByOffset('.slider-handle', 100, 0);

// Drag element down and left
await browser.dragByOffset('.draggable-box', -50, 75);
```

---

## Keyboard Input

Methods for keyboard interactions.

### sendKey()

```typescript
await browser.sendKey(key: string): Promise<void>
```

Sends a single keyboard key press.

**Example:**
```typescript
import { Key } from '@progress/kendo-e2e';

// Press Enter
await browser.sendKey(Key.ENTER);

// Press Tab
await browser.sendKey(Key.TAB);

// Press Escape
await browser.sendKey(Key.ESCAPE);

// Arrow keys
await browser.sendKey(Key.ARROW_DOWN);
await browser.sendKey(Key.ARROW_UP);
```

### sendKeyCombination()

```typescript
await browser.sendKeyCombination(key1: string, key2: string): Promise<void>
```

Sends a two-key combination.

**Example:**
```typescript
import { Key } from '@progress/kendo-e2e';

// Copy
await browser.sendKeyCombination(Key.CONTROL, 'c');

// Paste
await browser.sendKeyCombination(Key.CONTROL, 'v');
```

### sendKeysCombination()

```typescript
await browser.sendKeysCombination(keys: string[]): Promise<void>
```

Sends multiple keys simultaneously.

**Example:**
```typescript
import { Key } from '@progress/kendo-e2e';

// Ctrl+Shift+Delete
await browser.sendKeysCombination([Key.CONTROL, Key.SHIFT, Key.DELETE]);

// Select all
await browser.sendKeysCombination([Key.CONTROL, 'a']);
```

### sendControlKeyCombination()

```typescript
await browser.sendControlKeyCombination(key: string): Promise<void>
```

Sends Ctrl+key on Windows/Linux or Cmd+key on macOS automatically.

**Example:**
```typescript
// Copy (cross-platform)
await browser.sendControlKeyCombination('c');

// Paste (cross-platform)
await browser.sendControlKeyCombination('v');

// Select all (cross-platform)
await browser.sendControlKeyCombination('a');
```

---

## Waiting and Conditions

Methods for waiting and checking conditions.

### wait()

```typescript
await browser.wait(
    condition: WebElementCondition | WaitCondition,
    options?: { timeout?: number; message?: string; pollTimeout?: number }
): Promise<void>
```

Waits for a condition to become true. Throws error if timeout is reached.

**Example:**
```typescript
import { EC } from '@progress/kendo-e2e';

// Wait for element to be visible
await browser.wait(EC.isVisible('#modal'));

// Wait with custom timeout and message
await browser.wait(EC.hasText(element, 'Success'), {
    timeout: 15000,
    message: 'Success message did not appear'
});

// Wait for custom condition
await browser.wait(async () => {
    const items = await browser.findAll('.item');
    return items.length > 5;
}, { message: 'Less than 5 items found' });
```

### waitSafely()

```typescript
await browser.waitSafely(
    condition: WebElementCondition | WaitCondition,
    options?: { timeout?: number; pollTimeout?: number }
): Promise<boolean>
```

Waits for a condition **without throwing an error**. Returns true if met, false if timeout.

**Example:**
```typescript
import { EC } from '@progress/kendo-e2e';

// Check if element appears
const appeared = await browser.waitSafely(EC.isVisible('.optional-message'));
if (appeared) {
    console.log('Message was shown');
}

// Conditional test flow
const hasModal = await browser.waitSafely(EC.isVisible('.modal'), { timeout: 3000 });
if (hasModal) {
    await browser.click('.modal .close');
}
```

### waitForAnimation()

```typescript
await browser.waitForAnimation(
    element: WebElement | By | string,
    options?: { timeout?: number; pollTimeout?: number }
): Promise<void>
```

Waits for an element to stop moving or resizing (animation to complete).

**Example:**
```typescript
// Wait for sliding panel to stop
await browser.waitForAnimation('.slide-panel');
await browser.click('.slide-panel button');

// Wait before screenshot
await browser.waitForAnimation('.chart');
const screenshot = await browser.getScreenshot();
```

### sleep()

```typescript
await browser.sleep(milliseconds: number): Promise<void>
```

Pauses execution for specified time. **Avoid using this** - use `wait()` or `expect()` instead.

**Example:**
```typescript
// ❌ Don't do this
await browser.sleep(2000);

// ✅ Do this instead
await browser.expect('#element').toBeVisible();
```

### Expected Conditions (EC)

Pre-built condition functions for use with `wait()` and `waitSafely()`.

```typescript
import { EC } from '@progress/kendo-e2e';
```

#### EC.isVisible()
```typescript
EC.isVisible(element: WebElement | By | string): WaitCondition
```

Wait for element to be visible.

```typescript
await browser.wait(EC.isVisible('#modal'));
```

#### EC.notVisible()
```typescript
EC.notVisible(element: WebElement | By | string): WaitCondition
```

Wait for element to become hidden or be removed.

```typescript
await browser.wait(EC.notVisible('.spinner'));
```

#### EC.hasText()
```typescript
EC.hasText(element: WebElement, text: string): WaitCondition
```

Wait for element to have specific text.

```typescript
const message = await browser.find('#message');
await browser.wait(EC.hasText(message, 'Operation completed'));
```

#### EC.hasValue()
```typescript
EC.hasValue(element: WebElement, value: string): WaitCondition
```

Wait for input element to have specific value.

```typescript
const input = await browser.find('#email');
await browser.wait(EC.hasValue(input, 'user@example.com'));
```

#### EC.hasFocus()
```typescript
EC.hasFocus(element: WebElement): WaitCondition
```

Wait for element to have keyboard focus.

```typescript
const input = await browser.find('#search');
await browser.wait(EC.hasFocus(input));
```

#### EC.hasNoFocus()
```typescript
EC.hasNoFocus(element: WebElement): WaitCondition
```

Wait for element to lose keyboard focus.

```typescript
const input = await browser.find('#field');
await browser.wait(EC.hasNoFocus(input));
```

#### EC.hasAttribute()
```typescript
EC.hasAttribute(
    element: WebElement,
    attribute: string,
    value: string,
    exactMatch?: boolean
): WaitCondition
```

Wait for element to have specific attribute value.

```typescript
const button = await browser.find('#submit');
await browser.wait(EC.hasAttribute(button, 'disabled', 'true'));
```

#### EC.hasClass()
```typescript
EC.hasClass(
    element: WebElement,
    value: string,
    exactMatch?: boolean
): WaitCondition
```

Wait for element to have specific CSS class.

```typescript
const button = await browser.find('#toggle');
await browser.wait(EC.hasClass(button, 'active'));
```

#### EC.hasChild()
```typescript
EC.hasChild(element: WebElement, locator: By | string): WaitCondition
```

Wait for element to have at least one child matching locator.

```typescript
const list = await browser.find('ul#results');
await browser.wait(EC.hasChild(list, 'li'));
```

#### EC.isInViewport()
```typescript
EC.isInViewport(element: WebElement | By | string): WaitCondition
```

Wait for element to be in visible viewport.

```typescript
await browser.wait(EC.isInViewport('.footer-content'));
```

#### EC.notInViewport()
```typescript
EC.notInViewport(element: WebElement | By | string): WaitCondition
```

Wait for element to be outside visible viewport.

```typescript
await browser.wait(EC.notInViewport('#top-element'));
```

---

## Expect API

Modern, fluent API for assertions with automatic retry. See [expect.md](./expect.md) for full details.

### expect()

```typescript
browser.expect(selector: string | By): ExpectApi
```

Creates an expectation API for element assertions.

**Returns:** ExpectApi with assertion methods

### toHaveText()

```typescript
await browser.expect(selector).toHaveText(
    text: string | RegExp,
    opts?: { timeout?: number; message?: string; pollInterval?: number }
): Promise<void>
```

Assert element has specific text (auto-retries until timeout).

**Example:**
```typescript
// Exact match
await browser.expect('#message').toHaveText('Success');

// Regex pattern
await browser.expect('#status').toHaveText(/complete|success/i);

// Custom timeout
await browser.expect('#result').toHaveText('Done', { timeout: 5000 });
```

### toBeVisible()

```typescript
await browser.expect(selector).toBeVisible(
    opts?: { timeout?: number; message?: string; pollInterval?: number }
): Promise<void>
```

Assert element is visible (auto-retries).

**Example:**
```typescript
await browser.expect('.modal').toBeVisible();
await browser.expect('#notification').toBeVisible({ timeout: 5000 });
```

### toHaveValue()

```typescript
await browser.expect(selector).toHaveValue(
    value: string,
    opts?: { timeout?: number; message?: string; pollInterval?: number }
): Promise<void>
```

Assert input has specific value (auto-retries).

**Example:**
```typescript
await browser.expect('#email').toHaveValue('user@example.com');
```

### toHaveFocus()

```typescript
await browser.expect(selector).toHaveFocus(
    opts?: { timeout?: number; message?: string; pollInterval?: number }
): Promise<void>
```

Assert element has keyboard focus (auto-retries).

**Example:**
```typescript
await browser.expect('#activeInput').toHaveFocus();
```

### toHaveAttribute()

```typescript
await browser.expect(selector).toHaveAttribute(
    attribute: string,
    value: string,
    opts?: { timeout?: number; message?: string; pollInterval?: number; exactMatch?: boolean }
): Promise<void>
```

Assert element has specific attribute value (auto-retries).

**Example:**
```typescript
await browser.expect('#submit').toHaveAttribute('disabled', 'true');
await browser.expect('#link').toHaveAttribute('href', '/dashboard', { exactMatch: false });
```

### toHaveClass()

```typescript
await browser.expect(selector).toHaveClass(
    className: string,
    opts?: { timeout?: number; message?: string; pollInterval?: number; exactMatch?: boolean }
): Promise<void>
```

Assert element has specific CSS class (auto-retries).

**Example:**
```typescript
await browser.expect('#button').toHaveClass('active');
await browser.expect('#div').toHaveClass('btn btn-primary', { exactMatch: true });
```

### toBeEnabled() / toBeDisabled()

```typescript
await browser.expect(selector).toBeEnabled(opts?): Promise<void>
await browser.expect(selector).toBeDisabled(opts?): Promise<void>
```

Assert element is enabled or disabled (auto-retries). Uses WebDriver's `isEnabled()`.

**Example:**
```typescript
await browser.expect('#submit').toBeEnabled();
await browser.expect('#submit').toBeDisabled();
```

### toBeChecked()

```typescript
await browser.expect(selector).toBeChecked(opts?): Promise<void>
await browser.expect(selector).not.toBeChecked(opts?): Promise<void>
```

Assert checkbox/radio is checked or unchecked (auto-retries). Uses WebDriver's `isSelected()`.

**Example:**
```typescript
await browser.expect('#agree-checkbox').toBeChecked();
await browser.expect('#opt-out').not.toBeChecked();
```

### toContainText()

```typescript
await browser.expect(selector).toContainText(
    text: string,
    opts?: { timeout?: number; message?: string; pollInterval?: number }
): Promise<void>
```

Assert element text contains a substring (auto-retries).

**Example:**
```typescript
await browser.expect('#message').toContainText('success');
await browser.expect('.alert').not.toContainText('error');
```

### toHaveCount()

```typescript
await browser.expect(selector).toHaveCount(
    count: number,
    opts?: { timeout?: number; message?: string; pollInterval?: number }
): Promise<void>
```

Assert that a specific number of elements match the selector (auto-retries).

**Example:**
```typescript
await browser.expect('.list-item').toHaveCount(5);
await browser.expect('.error').toHaveCount(0);
```

### Negative Assertions

```typescript
browser.expect(selector).not.toBeVisible(opts?): Promise<void>
browser.expect(selector).not.toHaveFocus(opts?): Promise<void>
browser.expect(selector).not.toHaveText(text, opts?): Promise<void>
browser.expect(selector).not.toHaveValue(value, opts?): Promise<void>
browser.expect(selector).not.toHaveAttribute(attr, value, opts?): Promise<void>
browser.expect(selector).not.toHaveClass(className, opts?): Promise<void>
browser.expect(selector).not.toBeChecked(opts?): Promise<void>
browser.expect(selector).not.toContainText(text, opts?): Promise<void>
browser.expect(selector).not.toBeEnabled(opts?): Promise<void>
browser.expect(selector).not.toBeDisabled(opts?): Promise<void>
```

**Example:**
```typescript
// Wait for element to disappear
await browser.expect('.spinner').not.toBeVisible();

// Wait for focus to move away
await browser.expect('#previous-field').not.toHaveFocus();

// Verify text changed
await browser.expect('#status').not.toHaveText('Loading');

// Verify input cleared
await browser.expect('#search').not.toHaveValue('old query');

// Verify class removed
await browser.expect('#panel').not.toHaveClass('expanded');

// Verify checkbox unchecked
await browser.expect('#opt-out').not.toBeChecked();

// Verify button is no longer enabled / disabled
await browser.expect('#submit').not.toBeEnabled();
await browser.expect('#submit').not.toBeDisabled();
```

---

## Navigation

Methods for browser navigation.

### navigateTo()

```typescript
await browser.navigateTo(url: string): Promise<void>
```

Navigates to a URL.

**Example:**
```typescript
await browser.navigateTo('https://example.com');
await browser.navigateTo('http://localhost:3000');
```

### refresh()

```typescript
await browser.refresh(): Promise<void>
```

Refreshes the current page.

**Example:**
```typescript
await browser.click('#update-settings');
await browser.refresh();
```

### getCurrentUrl()

```typescript
await browser.getCurrentUrl(): Promise<string>
```

Gets the current URL.

**Example:**
```typescript
const url = await browser.getCurrentUrl();
expect(url).toContain('/products');
```

### switchToIFrame()

```typescript
await browser.switchToIFrame(elementLocator: By): Promise<void>
```

Switches context to an iframe.

**Example:**
```typescript
// Switch to iframe
await browser.switchToIFrame(By.css('#my-iframe'));
await browser.click('#button-inside-iframe');

// Switch back to main page
await browser.driver.switchTo().defaultContent();
```

---

## Window Management

Methods for controlling the browser window.

### resizeWindow()

```typescript
await browser.resizeWindow(width: number, height: number): Promise<void>
```

Resizes the browser window.

**Example:**
```typescript
// Desktop size
await browser.resizeWindow(1920, 1080);

// Mobile size
await browser.resizeWindow(375, 667);
```

### getRect()

```typescript
await browser.getRect(): Promise<IRectangle>
```

Gets current window dimensions and position.

**Returns:** `{ width, height, x, y }`

### setRect()

```typescript
await browser.setRect(rect: {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
}): Promise<void>
```

Sets window dimensions and/or position.

---

## Testing Utilities

Methods for testing and debugging.

### getScreenshot()

```typescript
await browser.getScreenshot(): Promise<string>
```

Takes a screenshot, returns base64-encoded image.

**Example:**
```typescript
const screenshot = await browser.getScreenshot();
// Save or compare screenshot
```

### hideCursor()

```typescript
await browser.hideCursor(
    element?: WebElement | By | string,
    options?: { timeout?: number; pollTimeout?: number }
): Promise<void>
```

Hides text cursor for cleaner screenshots. Perfect for visual testing where blinking cursor can cause inconsistencies.

**Example:**
```typescript
// Hide all cursors globally
await browser.hideCursor();

// Hide cursor for specific element
await browser.hideCursor('#input');
```

### clearLogs()

```typescript
await browser.clearLogs(): Promise<void>
```

Clears browser console logs.

**Example:**
```typescript
await browser.clearLogs();
await browser.click('#trigger-action');
const errors = await browser.getErrorLogs();
```

### getErrorLogs()

```typescript
await browser.getErrorLogs(
    excludeList?: string[],
    logLevel?: Level
): Promise<string[]>
```

Gets console errors from browser (Chrome only).

**Parameters:**
- `excludeList` - Strings to filter out (default: `['favicon.ico']`)
- `logLevel` - Minimum severity (default: `Level.SEVERE`)

**Example:**
```typescript
const errors = await browser.getErrorLogs();
expect(errors.length).toBe(0);

// Exclude known warnings
const errors = await browser.getErrorLogs(['favicon', 'analytics']);
```

### getAccessibilityViolations()

```typescript
await browser.getAccessibilityViolations(
    cssSelector?: string,
    disableRules?: string[]
): Promise<[]>
```

Runs accessibility tests using axe-core.

**Parameters:**
- `cssSelector` - Limit scope (default: `'html'`)
- `disableRules` - Rules to skip (default: `['color-contrast']`)

**Example:**
```typescript
// Scan entire page
const violations = await browser.getAccessibilityViolations();
expect(violations.length).toBe(0);

// Scan specific component
const formViolations = await browser.getAccessibilityViolations('#login-form');

// Enable all rules
const allViolations = await browser.getAccessibilityViolations('html', []);
```

### getBrowserName()

```typescript
await browser.getBrowserName(): Promise<string>
```

Gets the browser name ('chrome', 'firefox', 'safari', 'edge').

**Example:**
```typescript
const browserName = await browser.getBrowserName();
if (browserName === 'safari') {
    // Skip Safari-specific test
    return;
}
```

### executeScript()

```typescript
await browser.executeScript(
    script: string,
    waitBeforeMs?: number,
    waitAfterMs?: number
): Promise<unknown>
```

Executes JavaScript in the browser context.

**Example:**
```typescript
// Get page title
const title = await browser.executeScript('return document.title;');

// With waits
const height = await browser.executeScript(
    'return document.body.scrollHeight;',
    500,  // wait before
    200   // wait after
);
```

### getText()

```typescript
await browser.getText(element: WebElement | By | string): Promise<string>
```

Gets visible text content of an element.

**Example:**
```typescript
const text = await browser.getText('#message');
const buttonText = await browser.getText('.submit-btn');
```

### getAttribute()

```typescript
await browser.getAttribute(
    element: WebElement | By | string,
    attribute: string
): Promise<string>
```

Gets an HTML attribute value.

**Example:**
```typescript
const href = await browser.getAttribute('a.download', 'href');
const isDisabled = await browser.getAttribute('#submit', 'disabled');
const dataId = await browser.getAttribute('.user', 'data-user-id');
```

### getProperty()

```typescript
await browser.getProperty(
    element: WebElement | By | string,
    property: string
): Promise<string>
```

Gets a JavaScript property value (different from attribute).

**Example:**
```typescript
const isChecked = await browser.getProperty('#agree', 'checked');
const currentValue = await browser.getProperty('#username', 'value');
```

### getColor()

```typescript
await browser.getColor(element: WebElement | By | string): Promise<string>
```

Gets text color as hex value.

**Example:**
```typescript
const errorColor = await browser.getColor('.error-message');
expect(errorColor).toBe('#ff0000');
```

### getBackgroundColor()

```typescript
await browser.getBackgroundColor(element: WebElement | By | string): Promise<string>
```

Gets background color as hex value.

**Example:**
```typescript
const btnBg = await browser.getBackgroundColor('#primary-btn');
expect(btnBg).toBe('#007bff');
```

---

## Environment Variables

Configure browser behavior via environment variables:

| Variable | Values | Default | Description |
|----------|--------|---------|-------------|
| `BROWSER_NAME` | `chrome`, `firefox`, `safari`, `MicrosoftEdge` | `chrome` | Browser to use |
| `BROWSER_WIDTH` | number | `1366` | Browser window width |
| `BROWSER_HEIGHT` | number | `768` | Browser window height |
| `HEADLESS` | `true`, `false` | `false` | Run in headless mode |

**Example:**
```bash
BROWSER_NAME=firefox HEADLESS=true npm test
```

---

## Key Imports

```typescript
import { Browser, By, Key, EC } from '@progress/kendo-e2e';
```

- `Browser` - Main browser class
- `By` - Selenium locator strategies
- `Key` - Keyboard key constants
- `EC` - Expected Conditions helpers

---

## TypeScript Types

```typescript
import type {
    ThenableWebDriver,
    WebElement,
    WebElementCondition,
    ExpectApi,
    WaitCondition
} from '@progress/kendo-e2e';
```

---

For more details:
- **Getting Started:** [GETTING_STARTED.md](./GETTING_STARTED.md)
- **Common Patterns:** [PATTERNS.md](./PATTERNS.md)
