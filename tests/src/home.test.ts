import { Browser, Grid } from '@progress/kendo-e2e';
import BASE_URL from './config';

describe('Home Page', () => {
    let browser: Browser;
    let appointmentsGrid: Grid;

    beforeAll(async () => {
        browser = new Browser();
        appointmentsGrid = new Grid(browser, '#appointments-grid');
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

    describe('AppBar Navigation', () => {
        it('should display the app bar', async () => {
            await browser.expect('#appbar').toBeVisible();
        });

        it('should display the logo', async () => {
            await browser.expect('.appbar-logo-img').toBeVisible();
        });

        it('should display navigation with four sections', async () => {
            await browser.expect('[data-role="segmentedcontrol"]').toBeVisible();
            await browser.expect('.k-segmented-control-button').toHaveCount(4);
        });

        it('should have Dashboard selected by default', async () => {
            await browser.expect('.k-segmented-control-button:nth-child(2)').toHaveAttribute('aria-pressed', 'true');
        });

        it('should display the search autocomplete', async () => {
            await browser.expect('#appbar-search').toBeVisible();
        });

        it('should display the notification badge', async () => {
            await browser.expect('#notif-btn .k-badge').toBeVisible();
        });

        it('should display the profile avatar', async () => {
            await browser.expect('#profile-trigger').toBeVisible();
        });
    });

    describe('Greeting Section', () => {
        it('should display a greeting message', async () => {
            await browser.expect('.home-greeting').toBeVisible();
        });

        it('should show today\'s date', async () => {
            await browser.expect('.home-greeting p').toContainText('Today is');
        });
    });

    describe('Quick Actions Card', () => {
        it('should display the Quick Actions card', async () => {
            await browser.expect('.quick-actions-card').toBeVisible();
        });

        it('should display the card title', async () => {
            await browser.expect('.quick-actions-card .k-card-title').toHaveText('Quick Actions');
        });

        it('should show three shortcut cards', async () => {
            await browser.expect('.shortcut-card').toHaveCount(3);
        });

        it('should have Add new clinical note shortcut', async () => {
            await browser.expect('#btn-new-note').toBeVisible();
        });

        it('should have Request lab test shortcut', async () => {
            await browser.expect('#btn-lab-test').toBeVisible();
        });

        it('should have Message nurse shortcut', async () => {
            await browser.expect('#btn-nurse-chat').toBeVisible();
        });

        it('should display shortcut titles', async () => {
            await browser.expect('.shortcut-title').toHaveCount(3);
            await browser.expect('.shortcut-title').toContainText('Add new clinical note');
        });

        it('should display shortcut descriptions', async () => {
            await browser.expect('.shortcut-desc').toBeVisible();
            await browser.expect('.shortcut-desc').toHaveCount(3);
        });

        it('should display shortcut icons', async () => {
            await browser.expect('.shortcut-icon').toHaveCount(3);
        });
    });

    describe('Appointments Grid', () => {
        it('should display the Today\'s Appointments section', async () => {
            await browser.expect('.appointments-card').toBeVisible();
        });

        it('should have a View Schedule button', async () => {
            await browser.expect('#btn-view-schedule').toBeVisible();
            await browser.expect('#btn-view-schedule .k-button-text').toHaveText('View Schedule');
        });

        it('should display the appointments grid', async () => {
            await browser.expect('#appointments-grid[data-role="grid"]').toBeVisible();
        });

        it('should display appointment rows with data', async () => {
            expect(await appointmentsGrid.masterRowsCount()).toBe(15);
        });

        it('should display status badges in appointments', async () => {
            await browser.expect('#appointments-grid [data-role="badge"]').toBeVisible();
        });

        it('should have five grid columns', async () => {
            const cols = await browser.findAll('#appointments-grid .k-grid-header th');
            expect(cols.length).toBe(5);
        });
    });

    describe('Next Patient Card', () => {
        it('should display the Next Patient card', async () => {
            await browser.expect('.next-patient-card').toBeVisible();
        });

        it('should show patient name', async () => {
            await browser.expect('.patient-name').toBeVisible();
        });

        it('should show patient avatar', async () => {
            await browser.expect('.next-patient-card .patient-avatar').toBeVisible();
        });

        it('should show patient meta info (age/gender)', async () => {
            await browser.expect('.patient-meta').toBeVisible();
        });

        it('should show appointment time', async () => {
            await browser.expect('.appt-time').toBeVisible();
        });

        it('should show reason for visit', async () => {
            await browser.expect('.detail-label').toContainText('Reason for visit');
        });

        it('should show allergy alert', async () => {
            await browser.expect('#link-allergy-details').toBeVisible();
        });

        it('should have a View Profile link', async () => {
            await browser.expect('.view-profile-link').toBeVisible();
        });
    });

    describe('Daily Alerts Section', () => {
        it('should display the Daily Alerts title', async () => {
            await browser.expect('.next-patient-card').toContainText('Daily Alerts');
        });

        it('should display alert cards', async () => {
            const cards = await browser.findAll('.alert-card');
            expect(cards.length).toBe(17);
        });

        it('should display alert card titles', async () => {
            await browser.expect('.alert-card-title').toBeVisible();
        });

        it('should display alert timestamps', async () => {
            await browser.expect('.alert-card-time').toBeVisible();
        });

        it('should display Review links on alerts', async () => {
            await browser.expect('.alert-review').toBeVisible();
        });
    });

    describe('Appointments Grid Scroll', () => {
        it('should have more rows than visible in the grid viewport', async () => {
            expect(await appointmentsGrid.masterRowsCount()).toBe(15);
        });

        it('should reveal the last row after scrolling into view', async () => {
            await browser.scrollIntoView('.k-grid-content .k-master-row:last-child');
            await browser.expect('.k-grid-content .k-master-row:last-child').toBeVisible();
        });
    });

    describe('Daily Alerts Scroll', () => {
        it('should have more alert cards than visible in the container', async () => {
            await browser.navigateTo(BASE_URL);
            const cards = await browser.findAll('.np-alerts-body .alert-card');
            expect(cards.length).toBe(17);
        });

        it('should reveal the last alert after scrolling into view', async () => {
            await browser.scrollIntoView('.np-alerts-body .alert-card:last-child');
            await browser.expect('.np-alerts-body .alert-card:last-child').toBeVisible();
        });
    });
});
