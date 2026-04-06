/* ═══════════════════════════════════════════════
   EVENT HANDLERS for Html Helper–initialized widgets
═══════════════════════════════════════════════ */
_patientsExportClickImpl = function() {
    var g = $("#patients-grid").data("kendoGrid");
    if (g) g.saveAsExcel();
};

/* Save Patient Note — wired by Html Helper .Events(e => e.Click("onSavePatientNote")) */
function onSavePatientNote() {
    if (!notesEditor || !currentPatient) return;
    var noteVal = notesEditor.value();
    currentPatient.Notes = noteVal;
    var $btn = $("#btn-save-patient-note");
    $.ajax({
        url:         "/api/patients/" + currentPatient.Id + "/notes",
        type:        "POST",
        contentType: "application/json",
        data:        JSON.stringify({ notes: noteVal }),
        success: function () {
            $btn.text("\u2713 Saved").addClass("detail-save-btn--saved");
            setTimeout(function () { $btn.text("\uD83D\uDCBE Save").removeClass("detail-save-btn--saved"); }, 1500);
        },
        error: function () {
            alert("Failed to save note. Please try again.");
        }
    });
}

var _aiPanelOpen = false;
_aiAssistanceClickImpl = function() {
    var g = $("#patients-grid").data("kendoGrid");
    if ($(".sparkles").length) { kendo.ui.icon($(".sparkles"), { icon: 'sparkles' }); }

    // If the user is on the patient detail view, navigate back to the grid first
    if ($("#patients-detail-view").is(":visible")) {
        closePatientDrilldown();
        _aiPanelOpen = false;
    }

    _aiPanelOpen = !_aiPanelOpen;
    if (_aiPanelOpen) {
        closePatientPreview();
        initListAiChat();
        $("#list-ai-date").text(kendo.toString(new Date(), "dddd, MMMM dd, yyyy"));
        $("#list-ai-panel").show();
        $("#patients-list-body").addClass("ai-panel-open");
        syncPatientsSidePanelHeights();
        if (g) { kendo.resize($("#patients-grid")); }
    } else {
        $("#list-ai-panel").hide();
        $("#patients-list-body").removeClass("ai-panel-open");
        clearPatientsSidePanelHeights();
        if (g) { kendo.resize($("#patients-grid")); }
    }
};

function onPatientsGridDataBound() {
    var widget = this;

    // Cache data for search, drilldown, and preview
    var rawData = widget.dataSource.data();
    patientsData = rawData.toJSON ? rawData.toJSON() : Array.from(rawData);

    // Handle page-ready state and deep links once
    if (!window._patientsSearchInit && patientsData.length) {
        window._patientsSearchInit = true;

        $("#page-content").removeClass("page-loading").addClass("page-ready");

        var pendingId = sessionStorage.getItem("openPatientId");
        if (pendingId) {
            sessionStorage.removeItem("openPatientId");
            var target = patientsData.find(function (p) { return p.Id === pendingId; });
            if (target) { openPatientDrilldown(target); }
        }
    }

    // Row click handlers
    widget.tbody.find("tr[role='row']").off("dblclick.drill");
    widget.tbody.find(".patient-name-cell").off("dblclick.preview").on("dblclick.preview", function (e) {
        e.stopPropagation();
        var row     = $(this).closest("tr");
        var dataItem = widget.dataItem(row);
        var patient  = getFullPatient(dataItem.Id || dataItem.get("Id"));
        if (patient) { openPatientPreview(patient); }
    });
    initKendoStatusBadges(widget.element);
}

function onPatientsContextMenuSelect(e) {
    var g = $("#patients-grid").data("kendoGrid");
    if (!g) return;
    var row    = $(e.target).closest("tr");
    var item   = g.dataItem(row);
    var patient = item ? getFullPatient(item.Id || item.get("Id")) : null;
    if (!patient) return;
    var action = $(e.item).data("action");
    if (action === "view")   { openPatientDrilldown(patient); }
    if (action === "status") { openChangeStatusDialog(patient); }
}

