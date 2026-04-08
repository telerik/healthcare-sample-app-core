# Notifications — Test Coverage

**Tests: 24 (20 pass, 4 skipped) | File: notifications.test.ts**

## Skipped Tests (Potential App Bugs)

| # | Test Name | Reason |
|---|---|---|
| 1 | should display notification description subtitles | App bug: JS sends `desc` field but server model expects `Description` — subtitles render empty |
| 2 | should show CRP elevated description for Critical Lab Alert | Same serialization mismatch — description text not delivered to partial view |
| 3 | should show blood pressure description for Vitals Warning | Same serialization mismatch — description text not delivered to partial view |
| 4 | should hide the notification badge after marking all read | App bug: `updateBadge()` references `#notif-badge` but the Badge element rendered by Html Helper has no ID |

## All Tests

| # | Requirement | Test Name | File |
|---|---|---|---|
| 1 | Bell icon button | should display the notification bell button | notifications.test.ts |
| 2 | Badge counter | should display the notification badge with count | notifications.test.ts |
| 3 | Dropdown opens | should open the notifications dropdown on click | notifications.test.ts |
| 4 | Notifications title | should display the Notifications title | notifications.test.ts |
| 5 | Mark all read button | should display the Mark all read button | notifications.test.ts |
| 6 | 7 notification cards | should display notification cards | notifications.test.ts |
| 7 | Critical Lab Alert | should show Critical Lab Alert notification | notifications.test.ts |
| 8 | CRP elevated description | **SKIPPED** — should show CRP elevated description | notifications.test.ts |
| 9 | Vitals Warning | should show Vitals Warning notification | notifications.test.ts |
| 10 | Blood pressure description | **SKIPPED** — should show blood pressure description | notifications.test.ts |
| 11 | ICU Monitoring Alert | should show ICU Monitoring Alert notification | notifications.test.ts |
| 12 | New Lab Results | should show New Lab Results notification | notifications.test.ts |
| 13 | Appointment Update | should show Appointment Update notification | notifications.test.ts |
| 14 | New Message | should show New Message notification | notifications.test.ts |
| 15 | System Info | should show System Info notification | notifications.test.ts |
| 16 | Timestamps | should display timestamps on notifications | notifications.test.ts |
| 17 | Description subtitles | **SKIPPED** — should display notification description subtitles | notifications.test.ts |
| 18 | Severity icons | should display notification icons | notifications.test.ts |
| 19 | Read state | should mark some notifications as read | notifications.test.ts |
| 20 | Dropdown closes | should close the dropdown when clicking outside | notifications.test.ts |
| 21 | Mark all: open & verify unread | should open dropdown and have unread notifications | notifications.test.ts |
| 22 | Mark all: all cards marked read | should mark all notifications as read when clicking Mark all read | notifications.test.ts |
| 23 | Mark all: All caught up message | should replace Mark all read button with All caught up message | notifications.test.ts |
| 24 | Mark all: badge hidden | **SKIPPED** — should hide the notification badge after marking all read | notifications.test.ts |
