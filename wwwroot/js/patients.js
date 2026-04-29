/* ═══════════════════════════════════════════════
   EVENT HANDLERS for Html Helper–initialized widgets
═══════════════════════════════════════════════ */
/* Reset the once-guard so PJAX re-entry re-checks openPatientId */
window._patientsSearchInit = false;

_patientsExportClickImpl = function() {
    if ($("#patients-detail-view").is(":visible")) {
        var labsGrid = $("#patient-labs-grid").data("kendoGrid");
        if (labsGrid) labsGrid.saveAsExcel();
    } else {
        var g = $("#patients-grid").data("kendoGrid");
        if (g) g.saveAsExcel();
    }
};

/* Save Patient Note — wired by Html Helper .Events(e => e.Click("onSavePatientNote")) */
function onSavePatientNote() {
    if (!notesEditor || !currentPatient) return;
    var noteVal = notesEditor.value();
    currentPatient.Notes = noteVal;
    var $btn = $("#btn-save-patient-note");
    $.ajax({
        url:         "./api/patients/" + currentPatient.Id + "/notes",
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
    if ($(".sparkles").length) { kendo.ui.icon($(".sparkles"), { icon: 'sparkles' }); }    

    if (listAiOpen) {
        closeListAiPanel();
    } else {
        openListAiPanel();
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
    }

    openPendingPatientProfile();

    // Row click handlers
    widget.tbody.find("tr[role='row']").off("click.drill");
    widget.tbody.find(".patient-name-cell").off("click.preview").on("click.preview", function (e) {
        e.stopPropagation();
        var row     = $(this).closest("tr");
        var dataItem = widget.dataItem(row);
        var patient  = getFullPatient(dataItem.Id || dataItem.get("Id"));
        if (patient) { openPatientPreview(patient); }
    });
    initKendoStatusBadges(widget.element);
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
var listAiOpen       = false;
var notesEditor      = null;
var _aiAssistant    = {
        id: "ai-assistant",
        name: "AI Assistant"
};

/* ═══════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════ */
function getFullPatient(id) {
    // patientsData is populated after the first grid read
    var cached = patientsData.find(function (p) { return p.Id === id; });
    return cached || null;
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

function renderListAiChatMessage(message) {
    var text = (message && message.text) || "";
    if (typeof isAiMarkupMessage === "function" && isAiMarkupMessage(text)) {
        return text;
    }

    var encodedText = kendo.htmlEncode(text).replace(/\n/g, "<br>");
    return '<div class="ai-msg-content">' + encodedText + '</div>';
}

function _replyToListAiMsg(text) {
    if (!listAiChat) listAiChat = $("#list-ai-chat").data("kendoChat");
    if (!listAiChat) return;  
    var reply = _listAiResponses[text] ||
        '<div class="ai-msg-content ai-demo-disclaimer">' +
        '<p>\u24D8 <strong>This is a demo assistant.</strong></p>' +
        '<p>Free-text queries are not supported in this preview. In your production app, connect a <strong>real AI service</strong> (e.g. OpenAI, Azure OpenAI, or your own clinical LLM) to handle any message.</p>' +
        '<p><strong>In this demo, you can use the suggestion chips</strong> to see pre-built responses.</p>' +
        '</div>';
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

function _initListAiChatIfNeeded() {
    if (listAiChat) return;
    listAiChat = $("#list-ai-chat").data("kendoChat");
    if (!listAiChat) return;

    // Add close-chat icon
    kendo.ui.icon($("#list-ai-chat .close-chat"), { icon: 'x', size: 'large' });

    listAiChat.postMessage({
            authorId:   _aiAssistant.id,
            authorName: _aiAssistant.name,
            type:       "text",
            timestamp:  new Date(),
            text: "\uD83D\uDC4B Hello! I\u2019m your AI Assistant.\n\nI can help you with your daily clinical tasks, patient information, and quick actions. Try one of the suggestions below!"
        });
    listAiChat.scrollToBottom();

    $("#list-ai-chat").on("click", ".close-chat", function () {
        closeListAiPanel();
    });
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
    $("#btn-ai-assistance").hide();
    window.scrollTo(0, 0);
}

function openPendingPatientProfile() {
    var pendingId = sessionStorage.getItem("openPatientId");
    if (!pendingId) return;

    function tryOpenPendingPatient() {
        var patient = getFullPatient(pendingId) || findPatient(pendingId);
        if (!patient) return false;

        sessionStorage.removeItem("openPatientId");
        openPatientDrilldown(patient);
        return true;
    }

    if (tryOpenPendingPatient()) return;

    ensurePatientSearchData().done(function () {
        tryOpenPendingPatient();
    });
}

function closePatientDrilldown() {
    // Save editor content back to patient object
    if (notesEditor && currentPatient) {
        currentPatient.Notes = notesEditor.value();
    }
    $("#patients-detail-view").hide();
    $("#patients-breadcrumb").hide();
    $("#patients-list-view").show();
    $("#btn-ai-assistance").show();
    // Refresh grid to reflect any status changes
    if (grid) { grid.dataSource.read(); }
}

/* ═══════════════════════════════════════════════════════
   DETAIL VIEW RENDERING — loaded from server partial
═══════════════════════════════════════════════════════ */
function renderPatientDetail(patient) {
    $.get(appBasePath + "Patients/DetailPartial", { patientId: patient.Id }, function (html) {
        var $main = $("#detail-main");
        // Destroy any existing Kendo widgets in previous detail view
        kendo.destroy($main);
        $main.html(html);
        initKendoStatusBadges($main);

        // Load labs grid partial
        $.get(appBasePath + "Patients/LabsPartial", { patientId: patient.Id }, function (labsHtml) {
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
    if (listAiOpen) { closeListAiPanel(); }

    previewPatient = patient;
    $.get(appBasePath + "Patients/PreviewPartial", { patientId: patient.Id }, function (html) {
        $("#patient-preview-panel").html(html).css("display", "flex");
        $("#patients-list-body").addClass("preview-panel-open");
        syncPatientsSidePanelHeights();
    });
}

function closePatientPreview() {
    previewPatient = null;
    $("#patient-preview-panel").css("display", "none").empty();
    $("#patients-list-body").removeClass("preview-panel-open");
    clearPatientsSidePanelHeights();
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
        title:        "Allergy Alert \u2014 Details",
        width:        420,
        modal:        true,
        visible:      false,
        buttonLayout: "normal",
        open:         function () { initAllergyBadges(this.element); },
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
        url:         "./api/patients/" + encodeURIComponent(_statusPatient.Id) + "/status",
        type:        "POST",
        contentType: "application/json",
        data:        JSON.stringify({ status: val }),
        success: function (r) {
            _statusPatient.Status = r.status;
            if (grid) { grid.dataSource.read(); }
        }
    });
}

/* ═══════════════════════════════════════════════════════
   GRID — Initialized by Html Helper
   The grid variable is retrieved from the helper-created widget.
═══════════════════════════════════════════════════════ */
function initGrid() {
    // Grid is created by Html Helper — just get a reference
    grid = $("#patients-grid").data("kendoGrid");
}

/* ═══════════════════════════════════════════════════════
   AI ASSISTANT SIDE-PANEL
═══════════════════════════════════════════════════════ */
function syncListAiPanelHost() {
    var panel = $("#patient-ai-panel");
    if (!panel.length) return;

    if (listAiOpen && window.innerWidth < 900) {
        if (!panel.parent().is("body")) {
            panel.appendTo("body");
        }
        panel.addClass("patient-ai-panel-floating");
        return;
    }

    if (!panel.parent().is("#patients-list-body")) {
        panel.appendTo("#patients-list-body");
    }
    panel.removeClass("patient-ai-panel-floating");
}

function openListAiPanel() {
    closePatientPreview();
    listAiOpen = true;
    _initListAiChatIfNeeded();
    syncListAiPanelHost();
    $("#patient-ai-panel").css("display", "flex");
    $("#patients-list-body").addClass("ai-panel-open");
    $("body").addClass("patients-ai-open");
    updateGridHeightVar();
    deferGridResize();
    if (listAiChat) { listAiChat.scrollToBottom(); }
}

function closeListAiPanel() {
    listAiOpen = false;
    $("#patient-ai-panel").css("display", "none");
    $("#patients-list-body").removeClass("ai-panel-open");
    $("body").removeClass("patients-ai-open");
    syncListAiPanelHost();
    deferGridResize();
}

function syncPatientsSidePanelHeights() {
    updateGridHeightVar();
    deferGridResize();
}

function clearPatientsSidePanelHeights() {
    deferGridResize();
}

/* Reads the grid card height and sets a CSS custom property so
   side panels can size themselves without repeated JS measurement. */
function updateGridHeightVar() {
    var h = $(".patients-grid-card:visible").outerHeight();
    if (h) {
        $("#patients-list-body")[0].style.setProperty("--patients-grid-height", h + "px");
    }
}

/* Defers kendo.resize so it doesn't block the current frame. */
var _resizeTimer = 0;
function deferGridResize() {
    cancelAnimationFrame(_resizeTimer);
    _resizeTimer = requestAnimationFrame(function () {
        if (grid) { kendo.resize($("#patients-grid")); }
    });
}

/* ═══════════════════════════════════════════════════════
   DOCUMENT READY
═══════════════════════════════════════════════════════ */
$(document).ready(function () {


    // Notification badge is managed by profile.js initNotifDropdown()

    // Grid — created by Html Helper, just get reference
    initGrid();

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
    $(window).off("resize.patientsPanels").on("resize.patientsPanels", function () {
        syncListAiPanelHost();
        updateGridHeightVar();
    });

});