/* ═══════════════════════════════════════════════════════
   PATIENTS PAGE — DATA loaded remotely from /api
═══════════════════════════════════════════════════════ */
var patientsData = []; // populated after the grid's first read

/* ═══════════════════════════════════════════════════════
   STATE
═══════════════════════════════════════════════════════ */
var grid             = null;
var currentPatient   = null;
var previewPatient   = null;
var listAiChat       = null;
var notesEditor      = null;
var listAiReady      = false;
var _aiAssistant    = {
        id: "ai-assistant",
        name: "AI Assistant"
};
 var _aiUser         = {
        id: "dr-carter",
        name: "Dr. Carter",
        iconUrl: "/content/patient-images/women/thumb/michael-dam-mEZ3PoFGs_k-unsplash.jpg"
    };

/* ═══════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════ */
function getFullPatient(id) {
    // patientsData is populated after the first grid read
    var cached = patientsData.find(function (p) { return p.Id === id; });
    return cached || null;
}

function formatVital(key, val) {
    switch (key) {
        case "bp":     return val;                       // already "148/92 mmHg"
        case "hr":     return val + " bpm";
        case "temp":   return val + "°F";
        case "spo2":   return val + "%";
        case "weight": return val + " lbs";
        default:       return String(val);
    }
}

function formatMed(m) {
    if (typeof m === "string") return m;
    return m.Drug + " " + m.Dose + (m.Frequency !== "PRN" ? " " + m.Frequency : " PRN");
}

function isVitalCritical(field, value) {
    var num = parseFloat(value);
    if (isNaN(num)) return false;
    switch (field) {
        case "bp":   return parseInt(value, 10) > 140;
        case "hr":   return num > 100 || num < 60;
        case "temp": return num > 99.5;
        case "spo2": return num < 94;
        default:     return false;
    }
}

function flagClass(flag) {
    var map = { "High": "flag-high", "Low": "flag-low", "Abnormal": "flag-abnormal", "Normal": "flag-normal" };
    return map[flag] || "flag-normal";
}

function buildSnippet(key, p) {
    var lastReason = p.Visits.length ? p.Visits[0].Reason : "N/A";
    var allergiesStr = p.Allergies.length ? p.Allergies.join(", ") : "none known";
    var medsStr = p.Medications.map(formatMed).join(", ");
    switch (key) {
        case "summarize":
            return "Patient shows a pattern of " + p.Diagnosis + " managed with " + medsStr +
                   ". History of " + p.LastVisit + " visit regarding " + lastReason + ".";
        case "flag":
            return "\u26a0 FLAGGED FOR REVIEW: Abnormal lab results require immediate attention.";
        case "followup":
            return "Recommend follow-up in 2 weeks. Monitor " + p.Diagnosis +
                   " progression and adjust medications as needed.";
        case "risk":
            return "Risk factors identified: " + allergiesStr +
                   ", complex medication regimen. Caution advised.";
        default:
            return "";
    }
}


var _listAiResponses = {
    "What are common patient risk factors?":
        "Common risk factors across patients include hypertension, diabetes, obesity, smoking, and sedentary lifestyle. Patients with complex medication regimens or known allergies require additional monitoring.",
    "What follow-up protocols should I apply?":
        "Standard follow-up protocols: schedule a review within 2\u20134 weeks post-discharge, confirm medication adherence, repeat any abnormal lab tests within 30 days, and coordinate with specialists where a referral was made.",
    "How do I interpret abnormal lab results?":
        "Abnormal results should be compared against the patient\u2019s historical baseline and clinical context. Elevated CRP or WBC may indicate infection or inflammation. Out-of-range electrolytes (sodium, potassium) carry cardiac risk. Always cross-reference with current medications before acting.",
    "What are today's critical care priorities?":
        "Critical priorities include: monitoring patients with oxygen saturation below 92%, reviewing all flagged lab results before the next round, confirming allergy documentation for any new prescriptions, and ensuring high-risk patients have an updated care plan."
};

