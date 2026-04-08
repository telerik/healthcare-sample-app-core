# Home (Today Overview) — Test Coverage

**Tests: 170 | Files: home.test.ts, home-interactions.test.ts**

| # | Requirement | Test Name | File |
|---|---|---|---|
| 1 | AppBar visible | should display the app bar | home.test.ts |
| 2 | Logo | should display the logo | home.test.ts |
| 3 | Segmented Control (4 sections) | should display navigation with four sections | home.test.ts |
| 4 | Dashboard selected by default | should have Dashboard selected by default | home.test.ts |
| 5 | Global patient search | should display the search autocomplete | home.test.ts |
| 6 | Search typing | should type in the search box | profile-and-search.test.ts |
| 7 | Search suggestions | should show autocomplete suggestions | profile-and-search.test.ts |
| 8 | Search clear | should clear the search | profile-and-search.test.ts |
| 9 | Notification badge | should display the notification badge | home.test.ts |
| 10 | Profile avatar | should display the profile avatar | home.test.ts |
| 11 | Greeting message | should display a greeting message | home.test.ts |
| 12 | Today's date shown | should show today's date | home.test.ts |
| 13 | Quick Actions card | should display the Quick Actions card | home.test.ts |
| 14 | Quick Actions title | should display the card title | home.test.ts |
| 15 | 3 shortcut cards | should show three shortcut cards | home.test.ts |
| 16 | Shortcut titles | should display shortcut titles | home.test.ts |
| 17 | Shortcut descriptions | should display shortcut descriptions | home.test.ts |
| 18 | Shortcut icons | should display shortcut icons | home.test.ts |
| 19 | Add note button | should have Add new clinical note shortcut | home.test.ts |
| 20 | Lab test button | should have Request lab test shortcut | home.test.ts |
| 21 | Nurse chat button | should have Message nurse shortcut | home.test.ts |
| 22 | Hover Add note (color + label) | should change color and show label on Add note hover | home-interactions.test.ts |
| 23 | Hover Request test (color + label) | should change color and show label on Request test hover | home-interactions.test.ts |
| 24 | Hover Send message (color + label) | should change color and show label on Send message hover | home-interactions.test.ts |
| 25 | New Note dialog opens | should open the dialog when clicking Add new clinical note | home-interactions.test.ts |
| 26 | New Note dialog title | should display the dialog title | home-interactions.test.ts |
| 27 | New Note patient dropdown | should show a patient selection dropdown | home-interactions.test.ts |
| 28 | New Note textarea | should show a clinical note textarea | home-interactions.test.ts |
| 29 | New Note action buttons | should have Discard and Save note buttons | home-interactions.test.ts |
| 30 | New Note dialog closes | should close the dialog when clicking Discard | home-interactions.test.ts |
| 31 | Lab Test dialog opens | should open the dialog when clicking Request lab test | home-interactions.test.ts |
| 32 | Lab Test dialog title | should display dialog title | home-interactions.test.ts |
| 33 | Lab Test patient dropdown | should show a patient selection dropdown | home-interactions.test.ts |
| 34 | Lab Test select patient | should select a patient from the dropdown | home-interactions.test.ts |
| 35 | Lab Test search input | should show a lab test search input | home-interactions.test.ts |
| 36 | Lab Test list | should show a list of lab tests | home-interactions.test.ts |
| 37 | Lab Test check item | should check a lab test when clicking it | home-interactions.test.ts |
| 38 | Lab Test uncheck item | should uncheck a lab test when clicking it again | home-interactions.test.ts |
| 39 | Lab Test filter | should filter lab tests via search | home-interactions.test.ts |
| 40 | Lab Test clear button | should show the clear button when search has text | home-interactions.test.ts |
| 41 | Lab Test clear search | should clear search and show all tests | home-interactions.test.ts |
| 42 | Lab Test action buttons | should have Discard and Send request buttons | home-interactions.test.ts |
| 43 | Lab Test dialog closes | should close the dialog when clicking Discard | home-interactions.test.ts |
| 44 | Nurse Chat dialog opens | should open the dialog when clicking Message nurse | home-interactions.test.ts |
| 45 | Nurse Chat combobox | should show a To combobox for nurse selection | home-interactions.test.ts |
| 46 | Nurse Chat subject | should show a subject input | home-interactions.test.ts |
| 47 | Nurse Chat body | should show a description textarea | home-interactions.test.ts |
| 48 | Nurse Chat dialog closes | should close the dialog when clicking Cancel | home-interactions.test.ts |
| 49 | Reason for Visit Details opens | should open the dialog when clicking Details on Reason for visit | home-interactions.test.ts |
| 50 | Reason dialog title | should display the dialog title | home-interactions.test.ts |
| 51 | Reason dialog patient name | should display patient name | home-interactions.test.ts |
| 52 | Reason dialog chief complaint | should display chief complaint | home-interactions.test.ts |
| 53 | Reason dialog appointment info | should display appointment info | home-interactions.test.ts |
| 54 | Reason dialog doctor | should display doctor name | home-interactions.test.ts |
| 55 | Reason dialog visit history | should display visit history section | home-interactions.test.ts |
| 56 | Reason dialog history entries | should display visit history entries | home-interactions.test.ts |
| 57 | Reason dialog closes | should close the dialog when clicking Close | home-interactions.test.ts |
| 58 | Allergy Details opens | should open the dialog when clicking Details on Allergy Alert | home-interactions.test.ts |
| 59 | Allergy dialog title | should display the dialog title | home-interactions.test.ts |
| 60 | Allergy dialog patient name | should display patient name | home-interactions.test.ts |
| 61 | Allergy dialog blood type | should display blood type | home-interactions.test.ts |
| 62 | Allergy allergens section | should display known allergens section | home-interactions.test.ts |
| 63 | Allergy chips | should display allergy chips | home-interactions.test.ts |
| 64 | Allergy warning note | should display warning note | home-interactions.test.ts |
| 65 | Allergy dialog closes | should close the dialog when clicking Close | home-interactions.test.ts |
| 66 | Appointments section | should display the Today's Appointments section | home.test.ts |
| 67 | View Schedule button | should have a View Schedule button | home.test.ts |
| 68 | Appointments grid | should display the appointments grid | home.test.ts |
| 69 | Appointment rows | should display appointment rows with data | home.test.ts |
| 70 | Status badges | should display status badges in appointments | home.test.ts |
| 71 | Five grid columns | should have five grid columns | home.test.ts |
| 72 | Grid scrollable (more rows) | should have more rows than visible in the grid viewport | home.test.ts |
| 73 | Grid scroll to last row | should reveal the last row after scrolling into view | home.test.ts |
| 74 | View Schedule navigates | should navigate to Schedule page when View Schedule is clicked | home-interactions.test.ts |
| 75 | Next Patient card | should display the Next Patient card | home.test.ts |
| 76 | Patient name | should show patient name | home.test.ts |
| 77 | Patient avatar | should show patient avatar | home.test.ts |
| 78 | Patient meta (age/gender) | should show patient meta info (age/gender) | home.test.ts |
| 79 | Appointment time | should show appointment time | home.test.ts |
| 80 | Reason for visit | should show reason for visit | home.test.ts |
| 81 | Allergy alert | should show allergy alert | home.test.ts |
| 82 | View Profile link | should have a View Profile link | home.test.ts |
| 83 | Daily Alerts title | should display the Daily Alerts title | home.test.ts |
| 84 | Alert cards | should display alert cards | home.test.ts |
| 85 | Alert card titles | should display alert card titles | home.test.ts |
| 86 | Alert timestamps | should display alert timestamps | home.test.ts |
| 87 | Alert Review links | should display Review links on alerts | home.test.ts |
| 88 | Alerts scrollable (more cards) | should have more alert cards than visible | home.test.ts |
| 89 | Alert scroll to last | should reveal the last alert after scrolling into view | home.test.ts |
| 90 | Alert Review dialog opens | should open the alert review dialog when Review is clicked | home-interactions.test.ts |
| 91 | Alert Review title | should display alert review title | home-interactions.test.ts |
| 92 | Alert Review severity badge | should display severity badge | home-interactions.test.ts |
| 93 | Alert Review details text | should display alert details text | home-interactions.test.ts |
| 94 | Alert Review patient info | should display patient information | home-interactions.test.ts |
| 95 | Alert Review vitals | should display patient vitals | home-interactions.test.ts |
| 96 | Alert Review profile link | should have a View Full Profile link | home-interactions.test.ts |
| 97 | Alert Review resolve button | should have a Mark as Resolved button | home-interactions.test.ts |
| 98 | Alert Review dialog closes | should close the dialog when clicking Close | home-interactions.test.ts |
| 99 | Alert Review → open dialog | should open alert review dialog | home-interactions.test.ts |
| 100 | Alert Review → View Full Profile link visible | should display View Full Profile link | home-interactions.test.ts |
| 101 | Alert Review → navigate to patients | should navigate to patients page when View Full Profile is clicked | home-interactions.test.ts |
| 102 | Alert Review → patient detail shown | should display the patient detail view | home-interactions.test.ts |
| 103 | Alert Review → navigate back | should navigate back to home | home-interactions.test.ts |
| 104 | AI FAB button | should display the floating action button | home-interactions.test.ts |
| 105 | AI Chat opens | should open AI chat when FAB is clicked | home-interactions.test.ts |
| 106 | AI Chat header | should display AI Assistant header | home-interactions.test.ts |
| 107 | AI Chat welcome message | should display a welcome message | home-interactions.test.ts |
| 108 | AI suggested prompts visible | should display suggested prompts | home-interactions.test.ts |
| 109 | AI prompt: Summary for next patient | should show "Summary for next patient" suggestion | home-interactions.test.ts |
| 110 | AI prompt: Provide lab results | should show "Provide lab results" suggestion | home-interactions.test.ts |
| 111 | AI prompt: How many patients | should show "How many patients" suggestion | home-interactions.test.ts |
| 112 | AI prompt: Allergic patients | should show "allergic patients" suggestion | home-interactions.test.ts |
| 113 | AI message input | should have a message input textarea | home-interactions.test.ts |
| 114 | AI send prompt & response | should send a suggested prompt and get a response | home-interactions.test.ts |
| 115 | AI Chat closes | should close AI chat via close button | home-interactions.test.ts |
| 116 | Grid sort ascending | should sort the grid ascending when clicking a column header | home-interactions.test.ts |
| 117 | Grid sort descending | should sort the grid descending when clicking the same column again | home-interactions.test.ts |
| 118 | New Note: no patient → alert | should alert and keep dialog open when saving without a patient selected | home-interactions.test.ts |
| 119 | New Note: no text → alert | should alert and keep dialog open when saving with patient but empty note text | home-interactions.test.ts |
| 120 | New Note: valid → dialog closes | should close the dialog when saving with valid patient and note text | home-interactions.test.ts |
| 121 | Lab Test: no patient → alert | should alert and keep dialog open when sending without a patient selected | home-interactions.test.ts |
| 122 | Lab Test: no tests → alert | should alert and keep dialog open when sending with patient but no tests selected | home-interactions.test.ts |
| 123 | Lab Test: valid → dialog closes | should close the dialog when sending with valid patient and test selection | home-interactions.test.ts |
| 124 | Nurse: no recipient → alert | should alert and keep dialog open when sending without a recipient | home-interactions.test.ts |
| 125 | Nurse: no subject → alert | should alert and keep dialog open when sending with recipient but no subject | home-interactions.test.ts |
| 126 | Nurse: no body → alert | should alert and keep dialog open when sending with recipient and subject but no body | home-interactions.test.ts |
| 127 | Nurse: valid → dialog closes | should close the dialog when sending with all fields filled | home-interactions.test.ts |
| 128 | Settings dims appbar and content | should add page-dimmed class to #appbar and #page-content when Settings is clicked | home-interactions.test.ts |
| 129 | Settings toggles off | should remove page-dimmed class when Settings is clicked a second time | home-interactions.test.ts |
| 130 | New Note: patient dropdown populated | should populate the patient dropdown with patients | home-interactions.test.ts |
| 131 | New Note: selected patient reflected | should reflect the selected patient in the dropdown | home-interactions.test.ts |
| 132 | New Note: typing in textarea | should accept text typed into the note textarea | home-interactions.test.ts |
| 133 | New Note: save and close | should save the note and close the dialog when all fields are filled | home-interactions.test.ts |
| 134 | New Note: textarea reset after save | should reset the textarea after saving | home-interactions.test.ts |
| 135 | Lab Test: patient dropdown populated | should populate the patient dropdown with patients | home-interactions.test.ts |
| 136 | Lab Test: selected patient reflected | should reflect the selected patient in the dropdown | home-interactions.test.ts |
| 137 | Lab Test: single test selected | should mark a test as selected when clicked | home-interactions.test.ts |
| 138 | Lab Test: multiple tests selected | should allow selecting multiple lab tests | home-interactions.test.ts |
| 139 | Lab Test: send and close | should send the request and close the dialog when patient and tests are selected | home-interactions.test.ts |
| 140 | Lab Test: selection reset after send | should reset selected tests after sending | home-interactions.test.ts |
| 141 | Nurse: 4 recipients in combobox | should list available nurse recipients in the combobox | home-interactions.test.ts |
| 142 | Nurse: recipient accepted | should accept a recipient value in the To field | home-interactions.test.ts |
| 143 | Nurse: subject accepted | should accept text in the Subject field | home-interactions.test.ts |
| 144 | Nurse: description accepted | should accept text in the Description field | home-interactions.test.ts |
| 145 | Nurse: send and close | should send the message and close the dialog when all fields are filled | home-interactions.test.ts |
| 146 | Nurse: fields reset on Discard | should reset all fields when Discard is clicked | home-interactions.test.ts |
| 147 | New Note: saved note appears in Patient Note Editor | should persist the saved note in the Patient Note Editor on the Patients page | home-interactions.test.ts |
| 148 | Kbd New Note: Shift+Tab textarea→DDL | should focus patient dropdown on Shift+Tab from note textarea | home-interactions.test.ts |
| 149 | Kbd New Note: Tab DDL→textarea | should Tab from patient dropdown to note textarea | home-interactions.test.ts |
| 150 | Kbd New Note: Tab textarea→Discard | should Tab from note textarea to Discard button | home-interactions.test.ts |
| 151 | Kbd New Note: Tab Discard→Save | should Tab from Discard button to Save note button | home-interactions.test.ts |
| 152 | Kbd New Note: Enter on Discard closes | should close dialog pressing Enter on Discard button | home-interactions.test.ts |
| 153 | Kbd Lab Test: Shift+Tab search→DDL | should focus patient dropdown on Shift+Tab from search input | home-interactions.test.ts |
| 154 | Kbd Lab Test: Tab DDL→search | should Tab from patient dropdown to search input | home-interactions.test.ts |
| 155 | Kbd Lab Test: Tab search→Discard | should Tab from search input to Discard button | home-interactions.test.ts |
| 156 | Kbd Lab Test: Tab Discard→Send | should Tab from Discard button to Send request button | home-interactions.test.ts |
| 157 | Kbd Lab Test: Enter on Discard closes | should close dialog pressing Enter on Discard button | home-interactions.test.ts |
| 158 | Kbd Nurse: Tab combobox→subject | should Tab from To combobox to Subject input | home-interactions.test.ts |
| 159 | Kbd Nurse: Tab subject→description | should Tab from Subject to Description textarea | home-interactions.test.ts |
| 160 | Kbd Nurse: Tab description→Discard | should Tab from Description to Discard button | home-interactions.test.ts |
| 161 | Kbd Nurse: Tab Discard→Send | should Tab from Discard to Send message button | home-interactions.test.ts |
| 162 | Kbd Nurse: Shift+Tab description→subject | should Shift+Tab from Description back to Subject | home-interactions.test.ts |
| 163 | Kbd Nurse: Enter on Discard closes | should close dialog pressing Enter on Discard button | home-interactions.test.ts |
| 164 | Kbd Alert Review: Shift+Tab Close→link | should Shift+Tab from Close button back to View Full Profile link | home-interactions.test.ts |
| 165 | Kbd Alert Review: Tab link→Close | should Tab from View Full Profile to Close action button | home-interactions.test.ts |
| 166 | Kbd Alert Review: Tab Close→Resolved | should Tab from Close button to Mark as Resolved button | home-interactions.test.ts |
| 167 | Kbd Alert Review: Enter on Close closes | should close dialog pressing Enter on Close button | home-interactions.test.ts |
| 168 | Kbd Reason for Visit: focus Close | should focus Close button as the only focusable action | home-interactions.test.ts |
| 169 | Kbd Reason for Visit: Enter closes | should close dialog pressing Enter on Close button | home-interactions.test.ts |
| 170 | Kbd Allergy: Tab chip1→chip2 | should Tab from first allergy chip to second chip | home-interactions.test.ts |
| 171 | Kbd Allergy: Tab chip2→Close | should Tab from second chip to Close button | home-interactions.test.ts |
| 172 | Kbd Allergy: Shift+Tab chip2→chip1 | should Shift+Tab from second chip back to first chip | home-interactions.test.ts |
| 173 | Kbd Allergy: Enter on Close closes | should close dialog pressing Enter on Close button | home-interactions.test.ts |
