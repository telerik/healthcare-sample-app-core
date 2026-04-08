import { Browser, Grid } from '@progress/kendo-e2e';
import BASE_URL from './config';

describe('Patient Detail Drilldown', () => {
    let browser: Browser;
    let labsGrid: Grid;

    beforeAll(async () => {
        browser = new Browser();
        labsGrid = new Grid(browser, '#patient-labs-grid');
        await browser.navigateTo(`${BASE_URL}/Patients`);
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

    describe('Opening Patient Detail', () => {
        it('should display View Profile link on patient rows', async () => {
            await browser.expect('.btn-view-patient').toBeVisible();
        });

        it('should navigate to detail view when View Profile is clicked', async () => {
            await browser.click('.btn-view-patient');
            await browser.expect('#patients-detail-view').toBeVisible();
        });

        it('should hide the patient list grid', async () => {
            await browser.expect('#patients-list-view').not.toBeVisible();
        });

        it('should display the breadcrumb navigation', async () => {
            await browser.expect('#patients-breadcrumb').toBeVisible();
        });

        it('should show Patients link in breadcrumb', async () => {
            await browser.expect('#breadcrumb-back').toContainText('Patients');
        });

        it('should show Patient Profile in breadcrumb', async () => {
            await browser.expect('.breadcrumb-current').toContainText('Patient Profile');
        });
    });

    describe('Patient Info Card', () => {
        it('should display the patient info card', async () => {
            await browser.expect('.profile-info-card').toBeVisible();
        });

        it('should display the patient avatar', async () => {
            await browser.expect('.patient-avatar-profile').toBeVisible();
        });

        it('should display the patient name', async () => {
            await browser.expect('.profile-patient-name').toBeVisible();
        });

        it('should display the patient status chip', async () => {
            await browser.expect('.profile-info-card [data-role="badge"]').toBeVisible();
        });

        it('should display Patient ID', async () => {
            await browser.expect('.profile-info-label').toContainText('Patient ID');
        });

        it('should display Age/Gender info', async () => {
            await browser.expect('.profile-info-card').toContainText('Age/Gender');
        });
    });

    describe('Recent Vitals Card', () => {
        it('should display the recent vitals section', async () => {
            await browser.expect('.profile-section-heading').toContainText('Recent Vitals');
        });

        it('should display Heart Rate', async () => {
            await browser.expect('.profile-section-card').toContainText('Heart Rate');
        });

        it('should display Blood Pressure', async () => {
            await browser.expect('.profile-section-card').toContainText('Blood Pressure');
        });

        it('should display Temperature', async () => {
            await browser.expect('.profile-section-card').toContainText('Temperature');
        });

        it('should display O2 Saturation', async () => {
            await browser.expect('.profile-section-card').toContainText('O2 Saturation');
        });

        it('should display Respiratory Rate', async () => {
            await browser.expect('.profile-section-card').toContainText('Respiratory Rate');
        });
    });

    describe('Admission Details Card', () => {
        it('should display admission details heading', async () => {
            await browser.expect('.profile-section-card:last-of-type').toContainText('Admission Details');
        });

        it('should display Department', async () => {
            await browser.expect('.profile-section-card:last-of-type').toContainText('Department');
        });

        it('should display Ward', async () => {
            await browser.expect('.profile-section-card:last-of-type').toContainText('Ward');
        });

        it('should display Room', async () => {
            await browser.expect('.profile-section-card:last-of-type').toContainText('Room');
        });

        it('should display Assigned Nurse', async () => {
            await browser.expect('.profile-section-card:last-of-type').toContainText('Assigned Nurse');
        });
    });

    describe('Patient Note Editor', () => {
        it('should display the Patient Note card', async () => {
            await browser.expect('.profile-note-card').toBeVisible();
        });

        it('should display the note title', async () => {
            await browser.expect('.detail-card-header-text').toContainText('Patient Note');
        });

        it('should display the Kendo Editor', async () => {
            await browser.expect('.k-editor').toBeVisible();
        });

        it('should display the editor toolbar', async () => {
            await browser.expect('.k-editor-toolbar').toBeVisible();
        });

        it('should display the editable content area', async () => {
            await browser.expect('.k-editable-area').toBeVisible();
        });

        it('should display a Save button', async () => {
            await browser.expect('#btn-save-patient-note').toBeVisible();
        });
    });

    describe('Lab Results Grid', () => {
        it('should display the labs grid', async () => {
            await browser.expect('#patient-labs-grid[data-role="grid"]').toBeVisible();
        });

        it('should display lab result rows', async () => {
            expect(await labsGrid.masterRowsCount()).toBeGreaterThan(0);
        });

        it('should display lab grid pager', async () => {
            await browser.expect('#patient-labs-grid .k-pager').toBeVisible();
        });

        it('should sort labs ascending when clicking a column header', async () => {
            await browser.click('#patient-labs-grid .k-column-title');
            await browser.expect('#patient-labs-grid th[data-role="columnsorter"]').toHaveAttribute('aria-sort', 'ascending');
        });

        it('should sort labs descending when clicking the same column again', async () => {
            await browser.click('#patient-labs-grid .k-column-title');
            await browser.expect('#patient-labs-grid th[data-role="columnsorter"]').toHaveAttribute('aria-sort', 'descending');
        });
    });

    describe('Navigating Back', () => {
        it('should navigate back to patients list when breadcrumb is clicked', async () => {
            await browser.click('#breadcrumb-back');
            await browser.expect('#patients-list-view').toBeVisible();
        });

        it('should hide the detail view', async () => {
            await browser.expect('#patients-detail-view').not.toBeVisible();
        });
    });
});