function _replyToListAiMsg(text) {
    if (!listAiChat) listAiChat = $("#list-ai-chat").data("kendoChat");
    if (!listAiChat) return;  
    var reply = _listAiResponses[text] || "I\u2019m sorry, I don\u2019t have information on that right now.";
    setTimeout(function () {
        listAiChat.postMessage({
            authorId:   _aiAssistant.id,
            authorName: _aiAssistant.name,
            type:       "text",
            text:       reply
        });
        listAiChat.scrollToBottom();
    }, 1000);
}

function onListAiChatSendMessage(e) {    
    if (!e.generating) {
        _replyToListAiMsg(e.message.text);
    }
    // Scroll to show the user's sent message; bot reply scrolls inside _replyToListAiMsg
    setTimeout(function () { if (listAiChat) listAiChat.scrollToBottom(); }, 0);
}

function initListAiChat() {
    if (listAiReady) return;
    listAiReady = true;
    listAiChat = $("#list-ai-chat").data("kendoChat");
    if (!listAiChat) return;

    listAiChat.postMessage({
            authorId:   _aiAssistant.id,
            authorName: _aiAssistant.name,
            type:       "text",
            timestamp:  new Date(),
            text: "\uD83D\uDC4B Hello! I\u2019m your AI Assistant.\n\nI can help you with your daily clinical tasks, patient information, and quick actions. Try one of the suggestions below!"
        });
    listAiChat.scrollToBottom();
}

/* ═══════════════════════════════════════════════════════
   FILTER HELPERS
═══════════════════════════════════════════════════════ */
function applyFilters(searchVal) {
    if (!grid) return;
    var val = (searchVal !== undefined) ? searchVal : "";
    if (!val) {
        grid.dataSource.filter({});
        return;
    }
    grid.dataSource.filter({
        logic: "or",
        filters: [
            { field: "Name",      operator: "contains", value: val },
            { field: "Id",        operator: "contains", value: val },
            { field: "Diagnosis", operator: "contains", value: val }
        ]
    });
}

/* ═══════════════════════════════════════════════════════
   DRILLDOWN OPEN / CLOSE
═══════════════════════════════════════════════════════ */
function openPatientDrilldown(patient) {
    currentPatient = patient;
    renderPatientDetail(patient);
    $("#patients-list-view").hide();
    $("#patients-breadcrumb").show();
    $("#patients-detail-view").show();
    window.scrollTo(0, 0);
}

function closePatientDrilldown() {
    // Save editor content back to patient object
    if (notesEditor && currentPatient) {
        currentPatient.Notes = notesEditor.value();
    }
    $("#patients-detail-view").hide();
    $("#patients-breadcrumb").hide();
    $("#patients-list-view").show();
    // Refresh grid to reflect any status changes
    if (grid) { grid.dataSource.read(); }
}

/* ═══════════════════════════════════════════════════════
   DETAIL VIEW RENDERING — loaded from server partial
═══════════════════════════════════════════════════════ */
function renderPatientDetail(patient) {
    $.get("/Patients/DetailPartial", { patientId: patient.Id }, function (html) {
        var $main = $("#detail-main");
        // Destroy any existing Kendo widgets in previous detail view
        kendo.destroy($main);
        $main.html(html);
        initKendoStatusBadges($main);

        // Load labs grid partial
        $.get("/Patients/LabsPartial", { patientId: patient.Id }, function (labsHtml) {
            var $container = $("#patient-labs-grid-container");
            kendo.destroy($container);
            $container.html(labsHtml);
        });

        // Editor is created by Html Helper in the partial — get reference after script eval
        setTimeout(function () {
            notesEditor = $("#patient-notes-editor").data("kendoEditor");
        }, 0);
    });
}

/* ═══════════════════════════════════════════════════════
   PATIENT LABS GRID — DataBound handler for Html Helper grid
═══════════════════════════════════════════════════════ */
function onPatientLabsGridDataBound() {
    initKendoStatusBadges(this.element);
}

