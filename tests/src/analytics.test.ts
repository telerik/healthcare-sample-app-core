import { Browser } from '@progress/kendo-e2e';
import BASE_URL from './config';

describe('Analytics Page', () => {
    let browser: Browser;

    beforeAll(async () => {
        browser = new Browser();
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

    describe('Navigation', () => {
        it('should have Analytics & Reporting tab active', async () => {
            await browser.expect('.k-segmented-control-button.k-selected').toContainText('Analytics');
        });
    });

    describe('Page Header', () => {
        it('should display the analytics page header', async () => {
            await browser.expect('.analytics-page-header').toBeVisible();
        });

        it('should display the page title', async () => {
            await browser.expect('.analytics-page-header h1').toHaveText('Clinical Analytics');
        });

        it('should display the page subtitle', async () => {
            await browser.expect('.analytics-page-header p').toHaveText('Patient trends, vitals, lab results, and risk assessment overview');
        });

        it('should display header controls', async () => {
            await browser.expect('.analytics-header-controls').toBeVisible();
        });

        it('should show default patient as Emma Johnson (P-1001)', async () => {
            await browser.expect('.analytics-header-controls .k-input-value-text').toHaveText('Emma Johnson (P-1001)');
        });
    });

    describe('Charts', () => {
        it('should display the vitals chart', async () => {
            await browser.expect('#vitals-chart[data-role="chart"]').toBeVisible();
        });

        it('should display the alerts column chart', async () => {
            await browser.expect('#alerts-column-chart[data-role="chart"]').toBeVisible();
        });

        it('should display the labs chart card', async () => {
            await browser.expect('.analytics-row:nth-child(3) .analytics-chart-card').toBeVisible();
        });

        it('should display the alerts donut chart', async () => {
            await browser.expect('#alerts-donut-chart[data-role="chart"]').toBeVisible();
        });

        it('should display five chart titles', async () => {
            const titles = await browser.findAll('.chart-title');
            expect(titles.length).toBe(5);
        });

        it('should display "Vitals Over Time" as the first chart title', async () => {
            await browser.expect('.analytics-row:nth-child(1) .chart-title').toHaveText('Vitals Over Time');
        });

        it('should display "Alerts Over Time" as the second chart title', async () => {
            await browser.expect('.analytics-row:nth-child(2) .chart-title').toHaveText('Alerts Over Time');
        });

        it('should display "Lab Results Range" as the third chart title', async () => {
            await browser.expect('.analytics-row:nth-child(3) .chart-title').toHaveText('Lab Results Range');
        });

        it('should display "Alerts by Category" as the fourth chart title', async () => {
            await browser.expect('.analytics-row-2col-equal .analytics-chart-card:first-child .chart-title').toHaveText('Alerts by Category');
        });

        it('should display "Risk Score" as the fifth chart title', async () => {
            await browser.expect('.analytics-gauge-card .chart-title').toHaveText('Risk Score');
        });

        it('should display the vitals chart subtitle', async () => {
            await browser.expect('.analytics-row:nth-child(1) .chart-subtitle').toContainText('Multi-series tracking of blood pressure, heart rate');
        });

        it('should display the alerts chart subtitle', async () => {
            await browser.expect('.analytics-row:nth-child(2) .chart-subtitle').toHaveText('Alert count trend by severity level');
        });

        it('should display the labs chart subtitle', async () => {
            await browser.expect('.analytics-row:nth-child(3) .chart-subtitle').toHaveText('Multi-metric range chart showing latest lab results against optimal ranges');
        });

        it('should display the donut chart subtitle', async () => {
            await browser.expect('.analytics-row-2col-equal .analytics-chart-card:first-child .chart-subtitle').toHaveText('Distribution of alerts by clinical category');
        });

        it('should display chart subtitles', async () => {
            await browser.expect('.chart-subtitle').toBeVisible();
        });
    });

    describe('Lab Bullet Charts', () => {
        it('should display the labs charts container', async () => {
            await browser.expect('#labs-charts-container').toBeVisible();
        });

        it('should display five lab bullet chart rows', async () => {
            const rows = await browser.findAll('.klab-row');
            expect(rows.length).toBe(5);
        });

        it('should display CBC lab label', async () => {
            await browser.expect('.klab-label').toContainText('CBC');
        });

        it('should display CRP lab label', async () => {
            await browser.expect('.klab-row:nth-child(2) .klab-label').toHaveText('CRP');
        });

        it('should display Lipid Panel lab label', async () => {
            await browser.expect('.klab-row:nth-child(3) .klab-label').toHaveText('Lipid Panel');
        });

        it('should display HbA1c lab label', async () => {
            await browser.expect('.klab-row:nth-child(4) .klab-label').toHaveText('HbA1c');
        });

        it('should display eGFR lab label', async () => {
            await browser.expect('.klab-row:nth-child(5) .klab-label').toHaveText('eGFR');
        });

        it('should render bullet charts with data-role chart', async () => {
            await browser.expect('.klab-chart[data-role="chart"]').toBeVisible();
        });
    });

    describe('Risk Gauge', () => {
        it('should display the risk gauge section', async () => {
            await browser.expect('.analytics-gauge-card').toBeVisible();
        });

        it('should display the risk gauge visual', async () => {
            await browser.expect('.risk-gauge-wrap').toBeVisible();
        });

        it('should display the arc gauge component', async () => {
            await browser.expect('#risk-gauge[data-role="arcgauge"]').toBeVisible();
        });

        it('should display the gauge subtitle', async () => {
            await browser.expect('.analytics-gauge-card .chart-subtitle').toHaveText('Patient health risk assessment');
        });

        it('should display the gauge value as 85% for Emma Johnson', async () => {
            await browser.expect('.k-arcgauge-label').toContainText('85%');
        });

        it('should display "Out of 100" below the gauge value', async () => {
            await browser.expect('.k-arcgauge-label').toContainText('Out of 100');
        });

        it('should display the risk score legend', async () => {
            await browser.expect('.risk-score-legend').toBeVisible();
        });

        it('should display three risk legend zones', async () => {
            const items = await browser.findAll('.risk-legend-item');
            expect(items.length).toBe(3);
        });

        it('should label the first legend zone as "High Risk 0–39"', async () => {
            await browser.expect('.risk-legend-item:nth-child(1)').toContainText('High Risk');
            await browser.expect('.risk-legend-item:nth-child(1)').toContainText('0–39');
        });

        it('should label the second legend zone as "Medium Risk 40–69"', async () => {
            await browser.expect('.risk-legend-item:nth-child(2)').toContainText('Medium Risk');
            await browser.expect('.risk-legend-item:nth-child(2)').toContainText('40–69');
        });

        it('should label the third legend zone as "Low Risk 70–100"', async () => {
            await browser.expect('.risk-legend-item:nth-child(3)').toContainText('Low Risk');
            await browser.expect('.risk-legend-item:nth-child(3)').toContainText('70–100');
        });
    });

    describe('Layout', () => {
        it('should have four analytics rows', async () => {
            const rows = await browser.findAll('.analytics-row');
            expect(rows.length).toBe(4);
        });

        it('should have the last row as two-column layout', async () => {
            await browser.expect('.analytics-row-2col-equal').toBeVisible();
        });
    });
});
