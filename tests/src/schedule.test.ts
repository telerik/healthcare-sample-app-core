import { Browser } from '@progress/kendo-e2e';
import BASE_URL from './config';

describe('Schedule Page', () => {
    let browser: Browser;

    beforeAll(async () => {
        browser = new Browser();
        await browser.navigateTo(`${BASE_URL}/Schedule`);
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

    describe('Navigation', () => {
        it('should have Schedule tab active', async () => {
            await browser.expect('.k-segmented-control-button.k-selected').toContainText('Schedule');
        });
    });

    describe('Scheduler Component', () => {
        it('should display the Kendo Scheduler', async () => {
            await browser.expect('#scheduler[data-role="scheduler"]').toBeVisible();
        });

        it('should show scheduler toolbar with Today button', async () => {
            await browser.expect('.k-scheduler-toolbar').toBeVisible();
            await browser.expect('.k-scheduler-navigation .k-button-text').toContainText('Today');
        });

        it('should show Previous and Next navigation buttons', async () => {
            await browser.expect('.k-scheduler-navigation [aria-label="Previous"]').toBeVisible();
            await browser.expect('.k-scheduler-navigation [aria-label="Next"]').toBeVisible();
        });

        it('should display the current date', async () => {
            await browser.expect('.k-nav-current').toBeVisible();
        });

        it('should show Day/Week/Month/Agenda view buttons', async () => {
            await browser.expect('.k-scheduler-views.k-segmented-control').toBeVisible();
            const viewButtons = await browser.findAll('.k-scheduler-views .k-segmented-control-button');
            expect(viewButtons.length).toBe(4);
        });

        it('should have Day view selected by default', async () => {
            await browser.expect(".k-segmented-control-button[data-value='day']").toHaveAttribute('aria-pressed', 'true');
        });

        it('should switch to Week view when clicked', async () => {
            await browser.click(".k-segmented-control-button[data-value='week']");
            await browser.expect(".k-segmented-control-button[data-value='week']").toHaveAttribute('aria-pressed', 'true');
        });

        it('should switch back to Day view', async () => {
            await browser.click(".k-segmented-control-button[data-value='day']");
            await browser.expect(".k-segmented-control-button[data-value='day']").toHaveAttribute('aria-pressed', 'true');
        });
    });

    describe('Daily Tasks Card', () => {
        it('should display the tasks card', async () => {
            await browser.expect('.tasks-card').toBeVisible();
        });

        it('should display the Daily Tasks title', async () => {
            await browser.expect('.tasks-card-title').toHaveText('Daily Tasks');
        });

        it('should display the search input for tasks', async () => {
            await browser.expect('#tasks-search').toBeVisible();
        });

        it('should display the add task button', async () => {
            await browser.expect('#btn-add-task').toBeVisible();
        });

        it('should display the tasks ListView', async () => {
            await browser.expect('#tasks-list[data-role="listview"]').toBeVisible();
        });

        it('should display task items with checkboxes', async () => {
            const tasks = await browser.findAll('.task-item');
            expect(tasks.length).toBe(21);
        });

        it('should display priority badges on tasks', async () => {
            await browser.expect('.task-item [data-role="badge"]').toBeVisible();
        });

        it('should show task text content', async () => {
            await browser.expect('.task-text').toBeVisible();
        });

        it('should toggle task completion when checkbox is clicked', async () => {
            await browser.click('.task-item:not(.task-done) .k-checkbox-wrap');
            await browser.expect('.task-item.task-done').toBeVisible();
        });

        it('should show strikethrough text on completed task', async () => {
            const decoration = await browser.executeScript(
                "return window.getComputedStyle(document.querySelector('.task-done .task-text')).textDecorationLine"
            );
            expect(decoration).toBe('line-through');
        });

        it('should uncheck a completed task when checkbox is clicked again', async () => {
            await browser.click('.task-item.task-done .k-checkbox-wrap');
            const uncheckedItems = await browser.findAll('.task-item:not(.task-done)');
            expect(uncheckedItems.length).toBeGreaterThan(0);
        });

        it('should show normal text on unchecked task', async () => {
            const decoration = await browser.executeScript(
                "return window.getComputedStyle(document.querySelector('.task-item:not(.task-done) .task-text')).textDecorationLine"
            );
            expect(decoration).toBe('none');
        });

        it('should display priority button group in Add Task dialog', async () => {
            await browser.click('#btn-add-task');
            await browser.expect('#add-task-dialog').toBeVisible();
            await browser.expect('#atf-priority-group[data-role="segmentedcontrol"]').toHaveCount(1);
            await browser.click('#add-task-dialog ~ .k-dialog-actions .k-button:first-child');
        });
    });

    describe('Daily Tasks Scroll', () => {
        it('should have more tasks than visible in the list', async () => {
            await browser.navigateTo(`${BASE_URL}/Schedule`);
            const tasks = await browser.findAll('.k-listview-content .task-item');
            expect(tasks.length).toBe(21);
        });

        it('should reveal the last task after scrolling into view', async () => {
            await browser.scrollIntoView('.k-listview-content .task-item:last-child');
            await browser.expect('.k-listview-content .task-item:last-child').toBeVisible();
        });
    });
});
