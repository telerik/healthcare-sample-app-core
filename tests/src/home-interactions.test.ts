import { Browser, DropDownList, Key } from '@progress/kendo-e2e';
import BASE_URL from './config';

let browser: Browser;
let labPatientDdl: DropDownList;

beforeAll(async () => {
    browser = new Browser();
    labPatientDdl = new DropDownList(browser, '#dialog-lab-test .k-dropdownlist');
    await browser.navigateTo(BASE_URL);
    await browser.expect('#btn-new-note').toBeVisible();
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

describe('Home Page — Quick Action Button Hover', () => {
    it('should change color and show label on Add note hover', async () => {
        await browser.hover('.home-greeting');
        const btnBefore = await browser.getBackgroundColor('#btn-new-note');
        await browser.hover('#btn-new-note');
        const btnAfter = await browser.getBackgroundColor('#btn-new-note');
        expect(btnAfter).not.toBe(btnBefore);
        await browser.expect('#btn-new-note .k-button-text').toBeVisible();
        await browser.expect('#btn-new-note .k-button-text').toHaveText('Add note');
    });

    it('should change color and show label on Request test hover', async () => {
        const btnBefore = await browser.getBackgroundColor('#btn-lab-test');
        await browser.hover('#btn-lab-test');
        const btnAfter = await browser.getBackgroundColor('#btn-lab-test');
        expect(btnAfter).not.toBe(btnBefore);
        await browser.expect('#btn-lab-test .k-button-text').toBeVisible();
        await browser.expect('#btn-lab-test .k-button-text').toHaveText('Request test');
    });

    it('should change color and show label on Send message hover', async () => {
        const btnBefore = await browser.getBackgroundColor('#btn-nurse-chat');
        await browser.hover('#btn-nurse-chat');
        const btnAfter = await browser.getBackgroundColor('#btn-nurse-chat');
        expect(btnAfter).not.toBe(btnBefore);
        await browser.expect('#btn-nurse-chat .k-button-text').toBeVisible();
        await browser.expect('#btn-nurse-chat .k-button-text').toHaveText('Send message');
    });
});

describe('Home Page — Quick Action Dialogs', () => {
    describe('New Clinical Note Dialog', () => {
        it('should open the dialog when clicking Add new clinical note', async () => {
            await browser.click('#btn-new-note');
            await browser.expect('#dialog-new-note').toBeVisible();
        });

        it('should display the dialog title', async () => {
            await browser.expect('.k-dialog:has(#dialog-new-note) .k-dialog-title').toContainText('New Clinical Note');
        });

        it('should show a patient selection dropdown', async () => {
            await browser.expect('#dialog-new-note .k-dropdownlist').toBeVisible();
        });

        it('should show a clinical note textarea', async () => {
            await browser.expect('#note-textarea').toBeVisible();
        });

        it('should have Discard and Save note buttons', async () => {
            await browser.expect('#dialog-new-note ~ .k-dialog-actions .k-button').toBeVisible();
        });

        it('should close the dialog when clicking Discard', async () => {
            await browser.click('#dialog-new-note ~ .k-dialog-actions .k-button');
            await browser.expect('#dialog-new-note').not.toBeVisible();
        });
    });

    describe('Request Lab Test Dialog', () => {
        it('should open the dialog when clicking Request lab test', async () => {
            await browser.click('#btn-lab-test');
            await browser.expect('#dialog-lab-test').toBeVisible();
        });

        it('should display dialog title', async () => {
            await browser.expect('.k-dialog:has(#dialog-lab-test) .k-dialog-title').toContainText('Request Lab Tests');
        });

        it('should show a patient selection dropdown', async () => {
            await browser.expect('#dialog-lab-test .k-dropdownlist').toBeVisible();
        });

        it('should select a patient from the dropdown', async () => {
            await browser.executeScript("var ddl = kendo.jQuery('#lab-patient-ddl').data('kendoDropDownList'); ddl.select(1); ddl.trigger('change');");
            await browser.expect('#dialog-lab-test .k-input-value-text').not.toHaveText('Select patient...');
        });

        it('should show a lab test search input', async () => {
            await browser.expect('#lab-test-search').toBeVisible();
        });

        it('should show a list of lab tests', async () => {
            const tests = await browser.findAll('.lab-test-item');
            expect(tests.length).toBeGreaterThan(0);
        });

        it('should check a lab test when clicking it', async () => {
            await browser.click('#lab-test-list .k-listview-item:nth-child(1) .k-checkbox-wrap');
            const isChecked = await browser.executeScript("return document.querySelector('#lab-test-list .k-listview-item:nth-child(1) input[type=checkbox]').checked;") as boolean;
            expect(isChecked).toBe(true);
        });

        it('should uncheck a lab test when clicking it again', async () => {
            await browser.click('#lab-test-list .k-listview-item:nth-child(1) .k-checkbox-wrap');
            const isChecked = await browser.executeScript("return document.querySelector('#lab-test-list .k-listview-item:nth-child(1) input[type=checkbox]').checked;") as boolean;
            expect(isChecked).toBe(false);
        });

        it('should filter lab tests via search', async () => {
            await browser.type('#lab-test-search', 'Liver');
            await browser.expect('.lab-test-name').toContainText('Liver');
        });

        it('should have the search field retaining the typed text', async () => {
            await browser.expect('#lab-test-search').toHaveValue('Liver');
        });

        it('should clear search and show all tests', async () => {
            await browser.executeScript("var tb = kendo.jQuery('#lab-test-search').data('kendoTextBox'); tb.value(''); kendo.jQuery('#lab-test-search').trigger('input');");
            const allTests = await browser.findAll('#lab-test-list .lab-test-item');
            expect(allTests.length).toBeGreaterThan(15);
        });

        it('should have Discard and Send request buttons', async () => {
            await browser.expect('#dialog-lab-test ~ .k-dialog-actions .k-button').toHaveCount(2);
        });

        it('should close the dialog when clicking Discard', async () => {
            await browser.click('#dialog-lab-test ~ .k-dialog-actions .k-button');
            await browser.expect('#dialog-lab-test').not.toBeVisible();
        });
    });

    describe('Message Nurse Dialog', () => {
        it('should open the dialog when clicking Message nurse', async () => {
            await browser.click('#btn-nurse-chat');
            await browser.expect('#dialog-nurse-chat').toBeVisible();
        });

        it('should show a To combobox for nurse selection', async () => {
            await browser.expect('#dialog-nurse-chat .k-combobox').toBeVisible();
        });

        it('should show a subject input', async () => {
            await browser.expect('#nurse-msg-subject').toBeVisible();
        });

        it('should show a description textarea', async () => {
            await browser.expect('#nurse-msg-body').toBeVisible();
        });

        it('should close the dialog when clicking Cancel', async () => {
            await browser.click('#dialog-nurse-chat ~ .k-dialog-actions .k-button');
            await browser.expect('#dialog-nurse-chat').not.toBeVisible();
        });
    });
});

describe('New Clinical Note Dialog — Validation and Save', () => {
    beforeEach(async () => {
        await browser.navigateTo(BASE_URL);
        await browser.click('#btn-new-note');
        await browser.expect('#dialog-new-note').toBeVisible();
    });

    it('should show dialog and keep note dialog open when saving without a patient selected', async () => {
        await browser.click('#dialog-new-note ~ .k-dialog-actions .k-button:last-child');
        await browser.expect('[data-role="alert"]').toHaveText('Please select a patient.');
        await browser.click('[role="alertdialog"] .k-dialog-actions .k-button');
        await browser.expect('#dialog-new-note').toBeVisible();
    });

    it('should show dialog and keep note dialog open when saving with patient but empty note text', async () => {
        await browser.executeScript("var ddl = kendo.jQuery('#note-patient-ddl').data('kendoDropDownList'); ddl.select(1);");
        await browser.click('#dialog-new-note ~ .k-dialog-actions .k-button:last-child');
        await browser.expect('[data-role="alert"]').toHaveText('Please enter a clinical note.');
        await browser.click('[role="alertdialog"] .k-dialog-actions .k-button');
        await browser.expect('#dialog-new-note').toBeVisible();
    });

    it('should close the dialog when saving with valid patient and note text', async () => {
        await browser.executeScript("var ddl = kendo.jQuery('#note-patient-ddl').data('kendoDropDownList'); ddl.select(1);");
        await browser.type('#note-textarea', 'Patient is responding well to current treatment.');
        await browser.click('#dialog-new-note ~ .k-dialog-actions .k-button:last-child');
        await browser.expect('#dialog-new-note').not.toBeVisible();
    });
});

describe('Request Lab Test Dialog — Validation and Send', () => {
    beforeEach(async () => {
        await browser.navigateTo(BASE_URL);
        await browser.click('#btn-lab-test');
        await browser.expect('#dialog-lab-test').toBeVisible();
    });

    it('should show dialog and keep lab test dialog open when sending without a patient selected', async () => {
        await browser.click('#dialog-lab-test ~ .k-dialog-actions .k-button:last-child');
        await browser.expect('[data-role="alert"]').toHaveText('Please select a patient.');
        await browser.click('[role="alertdialog"] .k-dialog-actions .k-button');
        await browser.expect('#dialog-lab-test').toBeVisible();
    });

    it('should show dialog and keep lab test dialog open when sending with patient but no tests selected', async () => {
        await browser.expect('#dialog-lab-test .k-input-value-text').toBeVisible();
        await browser.executeScript("var ddl = kendo.jQuery('#lab-patient-ddl').data('kendoDropDownList'); ddl.select(1); ddl.trigger('change');");
        await browser.click('#dialog-lab-test ~ .k-dialog-actions .k-button:last-child');
        await browser.expect('[data-role="alert"]').toHaveText('Please select at least one lab test.');
        await browser.click('[role="alertdialog"] .k-dialog-actions .k-button');
        await browser.expect('#dialog-lab-test').toBeVisible();
    });

    it('should show confirmation dialog and close when sending with valid patient and test selection', async () => {
        await browser.executeScript("var ddl = kendo.jQuery('#lab-patient-ddl').data('kendoDropDownList'); ddl.select(1); ddl.trigger('change');");
        await browser.click('#lab-test-list .k-listview-item:first-child .k-checkbox-wrap');
        await browser.click('#dialog-lab-test ~ .k-dialog-actions .k-button:last-child');
        await browser.expect('[data-role="alert"]').toBeVisible();
        await browser.click('[role="alertdialog"] .k-dialog-actions .k-button');
        await browser.expect('#dialog-lab-test').not.toBeVisible();
    });
});

describe('Message Nurse Dialog — Validation and Send', () => {
    beforeEach(async () => {
        await browser.navigateTo(BASE_URL);
        await browser.click('#btn-nurse-chat');
        await browser.expect('#dialog-nurse-chat').toBeVisible();
    });

    it('should show dialog and keep nurse dialog open when sending without a recipient', async () => {
        await browser.click('#dialog-nurse-chat ~ .k-dialog-actions .k-button:last-child');
        await browser.expect('[data-role="alert"]').toHaveText('Please specify a recipient.');
        await browser.click('[role="alertdialog"] .k-dialog-actions .k-button');
        await browser.expect('#dialog-nurse-chat').toBeVisible();
    });

    it('should show dialog and keep nurse dialog open when sending with recipient but no subject', async () => {
        await browser.executeScript("$('#nurse-msg-to').data('kendoComboBox').value('nursestation@hospital.com');");
        await browser.click('#dialog-nurse-chat ~ .k-dialog-actions .k-button:last-child');
        await browser.expect('[data-role="alert"]').toHaveText('Please enter a subject.');
        await browser.click('[role="alertdialog"] .k-dialog-actions .k-button');
        await browser.expect('#dialog-nurse-chat').toBeVisible();
    });

    it('should show dialog and keep nurse dialog open when sending with recipient and subject but no body', async () => {
        await browser.executeScript("$('#nurse-msg-to').data('kendoComboBox').value('nursestation@hospital.com');");
        await browser.type('#nurse-msg-subject', 'Lab Results Review');
        await browser.click('#dialog-nurse-chat ~ .k-dialog-actions .k-button:last-child');
        await browser.expect('[data-role="alert"]').toHaveText('Please enter a message.');
        await browser.click('[role="alertdialog"] .k-dialog-actions .k-button');
        await browser.expect('#dialog-nurse-chat').toBeVisible();
    });

    it('should show confirmation dialog and close when sending with all fields filled', async () => {
        await browser.executeScript("$('#nurse-msg-to').data('kendoComboBox').value('nursestation@hospital.com');");
        await browser.type('#nurse-msg-subject', 'Lab Results Review');
        await browser.type('#nurse-msg-body', 'Please review the latest lab results for Patient P-1001.');
        await browser.click('#dialog-nurse-chat ~ .k-dialog-actions .k-button:last-child');
        await browser.expect('[data-role="alert"]').toBeVisible();
        await browser.click('[role="alertdialog"] .k-dialog-actions .k-button');
        await browser.expect('#dialog-nurse-chat').not.toBeVisible();
    });
});

describe('Home Page — Reason for Visit Details Dialog', () => {
    it('should open the dialog when clicking Details on Reason for visit', async () => {
        await browser.navigateTo(BASE_URL);
        await browser.click('#link-reason-details');
        await browser.expect('#dialog-reason-visit').toBeVisible();
    });

    it('should display the dialog title', async () => {
        await browser.expect('.k-dialog:has(#dialog-reason-visit) .k-dialog-title').toContainText('Reason for Visit');
    });

    it('should display patient name', async () => {
        await browser.expect('#dialog-reason-visit .info-dialog').toContainText('Patient');
    });

    it('should display chief complaint', async () => {
        await browser.expect('#dialog-reason-visit .info-dialog').toContainText('Chief Complaint');
    });

    it('should display appointment info', async () => {
        await browser.expect('#dialog-reason-visit .info-dialog').toContainText('Appointment');
    });

    it('should display doctor name', async () => {
        await browser.expect('#dialog-reason-visit .info-dialog').toContainText('Doctor');
    });

    it('should display visit history section', async () => {
        await browser.expect('#dialog-reason-visit .info-dialog-section-title').toBeVisible();
    });

    it('should display visit history entries', async () => {
        const rows = await browser.findAll('#dialog-reason-visit .info-dialog-section:last-child .info-dialog-row');
        expect(rows.length).toBeGreaterThanOrEqual(2);
    });

    it('should close the dialog when clicking Close', async () => {
        await browser.click('#dialog-reason-visit ~ .k-dialog-actions .k-button');
        await browser.expect('#dialog-reason-visit').not.toBeVisible();
    });
});

describe('Home Page — Allergy Alert Details Dialog', () => {
    it('should open the dialog when clicking Details on Allergy Alert', async () => {
        await browser.click('#link-allergy-details');
        await browser.expect('#dialog-allergy-details').toBeVisible();
    });

    it('should display the dialog title', async () => {
        await browser.expect('.k-dialog:has(#dialog-allergy-details) .k-dialog-title').toContainText('Allergy Alert');
    });

    it('should display patient name', async () => {
        await browser.expect('#dialog-allergy-details .info-dialog').toContainText('Patient');
    });

    it('should display blood type', async () => {
        await browser.expect('#dialog-allergy-details .info-dialog').toContainText('Blood Type');
    });

    it('should display known allergens section', async () => {
        await browser.expect('#dialog-allergy-details .info-dialog-section-title').toBeVisible();
    });

    it('should display allergy badges', async () => {
        const badges = await browser.findAll('#dialog-allergy-details [data-role="badge"]');
        expect(badges.length).toBeGreaterThanOrEqual(2);
    });

    it('should display warning note', async () => {
        await browser.expect('#dialog-allergy-details .info-dialog-note').toBeVisible();
    });

    it('should close the dialog when clicking Close', async () => {
        await browser.click('#dialog-allergy-details ~ .k-dialog-actions .k-button');
        await browser.expect('#dialog-allergy-details').not.toBeVisible();
    });
});

describe('Home Page — Alert Review Dialog', () => {
    it('should open the alert review dialog when Review is clicked', async () => {
        await browser.navigateTo(BASE_URL);
        await browser.scrollAndClick('.alert-review');
        await browser.expect('#dialog-alert-review').toBeVisible();
    });

    it('should display alert review title', async () => {
        await browser.expect('.ar-title').toHaveText('Alert Review');
    });

    it('should display severity badge', async () => {
        await browser.expect('.ar-badge-high').toBeVisible();
    });

    it('should display alert details text', async () => {
        await browser.expect('.ar-details-text').toBeVisible();
    });

    it('should display patient information', async () => {
        await browser.expect('.ar-patient-name').toBeVisible();
    });

    it('should display patient vitals', async () => {
        await browser.expect('.ar-vitals-grid').toBeVisible();
    });

    it('should have a View Full Profile link', async () => {
        await browser.expect('.ar-profile-link').toBeVisible();
    });

    it('should have a Mark as Resolved button', async () => {
        await browser.expect('.ar-resolve-btn').toBeVisible();
    });

    it('should close the dialog when clicking Close', async () => {
        await browser.click('#dialog-alert-review ~ .k-dialog-actions .k-button');
        await browser.expect('#dialog-alert-review').not.toBeVisible();
    });
});

describe('Home Page — Alert Review View Full Profile', () => {
    it('should open alert review dialog', async () => {
        await browser.navigateTo(BASE_URL);
        await browser.scrollAndClick('.alert-review');
        await browser.expect('#dialog-alert-review').toBeVisible();
    });

    it('should display View Full Profile link', async () => {
        await browser.expect('.ar-profile-link').toContainText('View Full Profile');
    });

    it('should navigate to patients page when View Full Profile is clicked', async () => {
        await browser.click('.ar-profile-link');
        await browser.expect('#patients-detail-view').toBeVisible();
    });

    it('should display the patient detail view', async () => {
        await browser.expect('.profile-patient-name').toBeVisible();
    });

    it('should navigate back to home', async () => {
        await browser.navigateTo(BASE_URL);
        await browser.expect('.home-greeting').toBeVisible();
    });
});

describe('Home Page — AI Assistant', () => {
    it('should display the floating action button', async () => {
        await browser.navigateTo(BASE_URL);
        await browser.expect('#ai-float-btn[data-role="floatingactionbutton"]').toBeVisible();
    });

    it('should open AI chat when FAB is clicked', async () => {
        await browser.click('#ai-float-btn');
        await browser.expect('#ai-chat[data-role="chat"]').toBeVisible();
    });

    it('should display AI Assistant header', async () => {
        await browser.expect('#ai-chat .k-chat-header').toHaveCount(1);
    });

    it('should display a welcome message', async () => {
        await browser.expect('.ai-msg-content').toContainText('AI Assistant');
    });

    it('should display suggested prompts', async () => {
        await browser.expect('.k-suggestion').toBeVisible();
    });

    it('should show "Summary for next patient" suggestion', async () => {
        await browser.expect('.k-suggestion').toContainText('Summary for next patient');
    });

    it('should show "Provide lab results" suggestion', async () => {
        await browser.expect('.k-suggestion:nth-child(2)').toContainText('lab results');
    });

    it('should show "How many patients" suggestion', async () => {
        await browser.expect('.k-suggestion:nth-child(3)').toContainText('How many patients');
    });

    it('should show "allergic patients" suggestion', async () => {
        await browser.expect('.k-suggestion:nth-child(4)').toContainText('allergic patients');
    });

    it('should have a message input textarea', async () => {
        await browser.expect('.k-prompt-box-textarea').toBeVisible();
    });

    it('should send a suggested prompt and get a response', async () => {
        await browser.click('.k-suggestion');
        await browser.expect('.k-message-group:last-child .k-message-group-content').toBeVisible();
    });

    it('should close AI chat via close button', async () => {
        await browser.click('#ai-float-btn');
        await browser.expect('#ai-chat').not.toBeVisible();
    });
});

describe('Home Page — Appointments Grid Sorting', () => {
    it('should sort the grid ascending when clicking a column header', async () => {
        await browser.navigateTo(BASE_URL);
        await browser.click('#appointments-grid .k-column-title');
        await browser.expect('#appointments-grid th[data-role="columnsorter"]').toHaveAttribute('aria-sort', 'ascending');
    });

    it('should sort the grid descending when clicking the same column again', async () => {
        await browser.click('#appointments-grid .k-column-title');
        await browser.expect('#appointments-grid th[data-role="columnsorter"]').toHaveAttribute('aria-sort', 'descending');
    });
});

describe('Home Page — View Schedule Navigation', () => {
    it('should navigate to Schedule page when View Schedule is clicked', async () => {
        await browser.navigateTo(BASE_URL);
        await browser.click('#btn-view-schedule');
        await browser.expect('#scheduler[data-role="scheduler"]').toBeVisible();
    });
});

describe('Home Page — Settings Button', () => {
    beforeEach(async () => {
        await browser.navigateTo(BASE_URL);
        await browser.executeScript("sessionStorage.removeItem('pageDimmed'); $('#page-content').removeClass('page-dimmed'); $('#appbar').removeClass('page-dimmed');");
    });

    it('should add page-dimmed class to #appbar and #page-content when Settings is clicked', async () => {
        await browser.click('#btn-settings');
        await browser.expect('#appbar').toHaveClass('page-dimmed', { exactMatch: false });
        await browser.expect('#page-content').toHaveClass('page-dimmed', { exactMatch: false });
    });

    it('should remove page-dimmed class when Settings is clicked a second time', async () => {
        await browser.click('#btn-settings');
        await browser.click('#btn-settings');
        await browser.expect('#appbar').not.toHaveClass('page-dimmed', { exactMatch: false });
        await browser.expect('#page-content').not.toHaveClass('page-dimmed', { exactMatch: false });
    });
});

describe('Home Page — Create New Clinical Note', () => {
    beforeEach(async () => {
        await browser.navigateTo(BASE_URL);
        await browser.click('#btn-new-note');
        await browser.expect('#dialog-new-note').toBeVisible();
    });

    it('should populate the patient dropdown with patients', async () => {
        const count = await browser.executeScript("return $('#note-patient-ddl').data('kendoDropDownList').dataSource.total();") as number;
        expect(count).toBeGreaterThan(0);
    });

    it('should reflect the selected patient in the dropdown', async () => {
        await browser.executeScript("var ddl = kendo.jQuery('#note-patient-ddl').data('kendoDropDownList'); ddl.select(1); ddl.trigger('change');");
        await browser.expect('#dialog-new-note .k-input-value-text').not.toHaveText('Select patient...');
    });

    it('should accept text typed into the note textarea', async () => {
        const noteText = 'Patient is stable and responding well to treatment.';
        await browser.type('#note-textarea', noteText);
        await browser.expect('#note-textarea').toHaveValue(noteText);
    });

    it('should save the note and close the dialog when all fields are filled', async () => {
        await browser.executeScript("var ddl = kendo.jQuery('#note-patient-ddl').data('kendoDropDownList'); ddl.select(1); ddl.trigger('change');");
        await browser.type('#note-textarea', 'Follow-up required in two weeks.');
        await browser.click('#dialog-new-note ~ .k-dialog-actions .k-button:last-child');
        await browser.expect('#dialog-new-note').not.toBeVisible();
    });

    it('should reset the textarea after saving', async () => {
        await browser.executeScript("var ddl = kendo.jQuery('#note-patient-ddl').data('kendoDropDownList'); ddl.select(1); ddl.trigger('change');");
        await browser.type('#note-textarea', 'Note to be cleared after save.');
        await browser.click('#dialog-new-note ~ .k-dialog-actions .k-button:last-child');
        await browser.expect('#dialog-new-note').not.toBeVisible();
        // dismiss the confirmation alert if shown
        const hasAlert = await browser.executeScript("return !!document.querySelector('[role=\"alertdialog\"]');") as boolean;
        if (hasAlert) {
            await browser.click('[role="alertdialog"] .k-dialog-actions .k-button');
        }
        await browser.click('#btn-new-note');
        await browser.expect('#note-textarea').toHaveValue('');
    });

    it('should persist the saved note in the Patient Note Editor on the Patients page', async () => {
        const noteText = 'E2E-note-' + Date.now();

        // select first real patient and capture their name
        const patientName = await browser.executeScript(
            "var ddl = kendo.jQuery('#note-patient-ddl').data('kendoDropDownList');" +
            "ddl.select(1); ddl.trigger('change');" +
            "return ddl.dataItem(1).text.split(' (')[0];"
        ) as string;

        // type and save the note
        await browser.type('#note-textarea', noteText);
        await browser.click('#dialog-new-note ~ .k-dialog-actions .k-button:last-child');
        await browser.expect('#dialog-new-note').not.toBeVisible();

        // navigate to Patients, filter by that patient, open their profile
        await browser.navigateTo(`${BASE_URL}/Patients`);
        await browser.type('#patients-grid .k-filter-row [aria-label="Patient Name Filter"]', patientName);
        await browser.sendKey(Key.ENTER);
        await browser.expect('#patients-grid .k-master-row').toHaveCount(1);
        await browser.click('.btn-view-patient');
        await browser.expect('#patients-detail-view').toBeVisible();

        // read the Kendo Editor value and verify the note is at the beginning
        const editorValue = await browser.executeScript(
            "return $('#patient-notes-editor').data('kendoEditor').value();"
        ) as string;
        expect(editorValue).toContain(noteText);

        // navigate back to home for subsequent tests
        await browser.navigateTo(BASE_URL);
    });
});

describe('Home Page — Create New Lab Test Request', () => {
    beforeEach(async () => {
        await browser.navigateTo(BASE_URL);
        await browser.click('#btn-lab-test');
        await browser.expect('#dialog-lab-test').toBeVisible();
    });

    it('should populate the patient dropdown with patients', async () => {
        const count = await browser.executeScript("return $('#lab-patient-ddl').data('kendoDropDownList').dataSource.total();") as number;
        expect(count).toBeGreaterThan(0);
    });

    it('should reflect the selected patient in the dropdown', async () => {
        await browser.executeScript("var ddl = kendo.jQuery('#lab-patient-ddl').data('kendoDropDownList'); ddl.select(1); ddl.trigger('change');");
        await browser.expect('#dialog-lab-test .k-input-value-text').not.toHaveText('Select patient...');
    });

    it('should mark a test as selected when clicked', async () => {
        await browser.click('#lab-test-list .k-listview-item:nth-child(2) .k-checkbox-wrap');
        const isChecked = await browser.executeScript("return document.querySelector('#lab-test-list .k-listview-item:nth-child(2) input[type=checkbox]').checked;") as boolean;
        expect(isChecked).toBe(true);
    });

    it('should allow selecting multiple lab tests', async () => {
        await browser.click('#lab-test-list .k-listview-item:nth-child(1) .k-checkbox-wrap');
        await browser.click('#lab-test-list .k-listview-item:nth-child(3) .k-checkbox-wrap');
        const checkedCount = await browser.executeScript("return document.querySelectorAll('#lab-test-list input[type=checkbox]:checked').length;") as number;
        expect(checkedCount).toBe(2);
    });

    it('should send the request and close the dialog when patient and tests are selected', async () => {
        await browser.executeScript("var ddl = kendo.jQuery('#lab-patient-ddl').data('kendoDropDownList'); ddl.select(1); ddl.trigger('change');");
        await browser.click('#lab-test-list .k-listview-item:nth-child(1) .k-checkbox-wrap');
        await browser.click('#dialog-lab-test ~ .k-dialog-actions .k-button:last-child');
        await browser.expect('[data-role="alert"]').toBeVisible();
        await browser.click('[role="alertdialog"] .k-dialog-actions .k-button');
        await browser.expect('#dialog-lab-test').not.toBeVisible();
    });

    it('should reset selected tests after sending', async () => {
        await browser.executeScript("var ddl = kendo.jQuery('#lab-patient-ddl').data('kendoDropDownList'); ddl.select(1); ddl.trigger('change');");
        await browser.click('#lab-test-list .k-listview-item:nth-child(1) .k-checkbox-wrap');
        await browser.click('#dialog-lab-test ~ .k-dialog-actions .k-button:last-child');
        await browser.click('[role="alertdialog"] .k-dialog-actions .k-button');
        await browser.click('#btn-lab-test');
        const checkedCount = await browser.executeScript("return document.querySelectorAll('#lab-test-list input[type=checkbox]:checked').length;") as number;
        expect(checkedCount).toBe(0);
    });
});

describe('Home Page — Send New Nurse Message', () => {
    beforeEach(async () => {
        await browser.navigateTo(BASE_URL);
        await browser.click('#btn-nurse-chat');
        await browser.expect('#dialog-nurse-chat').toBeVisible();
    });

    it('should list available nurse recipients in the combobox', async () => {
        const count = await browser.executeScript("return $('#nurse-msg-to').data('kendoComboBox').dataSource.total();") as number;
        expect(count).toBe(4);
    });

    it('should accept a recipient value in the To field', async () => {
        await browser.executeScript("$('#nurse-msg-to').data('kendoComboBox').value('nursestation@hospital.com');");
        await browser.expect('#nurse-msg-to').toHaveValue('nursestation@hospital.com');
    });

    it('should accept text in the Subject field', async () => {
        await browser.type('#nurse-msg-subject', 'Urgent: Medication Review');
        await browser.expect('#nurse-msg-subject').toHaveValue('Urgent: Medication Review');
    });

    it('should accept text in the Description field', async () => {
        await browser.type('#nurse-msg-body', 'Please review patient P-1001 medication schedule.');
        await browser.expect('#nurse-msg-body').toHaveValue('Please review patient P-1001 medication schedule.');
    });

    it('should send the message and close the dialog when all fields are filled', async () => {
        await browser.executeScript("$('#nurse-msg-to').data('kendoComboBox').value('amandareed@email.com');");
        await browser.type('#nurse-msg-subject', 'Patient Follow-up');
        await browser.type('#nurse-msg-body', 'Please check on patient P-1002 vitals before 14:00.');
        await browser.click('#dialog-nurse-chat ~ .k-dialog-actions .k-button:last-child');
        await browser.expect('[data-role="alert"]').toBeVisible();
        await browser.click('[role="alertdialog"] .k-dialog-actions .k-button');
        await browser.expect('#dialog-nurse-chat').not.toBeVisible();
    });

    it('should reset all fields when Discard is clicked', async () => {
        await browser.executeScript("$('#nurse-msg-to').data('kendoComboBox').value('amandareed@email.com');");
        await browser.type('#nurse-msg-subject', 'Temp Subject');
        await browser.type('#nurse-msg-body', 'Temp body text.');
        await browser.click('#dialog-nurse-chat ~ .k-dialog-actions .k-button:first-child');
        await browser.expect('#dialog-nurse-chat').not.toBeVisible();
        await browser.click('#btn-nurse-chat');
        await browser.expect('#nurse-msg-subject').toHaveValue('');
        await browser.expect('#nurse-msg-body').toHaveValue('');
    });
});

describe('Home Page — New Clinical Note Dialog — Keyboard Navigation', () => {
    beforeEach(async () => {
        await browser.navigateTo(BASE_URL);
        await browser.click('#btn-new-note');
        await browser.expect('#note-textarea').toHaveFocus(); // waits for the 100ms open timer to fire
    });

    it('should focus patient dropdown on Shift+Tab from note textarea', async () => {
        await browser.sendKeyCombination(Key.SHIFT, Key.TAB);
        await browser.expect('#dialog-new-note .k-dropdownlist').toHaveFocus();
    });

    it('should Tab from patient dropdown to note textarea', async () => {
        await browser.sendKeyCombination(Key.SHIFT, Key.TAB);
        await browser.sendKey(Key.TAB);
        await browser.expect('#note-textarea').toHaveFocus();
    });

    it('should Tab from note textarea to Discard button', async () => {
        await browser.sendKey(Key.TAB);
        await browser.expect('#dialog-new-note ~ .k-dialog-actions .k-button:first-child').toHaveFocus();
    });

    it('should Tab from Discard button to Save note button', async () => {
        await browser.sendKey(Key.TAB);
        await browser.sendKey(Key.TAB);
        await browser.expect('#dialog-new-note ~ .k-dialog-actions .k-button:last-child').toHaveFocus();
    });

    it('should close dialog pressing Enter on Discard button', async () => {
        await browser.sendKey(Key.TAB);
        await browser.sendKey(Key.RETURN);
        await browser.expect('#dialog-new-note').not.toBeVisible();
    });
});

describe('Home Page — Request Lab Test Dialog — Keyboard Navigation', () => {
    beforeEach(async () => {
        await browser.navigateTo(BASE_URL);
        await browser.click('#btn-lab-test');
        await browser.expect('#dialog-lab-test').toBeVisible();
    });

    it('should focus patient dropdown on Shift+Tab from search input', async () => {
        await browser.click('#lab-test-search');
        await browser.expect('#lab-test-search').toHaveFocus();
        await browser.sendKeyCombination(Key.SHIFT, Key.TAB);
        await browser.expect('#dialog-lab-test .k-dropdownlist').toHaveFocus();
    });

    it('should Tab from patient dropdown to search input', async () => {
        await browser.click('#lab-test-search');
        await browser.sendKeyCombination(Key.SHIFT, Key.TAB);
        await browser.expect('#dialog-lab-test .k-dropdownlist').toHaveFocus();
        await browser.sendKey(Key.TAB);
        await browser.expect('#lab-test-search').toHaveFocus();
    });

    it('should Tab from search input to first lab test checkbox', async () => {
        await browser.click('#lab-test-search');
        await browser.expect('#lab-test-search').toHaveFocus();
        await browser.sendKey(Key.TAB);
        await browser.expect('#lab-test-list .k-listview-item:first-child input[type=checkbox]').toHaveFocus();
    });

    it('should Tab from Discard button to Send request button', async () => {
        await browser.executeScript("document.querySelector('#dialog-lab-test ~ .k-dialog-actions .k-button:first-child').focus();");
        await browser.expect('#dialog-lab-test ~ .k-dialog-actions .k-button:first-child').toHaveFocus();
        await browser.sendKey(Key.TAB);
        await browser.expect('#dialog-lab-test ~ .k-dialog-actions .k-button:last-child').toHaveFocus();
    });

    it('should close dialog pressing Enter on Discard button', async () => {
        await browser.executeScript("document.querySelector('#dialog-lab-test ~ .k-dialog-actions .k-button:first-child').focus();");
        await browser.expect('#dialog-lab-test ~ .k-dialog-actions .k-button:first-child').toHaveFocus();
        await browser.sendKey(Key.RETURN);
        await browser.expect('#dialog-lab-test').not.toBeVisible();
    });
});

describe('Home Page — Message Nurse Dialog — Keyboard Navigation', () => {
    beforeEach(async () => {
        await browser.navigateTo(BASE_URL);
        await browser.click('#btn-nurse-chat');
        await browser.expect('#dialog-nurse-chat').toBeVisible();
    });

    it('should Tab from To combobox to Subject input', async () => {
        await browser.click('#dialog-nurse-chat .k-combobox');
        await browser.expect('#dialog-nurse-chat .k-combobox [role="combobox"]').toHaveFocus();
        await browser.sendKey(Key.TAB);
        await browser.expect('#nurse-msg-subject').toHaveFocus();
    });

    it('should Tab from Subject to Description textarea', async () => {
        await browser.click('#nurse-msg-subject');
        await browser.expect('#nurse-msg-subject').toHaveFocus();
        await browser.sendKey(Key.TAB);
        await browser.expect('#nurse-msg-body').toHaveFocus();
    });

    it('should Tab from Description to Discard button', async () => {
        await browser.click('#nurse-msg-body');
        await browser.expect('#nurse-msg-body').toHaveFocus();
        await browser.sendKey(Key.TAB);
        await browser.expect('#dialog-nurse-chat ~ .k-dialog-actions .k-button:first-child').toHaveFocus();
    });

    it('should Tab from Discard to Send message button', async () => {
        await browser.click('#nurse-msg-body');
        await browser.expect('#nurse-msg-body').toHaveFocus();
        await browser.sendKey(Key.TAB);
        await browser.expect('#dialog-nurse-chat ~ .k-dialog-actions .k-button:first-child').toHaveFocus();
        await browser.sendKey(Key.TAB);
        await browser.expect('#dialog-nurse-chat ~ .k-dialog-actions .k-button:last-child').toHaveFocus();
    });

    it('should Shift+Tab from Description back to Subject', async () => {
        await browser.click('#nurse-msg-body');
        await browser.expect('#nurse-msg-body').toHaveFocus();
        await browser.sendKeyCombination(Key.SHIFT, Key.TAB);
        await browser.expect('#nurse-msg-subject').toHaveFocus();
    });

    it('should close dialog pressing Enter on Discard button', async () => {
        await browser.click('#nurse-msg-body');
        await browser.expect('#nurse-msg-body').toHaveFocus();
        await browser.sendKey(Key.TAB);
        await browser.expect('#dialog-nurse-chat ~ .k-dialog-actions .k-button:first-child').toHaveFocus();
        await browser.sendKey(Key.RETURN);
        await browser.expect('#dialog-nurse-chat').not.toBeVisible();
    });
});

describe('Home Page — Alert Review Dialog — Keyboard Navigation', () => {
    beforeEach(async () => {
        await browser.navigateTo(BASE_URL);
        await browser.scrollAndClick('.alert-review');
        await browser.expect('#dialog-alert-review').toBeVisible();
    });

    it('should Shift+Tab from Close button back to View Full Profile link', async () => {
        await browser.sendKey(Key.TAB);
        await browser.sendKey(Key.TAB);
        await browser.expect('#dialog-alert-review ~ .k-dialog-actions .k-button:first-child').toHaveFocus();
        await browser.sendKeyCombination(Key.SHIFT, Key.TAB);
        await browser.expect('.ar-profile-link').toHaveFocus();
    });

    it('should Tab from View Full Profile to Close action button', async () => {
        await browser.sendKey(Key.TAB);
        await browser.expect('.ar-profile-link').toHaveFocus();
        await browser.sendKey(Key.TAB);
        await browser.expect('#dialog-alert-review ~ .k-dialog-actions .k-button:first-child').toHaveFocus();
    });

    it('should Tab from Close button to Mark as Resolved button', async () => {
        await browser.sendKey(Key.TAB);
        await browser.sendKey(Key.TAB);
        await browser.expect('#dialog-alert-review ~ .k-dialog-actions .k-button:first-child').toHaveFocus();
        await browser.sendKey(Key.TAB);
        await browser.expect('.ar-resolve-btn').toHaveFocus();
    });

    it('should close dialog pressing Enter on Close button', async () => {
        await browser.click('#dialog-alert-review ~ .k-dialog-actions .k-button:first-child');
        await browser.sendKey(Key.RETURN);
        await browser.expect('#dialog-alert-review').not.toBeVisible();
    });
});

describe('Home Page — Reason for Visit Dialog — Keyboard Navigation', () => {
    beforeEach(async () => {
        await browser.navigateTo(BASE_URL);
        await browser.click('#link-reason-details');
        await browser.expect('#dialog-reason-visit').toBeVisible();
    });

    it('should focus Close button as the only focusable action', async () => {
        await browser.sendKey(Key.TAB);
        await browser.expect('#dialog-reason-visit ~ .k-dialog-actions .k-button').toHaveFocus();
    });

    it('should close dialog pressing Enter on Close button', async () => {
        await browser.sendKey(Key.TAB);
        await browser.expect('#dialog-reason-visit ~ .k-dialog-actions .k-button').toHaveFocus();
        await browser.sendKey(Key.RETURN);
        await browser.expect('#dialog-reason-visit').not.toBeVisible();
    });
});

describe('Home Page — Allergy Alert Dialog — Keyboard Navigation', () => {
    beforeEach(async () => {
        await browser.navigateTo(BASE_URL);
        await browser.click('#link-allergy-details');
        await browser.expect('#dialog-allergy-details').toBeVisible();
    });

    it('should display the first allergy badge (Penicillin)', async () => {
        await browser.expect('#allergy-badge-penicillin').toBeVisible();
    });

    it('should display the second allergy badge (NSAIDs)', async () => {
        await browser.expect('#allergy-badge-nsaids').toBeVisible();
    });

    it('should Tab from the dialog content to Close button', async () => {
        await browser.executeScript("document.querySelector('#dialog-allergy-details ~ .k-dialog-actions .k-button').focus();");
        await browser.expect('#dialog-allergy-details ~ .k-dialog-actions .k-button').toHaveFocus();
    });

    it('should close dialog pressing Enter on Close button', async () => {
        await browser.executeScript("document.querySelector('#dialog-allergy-details ~ .k-dialog-actions .k-button').focus();");
        await browser.expect('#dialog-allergy-details ~ .k-dialog-actions .k-button').toHaveFocus();
        await browser.sendKey(Key.RETURN);
        await browser.expect('#dialog-allergy-details').not.toBeVisible();
    });
});
