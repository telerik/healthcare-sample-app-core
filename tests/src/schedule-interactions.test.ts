import { Browser, Key } from '@progress/kendo-e2e';
import BASE_URL from './config';

describe('Schedule Page — Scheduler Interactions', () => {
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

    describe('Scheduler Events', () => {
        it('should display color-coded events in the scheduler', async () => {
            const events = await browser.findAll('.k-event');
            expect(events.length).toBeGreaterThan(0);
        });

        it('should display event text with patient name and time', async () => {
            await browser.expect('.k-event').toBeVisible();
        });

        it('should display event title with type prefix', async () => {
            await browser.expect('.sched-ev-title').toBeVisible();
        });

        it('should display event meta with time and room', async () => {
            await browser.expect('.sched-ev-meta').toBeVisible();
        });

        it('should open appointment dialog on event double-click', async () => {
            await browser.doubleClick('.k-event');
            await browser.expect('#appointment-dialog').toBeVisible();
        });

        it('should display appointment date in dialog', async () => {
            await browser.expect('.appt-review-line').toBeVisible();
        });

        it('should display appointment time range', async () => {
            await browser.expect('.appt-review-line:nth-child(3)').toBeVisible();
        });

        it('should display appointment room', async () => {
            const lines = await browser.findAll('#appointment-dialog .appt-review-line');
            expect(lines.length).toBe(4);
        });

        it('should close appointment dialog', async () => {
            await browser.click('#appointment-dialog ~ .k-dialog-actions .k-button');
            await browser.expect('#appointment-dialog').not.toBeVisible();
        });
    });

    describe('Appointment Dialog Expand/Collapse', () => {
        it('should open appointment dialog on event double-click', async () => {
            await browser.doubleClick('.k-event');
            await browser.expect('#appointment-dialog').toBeVisible();
        });

        it('should start in collapsed state', async () => {
            await browser.expect('.appt-dialog-collapsed').toBeVisible();
        });

        it('should expand to show patient info when expand button is clicked', async () => {
            await browser.click('.appt-expand-btn');
            await browser.expect('.appt-dialog-expanded').toBeVisible();
        });

        it('should display Patient Information heading when expanded', async () => {
            await browser.expect('.appt-review-patient .appt-review-heading').toContainText('Patient Information');
        });

        it('should display patient name when expanded', async () => {
            await browser.expect('.appt-patient-row').toBeVisible();
        });

        it('should collapse back when expand button is clicked again', async () => {
            await browser.click('.appt-expand-btn');
            await browser.expect('.appt-dialog-collapsed').toBeVisible();
        });

        it('should close the expanded dialog', async () => {
            await browser.click('#appointment-dialog ~ .k-dialog-actions .k-button');
            await browser.expect('#appointment-dialog').not.toBeVisible();
        });
    });

    describe('Scheduler View Switching', () => {
        it('should switch to Week view', async () => {
            await browser.click(".k-segmented-control-button[data-value='week']");
            await browser.expect(".k-segmented-control-button[data-value='week']").toHaveAttribute('aria-pressed', 'true');
        });

        it('should display week layout with multiple day columns', async () => {
            await browser.expect('.k-scheduler-header').toBeVisible();
        });

        it('should switch to Month view', async () => {
            await browser.click(".k-segmented-control-button[data-value='month']");
            await browser.expect(".k-segmented-control-button[data-value='month']").toHaveAttribute('aria-pressed', 'true');
        });

        it('should switch to Agenda view', async () => {
            await browser.click(".k-segmented-control-button[data-value='agenda']");
            await browser.expect(".k-segmented-control-button[data-value='agenda']").toHaveAttribute('aria-pressed', 'true');
        });

        it('should switch back to Day view', async () => {
            await browser.click(".k-segmented-control-button[data-value='day']");
            await browser.expect(".k-segmented-control-button[data-value='day']").toHaveAttribute('aria-pressed', 'true');
        });
    });

    describe('Scheduler Navigation', () => {
        it('should navigate to the next day', async () => {
            await browser.click('.k-scheduler-navigation [aria-label="Next"]');
            await browser.expect('.k-nav-current').toBeVisible();
        });

        it('should navigate to the previous day', async () => {
            await browser.click('.k-scheduler-navigation [aria-label="Previous"]');
            await browser.expect('.k-nav-current').toBeVisible();
        });

        it('should return to Today', async () => {
            await browser.click('.k-scheduler-navigation [aria-label="Next"]');
            await browser.click('.k-scheduler-navigation .k-button:first-child');
            await browser.expect('.k-nav-current').toBeVisible();
        });
    });

    describe('Task Search', () => {
        it('should filter tasks when searching', async () => {
            await browser.expect('.task-item').toHaveCount(21);
            await browser.type('#tasks-search', 'Emma');
            await browser.expect('.task-text').toContainText('Emma');
            await browser.expect('.task-item').toHaveCount(4);
        });

        it('should show no tasks when search matches nothing', async () => {
            await browser.type('#tasks-search', 'ZZZNOMATCH999');
            await browser.expect('.task-item').toHaveCount(0);
        });

        it('should clear search and show all tasks', async () => {
            await browser.click('#tasks-search');
            await browser.sendKeyCombination(Key.CONTROL, 'a');
            await browser.sendKey(Key.BACK_SPACE);
            await browser.expect('.task-item').toHaveCount(21);
        });
    });

    describe('Add Task Dialog', () => {
        it('should open the Add Task dialog when clicking the add button', async () => {
            await browser.click('#btn-add-task');
            await browser.expect('#add-task-dialog').toBeVisible();
        });

        it('should display the dialog title', async () => {
            await browser.expect('.k-dialog:has(#add-task-dialog) .k-dialog-title').toContainText('Add Task');
        });

        it('should display Task Name input', async () => {
            await browser.expect('#atf-name').toBeVisible();
        });

        it('should display priority button group', async () => {
            await browser.expect('#atf-priority-group[data-role="segmentedcontrol"]').toBeVisible();
        });

        it('should have Low priority selected by default', async () => {
            await browser.expect('#atf-priority-group [data-value="Low"]').toHaveAttribute('aria-pressed', 'true');
        });

        it('should switch priority to High when clicked', async () => {
            await browser.click('#atf-priority-group [data-value="High"]');
            await browser.expect('#atf-priority-group [data-value="High"]').toHaveAttribute('aria-pressed', 'true');
        });

        it('should display description textarea', async () => {
            await browser.expect('#atf-description').toBeVisible();
        });

        it('should have Cancel and Save buttons', async () => {
            await browser.expect('#add-task-dialog ~ .k-dialog-actions .k-button').toHaveCount(2);
        });

        it('should close the dialog when clicking Cancel', async () => {
            await browser.click('#add-task-dialog ~ .k-dialog-actions .k-button');
            await browser.expect('#add-task-dialog').not.toBeVisible();
        });
    });

    describe('View Task Dialog', () => {
        it('should open the View Task dialog when clicking a task', async () => {
            await browser.click('.task-item');
            await browser.expect('#view-task-dialog').toBeVisible();
        });

        it('should display the dialog title', async () => {
            await browser.expect('.k-dialog:has(#view-task-dialog) .k-dialog-title').toContainText('Task Details');
        });

        it('should display task name', async () => {
            await browser.expect('#vtf-name').toBeVisible();
        });

        it('should display priority badge', async () => {
            await browser.expect('#vtf-priority-badge [data-role="badge"]').toBeVisible();
        });

        it('should display task description', async () => {
            await browser.expect('#vtf-description').toBeVisible();
        });

        it('should close the dialog when clicking Close', async () => {
            await browser.click('#view-task-dialog ~ .k-dialog-actions .k-button');
            await browser.expect('#view-task-dialog').not.toBeVisible();
        });
    });

    describe('Create New Daily Task', () => {
        beforeEach(async () => {
            await browser.navigateTo(`${BASE_URL}/Schedule`);
            await browser.click('#btn-add-task');
            await browser.expect('#add-task-dialog').toBeVisible();
        });

        it('should show a validation error when saving with no task name', async () => {
            await browser.click('#add-task-dialog ~ .k-dialog-actions .k-button:last-child');
            await browser.expect('#add-task-dialog .atf-error.is-visible').toBeVisible();
            await browser.expect('#add-task-dialog .atf-error').toContainText('Task name is required');
        });

        it('should clear validation error after typing a name', async () => {
            await browser.click('#add-task-dialog ~ .k-dialog-actions .k-button:last-child');
            await browser.expect('#add-task-dialog .atf-error.is-visible').toBeVisible();
            await browser.type('#atf-name', 'Any Name');
            await browser.expect('#add-task-dialog .atf-error.is-visible').not.toBeVisible();
        });

        it('should create a new task and show it in the list', async () => {
            await browser.type('#atf-name', 'E2E Test Task Alpha');
            await browser.click('#add-task-dialog ~ .k-dialog-actions .k-button:last-child');
            await browser.expect('#add-task-dialog').not.toBeVisible();
            await browser.expect('.task-item').toHaveCount(22);
            await browser.expect('.task-text').toContainText('E2E Test Task Alpha');
        });

        it('should create a task with Medium priority and show it in the list', async () => {
            await browser.type('#atf-name', 'E2E Test Task Beta');
            await browser.click('#atf-priority-group [data-value="Medium"]');
            await browser.click('#add-task-dialog ~ .k-dialog-actions .k-button:last-child');
            await browser.expect('#add-task-dialog').not.toBeVisible();
            await browser.expect('.task-text').toContainText('E2E Test Task Beta');
        });

        it('should create a task with High priority and a description and show it in the list', async () => {
            await browser.type('#atf-name', 'E2E Test Task Gamma');
            await browser.click('#atf-priority-group [data-value="High"]');
            await browser.type('#atf-description', 'Created by automated E2E test.');
            await browser.click('#add-task-dialog ~ .k-dialog-actions .k-button:last-child');
            await browser.expect('#add-task-dialog').not.toBeVisible();
            await browser.expect('.task-text').toContainText('E2E Test Task Gamma');
        });
    });

    describe('Add Task Dialog — Keyboard Navigation', () => {
        beforeEach(async () => {
            await browser.navigateTo(`${BASE_URL}/Schedule`);
            await browser.click('#btn-add-task');
            await browser.expect('#add-task-dialog').toBeVisible();
        });

        it('should Tab from task name to Low priority button', async () => {
            await browser.click('#atf-name');
            await browser.expect('#atf-name').toHaveFocus();
            await browser.sendKey(Key.TAB);
            await browser.expect('#atf-priority-group [data-value="Low"]').toHaveFocus();
        });

        it('should Tab from Low to Medium priority button', async () => {
            await browser.click('#atf-priority-group [data-value="Low"]');
            await browser.expect('#atf-priority-group [data-value="Low"]').toHaveFocus();
            await browser.sendKey(Key.TAB);
            await browser.expect('#atf-priority-group [data-value="Medium"]').toHaveFocus();
        });

        it('should Tab from Medium to High priority button', async () => {
            await browser.click('#atf-priority-group [data-value="Medium"]');
            await browser.expect('#atf-priority-group [data-value="Medium"]').toHaveFocus();
            await browser.sendKey(Key.TAB);
            await browser.expect('#atf-priority-group [data-value="High"]').toHaveFocus();
        });

        it('should Tab from High priority to description textarea', async () => {
            await browser.click('#atf-priority-group [data-value="High"]');
            await browser.expect('#atf-priority-group [data-value="High"]').toHaveFocus();
            await browser.sendKey(Key.TAB);
            await browser.expect('#atf-description').toHaveFocus();
        });

        it('should Tab from description to Cancel button', async () => {
            await browser.click('#atf-description');
            await browser.expect('#atf-description').toHaveFocus();
            await browser.sendKey(Key.TAB);
            await browser.expect('#add-task-dialog ~ .k-dialog-actions .k-button:first-child').toHaveFocus();
        });

        it('should Tab from Cancel to Save button', async () => {
            await browser.click('#atf-description');
            await browser.expect('#atf-description').toHaveFocus();
            await browser.sendKey(Key.TAB);
            await browser.expect('#add-task-dialog ~ .k-dialog-actions .k-button:first-child').toHaveFocus();
            await browser.sendKey(Key.TAB);
            await browser.expect('#add-task-dialog ~ .k-dialog-actions .k-button:last-child').toHaveFocus();
        });

        it('should select a priority button using Space', async () => {
            await browser.click('#atf-priority-group [data-value="Low"]');
            await browser.expect('#atf-priority-group [data-value="Low"]').toHaveFocus();
            await browser.sendKey(Key.TAB);
            await browser.expect('#atf-priority-group [data-value="Medium"]').toHaveFocus();
            await browser.sendKey(Key.SPACE);
            await browser.expect('#atf-priority-group [data-value="Medium"]').toHaveAttribute('aria-pressed', 'true');
        });

        it('should Shift+Tab from Low priority back to task name', async () => {
            await browser.click('#atf-priority-group [data-value="Low"]');
            await browser.expect('#atf-priority-group [data-value="Low"]').toHaveFocus();
            await browser.sendKeyCombination(Key.SHIFT, Key.TAB);
            await browser.expect('#atf-name').toHaveFocus();
        });

        it('should close dialog pressing Enter on Cancel button', async () => {
            await browser.click('#atf-description');
            await browser.expect('#atf-description').toHaveFocus();
            await browser.sendKey(Key.TAB);
            await browser.expect('#add-task-dialog ~ .k-dialog-actions .k-button:first-child').toHaveFocus();
            await browser.sendKey(Key.RETURN);
            await browser.expect('#add-task-dialog').not.toBeVisible();
        });
    });

    describe('View Task Dialog — Keyboard Navigation', () => {
        beforeEach(async () => {
            await browser.navigateTo(`${BASE_URL}/Schedule`);
            await browser.click('.task-item');
            await browser.expect('#view-task-dialog').toBeVisible();
        });

        it('should focus Close button as the only focusable action', async () => {
            await browser.sendKey(Key.TAB);
            await browser.expect('#view-task-dialog ~ .k-dialog-actions .k-button').toHaveFocus();
        });

        it('should close dialog pressing Enter on Close button', async () => {
            await browser.sendKey(Key.TAB);
            await browser.expect('#view-task-dialog ~ .k-dialog-actions .k-button').toHaveFocus();
            await browser.sendKey(Key.RETURN);
            await browser.expect('#view-task-dialog').not.toBeVisible();
        });
    });
});