/* ═══════════════════════════════════════════════════════
   PATIENT PREVIEW PANEL — loaded from server partial
═══════════════════════════════════════════════════════ */
function openPatientPreview(patient) {
    // Close AI panel if open — preview and AI assistant are mutually exclusive
    if (_aiPanelOpen) {
        _aiPanelOpen = false;
        $("#list-ai-panel").hide();
        $("#patients-list-body").removeClass("ai-panel-open");
    }

    previewPatient = patient;
    $.get("/Patients/PreviewPartial", { patientId: patient.Id }, function (html) {
        $("#patient-preview-panel").html(html).css("display", "flex");
        $("#patients-list-body").addClass("preview-panel-open");
        syncPatientsSidePanelHeights();
        if (grid) { kendo.resize($("#patients-grid")); }
    });
}

function closePatientPreview() {
    previewPatient = null;
    $("#patient-preview-panel").css("display", "none").empty();
    $("#patients-list-body").removeClass("preview-panel-open");
    clearPatientsSidePanelHeights();
    if (grid) { kendo.resize($("#patients-grid")); }
}

function openAllergyDetailsDialog(patient) {
    var chipsHtml = (patient.Allergies || []).map(function (a) {
        return '<span class="k-badge-allergy" data-label="' + kendo.htmlEncode(a) + '"></span>';
    }).join("");

    var dlgId = "pp-allergy-dialog";
    if ($("#" + dlgId).length === 0) {
        $("body").append('<div id="' + dlgId + '"></div>');
    }
    var $dlg = $("#" + dlgId);
    var existing = $dlg.data("kendoDialog");
    if (existing) { existing.destroy(); }

    $dlg.kendoDialog({
        title:   "Allergy Alert \u2014 Details",
        width:   420,
        modal:   true,
        visible: false,
        open:    function () { initAllergyBadges(this.element); },
        content: '<div class="info-dialog">' +
                 '  <div class="info-dialog-section">' +
                 '    <div class="info-dialog-row"><span class="info-dialog-label">Patient</span><span>' + kendo.htmlEncode(patient.Name) + '</span></div>' +
                 '    <div class="info-dialog-row"><span class="info-dialog-label">Blood Type</span><span>' + kendo.htmlEncode(patient.BloodType || '\u2014') + '</span></div>' +
                 '  </div>' +
                 '  <div class="info-dialog-section">' +
                 '    <div class="info-dialog-section-title">Known Allergens</div>' +
                 chipsHtml +
                 '    <div class="info-dialog-note">Please review before prescribing any medication.</div>' +
                 '  </div>' +
                 '</div>',
        actions: [{ text: "Close" }]
    });
    $dlg.data("kendoDialog").open();
}

/* ═══════════════════════════════════════════════════════
   CHANGE STATUS DIALOG (initialized via Html Helper)
═══════════════════════════════════════════════════════ */
var _statusPatient = null;

function onChangeStatusSave() {
    if (!_statusPatient) return true;
    var ddl = $("#new-status-ddl").data("kendoDropDownList");
    if (!ddl) return false;
    var val = ddl.value();
    $.ajax({
        url:         "/api/patients/" + encodeURIComponent(_statusPatient.Id) + "/status",
        type:        "POST",
        contentType: "application/json",
        data:        JSON.stringify({ status: val }),
        success: function (r) {
            _statusPatient.Status = r.status;
            if (grid) { grid.dataSource.read(); }
        }
    });
}

function onChangeStatusOpen() {
    /* DropDownList is now created by the HTML Helper in _ChangeStatusContent partial */
}

function openChangeStatusDialog(patient) {
    _statusPatient = patient;

    var dlg = $("#change-status-dialog").data("kendoDialog");
    dlg.title("Change Status \u2014 " + kendo.htmlEncode(patient.Name));

    // Destroy any existing DDL from a previous open to avoid re-init errors
    var oldDdl = $("#new-status-ddl").data("kendoDropDownList");
    if (oldDdl) { oldDdl.destroy(); }

    $.get("/Patients/ChangeStatusPartial", { patientId: patient.Id }, function (html) {
        dlg.content(html);
        dlg.open();
    });
}

