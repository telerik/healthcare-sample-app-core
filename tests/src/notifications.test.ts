import { Browser } from '@progress/kendo-e2e';
import BASE_URL from './config';

describe('Notifications Panel', () => {
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

    it('should display the notification bell button', async () => {
        await browser.expect('#notif-btn').toBeVisible();
    });

    it('should display the notification badge with count', async () => {
        await browser.expect('#notif-btn .k-badge').toBeVisible();
    });

    it('should open the notifications dropdown on click', async () => {
        await browser.click('#notif-btn');
        await browser.expect('#np-dropdown').toBeVisible();
    });

    it('should display the Notifications title', async () => {
        await browser.expect('.np-title').toHaveText('Notifications');
    });

    it('should display the Mark all read button', async () => {
        await browser.expect('#np-mark-all').toBeVisible();
    });

    it('should display notification cards', async () => {
        const cards = await browser.findAll('.np-card');
        expect(cards.length).toBe(7);
    });

    it('should show Critical Lab Alert notification', async () => {
        await browser.expect('.np-card-title').toContainText('Critical Lab Alert');
    });

    it('should show Vitals Warning notification', async () => {
        await browser.expect('.np-card:nth-child(2) .np-card-title').toHaveText('Vitals Warning');
    });

    it('should show ICU Monitoring Alert notification', async () => {
        await browser.expect('.np-card:nth-child(3) .np-card-title').toHaveText('ICU Monitoring Alert');
    });

    it('should show New Lab Results notification', async () => {
        await browser.expect('.np-card:nth-child(4) .np-card-title').toHaveText('New Lab Results');
    });

    it('should show Appointment Update notification', async () => {
        await browser.expect('.np-card:nth-child(5) .np-card-title').toHaveText('Appointment Update');
    });

    it('should show New Message notification', async () => {
        await browser.expect('.np-card:nth-child(6) .np-card-title').toHaveText('New Message');
    });

    it('should show System Info notification', async () => {
        await browser.expect('.np-card:nth-child(7) .np-card-title').toHaveText('System Info');
    });

    it('should display timestamps on notifications', async () => {
        await browser.expect('.np-card-time').toBeVisible();
    });

    it('should display notification description subtitles', async () => {
        await browser.expect('.np-card-subtitle').toBeVisible();
    });

    it('should show CRP elevated description for Critical Lab Alert', async () => {
        await browser.expect('.np-card:nth-child(1) .np-card-subtitle').toContainText('CRP elevated');
    });

    it('should show blood pressure description for Vitals Warning', async () => {
        await browser.expect('.np-card:nth-child(2) .np-card-subtitle').toContainText('Blood pressure');
    });

    it('should display notification icons', async () => {
        await browser.expect('.np-card-icon .np-bell-img').toBeVisible();
    });

    it('should mark some notifications as read', async () => {
        await browser.expect('.np-card-read').toBeVisible();
    });

    it('should close the dropdown when clicking outside', async () => {
        await browser.click('#notif-btn');
        await browser.expect('#np-dropdown').not.toBeVisible();
    });

    describe('Mark All Read', () => {
        it('should open dropdown and have unread notifications', async () => {
            await browser.navigateTo(BASE_URL);
            await browser.click('#notif-btn');
            await browser.expect('#np-dropdown').toBeVisible();
            await browser.expect('#np-mark-all').toBeVisible();
        });

        it('should mark all notifications as read when clicking Mark all read', async () => {
            await browser.click('#np-mark-all');
            const cards = await browser.findAll('.np-card-read');
            expect(cards.length).toBe(7);
        });

        it('should replace Mark all read button with All caught up message', async () => {
            await browser.expect('#np-mark-all').not.toBeVisible();
            await browser.expect('.np-all-read').toContainText('All caught up');
        });

        it('should hide the notification badge after marking all read', async () => {
            await browser.expect('#notif-btn .k-badge').not.toBeVisible();
        });
    });
});
