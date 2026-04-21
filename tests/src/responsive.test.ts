import { Browser, Key } from '@progress/kendo-e2e';
import BASE_URL from './config';

describe('Responsive Layout — 1200×900', () => {
    let browser: Browser;

    beforeAll(async () => {
        browser = new Browser();
        await browser.resizeWindow(1200, 900);
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

    describe('AppBar — Responsive Navigation', () => {
        it('should display the app bar', async () => {
            await browser.expect('#appbar').toBeVisible();
        });

        it('should display the full logo (not compact)', async () => {
            await browser.expect('.logo-full').toBeVisible();
            await browser.expect('.logo-compact').not.toBeVisible();
        });

        it('should show the navigation segmented control with 4 buttons', async () => {
            await browser.expect('[data-role="segmentedcontrol"]').toBeVisible();
            await browser.expect('.k-segmented-control-button').toHaveCount(4);
        });

        it('should hide navigation button text (icon-only mode)', async () => {
            const fontSize = await browser.executeScript(
                "return getComputedStyle(document.querySelector('.appbar-nav .k-segmented-control-button')).fontSize;"
            ) as string;
            expect(fontSize).toBe('0px');
        });

        it('should show icons on navigation buttons', async () => {
            await browser.expect('.appbar-nav .k-segmented-control-button .k-svg-icon').toBeVisible();
        });

        it('should have Dashboard selected by default', async () => {
            await browser.expect('.k-segmented-control-button:nth-child(2)').toHaveAttribute('aria-pressed', 'true');
        });

        it('should display the notification badge', async () => {
            await browser.expect('#notif-btn .k-badge').toBeVisible();
        });

        it('should display the profile avatar', async () => {
            await browser.expect('#profile-trigger').toBeVisible();
        });

        it('should hide the hamburger menu', async () => {
            await browser.expect('#hamburger-btn').not.toBeVisible();
        });
    });

    describe('AppBar — Search Icon Toggle', () => {
        it('should hide the inline search autocomplete', async () => {
            await browser.expect('.appbar-right .k-autocomplete').not.toBeVisible();
        });

        it('should show the search icon button', async () => {
            await browser.expect('#btn-search-toggle').toBeVisible();
        });

        it('should open search overlay when search icon is clicked', async () => {
            await browser.click('#btn-search-toggle');
            await browser.expect('#appbar').toHaveClass('search-open', { exactMatch: false });
        });

        it('should show search input with placeholder text', async () => {
            await browser.expect('.appbar-right .k-autocomplete .k-input-inner').toBeVisible();
            await browser.expect('.appbar-right .k-autocomplete .k-input-inner').toHaveAttribute(
                'placeholder',
                'Search patients by name, ID or phone\u2026'
            );
        });

        it('should show autocomplete suggestions when typing', async () => {
            await browser.type('#appbar-search', 'Emma');
            await browser.expect('.k-autocomplete-popup').toBeVisible();
        });

        it('should close search overlay when clicking outside', async () => {
            await browser.type('#appbar-search', '');
            await browser.click('body');
            await browser.expect('#appbar').not.toHaveClass('search-open', { exactMatch: false });
        });
    });

    describe('AppBar — Search Functionality in Overlay', () => {
        beforeAll(async () => {
            await browser.navigateTo(BASE_URL);
        });

        it('should open the search overlay via search icon', async () => {
            await browser.click('#btn-search-toggle');
            await browser.expect('#appbar').toHaveClass('search-open', { exactMatch: false });
        });

        it('should show matching suggestions when typing a patient name', async () => {
            await browser.type('#appbar-search', 'Emma');
            await browser.expect('.k-autocomplete-popup .k-list-item').toBeVisible();
        });

        it('should clear the search input', async () => {
            await browser.type('#appbar-search', '');
            await browser.expect('#appbar-search').toHaveValue('');
        });

        it('should show no data when typing a non-matching query', async () => {
            await browser.type('#appbar-search', 'ZZZNOMATCH999');
            await browser.expect('.k-autocomplete-popup .k-no-data').toBeVisible();
            await browser.expect('.k-autocomplete-popup .k-no-data').toContainText('No data found');
        });

        it('should close the overlay by clicking outside', async () => {
            await browser.type('#appbar-search', '');
            await browser.click('.home-greeting');
            await browser.expect('#appbar').not.toHaveClass('search-open', { exactMatch: false });
        });
    });

    describe('Cross-Page Navigation — Icon-Only', () => {
        beforeAll(async () => {
            await browser.navigateTo(BASE_URL);
        });

        it('should navigate to Schedule page via icon button', async () => {
            await browser.click('.k-segmented-control-button:nth-child(3)');
            await browser.expect('#scheduler[data-role="scheduler"]').toBeVisible();
        });

        it('should have Schedule button selected after navigation', async () => {
            await browser.expect('.k-segmented-control-button:nth-child(3)').toHaveAttribute('aria-pressed', 'true');
        });

        it('should navigate to Patients page via icon button', async () => {
            await browser.click('.k-segmented-control-button:nth-child(4)');
            await browser.expect('#patients-grid[data-role="grid"]').toBeVisible();
        });

        it('should have Patients button selected after navigation', async () => {
            await browser.expect('.k-segmented-control-button:nth-child(4)').toHaveAttribute('aria-pressed', 'true');
        });

        it('should navigate to Analytics page via icon button', async () => {
            await browser.click('.k-segmented-control-button:nth-child(5)');
            await browser.expect('#vitals-chart[data-role="chart"]').toBeVisible();
        });

        it('should have Analytics button selected after navigation', async () => {
            await browser.expect('.k-segmented-control-button:nth-child(5)').toHaveAttribute('aria-pressed', 'true');
        });

        it('should navigate back to Dashboard via icon button', async () => {
            await browser.click('.k-segmented-control-button:nth-child(2)');
            await browser.expect('.quick-actions-card').toBeVisible();
        });
    });

    describe('Home Page — Responsive Layout', () => {
        beforeAll(async () => {
            await browser.navigateTo(BASE_URL);
        });

        it('should display the greeting', async () => {
            await browser.expect('.home-greeting').toBeVisible();
        });

        it('should display the quick actions card', async () => {
            await browser.expect('.quick-actions-card').toBeVisible();
        });

        it('should display the appointments grid', async () => {
            await browser.expect('#appointments-grid').toBeVisible();
        });

        it('should stack page body to single column at this breakpoint', async () => {
            const columns = await browser.executeScript(
                "return getComputedStyle(document.querySelector('.page-body')).gridTemplateColumns;"
            ) as string;
            expect(columns).not.toContain('480px');
        });
    });

    describe('Schedule Page — Responsive Layout', () => {
        beforeAll(async () => {
            await browser.navigateTo(`${BASE_URL}/Schedule`);
        });

        it('should display the scheduler', async () => {
            await browser.expect('#scheduler[data-role="scheduler"]').toBeVisible();
        });

        it('should display the tasks list', async () => {
            await browser.expect('#tasks-list[data-role="listview"]').toBeVisible();
        });

        it('should stack the schedule body to column layout', async () => {
            const flexDir = await browser.executeScript(
                "return getComputedStyle(document.querySelector('.schedule-body')).flexDirection;"
            ) as string;
            expect(flexDir).toBe('column');
        });

        it('should display the Daily Tasks card', async () => {
            await browser.expect('.tasks-card').toBeVisible();
        });
    });

    describe('Patients Page — Responsive Layout', () => {
        beforeAll(async () => {
            await browser.navigateTo(`${BASE_URL}/Patients`);
        });

        it('should display the patients grid', async () => {
            await browser.expect('#patients-grid[data-role="grid"]').toBeVisible();
        });

        it('should stack patients page header to column layout', async () => {
            const flexDir = await browser.executeScript(
                "return getComputedStyle(document.querySelector('.patients-page-header')).flexDirection;"
            ) as string;
            expect(flexDir).toBe('column');
        });

        it('should display the search icon button on Patients page', async () => {
            await browser.expect('#btn-search-toggle').toBeVisible();
        });

        it('should display the patients page title', async () => {
            await browser.expect('.patients-page-title').toBeVisible();
        });
    });

    describe('Analytics Page — Responsive Layout', () => {
        beforeAll(async () => {
            await browser.navigateTo(`${BASE_URL}/Analytics`);
        });

        it('should display the vitals chart', async () => {
            await browser.expect('#vitals-chart[data-role="chart"]').toBeVisible();
        });

        it('should display the risk gauge', async () => {
            await browser.expect('#risk-gauge[data-role="arcgauge"]').toBeVisible();
        });

        it('should stack analytics page header to column layout', async () => {
            const flexDir = await browser.executeScript(
                "return getComputedStyle(document.querySelector('.analytics-page-header')).flexDirection;"
            ) as string;
            expect(flexDir).toBe('column');
        });

        it('should display the patient selector dropdown', async () => {
            await browser.expect('.analytics-header-controls .k-dropdownlist').toBeVisible();
        });
    });

    describe('Profile — Responsive', () => {
        beforeAll(async () => {
            await browser.navigateTo(BASE_URL);
        });

        it('should open the profile window when avatar is clicked', async () => {
            await browser.click('#profile-trigger');
            await browser.expect('#profile-window').toBeVisible();
        });

        it('should display the profile title', async () => {
            await browser.expect('#profile-window_wnd_title').toHaveText('Profile Management');
        });

        it('should close the profile window', async () => {
            await browser.executeScript(
                "document.querySelector('#profile-window').closest('.k-window').querySelector('[aria-label=\"Close\"]').click();"
            );
            await browser.expect('#profile-window').not.toBeVisible();
        });
    });

    describe('Notifications — Responsive', () => {
        it('should display the notification bell button', async () => {
            await browser.expect('#notif-btn').toBeVisible();
        });

        it('should open notifications dropdown when bell is clicked', async () => {
            await browser.click('#notif-btn');
            await browser.expect('#np-dropdown').toBeVisible();
        });

        it('should display 7 notification cards', async () => {
            const cards = await browser.findAll('.np-card');
            expect(cards.length).toBe(7);
        });

        it('should close the notifications dropdown', async () => {
            await browser.click('#notif-btn');
            await browser.expect('#np-dropdown').not.toBeVisible();
        });
    });
});