/* ═══════════════════════════════════════════════════════
   GRID AND CONTEXT MENU — Initialized by Html Helpers
   The grid variable is retrieved from the helper-created widget.
═══════════════════════════════════════════════════════ */
function initGrid() {
    // Grid is created by Html Helper — just get a reference
    grid = $("#patients-grid").data("kendoGrid");
}

function initContextMenu() {
    // Context menu is created by Html Helper — no JS init needed
}

function syncPatientsSidePanelHeights() {
    window.requestAnimationFrame(function () {
        var gridHeight = $(".patients-grid-card:visible").outerHeight();
        if (!gridHeight) return;
        $("#list-ai-panel:visible, #patient-preview-panel:visible").css("height", gridHeight + "px");
    });
}

function clearPatientsSidePanelHeights() {
    $("#list-ai-panel, #patient-preview-panel").css("height", "");
}

/* ═══════════════════════════════════════════════════════
   DOCUMENT READY
═══════════════════════════════════════════════════════ */
$(document).ready(function () {


    // Notification badge is managed by profile.js initNotifDropdown()

    // Grid + context menu — created by Html Helpers, just get reference
    initGrid();
    initContextMenu();

    kendo.ui.icon($(".status"), { icon: 'plan' });
    kendo.ui.icon($(".pencil"), { icon: 'pencil' });

    // Breadcrumb back navigation
    $(document).on("click", "#breadcrumb-back", function () {
        closePatientDrilldown();
    });

    // Export — handled by Html Helper button event

    // AI Assistance toggle — handled by Html Helper button event

    // Close patient preview panel
    $(document).on("click", "#btn-close-preview", function () {
        closePatientPreview();
    });

    // Allergy details link in patient preview panel
    $(document).on("click", ".pp-details-link", function (e) {
        e.preventDefault();
        if (!previewPatient) return;
        openAllergyDetailsDialog(previewPatient);
    });

    // View Profile link in grid (delegated)
    $(document).on("click", ".btn-view-patient", function (e) {
        e.stopPropagation();
        var id      = $(this).data("id");
        var patient = getFullPatient(id);
        if (patient) { openPatientDrilldown(patient); }
    });

    // AI note chips — notes editor (delegated)
    //$(document).on("click", ".ai-note-chip", function () {
    //    if (!notesEditor || !currentPatient) return;
    //    var key     = $(this).data("snippet-key");
    //    var snippet = buildSnippet(key, currentPatient);
    //    var current = notesEditor.value();
    //    notesEditor.value(current + (current.length ? "<br/>" : "") + snippet);
    //});

    // AppBar search → filter grid via Kendo AutoComplete events
    var ac = $("#appbar-search").data("kendoAutoComplete");
    if (ac) {
        if (window._patientsSearchHandler) {
            ac.unbind("filtering", window._patientsSearchHandler);
            ac.unbind("change", window._patientsSearchHandler);
        }
        window._patientsSearchHandler = function () {
            if ($("#patients-list-view").is(":visible")) {
                applyFilters(ac.value().trim());
            }
        };
        ac.bind("filtering", window._patientsSearchHandler);
        ac.bind("change", window._patientsSearchHandler);
    }

    // Hash-based deep link: patients.html#P-1003 opens that patient directly
    function handleLocationHash() {
        var hash = window.location.hash.replace("#", "").trim();
        if (!hash) return;
        var patient = getFullPatient(hash) || findPatient(hash);
        if (patient) {
            window.location.hash = "";
            openPatientDrilldown(patient);
        }
    }

    handleLocationHash();
    $(window).off("hashchange.patients").on("hashchange.patients", handleLocationHash);
    $(window).off("resize.patientsPanels").on("resize.patientsPanels", syncPatientsSidePanelHeights);

});
