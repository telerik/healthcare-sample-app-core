/* ═══════════════════════════════════════════════════════
   PROFILE MANAGEMENT — shared across all pages
   Window, Upload, TextBox, MaskedTextBox, Buttons, and
   Notification are created by HTML Helpers in _Layout.cshtml.
   This file provides global event handlers and data logic.
═══════════════════════════════════════════════════════ */

/* ── Doctor data ──────────────────────────────────── */
var doctorProfile = {
    fullName: "Emily Carter",
    email:    "drcarter@email.com",
    phone:    "+(555) 776-90-84",
    avatar:   "/content/patient-images/women/michael-dam-mEZ3PoFGs_k-unsplash.jpg"
};

function applyDoctorProfile(profile) {
    if (!profile) {
        return;
    }

    doctorProfile.fullName = profile.fullName || profile.FullName || doctorProfile.fullName;
    doctorProfile.email    = profile.email || profile.Email || doctorProfile.email;
    doctorProfile.phone    = profile.phone || profile.Phone || doctorProfile.phone;
    doctorProfile.avatar   = profile.avatar || profile.Avatar || doctorProfile.avatar;

    $(".avatar, #profile-trigger").attr("src", doctorProfile.avatar);
    $("#pm-avatar").attr("src", doctorProfile.avatar);
}

function loadDoctorProfile() {
    return $.getJSON("/api/profile")
        .done(function (profile) {
            applyDoctorProfile(profile);
            populateProfileForm();
        });
}
/* ═══════════════════════════════════════════════════════
   EVENT HANDLERS — wired by HTML Helpers in _Layout.cshtml
═══════════════════════════════════════════════════════ */

/* ── Window Open event ── */
function onProfileWindowOpen() {
     
    populateProfileForm();
    setTimeout(function () {
        $('.k-upload-button .k-button-text').prepend("<span class='k-icon upload'></span>");
        kendo.ui.icon($(".upload"), { icon: 'upload' }); // Add icon to upload button         
    })
}

/* ── Upload Success event — Kendo Upload async posts the file to the server ── */
function onProfileUploadSuccess(e) {
    if (e.response) {
        applyDoctorProfile(e.response);
    }
}

/* ── Form Submit event ── */
function onProfileFormSubmit(e) {
    e.preventDefault();
    var model = e.model;

    $.ajax({
        url:         "/api/profile/update",
        type:        "POST",
        contentType: "application/json",
        data:        JSON.stringify({ fullName: model.FullName, email: model.Email, phone: model.Phone }),
        success: function (profile) {
            applyDoctorProfile(profile);
            showProfileNotif("Profile saved successfully.", "success");

            var win = $("#profile-window").data("kendoWindow");
            if (win) {
                win.close();
            }
        },
        error: function () {
            showProfileNotif("Could not save the profile. Please try again.", "error");
        }
    });
}

/* ── Form Clear event ── */
function onProfileFormClear() {
    /* The Form widget handles clearing the fields automatically */
}

/* ── Populate form from doctorProfile ────────────── */
function populateProfileForm() {
    var form = $("#profile-form").data("kendoForm");
    if (form) {
        form.editable.options.model.set("FullName", doctorProfile.fullName);
        form.editable.options.model.set("Email", doctorProfile.email);
        form.editable.options.model.set("Phone", doctorProfile.phone);
    }

    $("#pm-avatar").attr("src", doctorProfile.avatar);
}

/* ── Show notification ───────────────────────────── */
function showProfileNotif(msg, type) {
    var n = $("#pm-notif").data("kendoNotification");
    if (n) n.show(msg, type);
}

/* ── Open trigger ────────────────────────────────── */
function initProfileTrigger() {
    $(document).on("click", "#profile-trigger", function () {
        var win = $("#profile-window").data("kendoWindow");
        if (win) {
            win.center().open();
        }
    });
}

/* ═══════════════════════════════════════════════════════
   NOTIFICATIONS DROPDOWN
═══════════════════════════════════════════════════════ */

