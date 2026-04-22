# Common Testing Patterns

Real-world patterns and best practices for writing reliable e2e tests with kendo-e2e.

## Table of Contents

- [Form Testing](#form-testing)
- [Navigation](#navigation)
- [Modal Dialogs](#modal-dialogs)
- [Dynamic Content](#dynamic-content)
- [Tables and Lists](#tables-and-lists)
- [File Uploads](#file-uploads)
- [Drag and Drop](#drag-and-drop)
- [Keyboard Navigation](#keyboard-navigation)
- [Visual Testing](#visual-testing)
- [Error Handling](#error-handling)
- [Mobile Testing](#mobile-testing)

## Form Testing

### Basic Form Submission

```typescript
it('should submit registration form', async () => {
    await browser.navigateTo('https://example.com/register');

    // Fill form fields
    await browser.type('#firstName', 'John');
    await browser.type('#lastName', 'Doe');
    await browser.type('#email', 'john@example.com');
    await browser.type('#password', 'SecurePass123!');
    await browser.type('#confirmPassword', 'SecurePass123!');

    // Check checkbox
    await browser.click('#agreeToTerms');

    // Submit
    await browser.click('#submitButton');

    // Verify success
    await browser.expect('.success-message').toBeVisible();
    await browser.expect('.success-message').toHaveText('Registration successful!');
});
```

### Form Validation

Use real user interactions to trigger validation — clicking submit, clicking another field, or pressing Tab. Avoid `executeScript` for this unless real interactions genuinely cannot trigger the behavior.

```typescript
it('should show validation errors on empty submit', async () => {
    await browser.navigateTo('https://example.com/form');

    // Submit without filling — triggers required validation
    await browser.click('#submit');

    await browser.expect('#email-error').toBeVisible();
    await browser.expect('#email-error').toHaveText('Email is required');
});

it('should show format error for invalid input', async () => {
    await browser.navigateTo('https://example.com/form');

    await browser.type('#email', 'invalid-email');
    // Click submit (or another field) to trigger validation
    await browser.click('#submit');

    await browser.expect('#email-error').toHaveText('Invalid email format');
});

it('should clear validation error once valid input is provided', async () => {
    await browser.navigateTo('https://example.com/form');

    // Trigger validation
    await browser.click('#submit');
    await browser.expect('#email-error').toBeVisible();

    // Fix the value and re-submit
    await browser.type('#email', 'valid@example.com');
    await browser.click('#submit');

    await browser.expect('#email-error').not.toBeVisible();
});
```

### Multi-Step Form

```typescript
it('should complete multi-step wizard', async () => {
    await browser.navigateTo('https://example.com/wizard');

    // Step 1: Personal Info
    await browser.expect('.step-indicator').toHaveText('Step 1 of 3');
    await browser.type('#name', 'John Doe');
    await browser.type('#email', 'john@example.com');
    await browser.click('#next-button');

    // Step 2: Address
    await browser.expect('.step-indicator').toHaveText('Step 2 of 3');
    await browser.type('#street', '123 Main St');
    await browser.type('#city', 'New York');
    await browser.click('#next-button');

    // Step 3: Confirmation
    await browser.expect('.step-indicator').toHaveText('Step 3 of 3');
    await browser.expect('.review-name').toHaveText('John Doe');
    await browser.expect('.review-email').toHaveText('john@example.com');
    await browser.click('#submit-button');

    // Success
    await browser.expect('.completion-message').toBeVisible();
});
```

## Navigation

### Page Navigation with Verification

```typescript
it('should navigate through site', async () => {
    await browser.navigateTo('https://example.com');

    // Navigate to products
    await browser.click('a[href="/products"]');
    await browser.expect('h1').toHaveText('Products');
    
    // Verify URL changed
    const url = await browser.getCurrentUrl();
    expect(url).toContain('/products');

    // Navigate back
    await browser.driver.navigate().back();
    await browser.expect('h1').toHaveText('Home');
});
```

### Menu Navigation

```typescript
it('should navigate through dropdown menu', async () => {
    await browser.navigateTo('https://example.com');

    // Hover to show dropdown
    await browser.hover('.nav-item-products');
    await browser.expect('.dropdown-menu').toBeVisible();

    // Click submenu item
    await browser.click('.dropdown-menu a[href="/products/widgets"]');
    await browser.expect('h1').toHaveText('Widgets');
});
```

## Modal Dialogs

### Opening and Closing Modals

```typescript
it('should open and close modal', async () => {
    await browser.navigateTo('https://example.com');

    // Open modal
    await browser.click('#open-modal-button');
    await browser.expect('.modal').toBeVisible();
    await browser.expect('.modal-title').toHaveText('Confirm Action');

    // Close modal
    await browser.click('.modal .close-button');
    await browser.expect('.modal').not.toBeVisible();
});
```

### Modal with Form Submission

```typescript
it('should submit form in modal', async () => {
    await browser.navigateTo('https://example.com/dashboard');

    // Open edit modal
    await browser.click('.edit-button');
    await browser.expect('#edit-modal').toBeVisible();

    // Edit in modal
    await browser.type('#edit-modal #name', 'Updated Name');
    await browser.type('#edit-modal #description', 'New description');
    await browser.click('#edit-modal #save-button');

    // Modal should close
    await browser.expect('#edit-modal').not.toBeVisible();

    // Verify update
    await browser.expect('.item-name').toHaveText('Updated Name');
});
```

### Waiting for Modal Animation

```typescript
it('should wait for animated modal', async () => {
    await browser.navigateTo('https://example.com');

    await browser.click('#show-modal');
    
    // Wait for animation to complete before interacting
    await browser.waitForAnimation('.modal');
    await browser.click('.modal #confirm-button');
});
```

## Dynamic Content

### Waiting for AJAX Content

```typescript
it('should load dynamic content', async () => {
    await browser.navigateTo('https://example.com/dashboard');

    // Click to load data
    await browser.click('#load-data-button');

    // Wait for loading spinner to appear and disappear
    await browser.expect('.spinner').toBeVisible();
    await browser.expect('.spinner').not.toBeVisible({ timeout: 10000 });

    // Verify content loaded
    const items = await browser.findAllWithTimeout('.data-item');
    expect(items.length).toBeGreaterThan(0);
});
```

### Infinite Scroll

```typescript
it('should handle infinite scroll', async () => {
    await browser.navigateTo('https://example.com/feed');

    // Count initial items
    let items = await browser.findAll('.feed-item');
    const initialCount = items.length;

    // Scroll to bottom
    await browser.driver.executeScript('window.scrollTo(0, document.body.scrollHeight)');

    // Wait for new items to load
    await browser.sleep(1000); // Give time for scroll trigger

    // Verify more items loaded
    items = await browser.findAll('.feed-item');
    expect(items.length).toBeGreaterThan(initialCount);
});
```

### Polling for Updates

```typescript
it('should wait for status update', async () => {
    await browser.navigateTo('https://example.com/job/123');

    // Start job
    await browser.click('#start-button');

    // Wait for status to change (with longer timeout)
    await browser.expect('.status').toHaveText('Processing', { timeout: 2000 });
    await browser.expect('.status').toHaveText('Complete', { timeout: 30000 });

    // Verify completion
    await browser.expect('.success-icon').toBeVisible();
});
```

## Tables and Lists

### Sorting and Filtering

```typescript
it('should sort table by column', async () => {
    await browser.navigateTo('https://example.com/products');

    // Click column header to sort
    await browser.click('th.price-column');

    // Verify sort indicator
    await browser.expect('th.price-column .sort-asc').toBeVisible();

    // Get first row price
    const firstPrice = await browser.getText('tbody tr:first-child .price');
    
    // Click again to reverse sort
    await browser.click('th.price-column');
    await browser.expect('th.price-column .sort-desc').toBeVisible();

    // Verify order changed
    const newFirstPrice = await browser.getText('tbody tr:first-child .price');
    expect(newFirstPrice).not.toBe(firstPrice);
});
```

### List Filtering

```typescript
it('should filter list items', async () => {
    await browser.navigateTo('https://example.com/products');

    // Type in search box
    await browser.type('#search-input', 'widget');

    // Wait for filter to apply
    await browser.sleep(300); // Debounce time

    // Verify filtered results
    const items = await browser.findAllWithTimeout('.product-item');
    
    for (const item of items) {
        const text = await item.getText();
        expect(text.toLowerCase()).toContain('widget');
    }
});
```

## File Uploads

### Single File Upload

```typescript
it('should upload file', async () => {
    await browser.navigateTo('https://example.com/upload');

    // Set file input value (absolute path)
    const filePath = '/absolute/path/to/test-file.pdf';
    const fileInput = await browser.find('input[type="file"]');
    await fileInput.sendKeys(filePath);

    // Submit upload
    await browser.click('#upload-button');

    // Verify upload success
    await browser.expect('.upload-success').toBeVisible();
    await browser.expect('.file-name').toHaveText('test-file.pdf');
});
```

## Drag and Drop

### Reordering List Items

```typescript
it('should reorder items by drag and drop', async () => {
    await browser.navigateTo('https://example.com/sortable-list');

    // Drag first item to third position
    await browser.dragTo(
        '.list-item:nth-child(1)',
        '.list-item:nth-child(3)'
    );

    // Verify new order
    const firstItem = await browser.getText('.list-item:nth-child(1)');
    const secondItem = await browser.getText('.list-item:nth-child(2)');
    
    expect(firstItem).toBe('Item 2');
    expect(secondItem).toBe('Item 3');
});
```

### Moving Between Containers

```typescript
it('should move item between lists', async () => {
    await browser.navigateTo('https://example.com/kanban');

    // Drag from "To Do" to "In Progress"
    await browser.dragTo(
        '#todo .task-card:first-child',
        '#in-progress'
    );

    // Verify task moved
    const todoTasks = await browser.findAll('#todo .task-card');
    const inProgressTasks = await browser.findAll('#in-progress .task-card');
    
    expect(inProgressTasks.length).toBeGreaterThan(0);
});
```

## Keyboard Navigation

### Tab Navigation

```typescript
it('should navigate form with Tab key', async () => {
    await browser.navigateTo('https://example.com/form');

    // Focus first input
    await browser.click('#firstName');
    await browser.expect('#firstName').toHaveFocus();

    // Tab to next field
    await browser.sendKey(Key.TAB);
    await browser.expect('#lastName').toHaveFocus();

    // Tab to email
    await browser.sendKey(Key.TAB);
    await browser.expect('#email').toHaveFocus();
});
```

### Keyboard Shortcuts

```typescript
it('should use keyboard shortcuts', async () => {
    await browser.navigateTo('https://example.com/editor');

    // Type some text
    await browser.click('.editor');
    await browser.type('.editor', 'Sample text');

    // Select all (Ctrl+A / Cmd+A)
    await browser.sendControlKeyCombination('a');

    // Copy (Ctrl+C / Cmd+C)
    await browser.sendControlKeyCombination('c');

    // Move to another field
    await browser.click('#output');

    // Paste (Ctrl+V / Cmd+V)
    await browser.sendControlKeyCombination('v');

    // Verify paste
    await browser.expect('#output').toHaveValue('Sample text');
});
```

### Arrow Key Navigation

```typescript
it('should navigate dropdown with arrow keys', async () => {
    await browser.navigateTo('https://example.com/search');

    // Type to open suggestions
    await browser.type('#search', 'test');
    await browser.expect('.suggestions').toBeVisible();

    // Arrow down to select first suggestion
    await browser.sendKey(Key.ARROW_DOWN);
    await browser.expect('.suggestion:nth-child(1)').toHaveClass('highlighted');

    // Arrow down again
    await browser.sendKey(Key.ARROW_DOWN);
    await browser.expect('.suggestion:nth-child(2)').toHaveClass('highlighted');

    // Press Enter to select
    await browser.sendKey(Key.ENTER);
    await browser.expect('#search').toHaveValue('test result 2');
});
```

## Visual Testing

### Screenshot with Hidden Cursor

```typescript
it('should take clean screenshot', async () => {
    await browser.navigateTo('https://example.com/form');

    // Fill form
    await browser.type('#username', 'testuser');
    await browser.focus('#username');

    // Hide cursor for clean screenshot
    await browser.hideCursor();

    // Take screenshot
    const screenshot = await browser.getScreenshot();
    
    // Compare or save screenshot
    // expect(screenshot).toMatchImageSnapshot();
});
```

### Responsive Testing

```typescript
it('should test responsive layout', async () => {
    // Desktop view
    await browser.resizeWindow(1920, 1080);
    await browser.navigateTo('https://example.com');
    await browser.expect('.desktop-menu').toBeVisible();
    await browser.expect('.mobile-menu').not.toBeVisible();

    // Mobile view
    await browser.resizeWindow(375, 667);
    await browser.refresh();
    await browser.expect('.mobile-menu').toBeVisible();
    await browser.expect('.desktop-menu').not.toBeVisible();
});
```

### Waiting for Animations

```typescript
it('should wait for transitions', async () => {
    await browser.navigateTo('https://example.com');

    // Click to trigger animation
    await browser.click('#expand-panel');

    // Wait for animation to complete
    await browser.waitForAnimation('.panel-content');

    // Now safe to take screenshot or interact
    const screenshot = await browser.getScreenshot();
});
```

## Error Handling

### Checking Console Errors

```typescript
it('should have no console errors', async () => {
    // Clear previous logs
    await browser.clearLogs();

    await browser.navigateTo('https://example.com');
    await browser.click('#load-content');

    // Check for errors
    const errors = await browser.getErrorLogs();
    expect(errors.length).toBe(0);
});
```

### Accessibility Testing

```typescript
it('should pass accessibility audit', async () => {
    await browser.navigateTo('https://example.com');

    // Run a11y check on entire page
    const violations = await browser.getAccessibilityViolations();
    expect(violations.length).toBe(0);
});

it('should pass accessibility audit on modal', async () => {
    await browser.navigateTo('https://example.com');
    await browser.click('#open-modal');

    // Check only the modal
    const violations = await browser.getAccessibilityViolations('.modal');
    expect(violations.length).toBe(0);
});
```

## Mobile Testing

### Mobile Device Emulation

```typescript
describe('Mobile Tests', () => {
    let browser: Browser;

    beforeAll(async () => {
        // Start with mobile emulation
        browser = new Browser({
            mobileEmulation: { deviceName: 'iPhone 14 Pro Max' }
        });
    });

    afterAll(async () => {
        await browser.close();
    });

    it('should work on mobile', async () => {
        await browser.navigateTo('https://example.com');
        
        // Mobile-specific interactions
        await browser.click('.mobile-menu-toggle');
        await browser.expect('.mobile-menu').toBeVisible();
        
        await browser.click('.mobile-menu a[href="/products"]');
        await browser.expect('h1').toHaveText('Products');
    });
});
```


## Testing Best Practices

1. **Browser lifecycle management** - Use `beforeAll`/`afterAll` for browser lifecycle (start once, not per test)
2. **Use id or css selectors** - CSS Selectors using kendo classes (like ".k-grid", ".k-menu-item") are good choice because we don't change them often and they are required to enable kendo-themes work properly.
3. **Avoid sleep()** - All basic interactions have build in waits, so no need to use sleep. Use `await browser.wait(<condition>)` if you need to wait for custom conditions. Use `await browser.waitForAnimation() or await browser.waitForAnimationAndClick()` if you expect element to be animated and standard build-in wait make test flaky.
4. **Avoid Page Object pattern** - Don't use Page Object pattern unless strictly specified. Tests are for simple screens with single components and don't need extra abstractions and complexity.
5. **Reset window size** - If using `browser.resizeWindow()` in any test, set default size in `beforeEach` to avoid flakiness that depends on test order.
6. **Check invisibility correctly** - Use `expect(await browser.isNotVisible('.k-grid')).toBe(true)` or `await browser.expect('.k-grid').not.toBeVisible()` to check elements are NOT visible. DON'T use `expect(await browser.isVisible('.k-grid')).toBe(false)` because it waits up to 10 seconds for element to become visible, wasting time when testing absence.

