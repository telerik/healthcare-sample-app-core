import { Browser, Key } from '@progress/kendo-e2e';
import BASE_URL from './config';

let browser: Browser;

beforeAll(async () => {
    browser = new Browser();
    await browser.navigateTo(BASE_URL);
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

describe('Cross-Page Navigation', () => {
    it('should start on the Dashboard page', async () => {
        await browser.expect('.k-segmented-control-button:nth-child(2)').toHaveAttribute('aria-pressed', 'true');
        await browser.expect('.quick-actions-card').toBeVisible();
    });

    it('should navigate to Schedule page', async () => {
        await browser.click('.k-segmented-control-button:nth-child(3)');
        await browser.expect('#scheduler[data-role="scheduler"]').toBeVisible();
    });

    it('should navigate to Patients page', async () => {
        await browser.click('.k-segmented-control-button:nth-child(4)');
        await browser.expect('#patients-grid[data-role="grid"]').toBeVisible();
    });

    it('should navigate to Analytics page', async () => {
        await browser.click('.k-segmented-control-button:nth-child(5)');
        await browser.expect('#vitals-chart[data-role="chart"]').toBeVisible();
    });

    it('should navigate back to Dashboard', async () => {
        await browser.click('.k-segmented-control-button:nth-child(2)');
        await browser.expect('.quick-actions-card').toBeVisible();
    });
});

describe('AppBar Navigation — Keyboard Navigation', () => {
    beforeEach(async () => {
        await browser.navigateTo(BASE_URL);
        await browser.executeScript("document.querySelector('#appbar-nav .k-segmented-control-button').focus();");
    });

    it('should move focus from Home to Schedule on Tab', async () => {
        await browser.sendKey(Key.TAB);
        await browser.expect('.k-segmented-control-button:nth-child(3)').toHaveClass('k-focus', { exactMatch: false });
    });

    it('should move focus from Schedule to Patients on Tab', async () => {
        await browser.sendKey(Key.TAB);
        await browser.sendKey(Key.TAB);
        await browser.expect('.k-segmented-control-button:nth-child(4)').toHaveClass('k-focus', { exactMatch: false });
    });

    it('should move focus from Patients to Clinical Analytics on Tab', async () => {
        await browser.sendKey(Key.TAB);
        await browser.sendKey(Key.TAB);
        await browser.sendKey(Key.TAB);
        await browser.expect('.k-segmented-control-button:nth-child(5)').toHaveClass('k-focus', { exactMatch: false });
    });

    it('should move focus out of the nav to the search input after the last button', async () => {
        await browser.sendKey(Key.TAB);
        await browser.sendKey(Key.TAB);
        await browser.sendKey(Key.TAB);
        await browser.sendKey(Key.TAB);
        await browser.expect('.k-autocomplete:has(#appbar-search)').toHaveClass('k-focus', { exactMatch: false });
    });

    it('should move focus from Schedule back to Home on Shift+Tab', async () => {
        await browser.sendKey(Key.TAB); // Home → Schedule
        await browser.sendKeyCombination(Key.SHIFT, Key.TAB);
        await browser.expect('.k-segmented-control-button:nth-child(2)').toHaveClass('k-focus', { exactMatch: false });
    });

    it('should move focus from Patients back to Schedule on Shift+Tab', async () => {
        await browser.sendKey(Key.TAB);
        await browser.sendKey(Key.TAB); // Home → Patients
        await browser.sendKeyCombination(Key.SHIFT, Key.TAB);
        await browser.expect('.k-segmented-control-button:nth-child(3)').toHaveClass('k-focus', { exactMatch: false });
    });

    it('should move focus from Clinical Analytics back to Patients on Shift+Tab', async () => {
        await browser.sendKey(Key.TAB);
        await browser.sendKey(Key.TAB);
        await browser.sendKey(Key.TAB); // Home → Clinical Analytics
        await browser.sendKeyCombination(Key.SHIFT, Key.TAB);
        await browser.expect('.k-segmented-control-button:nth-child(4)').toHaveClass('k-focus', { exactMatch: false });
    });

    it('should activate a button on Enter', async () => {
        await browser.sendKey(Key.TAB); // focus Schedule
        await browser.sendKey(Key.RETURN);
        await browser.expect('#scheduler[data-role="scheduler"]').toBeVisible();
    });
});
