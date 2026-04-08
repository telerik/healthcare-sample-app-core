# Scheduler — Test Coverage

**Tests: 87 | Files: schedule.test.ts, schedule-interactions.test.ts**

| # | Requirement | Test Name | File |
|---|---|---|---|
| 1 | Schedule tab active | should have Schedule tab active | schedule.test.ts |
| 2 | Scheduler visible | should display the Kendo Scheduler | schedule.test.ts |
| 3 | Toolbar with Today | should show scheduler toolbar with Today button | schedule.test.ts |
| 4 | Prev/Next buttons | should show Previous and Next navigation buttons | schedule.test.ts |
| 5 | Current date | should display the current date | schedule.test.ts |
| 6 | 4 view buttons | should show Day/Week/Month/Agenda view buttons | schedule.test.ts |
| 7 | Day view default | should have Day view selected by default | schedule.test.ts |
| 8 | Switch to Week view | should switch to Week view when clicked | schedule.test.ts |
| 9 | Switch back to Day | should switch back to Day view | schedule.test.ts |
| 10 | Color-coded events | should display color-coded events in the scheduler | schedule-interactions.test.ts |
| 11 | Event text (patient/time) | should display event text with patient name and time | schedule-interactions.test.ts |
| 12 | Event title with type prefix | should display event title with type prefix | schedule-interactions.test.ts |
| 13 | Event meta (time + room) | should display event meta with time and room | schedule-interactions.test.ts |
| 14 | Appointment dialog on dblclick | should open appointment dialog on event double-click | schedule-interactions.test.ts |
| 15 | Dialog: appointment date | should display appointment date in dialog | schedule-interactions.test.ts |
| 16 | Dialog: time range | should display appointment time range | schedule-interactions.test.ts |
| 17 | Dialog: room/floor | should display appointment room | schedule-interactions.test.ts |
| 18 | Dialog closes | should close appointment dialog | schedule-interactions.test.ts |
| 19 | Expand: open dialog | should open appointment dialog on event double-click | schedule-interactions.test.ts |
| 20 | Expand: collapsed state | should start in collapsed state | schedule-interactions.test.ts |
| 21 | Expand: show patient info | should expand to show patient info when expand button is clicked | schedule-interactions.test.ts |
| 22 | Expand: patient heading | should display Patient Information heading when expanded | schedule-interactions.test.ts |
| 23 | Expand: patient name | should display patient name when expanded | schedule-interactions.test.ts |
| 24 | Expand: collapse back | should collapse back when expand button is clicked again | schedule-interactions.test.ts |
| 25 | Expand: close dialog | should close the expanded dialog | schedule-interactions.test.ts |
| 26 | View: switch to Week | should switch to Week view | schedule-interactions.test.ts |
| 27 | View: week multi-day columns | should display week layout with multiple day columns | schedule-interactions.test.ts |
| 28 | View: switch to Month | should switch to Month view | schedule-interactions.test.ts |
| 29 | View: switch to Agenda | should switch to Agenda view | schedule-interactions.test.ts |
| 30 | View: back to Day | should switch back to Day view | schedule-interactions.test.ts |
| 31 | Nav: next day | should navigate to the next day | schedule-interactions.test.ts |
| 32 | Nav: previous day | should navigate to the previous day | schedule-interactions.test.ts |
| 33 | Nav: return to Today | should return to Today | schedule-interactions.test.ts |
| 34 | Priority filter group | should display priority filter button group | schedule-interactions.test.ts |
| 35 | Task search filter | should filter tasks when searching | schedule-interactions.test.ts |
| 36 | Task search clear | should clear search and show all tasks | schedule-interactions.test.ts |
| 37 | Add Task dialog opens | should open the Add Task dialog when clicking the add button | schedule-interactions.test.ts |
| 38 | Add Task dialog title | should display the dialog title | schedule-interactions.test.ts |
| 39 | Add Task name input | should display Task Name input | schedule-interactions.test.ts |
| 40 | Add Task priority group | should display priority button group | schedule-interactions.test.ts |
| 41 | Add Task Low default | should have Low priority selected by default | schedule-interactions.test.ts |
| 42 | Add Task switch to High | should switch priority to High when clicked | schedule-interactions.test.ts |
| 43 | Add Task description | should display description textarea | schedule-interactions.test.ts |
| 44 | Add Task action buttons | should have Cancel and Save buttons | schedule-interactions.test.ts |
| 45 | Add Task dialog closes | should close the dialog when clicking Cancel | schedule-interactions.test.ts |
| 46 | View Task dialog opens | should open the View Task dialog when clicking a task | schedule-interactions.test.ts |
| 47 | View Task dialog title | should display the dialog title | schedule-interactions.test.ts |
| 48 | View Task name | should display task name | schedule-interactions.test.ts |
| 49 | View Task priority badge | should display priority badge | schedule-interactions.test.ts |
| 50 | View Task description | should display task description | schedule-interactions.test.ts |
| 51 | View Task dialog closes | should close the dialog when clicking Close | schedule-interactions.test.ts |
| 52 | Tasks card visible | should display the tasks card | schedule.test.ts |
| 53 | Daily Tasks title | should display the Daily Tasks title | schedule.test.ts |
| 54 | Task search input | should display the search input for tasks | schedule.test.ts |
| 55 | Add task button | should display the add task button | schedule.test.ts |
| 56 | Tasks ListView | should display the tasks ListView | schedule.test.ts |
| 57 | Task items with checkboxes | should display task items with checkboxes | schedule.test.ts |
| 58 | Priority badges | should display priority badges on tasks | schedule.test.ts |
| 59 | Task text | should show task text content | schedule.test.ts |
| 60 | Task completion toggle | should toggle task completion when checkbox is clicked | schedule.test.ts |
| 61 | Checked task strikethrough | should show strikethrough text on completed task | schedule.test.ts |
| 62 | Task uncheck | should uncheck a completed task when checkbox is clicked again | schedule.test.ts |
| 63 | Unchecked task normal text | should show normal text on unchecked task | schedule.test.ts |
| 64 | Priority filter group (static) | should display priority filter button group | schedule.test.ts |
| 65 | Tasks scrollable (more items) | should have more tasks than visible in the list | schedule.test.ts |
| 66 | Task scroll to last | should reveal the last task after scrolling into view | schedule.test.ts |
| 67 | Task search: no match → 0 items | should show no tasks when search matches nothing | schedule-interactions.test.ts |
| 68 | Task search: restore after no-match | should restore all tasks after clearing the no-match search | schedule-interactions.test.ts |
| 69 | Create task: empty name → error | should show a validation error when saving with no task name | schedule-interactions.test.ts |
| 70 | Create task: error clears on type | should clear validation error after typing a name | schedule-interactions.test.ts |
| 71 | Create task (Low priority) | should create a new task and show it in the list | schedule-interactions.test.ts |
| 72 | Create task (Medium priority) | should create a task with Medium priority and show it in the list | schedule-interactions.test.ts |
| 73 | Create task (High priority + description) | should create a task with High priority and a description and show it in the list | schedule-interactions.test.ts |
| 74 | Kbd Add Task: Tab name→Low | should Tab from task name to Low priority button | schedule-interactions.test.ts |
| 75 | Kbd Add Task: Tab Low→Medium | should Tab from Low to Medium priority button | schedule-interactions.test.ts |
| 76 | Kbd Add Task: Tab Medium→High | should Tab from Medium to High priority button | schedule-interactions.test.ts |
| 77 | Kbd Add Task: Tab High→description | should Tab from High priority to description textarea | schedule-interactions.test.ts |
| 78 | Kbd Add Task: Tab description→Cancel | should Tab from description to Cancel button | schedule-interactions.test.ts |
| 79 | Kbd Add Task: Tab Cancel→Save | should Tab from Cancel to Save button | schedule-interactions.test.ts |
| 80 | Kbd Add Task: ArrowRight Low→Medium | should navigate within priority group using ArrowRight from Low to Medium | schedule-interactions.test.ts |
| 81 | Kbd Add Task: ArrowRight Medium→High | should navigate within priority group using ArrowRight from Medium to High | schedule-interactions.test.ts |
| 82 | Kbd Add Task: ArrowRight wraps High→Low | should wrap around priority group from High to Low on ArrowRight | schedule-interactions.test.ts |
| 83 | Kbd Add Task: ArrowLeft Medium→Low | should navigate priority group using ArrowLeft from Medium to Low | schedule-interactions.test.ts |
| 84 | Kbd Add Task: Space selects priority | should select a priority button using Space | schedule-interactions.test.ts |
| 85 | Kbd Add Task: Shift+Tab Low→name | should Shift+Tab from Low priority back to task name | schedule-interactions.test.ts |
| 86 | Kbd Add Task: Enter on Cancel closes | should close dialog pressing Enter on Cancel button | schedule-interactions.test.ts |
| 87 | Kbd View Task: focus Close button | should focus Close button as the only focusable action | schedule-interactions.test.ts |
| 88 | Kbd View Task: Enter on Close closes | should close dialog pressing Enter on Close button | schedule-interactions.test.ts |
