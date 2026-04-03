/* ═══════════════════════════════════════════════
   EVENT HANDLERS for Html Helper–initialized widgets
═══════════════════════════════════════════════ */
function onSchedulerEdit(e) {
    e.preventDefault();
    openAppointmentDialog(e.event);
}

var _pendingHighlightUid = null;

function highlightSchedulerEvent(uid) {
    var scheduler = $("#scheduler").data("kendoScheduler");
    if (!scheduler) return;
    var $el = scheduler.element.find('[data-uid="' + uid + '"]');
    if (!$el.length) return;
    $el.addClass("context-search-hit");
    $el[0].scrollIntoView({ behavior: "smooth", block: "nearest" });
    setTimeout(function () { $el.removeClass("context-search-hit"); }, 2200);
}

function onSchedulerDataBound() {
    var scheduler = $("#scheduler").data("kendoScheduler");
    if (!scheduler) return;
    var appts = scheduler.dataSource.data().slice();
    if (!appts.length) return;
    if (_pendingHighlightUid) {
        var uid = _pendingHighlightUid;
        _pendingHighlightUid = null;
        setTimeout(function () { highlightSchedulerEvent(uid); }, 100);
    }
}

var activePriorityFilter = null;

/* Add Task button handler — wired by Html Helper */
function onAddTaskBtnClick() {
    $("#add-task-dialog").data("kendoDialog").open();
}

/* View Task dialog — data and open handler */
var _taskViewData = null;

function onViewTaskDialogOpen() {
    if (!_taskViewData) return;
    $("#vtf-name").text(_taskViewData.Task || "");
    $("#vtf-description").text(_taskViewData.Description || "No description provided.");

    var priorityEl = $("#vtf-priority-badge");
    priorityEl.empty();
    var p     = _taskViewData.Priority || "Medium";
    var badge = $('<span class="priority-badge"></span>')
        .attr("data-priority", priorityTheme(p))
        .text(p);
    priorityEl.append(badge);
    badge.kendoBadge({
        themeColor: priorityTheme(p),
        fillMode:   "solid",
        rounded:    "full",
        size:       "large"
    });
}

function onTasksListDataBound() {
    var el = this.element;
    setTimeout(function () {
        el.find(".priority-badge").each(function () {
            var p = $(this).attr("data-priority");
            if (!$(this).data("kendoBadge")) {
                $(this).kendoBadge({
                    themeColor: p || "info",
                    shape:      "pill",
                    fillMode:   "solid",
                    rounded:    "full",
                    size:       "medium"
                });
            }
        });
        /* Initialize task checkboxes as Kendo CheckBox */
        el.find(".task-checkbox").each(function () {
            if (!$(this).data("kendoCheckBox")) {
                $(this).kendoCheckBox({
                    change: onTaskCheckboxChange
                });
            }
        });
    }, 0);
}

function applyTaskFilters() {
    var tasksDS = $("#tasks-list").data("kendoListView").dataSource;
    var q   = $("#tasks-search").val().toLowerCase().trim();
    var filters = [];
    if (q)                    { filters.push({ field: "Task",     operator: "contains",  value: q }); }
    if (activePriorityFilter) { filters.push({ field: "Priority", operator: "eq",        value: activePriorityFilter }); }
    tasksDS.filter(filters.length ? { logic: "and", filters: filters } : {});
}

/* ═══════════════════════════════════════════════
   SHARED DATA — global so Dialog handler functions
   defined below can reference them before ready().
═══════════════════════════════════════════════ */
var patientsData     = [];
var _currentApptEvt  = null;
var _apptExpanded    = false;

