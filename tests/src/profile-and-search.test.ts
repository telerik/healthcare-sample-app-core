import { Browser } from '@progress/kendo-e2e';
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

describe('Profile Management', () => {
    it('should open profile window when avatar is clicked', async () => {
        await browser.click('#profile-trigger');
        await browser.expect('#profile-window').toBeVisible();
    });

    it('should display Profile Management title', async () => {
        await browser.expect('#profile-window_wnd_title').toHaveText('Profile Management');
    });

    it('should display profile photo section', async () => {
        await browser.expect('.pm-photo-wrap').toBeVisible();
    });

    it('should display the upload widget', async () => {
        await browser.expect('.pm-section [data-role="upload"]').toHaveCount(1);
    });

    it('should display profile photo section', async () => {
        const sections = await browser.findAll('.pm-section');
        expect(sections.length).toBe(1);
    });

    it('should display form fields', async () => {
        const fields = await browser.findAll('.k-form-field');
        expect(fields.length).toBe(3);
    });

    it('should display callout with instructions', async () => {
        await browser.expect('.pm-callout').toBeVisible();
    });

    it('should display Password Policy callout text', async () => {
        await browser.expect('.pm-callout strong').toHaveText('Password Policy');
    });

    it('should display Full Name label in form', async () => {
        await browser.scrollIntoView('#profile-form');
        await browser.expect('#profile-form .k-form-field:nth-child(1) label').toContainText('Full Name');
    });

    it('should display Full Name field', async () => {
        await browser.expect('#FullName').toHaveCount(1);
    });

    it('should display Email Address field', async () => {
        await browser.expect('#Email').toHaveCount(1);
    });

    it('should display Phone Number masked input', async () => {
        await browser.expect('#Phone[data-role="maskedtextbox"]').toHaveCount(1);
    });

    it('should have a Submit button', async () => {
        await browser.expect('#profile-form .k-form-submit').toHaveCount(1);
    });

    it('should have a Clear button', async () => {
        await browser.expect('#profile-form .k-form-clear').toHaveCount(1);
    });

    it('should close profile window via close button', async () => {
        await browser.executeScript("document.querySelector('#profile-window').closest('.k-window').querySelector('[aria-label=\"Close\"]').click()");
        await browser.expect('#profile-window').not.toBeVisible();
    });
});

describe('Global Patient Search', () => {
    it('should display the global search input', async () => {
        await browser.navigateTo(BASE_URL);
        await browser.expect('#appbar-search[data-role="autocomplete"]').toBeVisible();
    });

    it('should type in the search box', async () => {
        await browser.type('#appbar-search', 'Emma');
        await browser.expect('#appbar-search').toHaveValue('Emma');
    });

    it('should show autocomplete suggestions', async () => {
        await browser.expect('.k-autocomplete-popup:not([hidden])').toBeVisible();
    });

    it('should clear the search', async () => {
        await browser.type('#appbar-search', '');
        await browser.expect('#appbar-search').toHaveValue('');
    });

    it('should show No data found when searching for a non-existing patient', async () => {
        await browser.type('#appbar-search', 'ZZZNOMATCH999');
        await browser.expect('.k-autocomplete-popup .k-no-data').toBeVisible();
        await browser.expect('.k-autocomplete-popup .k-no-data').toContainText('No data found');
    });

    it('should hide No data found after clearing the search', async () => {
        await browser.type('#appbar-search', '');
        await browser.expect('.k-autocomplete-popup').not.toBeVisible();
    });
});