var notificationsData = (function () {
    var p = sharedPatients;
    var n0 = p[0] || { name: "Unknown", id: null };
    var n1 = p[1] || n0;
    var n2 = p[2] || n0;
    var n3 = p.length > 4 ? p[4] : n0;
    var n4 = p.length > 3 ? p[3] : n0;
    return [
        { id: 1, read: false,  severity: "critical", icon: "\uD83D\uDD34", title: "Critical Lab Alert",     desc: "CRP elevated \u2013 " + n1.name,                          time: "2 min ago",  action: "View Patient",   patientId: n1.id },
        { id: 2, read: false,  severity: "warning",  icon: "\uD83D\uDFE0", title: "Vitals Warning",          desc: "Blood pressure abnormal \u2013 " + n2.name,               time: "8 min ago",  action: "View Patient",   patientId: n2.id },
        { id: 3, read: false,  severity: "critical", icon: "\uD83D\uDD34", title: "ICU Monitoring Alert",    desc: "Oxygen saturation low \u2013 " + n0.name,                 time: "15 min ago", action: "View Patient",   patientId: n0.id },
        { id: 4, read: false,  severity: "info",     icon: "\uD83D\uDD35", title: "New Lab Results",         desc: "CBC results posted \u2013 " + n1.name,                    time: "22 min ago", action: "View Results",   patientId: n1.id },
        { id: 5, read: true,   severity: "info",     icon: "\uD83D\uDFE1", title: "Appointment Update",      desc: "Appointment rescheduled \u2013 " + n4.name + " now at 09:30", time: "1 hr ago",  action: "View Schedule", patientId: null },
        { id: 6, read: true,   severity: "info",     icon: "\uD83D\uDCAC", title: "New Message",             desc: "Nurse Amanda Reed sent an update for " + n3.name,         time: "1 hr ago",   action: "View Message",   patientId: n3.id },
        { id: 7, read: true,   severity: "system",   icon: "\u2705",       title: "System Info",             desc: "Daily schedule synced successfully",                       time: "2 hr ago",   action: null,             patientId: null }
    ];
})();

function getUnreadCount() {
    return notificationsData.filter(function (n) { return !n.read; }).length;
}

function initNotifDropdown() {
    updateBadge();
}

function updateBadge() {
    var count = getUnreadCount();
    var badge = $("#notif-badge").data("kendoBadge");
    if (badge) {
        badge.text(count > 0 ? String(count) : "");
        badge.themeColor(count > 0 ? "error" : "info");
        if (count === 0) {
            badge.hide();
        } else {
            badge.show();
        }
    }
}

function renderNotifPanel(callback) {
    var unread = getUnreadCount();
    var payload = {
        items: notificationsData,
        unreadCount: unread
    };
    $.ajax({
        url:         "/Home/NotificationsPartial",
        type:        "POST",
        contentType: "application/json",
        data:        JSON.stringify(payload),
        success: function (html) {
            $("#np-dropdown").html(html);
            if (callback) callback();
        }
    });
}

function onNotifPopoverShow(e) {
    renderNotifPanel(function () {
        var $panel = $("#np-dropdown");

        /* Remove old delegated handlers to avoid duplicates */
        $panel.off("click.np");

        /* Mark all read — do NOT close the popover */
        $panel.on("click.np", "#np-mark-all", function (ev) {
            ev.stopPropagation();
            $.each(notificationsData, function (_, n) { n.read = true; });
            renderNotifPanel();
            updateBadge();
        });

        /* Dismiss individual */
        $panel.on("click.np", ".np-dismiss", function (ev) {
            ev.stopPropagation();
            var id = parseInt($(this).data("id"), 10);
            notificationsData = notificationsData.filter(function (n) { return n.id !== id; });
            renderNotifPanel();
            updateBadge();
        });

        /* Action link — mark read and navigate */
        $panel.on("click.np", ".np-action", function (ev) {
            ev.preventDefault();
            var id = parseInt($(this).data("id"), 10);
            var patientId = $(this).data("patient");
            $.each(notificationsData, function (_, n) { if (n.id === id) n.read = true; });
            updateBadge();

            var notif = notificationsData.filter(function (n) { return n.id === id; })[0];
            if (notif && notif.severity !== "system") {
                var popover = $("#notif-popover").data("kendoPopover");
                if (popover) popover.hide();
                if (patientId) {
                    window.location.href = navRoutes.Patients;
                } else if (notif.title.indexOf("Schedule") >= 0 || notif.title.indexOf("Appointment") >= 0) {
                    window.location.href = navRoutes.Schedule;
                }
            }
        });
    });
}

/* ── Document ready ──────────────────────────────── */
$(document).ready(function () {
    initProfileTrigger();
    loadDoctorProfile();
    initNotifDropdown();

    /* Close popover on outside click */
    $(document).on("click", function (ev) {
        var popover = $("#notif-popover").data("kendoPopover");
        if (popover && popover.popup && popover.popup.visible()) {
            if (!$(ev.target).closest(".k-popover, #notif-btn").length) {
                popover.hide();
            }
        }
    });
});
