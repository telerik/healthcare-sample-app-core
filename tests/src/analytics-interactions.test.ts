import fs from 'fs';
import { Browser, DropDownList, Key } from '@progress/kendo-e2e';
import { deleteFileIfExists, getFileContent, defaultDownloadPath } from '@progress/kendo-e2e/dist/utils/fsUtils';
import BASE_URL from './config';

describe('Analytics Page — Interactions', () => {
    let browser: Browser;
    let dropdown: DropDownList;

    beforeAll(async () => {
        browser = new Browser();
        dropdown = new DropDownList(browser, '.analytics-header-controls .k-dropdownlist');
        await browser.navigateTo(`${BASE_URL}/Analytics`);
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

    describe('Patient Selection Dropdown', () => {
        it('should display the patient selection dropdown', async () => {
            await browser.expect('.analytics-header-controls .k-dropdownlist').toBeVisible();
        });

        it('should open dropdown and display all 30 patients', async () => {
            await browser.expect('.analytics-header-controls .k-dropdownlist').toBeVisible();
            await browser.expect('.analytics-header-controls .k-input-value-text').toBeVisible();
            await dropdown.expand();
            await dropdown.waitToExpand();
            await browser.expect('.k-dropdownlist-popup .k-list-item').toHaveCount(30);
            await browser.click('.analytics-page-header');
            await dropdown.waitToCollapse();
        });

        it('should display filter input in the dropdown', async () => {
            await dropdown.expand();
            await dropdown.waitToExpand();
            await browser.expect('.k-dropdownlist-popup .k-list-filter .k-input-inner').toBeVisible();
            await browser.click('.analytics-page-header');
            await dropdown.waitToCollapse();
        });

        it('should filter and select a patient from the dropdown', async () => {
            await dropdown.expand();
            await dropdown.waitToExpand();
            await dropdown.setFilter('Olivia Davis');
            await browser.wait(async () => (await dropdown.getItems({ waitForItems: false })).length === 1);
            await (await dropdown.getItemByIndex(0)).click();
            await dropdown.waitToCollapse();
            await browser.expect('.analytics-header-controls .k-input-value-text').toContainText('Olivia Davis');
        });

        it('should update the risk gauge after changing patient', async () => {
            const gaugeValue = await browser.executeScript("return String(kendo.jQuery('#risk-gauge').data('kendoArcGauge').value())");
            expect(Number(gaugeValue)).toBe(78);
        });

        it('should update the vitals chart after changing patient', async () => {
            const dataTotal = await browser.executeScript("return String(kendo.jQuery('#vitals-chart').data('kendoChart').dataSource.total())");
            expect(Number(dataTotal)).toBe(5);
        });

        it('should update the alerts column chart after changing patient', async () => {
            const dataTotal = await browser.executeScript("return String(kendo.jQuery('#alerts-column-chart').data('kendoChart').dataSource.total())");
            expect(Number(dataTotal)).toBe(10);
        });

        it('should update the alerts donut chart after changing patient', async () => {
            const dataTotal = await browser.executeScript("return String(kendo.jQuery('#alerts-donut-chart').data('kendoChart').dataSource.total())");
            expect(Number(dataTotal)).toBe(6);
        });

        it('should select back the first patient', async () => {
            await dropdown.selectItemByIndex(0);
            await browser.expect('.analytics-header-controls .k-input-value-text').toContainText('Emma Johnson');
        });
    });

    describe('Export Button', () => {
        it('should display the export button', async () => {
            await browser.expect('#btn-export-analytics').toBeVisible();
        });

        it('should have export icon and text', async () => {
            await browser.expect('#btn-export-analytics .k-button-text').toHaveText('Export');
        });

        it('should trigger a PDF download when clicked', async () => {
            const fileName = 'analytics-report.pdf';
            await deleteFileIfExists(fileName);

            let errorState: unknown = 'no errors';
            await browser.click('#btn-export-analytics');
            try {
                const content = await getFileContent(fileName) as Buffer;
                await new Promise(r => setTimeout(r, 500));
                expect(content.length).toBeGreaterThan(0);
                expect(content.slice(0, 4).toString()).toBe('%PDF');
            } catch (err) {
                errorState = err;
            } finally {
                await new Promise(r => setTimeout(r, 500));
                fs.unlink(defaultDownloadPath + fileName, () => {});
            }
            expect(errorState).toBe('no errors');
        });
    });

    describe('Vitals Over Time Chart', () => {
        it('should display the vitals chart', async () => {
            await browser.expect('#vitals-chart[data-role="chart"]').toBeVisible();
        });

        it('should display chart header', async () => {
            await browser.expect('.analytics-row:first-child .chart-header').toBeVisible();
        });
    });

    describe('Alerts Over Time Chart', () => {
        it('should display the alerts column chart', async () => {
            await browser.expect('#alerts-column-chart[data-role="chart"]').toBeVisible();
        });
    });

    describe('Alerts by Type Donut Chart', () => {
        it('should display the donut chart', async () => {
            await browser.expect('#alerts-donut-chart[data-role="chart"]').toBeVisible();
        });
    });

    describe('Risk Score Gauge', () => {
        it('should display the gauge card', async () => {
            await browser.expect('.analytics-gauge-card').toBeVisible();
        });

        it('should display the risk gauge visual', async () => {
            await browser.expect('.risk-gauge-wrap').toBeVisible();
        });

        it('should display the risk score legend with zones', async () => {
            await browser.expect('.risk-score-legend').toBeVisible();
        });
    });
});