/* ═══════════════════════════════════════════════
   APPOINTMENT DIALOG — helper functions (global)
   Called from onSchedulerEdit / onSchedulerDataBound
   which are also global.
═══════════════════════════════════════════════ */
function appointmentDialogIcon(kind) {
    var icons = {
        date: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3.25" y="4.75" width="13.5" height="12" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M6.5 3.5V6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M13.5 3.5V6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M3.25 8.25H16.75" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
        time: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="6.75" stroke="currentColor" stroke-width="1.8"/><path d="M10 6.75V10.25L12.5 11.75" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        location: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 17C12.8 13.7 15 11.15 15 8.75C15 6.13 12.76 4 10 4C7.24 4 5 6.13 5 8.75C5 11.15 7.2 13.7 10 17Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="10" cy="8.75" r="1.9" stroke="currentColor" stroke-width="1.8"/></svg>',
        visit: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M6.75 11.25C8.68 11.25 10.25 9.68 10.25 7.75C10.25 5.82 8.68 4.25 6.75 4.25C4.82 4.25 3.25 5.82 3.25 7.75C3.25 9.68 4.82 11.25 6.75 11.25Z" stroke="currentColor" stroke-width="1.8"/><path d="M11.25 15.75C11.25 13.4 9.23 11.5 6.75 11.5C4.27 11.5 2.25 13.4 2.25 15.75" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M12.75 6L17 10.25" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M17 6V10.25H12.75" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        expand: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M11.75 4.5H15.5V8.25" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.5 4.5L10.75 9.25" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M8.25 15.5H4.5V11.75" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.5 15.5L9.25 10.75" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
        collapse: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.33301 6.66667L13.9997 2" stroke="#232A36" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.333 6.66663H9.33301V2.66663" stroke="#232A36" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 14L6.66667 9.33337" stroke="#232A36" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/><path d="M2.66699 9.33337H6.66699V13.3334" stroke="#232A36" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    };
    return icons[kind] || "";
}

function renderAppointmentDialogContent(evt, callback) {
    $.get("/Schedule/AppointmentDialogPartial", {
        patientName: evt.PatientName || evt.title || "",
        room:        evt.Room   || "",
        reason:      evt.Reason || "",
        start:       evt.start.toISOString(),
        end:         evt.end.toISOString(),
        expanded:    _apptExpanded
    }, function (html) {
        var dlg = $("#appointment-dialog").data("kendoDialog");
        if (dlg) {
            dlg.content(html);
            // Re-inject SVG icons into the placeholder spans
            dlg.wrapper.find(".appt-icon-date").html(appointmentDialogIcon("date"));
            dlg.wrapper.find(".appt-icon-time").html(appointmentDialogIcon("time"));
            dlg.wrapper.find(".appt-icon-location").html(appointmentDialogIcon("location"));
            dlg.wrapper.find(".appt-icon-visit").html(appointmentDialogIcon("visit"));
        }
        if (callback) callback();
    });
}

function syncAppointmentDialogState() {
    var dlg = $("#appointment-dialog").data("kendoDialog");
    if (!dlg) return;
    var wrapper = dlg.wrapper.closest(".k-dialog-wrapper");
    if (!wrapper.length) wrapper = dlg.wrapper;
    wrapper.toggleClass("appt-dialog-expanded", _apptExpanded);
    wrapper.toggleClass("appt-dialog-collapsed", !_apptExpanded);
    dlg.wrapper.find(".appt-expand-btn")
        .attr("aria-label", _apptExpanded ? "Collapse appointment" : "Expand appointment")
        .attr("title", _apptExpanded ? "Collapse" : "Expand")
        .html(appointmentDialogIcon(_apptExpanded ? "collapse" : "expand"));
}

function ensureAppointmentDialogToggle() {
    var dlg = $("#appointment-dialog").data("kendoDialog");
    if (!dlg) return;
    var titlebar = dlg.wrapper.find(".k-window-titlebar");
    if (!titlebar.find(".appt-expand-btn").length) {
        $(
            '<button type="button" class="appt-expand-btn" aria-label="Expand appointment" title="Expand"></button>'
        ).insertBefore(titlebar.find(".k-window-titlebar-actions, .k-window-actions").first());

        titlebar.on("click", ".appt-expand-btn", function () {
            _apptExpanded = !_apptExpanded;
            if (_currentApptEvt) {
                renderAppointmentDialogContent(_currentApptEvt, function () {
                    syncAppointmentDialogState();
                });
            }
        });
    }
    syncAppointmentDialogState();
}

function openAppointmentDialog(evt) {
    _currentApptEvt = evt;
    _apptExpanded   = false;

    var dlg = $("#appointment-dialog").data("kendoDialog");
    if (!dlg) return;
    dlg.title(kendo.htmlEncode((evt.EventType || "Appointment") + " - " + (evt.PatientName || evt.title || "")));
    renderAppointmentDialogContent(evt, function () {
        ensureAppointmentDialogToggle();
        syncAppointmentDialogState();
        dlg.open();
    });
}

/* ── Appointment Dialog event handlers — wired by HTML Helper ── */
function onAppointmentDialogClose() {
    _apptExpanded = false;
}

function onAppointmentDialogCancel() {
    _apptExpanded = false;
    return true;
}

function onAppointmentDialogSave() {
    _apptExpanded = false;
    return true;
}

/* ── New Appointment Dialog event handlers — wired by HTML Helper ── */
function onNewApptDialogOpen() {
    /* Populate the patient DDL data on first open */
    var patDDL = $("#new-appt-patient").data("kendoDropDownList");
    if (patDDL && (!patDDL.dataSource.data().length) && patientsData.length) {
        patDDL.setDataSource(new kendo.data.DataSource({ data: patientsData }));
    }
}

function onNewApptSchedule() {
    var patDDL  = $("#new-appt-patient").data("kendoDropDownList");
    var typDDL  = $("#new-appt-type").data("kendoDropDownList");
    var datePk  = $("#new-appt-date").data("kendoDatePicker");
    var startTp = $("#new-appt-start").data("kendoTimePicker");
    var endTp   = $("#new-appt-end").data("kendoTimePicker");
    var roomDDL = $("#new-appt-room").data("kendoDropDownList");
    var reason  = $("#new-appt-reason").val();
    var scheduler = $("#scheduler").data("kendoScheduler");

    if (!patDDL || !typDDL || !datePk || !startTp || !endTp || !scheduler) { return false; }
    if (!patDDL.value() || !typDDL.value()) { return false; }

    var base = datePk.value();
    var s    = startTp.value();
    var en   = endTp.value();

    scheduler.dataSource.add({
        id:          0,
        title:       patDDL.text(),
        PatientName: patDDL.text(),
        Reason:      reason || "Appointment",
        Room:        roomDDL.value(),
        EventType:   typDDL.value(),
        start:       new Date(base.getFullYear(), base.getMonth(), base.getDate(), s.getHours(), s.getMinutes()),
        end:         new Date(base.getFullYear(), base.getMonth(), base.getDate(), en.getHours(), en.getMinutes())
    });
    scheduler.dataSource.sync();
    return true;
}

/* ── Task checkbox change handler — wired by kendoCheckBox ── */
function onTaskCheckboxChange(e) {
    var id      = parseInt($(e.sender.element).data("id"), 10);
    var checked = e.checked;
    var listView = $("#tasks-list").data("kendoListView");
    if (!listView) return;
    var item = listView.dataSource.get(id);
    if (!item) return;
    item.set("Done", checked);
    $.ajax({
        url:         "/api/tasks/update",
        type:        "POST",
        contentType: "application/json",
        data:        JSON.stringify({ id: id, task: item.Task, priority: item.Priority, description: item.Description || "", done: checked }),
        success: function () { listView.dataSource.read(); }
    });
}

/* ── Add Task form helpers (global scope) ── */
function resetAddTaskForm() {
    var tb = $("#atf-name").data("kendoTextBox");
    if (tb) { tb.value(""); }
    var grp = $("#atf-priority-group").data("kendoButtonGroup");
    if (grp) grp.select(0);
    var ta = $("#atf-description").data("kendoTextArea");
    if (ta) { ta.value(""); }
    clearTaskNameError();
}

function showTaskNameError(message) {
    $("#atf-name").closest(".k-input").addClass("k-invalid");
    $("#add-task-dialog .atf-error").text(message).addClass("is-visible");
}

function clearTaskNameError() {
    $("#atf-name").closest(".k-input").removeClass("k-invalid");
    $("#add-task-dialog .atf-error").text("").removeClass("is-visible");
}

/* ── Add Task Dialog event handlers — wired by HTML Helper ── */
function onAddTaskDialogClose() {
    resetAddTaskForm();
}

function onAddTaskDialogShow() {
    /* Widgets are now created by HTML Helpers — nothing to initialize */
}

function onAddTaskCancel() {
    resetAddTaskForm();
    return true;
}

function onAddTaskSave() {
    var name = ($("#atf-name").val() || "").trim();
    $("#atf-name").val(name);
    if (!name) {
        showTaskNameError("Task name is required.");
        return false;
    }
    clearTaskNameError();
    var priorities = ["Low", "Medium", "High"];
    var grp = $("#atf-priority-group").data("kendoButtonGroup");
    var idx = grp ? grp.current().index() : 0;
    var priority = priorities[idx !== undefined ? idx : 0];
    var ta = $("#atf-description").data("kendoTextArea");
    var description = (ta ? ta.value() : $("#atf-description").val() || "").trim();
    var listView = $("#tasks-list").data("kendoListView");
    $.ajax({
        url:         "/api/tasks/create",
        type:        "POST",
        contentType: "application/json",
        data:        JSON.stringify({ task: name, priority: priority, description: description, done: false }),
        success: function () { if (listView) listView.dataSource.read(); },
        error: function (xhr) {
            showTaskNameError(xhr.responseText || "Task name is required.");
        }
    });
    resetAddTaskForm();
    return true;
}

$(document).ready(function () {

    /* ═══════════════════════════════════════════════
       DATA — static lookups (no patient fetch needed)
    ═══════════════════════════════════════════════ */
    var eventTypesData = sharedEventTypes;
    var roomOptions    = sharedRoomOptions;

    /* ═══════════════════════════════════════════════
       WEEK DATE HELPER
    ═══════════════════════════════════════════════ */
    function thisWeekDay(weekOffset, dayOfWeek, hours, minutes) {
        var d    = new Date();
        var diff = dayOfWeek - d.getDay() + weekOffset * 7;
        var date = new Date(d.getFullYear(), d.getMonth(), d.getDate() + diff, hours, minutes, 0, 0);
        return date;
    }

    /* ═══════════════════════════════════════════════
       SCHEDULER, LISTVIEW, BUTTONGROUP — created by Html Helpers
       Get references to them
    ═══════════════════════════════════════════════ */
    var today     = new Date();
    var scheduler = $("#scheduler").data("kendoScheduler");
    var tasksDS   = $("#tasks-list").data("kendoListView") ? $("#tasks-list").data("kendoListView").dataSource : null;

    /* Notification badge is managed by profile.js initNotifDropdown() */

    /* ═══════════════════════════════════════════════
       APPOINTMENT DETAIL DIALOG
       (all functions defined at global scope above)
    ═══════════════════════════════════════════════ */

    /* ═══════════════════════════════════════════════
       NEW APPOINTMENT — open via btn-add-task is now wired by
       Html Helper .Events(). Just need to open the dialog.
    ═══════════════════════════════════════════════ */
    function openNewAppointmentDialog() {
        var dlg = $("#new-appointment-dialog").data("kendoDialog");
        if (dlg) { dlg.open(); }
    }

    /* ═══════════════════════════════════════════════
       DAILY TASKS — created by Html Helper, just hook events
    ═══════════════════════════════════════════════ */

    var priorityColorMap = { high: "error", medium: "warning", low: "success" };

    window.priorityTheme = function (p) {
        return priorityColorMap[(p || "").toLowerCase()] || "info";
    };

    /* Task checkbox change is handled by kendoCheckBox events in onTasksListDataBound */

    /* priority filter — handled by Html Helper ButtonGroup event */

    $("#tasks-search").on("input", function () {
        applyTaskFilters();
    });

    /* ═══════════════════════════════════════════════
       ADD TASK — open dialog
    ═══════════════════════════════════════════════ */
    /* Add task btn is wired via Html Helper .Events(e => e.Click("onAddTaskBtnClick")) */

    $("#add-task-dialog").on("input", "#atf-name", function () {
        if (($(this).val() || "").trim()) {
            clearTaskNameError();
        }
    });

    /* ═══════════════════════════════════════════════
       VIEW TASK — open on task row click
    ═══════════════════════════════════════════════ */
    $("#tasks-list").on("dblclick", ".task-item", function (e) {
        // Ignore clicks on the checkbox itself
        if ($(e.target).closest(".k-checkbox-wrap, .k-checkbox, .task-cb-wrap").length) return;
        var id   = parseInt($(this).find(".task-checkbox").data("id"), 10);
        if (!tasksDS) tasksDS = $("#tasks-list").data("kendoListView") ? $("#tasks-list").data("kendoListView").dataSource : null;
        if (!tasksDS) return;
        var item = tasksDS.get(id);
        if (!item) return;
        _taskViewData = item.toJSON ? item.toJSON() : item;
        $("#view-task-dialog").data("kendoDialog").open();
    });

    /* ═══════════════════════════════════════════════
       PATIENTS FETCH — populates dialog dropdowns
    ═══════════════════════════════════════════════ */
    ensurePatientSearchData().done(function (patients) {
        patientsData = Array.isArray(patients) ? patients : (patients[0] || []);
        $("#page-content").removeClass("page-loading").addClass("page-ready");
    });

});
