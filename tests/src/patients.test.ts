import fs from 'fs';
import { Browser, Grid, DropDownList, Key } from '@progress/kendo-e2e';
import { deleteFileIfExists, getFileContent, defaultDownloadPath } from '@progress/kendo-e2e/dist/utils/fsUtils';
import BASE_URL from './config';

describe('Patients Page', () => {
    let browser: Browser;
    let grid: Grid;

    beforeAll(async () => {
        browser = new Browser();
        grid = new Grid(browser, '#patients-grid');
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

    describe('Navigation', () => {
        it('should have Patients tab active', async () => {
            await browser.expect('.k-segmented-control-button.k-selected').toContainText('Patients');
        });
    });

    describe('Page Header', () => {
        it('should display the page title', async () => {
            await browser.expect('.patients-page-title').toBeVisible();
            await browser.expect('.patients-page-title').toHaveText('Patients');
        });

        it('should display subtitle text', async () => {
            await browser.expect('.patients-page-sub').toBeVisible();
            await browser.expect('.patients-page-sub').toHaveText('Monitor patient trends, vitals, lab results, and risk levels in one place');
        });

        it('should display the AI Assistance button', async () => {
            await browser.expect('#btn-ai-assistance').toBeVisible();
        });

        it('should display the Export button', async () => {
            await browser.expect('#btn-export').toBeVisible();
        });

        it('should trigger an Excel download when clicked', async () => {
            const fileName = 'Patients.xlsx';
            await deleteFileIfExists(fileName);

            let errorState: unknown = 'no errors';
            await browser.click('#btn-export');
            try {
                const content = await getFileContent(fileName) as Buffer;
                await new Promise(r => setTimeout(r, 500));
                expect(content.length).toBeGreaterThan(0);
                expect(content.slice(0, 2).toString()).toBe('PK'); // XLSX magic bytes (ZIP)
            } catch (err) {
                errorState = err;
            } finally {
                await new Promise(r => setTimeout(r, 500));
                fs.unlink(defaultDownloadPath + fileName, () => {});
            }
            expect(errorState).toBe('no errors');
        });
    });

    describe('Patients Grid', () => {
        it('should display the patients grid', async () => {
            await browser.expect('#patients-grid[data-role="grid"]').toBeVisible();
        });

        it('should have correct column headers', async () => {
            const headers = await browser.findAll('#patients-grid .k-column-title');
            expect(headers.length).toBe(8);
        });

        it('should show Patient Name column', async () => {
            await browser.expect('#patients-grid .k-column-title').toContainText('Patient Name');
        });

        it('should display patient rows', async () => {
            expect(await grid.masterRowsCount()).toBe(10);
        });

        it('should have filter row for columns', async () => {
            await browser.expect('#patients-grid .k-filter-row').toBeVisible();
        });

        it('should have a Patient Name filter input', async () => {
            await browser.expect('#patients-grid .k-filter-row [aria-label="Patient Name Filter"]').toBeVisible();
        });

        it('should filter patients by name', async () => {
            await browser.type('#patients-grid .k-filter-row [aria-label="Patient Name Filter"]', 'Emma');
            await browser.expect('#patients-grid .k-master-row').toBeVisible();
            await browser.expect('#patients-grid .k-master-row td:nth-child(1)').toContainText('Emma');
        });

        it('should clear filter and show all patients', async () => {
            await browser.type('#patients-grid .k-filter-row [aria-label="Patient Name Filter"]', '');
            expect(await grid.masterRowsCount()).toBe(10);
        });

        it('should show No items to display when filter matches no patients', async () => {
            await browser.type('#patients-grid .k-filter-row [aria-label="Patient Name Filter"]', 'ZZZNOMATCH999');
            await browser.sendKey(Key.ENTER);
            await grid.waitForRows(0);
            expect(await grid.isEmpty()).toBe(false); // grid renders but pager shows no items
            const pager = await grid.pager();
            expect(await pager.infoText()).toBe('No items to display');
        });

        it('should restore rows after clearing the no-match filter', async () => {
            await browser.type('#patients-grid .k-filter-row [aria-label="Patient Name Filter"]', '');
            await grid.waitForRows(10);
            expect(await grid.masterRowsCount()).toBe(10);
        });

        it('should allow sorting by clicking column headers', async () => {
            await grid.headerByText('Patient Name');
            await browser.click('#patients-grid .k-column-title:first-of-type');
            await browser.expect('#patients-grid [data-role="columnsorter"]:first-child').toBeVisible();
        });

        it('should display the grid pager', async () => {
            await browser.expect('#patients-grid .k-pager').toBeVisible();
        });

        it('should show 3 page number buttons', async () => {
            const pager = await grid.pager();
            const pages = await pager.pageButtons();
            expect(pages.length).toBe(3);
        });

        it('should navigate to page 2', async () => {
            const pager = await grid.pager();
            await browser.click(await pager.pageButton(2));
            expect(await pager.selectedPage()).toBe('2');
        });

        it('should navigate back to page 1', async () => {
            const pager = await grid.pager();
            await browser.click(await pager.firstPage());
            expect(await pager.selectedPage()).toBe('1');
        });

        it('should show pager info "1 - 10 of 30 items" by default', async () => {
            const pager = await grid.pager();
            expect(await pager.infoText()).toBe('1 - 10 of 30 items');
        });
    });

    describe('Patients Grid — Items Per Page', () => {
        beforeEach(async () => {
            await browser.navigateTo(`${BASE_URL}/Patients`);
        });

        afterEach(async () => {
            await browser.executeScript(
                "kendo.jQuery('#patients-grid').data('kendoGrid').dataSource.pageSize(10);"
            );
        });

        it('should change page count from 3 to 2 when switching to 20 items per page', async () => {
            await browser.executeScript(
                "kendo.jQuery('#patients-grid').data('kendoGrid').dataSource.pageSize(20);"
            );
            const pager = await grid.pager();
            const pages = await pager.pageButtons();
            expect(pages.length).toBe(2);
        });

        it('should update pager info to "1 - 20 of 30 items" when switching to 20 items per page', async () => {
            await browser.executeScript(
                "kendo.jQuery('#patients-grid').data('kendoGrid').dataSource.pageSize(20);"
            );
            const pager = await grid.pager();
            expect(await pager.infoText()).toBe('1 - 20 of 30 items');
        });

        it('should display 20 rows in the grid when switching to 20 items per page', async () => {
            await browser.executeScript(
                "kendo.jQuery('#patients-grid').data('kendoGrid').dataSource.pageSize(20);"
            );
            await grid.waitForRows(20);
            expect(await grid.masterRowsCount()).toBe(20);
        });

        it('should change page size via the pager dropdown', async () => {
            const pager = await grid.pager();
            const ddl = await pager.dropDownList();
            await ddl.selectItemByText('20');
            expect(await pager.infoText()).toBe('1 - 20 of 30 items');
            await grid.waitForRows(20);
            expect(await grid.masterRowsCount()).toBe(20);
        });

        it('should display the page size dropdown', async () => {
            await browser.expect('#patients-grid .k-pager-sizes .k-dropdownlist').toBeVisible();
        });

        it('should show "10" as the default selected page size', async () => {
            const pager = await grid.pager();
            const ddl = await pager.dropDownList();
            expect(await ddl.getText()).toBe('10');
        });
    });

    describe('Patients Grid — Columns', () => {
        it('should display Age column', async () => {
            await browser.expect('#patients-grid .k-grid-header').toContainText('Age');
        });

        it('should display Status column', async () => {
            await browser.expect('#patients-grid .k-grid-header').toContainText('Status');
        });

        it('should display Ward column', async () => {
            await browser.expect('#patients-grid').toContainText('Ward');
        });

        it('should display Diagnosis column', async () => {
            await browser.expect('#patients-grid').toContainText('Diagnosis');
        });

        it('should display Actions column', async () => {
            await browser.expect('#patients-grid').toContainText('Actions');
        });
    });

    describe('AI Assistance Panel', () => {
        it('should open AI Assistance panel when button is clicked', async () => {
            await browser.click('#btn-ai-assistance');
            await browser.expect('#patient-ai-panel').toBeVisible();
        });

        it('should display the AI chat widget', async () => {
            await browser.expect('#list-ai-chat[data-role="chat"]').toBeVisible();
        });

        it('should display AI Assistant header', async () => {
            await browser.expect('#list-ai-chat .k-chat-header').toHaveCount(1);
        });

        it('should display a welcome message', async () => {
            await browser.expect('#list-ai-chat .ai-msg-content').toContainText('AI Assistant');
        });

        it('should display suggested prompts', async () => {
            await browser.expect('#list-ai-chat .k-suggestion').toBeVisible();
        });

        it('should show "critical care priorities" suggestion', async () => {
            await browser.expect('#list-ai-chat .k-suggestion').toContainText('critical care priorities');
        });

        it('should send message when suggestion is clicked', async () => {
            await browser.click('#list-ai-chat .k-suggestion');
            await browser.expect('#list-ai-chat .k-message-group-sender .ai-msg-content').toContainText('critical care priorities');
        });

        it('should send the suggestion and show user message', async () => {
            await browser.click('#list-ai-chat .k-prompt-box-textarea');
            await browser.sendKey(Key.ENTER);
            await browser.expect('#list-ai-chat .k-message-group-sender .ai-msg-content').toContainText('critical care priorities');
        });

        it('should receive an AI response after sending', async () => {
            await browser.expect('#list-ai-chat .k-message-group-receiver:last-child .ai-msg-content').toContainText('Critical priorities include');
        });

        it('should close AI Assistance panel when button is clicked again', async () => {
            await browser.click('#btn-ai-assistance');
            await browser.expect('#patient-ai-panel').not.toBeVisible();
        });
    });
});
