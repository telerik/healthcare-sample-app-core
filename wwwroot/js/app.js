/* ═══════════════════════════════════════════════
   EVENT HANDLERS for Html Helper–initialized widgets
═══════════════════════════════════════════════ */
function onNewNoteClick() {
    $("#dialog-new-note").data("kendoDialog").open();
}
function onLabTestClick() {
    $("#dialog-lab-test").data("kendoDialog").open();
}
function onNurseChatClick() {
    $("#dialog-nurse-chat").data("kendoDialog").open();
}
function onAppointmentsRequestEnd(e) {
    var grid = e.sender || this;
    var data = grid.dataSource.data();
    appointmentsData = data.toJSON ? data.toJSON() : Array.from(data);
    window._homeAppointmentsData = appointmentsData;
    initKendoStatusBadges(grid.element);
    $("#page-content").removeClass("page-loading").addClass("page-ready");
    if (_onAppointmentsLoaded) { _onAppointmentsLoaded(); }
}

function onViewScheduleClick() {
    window.location.href = navRoutes.Schedule;
}

function onReasonDetailsClick() {
    $("#dialog-reason-visit").data("kendoDialog").open();
}

function onReasonVisitOpen() {
    var dlg = $("#dialog-reason-visit").data("kendoDialog");
    if (dlg) applySharedDialogShell(dlg);
}

function onAllergyDetailsClick() {
    $("#dialog-allergy-details").data("kendoDialog").open();
}

var _initAiChatIfNeeded = function () {};
var _homeAiChatSendMessage = function () {};
function isAiMarkupMessage(text) {
    return typeof text === "string" && text.indexOf('<div class="ai-msg-content') === 0;
}

var _homeAiChatMessageTemplate = function (message) {
    var text = (message && message.text) || "";
    if (isAiMarkupMessage(text)) {
        return text;
    }

    var encodedText = kendo.htmlEncode(text).replace(/\n/g, "<br>");
    return '<div class="ai-msg-content">' + encodedText + '</div>';
};

var _homeSkipSuggestionSend = false;

function onHomeAiChatSendMessage(e) {
    if (_homeSkipSuggestionSend) {
        _homeSkipSuggestionSend = false;
        e.preventDefault();
        return;
    }
    _homeAiChatSendMessage(e);
    e.sender.scrollToBottom();
}

function renderHomeAiChatMessage(message) {
    return _homeAiChatMessageTemplate(message);
}

function onAiFloatBtnClick() {
    var dlg = $("#dialog-ai-assistant").data("kendoDialog");
    if (!dlg) return;
    if (dlg.wrapper && dlg.wrapper.is(":visible")) {
        dlg.close();
    } else {
        dlg.open();
    }
}

/* ═══════════════════════════════════════════════
   SHARED DATA — promoted to global scope so Dialog
   Html Helper event/action handlers can reference them
   before $(document).ready() finishes.
═══════════════════════════════════════════════ */
var patientsData        = [];
var alertsData          = [];
var appointmentsData    = [];          // populated by onAppointmentsRequestEnd
var labTests            = typeof sharedLabCatalogue !== 'undefined' ? sharedLabCatalogue : [];
var selectedLabTests    = [];
var _currentAlertIdx    = null;
var _onAppointmentsLoaded = null;      // trampoline set inside $(document).ready()

/* ═══════════════════════════════════════════════
   ALERT LIST RENDERING — client-side from alertsData
═══════════════════════════════════════════════ */
function renderAlertsList() {
    var $list = $("#alerts-list");
    if (!alertsData || !alertsData.length) {
        $list.html('<div class="k-card alert-card"><div class="k-card-body alert-card-body" style="color:#888">No active alerts.</div></div>');
        return;
    }
    var html = "";
    alertsData.forEach(function (a, idx) {
        html += '<div class="k-card alert-card" data-alert-idx="' + idx + '">' +
            '<div class="k-card-body alert-card-body">' +
            '<div class="k-card-title alert-card-title">' + kendo.htmlEncode(a.Title) + '</div>' +
            '<div class="alert-card-meta">' +
            '<span class="alert-card-time">' + kendo.htmlEncode(a.Time) + '</span>' +
            '<span class="alert-review" data-alert-idx="' + idx + '">Review ' +
            kendo.ui.icon({ type: "svg", icon: "chevron-right" }) +
            '</span></div></div></div>';
    });
    $list.html(html);
}

/* ═══════════════════════════════════════════════
   LAB TEST LIST — ListView + Card + CheckBox
═══════════════════════════════════════════════ */
function labTestItemTemplate(data) {
    var checked = selectedLabTests.indexOf(data.name) !== -1;
    return '<div class="k-card k-card-horizontal lab-test-item' + (checked ? ' selected' : '') + '" data-test="' + kendo.htmlEncode(data.name) + '">' +
               '<input type="checkbox" class="lab-test-checkbox"' + (checked ? ' checked="checked"' : '') + ' />' +
               '<span class="lab-test-name">' + kendo.htmlEncode(data.name) + '</span>' +
           '</div>';
}

function onLabTestListDataBound(e) {
    var listView = e.sender;
    listView.element.find(".lab-test-checkbox").each(function () {
        if (!$(this).data("kendoCheckBox")) {
            $(this).kendoCheckBox({ rounded: "full" });
        }
    });
}

function onLabTestSearchChange(e) {
    var q = (e.sender.value() || "").toLowerCase().trim();
    filterLabListView(q);
}

function filterLabListView(filter) {
    var q = (filter || "").toLowerCase().trim();
    var listView = $("#lab-test-list").data("kendoListView");
    if (!listView) return;
    var filteredData = labTests.filter(function (t) {
        return !q || t.toLowerCase().indexOf(q) !== -1;
    }).map(function (t) { return { name: t }; });
    listView.setDataSource(new kendo.data.DataSource({ data: filteredData }));
}

function renderLabList(filter) {
    filterLabListView(filter);
}

/* ═══════════════════════════════════════════════
   DIALOG EVENT / ACTION HANDLERS
   Must be global so Html Helper init can resolve them.
═══════════════════════════════════════════════ */
function onAlertReviewResolve() {
    if (_currentAlertIdx !== null) {
        alertsData.splice(_currentAlertIdx, 1);
        _currentAlertIdx = null;
        renderAlertsList();
    }
    return true;
}

function onAllergyDetailsOpen() {
    var dlg = $("#dialog-allergy-details").data("kendoDialog");
    if (dlg) applySharedDialogShell(dlg);
}

function onNewNoteDiscard() {
    var ta = $("#note-textarea").data("kendoTextArea");
    if (ta) ta.value("");
    var ddl = $("#note-patient-ddl").data("kendoDropDownList");
    if (ddl) ddl.select(0);
    return true;
}

function onNewNoteSave() {
    var ddl  = $("#note-patient-ddl").data("kendoDropDownList");
    var ta = $("#note-textarea").data("kendoTextArea");
    var text = (ta ? ta.value() : "").trim();
    if (!ddl || !ddl.value()) {
        kendo.alert("Please select a patient.");
        return false;
    }
    if (!text) {
        kendo.alert("Please enter a clinical note.");
        return false;
    }
    var patientId = ddl.value();
    var patientName = ddl.text();
    $.ajax({
        url:         "./api/patients/" + encodeURIComponent(patientId) + "/add-note",
        type:        "POST",
        contentType: "application/json",
        data:        JSON.stringify({ text: text }),
        error: function () {
            kendo.alert("Could not save the note. Please try again.");
        }
    });
    kendo.alert("Clinical note for <strong>" + kendo.htmlEncode(patientName) + "</strong> has been saved.");
    if (ta) ta.value("");
    return true;
}

function onNewNoteOpen() {
    var dlg = $("#dialog-new-note").data("kendoDialog");
    if (dlg) applySharedDialogShell(dlg);
    if (dlg) dlg.center();
    var ddl = $("#note-patient-ddl").data("kendoDropDownList");
    if (ddl && patientsData.length && ddl.dataSource.total() === 0) {
        ddl.setDataSource(new kendo.data.DataSource({
            data: patientsData.map(function (p) { return { text: p.Name + " (" + p.Id + ")", value: p.Id }; })
        }));
    }
    setTimeout(function () {
        var ta = $("#note-textarea").data("kendoTextArea");
        if (ta) ta.focus();
    }, 100);
}

function onLabTestDiscard() {
    selectedLabTests = [];
    var tb = $("#lab-test-search").data("kendoTextBox");
    if (tb) tb.value("");
    var ddl = $("#lab-patient-ddl").data("kendoDropDownList");
    if (ddl) ddl.select(0);
    return true;
}

function onLabTestSend() {
    var ddl = $("#lab-patient-ddl").data("kendoDropDownList");
    if (!ddl || !ddl.value()) {
        kendo.alert("Please select a patient.");
        return false;
    }
    if (selectedLabTests.length === 0) {
        kendo.alert("Please select at least one lab test.");
        return false;
    }
    var patientName = ddl.text();
    var tests = selectedLabTests.join(", ");
    kendo.alert("Lab test request for <strong>" + kendo.htmlEncode(patientName) + "</strong> has been sent.<br><br>Tests: " + kendo.htmlEncode(tests));
    selectedLabTests = [];
    var tb2 = $("#lab-test-search").data("kendoTextBox");
    if (tb2) tb2.value("");
    return true;
}

function onLabTestOpen() {
    var dlg = $("#dialog-lab-test").data("kendoDialog");
    if (dlg) applySharedDialogShell(dlg);
    if (dlg) dlg.center();
    var ddl = $("#lab-patient-ddl").data("kendoDropDownList");
    if (ddl && patientsData.length && ddl.dataSource.total() === 0) {
        ddl.setDataSource(new kendo.data.DataSource({
            data: patientsData.map(function (p) { return { text: p.Name + " (" + p.Id + ")", value: p.Id }; })
        }));
    }
    var tb = $("#lab-test-search").data("kendoTextBox");
    if (tb) {
        tb.value("");
        // Bind jQuery input event on the actual <input> for real-time filtering
        tb.element.off("input.labfilter").on("input.labfilter", function () {
            var q = $(this).val() || "";
            filterLabListView(q);
        });
        // Fix: clear button should also reset the list
        tb.wrapper.off("click.labclear", ".k-clear-value").on("click.labclear", ".k-clear-value", function () {
            setTimeout(function () {
                filterLabListView("");
            }, 0);
        });
    }
    renderLabList("");
}

function onNurseChatDiscard() {
    var cb = $("#nurse-msg-to").data("kendoComboBox");
    if (cb) cb.value("");
    var subj = $("#nurse-msg-subject").data("kendoTextBox");
    if (subj) subj.value("");
    var body = $("#nurse-msg-body").data("kendoTextArea");
    if (body) body.value("");
    return true;
}

function onNurseChatSend() {
    var cb      = $("#nurse-msg-to").data("kendoComboBox");
    var to      = cb ? cb.value().trim() : $("#nurse-msg-to").val().trim();
    var subjWidget = $("#nurse-msg-subject").data("kendoTextBox");
    var bodyWidget = $("#nurse-msg-body").data("kendoTextArea");
    var subject = (subjWidget ? subjWidget.value() : "").trim();
    var body    = (bodyWidget ? bodyWidget.value() : "").trim();
    if (!to) { kendo.alert("Please specify a recipient."); return false; }
    if (!subject) { kendo.alert("Please enter a subject."); return false; }
    if (!body) { kendo.alert("Please enter a message."); return false; }
    kendo.alert("Message to <strong>" + kendo.htmlEncode(to) + "</strong> has been sent.<br><br>Subject: " + kendo.htmlEncode(subject));
    return true;
}

function onNurseChatOpen() {
    var dlg = $("#dialog-nurse-chat").data("kendoDialog");
    if (dlg) applySharedDialogShell(dlg);
    if (dlg) dlg.center();
}

function onAiAssistantDialogOpen() {
    var self = this;
    self.wrapper.addClass("ai-dialog-wrapper");
    if (window.innerWidth < 900) {
        self.wrapper.addClass("chat-fullscreen");
    } else {
        self.wrapper.removeClass("chat-fullscreen");
    }
    if (!self._resizableApplied) {
        self.options.resizable = true;
        self._resizableApplied = true;
    }
    // Defer until after the dialog open animation so the chat container has a rendered height
    setTimeout(function () {
        kendo.resize($("#ai-chat"));
        _initAiChatIfNeeded();
        var chat = $("#ai-chat").data("kendoChat");
        if (chat) { chat.scrollToBottom(); }
    }, 300);
}

$(document).ready(function () {

    /* ═══════════════════════════════════════════════
       GREETING DATE
    ═══════════════════════════════════════════════ */
    $("#today-date").text(kendo.toString(new Date(), "dddd, MMMM dd, yyyy"));
    if ($(".open-link").length) { kendo.ui.icon($(".open-link"), { icon: 'hyperlink-open-sm' }); }
    if ($(".appt-time-icon").length) { kendo.ui.icon($(".appt-time-icon"), { icon: 'clock' }); }
    if ($(".ai-chat-header-close").length) { kendo.ui.icon($(".ai-chat-header-close"), { icon: 'x' }); }
    if ($(".sparkles").length) { kendo.ui.icon($(".sparkles"), { icon: 'sparkles' }); }
    $("#link-reason-details .detail-link-icon").html(kendo.ui.icon({ type: "svg", icon: "chevron-right" }));
    $("#link-allergy-details .detail-link-icon").html(kendo.ui.icon({ type: "svg", icon: "chevron-right" }));


    /* Notification badge is managed by profile.js initNotifDropdown() */

    /* ═══════════════════════════════════════════════
       DAILY ALERTS + PATIENTS — loaded together
    ═════════════════════════════════════════════ */
    $.when(
        $.getJSON("./api/alerts"),
        ensurePatientSearchData()
    ).done(function (alertsResp, patients) {
        alertsData   = alertsResp[0];
        patientsData = Array.isArray(patients[0]) ? patients[0] : (Array.isArray(patients) ? patients : []);
        renderAlertsList();
        _initAiPanel();  // retry now that patientsData is available
    });

    /* ═══════════════════════════════════════════════
       ALERT REVIEW — loaded from server partial
    ═══════════════════════════════════════════════ */
    $(document).off(".homeApp");
    $(document).on("click.homeApp", ".alert-review", function () {
        var idx = parseInt($(this).data("alert-idx"), 10);
        _currentAlertIdx = idx;

        $.get(appBasePath + "Home/AlertReviewPartial", { alertIndex: idx }, function (html) {
            var dlg = $("#dialog-alert-review").data("kendoDialog");
            if (dlg) applySharedDialogShell(dlg);
            dlg.content(html);
            dlg.open();
        });
    });

    $(document).on("click.homeApp", ".ar-profile-link", function (e) {
        e.preventDefault();
        var patientId = $(this).data("patient-id");
        if (patientId) {
            sessionStorage.setItem("openPatientId", patientId);
            window.location.href = navRoutes.Patients;
        }
    });

    /* ═══════════════════════════════════════════════
       DIALOG — REASON FOR VISIT (initialized via Html Helper)
       Button click events wired via Html Helper .Events()
    ═══════════════════════════════════════════════ */

    $(document).on("click.homeApp", "#lab-test-list .lab-test-item", function (e) {
        var $item = $(this);
        var t = $item.data("test");
        var idx = selectedLabTests.indexOf(t);
        if (idx === -1) {
            selectedLabTests.push(t);
        } else {
            selectedLabTests.splice(idx, 1);
        }
        // Toggle visual state in-place without re-rendering
        var isNowSelected = selectedLabTests.indexOf(t) !== -1;
        $item.toggleClass("selected", isNowSelected);
        var cb = $item.find(".lab-test-checkbox");
        cb.prop("checked", isNowSelected);
        // Sync Kendo CheckBox visual state
        var kendoCb = cb.data("kendoCheckBox");
        if (kendoCb) { kendoCb.check(isNowSelected); }
    });



    /* ═══════════════════════════════════════════════
       NEXT PATIENT — ACTION BUTTONS
    ═══════════════════════════════════════════════ */
    $(document).on("click.homeApp", ".view-profile-link", function (e) {
        e.preventDefault();
        var pid = $(this).data("patient-id") || (_nextPt && _nextPt.Id);
        if (pid) sessionStorage.setItem("openPatientId", pid);
        window.location.href = navRoutes.Patients;
    });

    /* ═══════════════════════════════════════════════
       AI ASSISTANT — DIALOG + FLOATING BUTTON
    ═══════════════════════════════════════════════ */
    var _aiInitialised  = false;
    var _aiChatReady    = false;
    var _aiResponses    = {};
    var _nextPt         = null;
    var _fab            = null;
    var _aiAssistant    = {
        id: "ai-assistant",
        name: "AI Assistant"
    };

    /* Wire the trampoline so onAppointmentsRequestEnd can call _initAiPanel */
    _onAppointmentsLoaded = function () { _initAiPanel(); };

    function _initAiPanel() {
        if (_aiInitialised || !patientsData.length || !appointmentsData.length) return;
        _aiInitialised = true;
        if (!_fab) { _fab = $("#ai-float-btn").data("kendoFloatingActionButton"); }
        if (_fab) { $("#ai-float-btn").show(); }
        if ($(".sparkles").length) { kendo.ui.icon($(".sparkles"), { icon: 'sparkles' }); }

        _nextPt = patientsData.find(function (p) { return p.Id === "P-1001"; }) ||
                  (patientsData.length > 1 ? patientsData[1] : patientsData[0]);
        var _allergyPts = patientsData.filter(function (p) { return p.Allergies && p.Allergies.length > 0; });
        var _allergyText = _allergyPts.length > 0
            ? "Yes. " + _allergyPts.slice(0, 2).map(function (p) { return p.Name + " (" + p.Allergies.join(", ") + ")"; }).join(" and ") + " have documented allergies. Please review before prescribing."
            : "No patients with documented allergies are on today\u2019s schedule.";

        _aiResponses = {
            "Provide lab results for next patient":
                _nextPt.Name + "'s latest labs: " + (_nextPt.Labs.length > 0 ? _nextPt.Labs.map(function (l) { return l.Test + " " + l.Result + " (" + l.Flag + ")"; }).join(", ") : "No lab results on file") + ".",
            "Summary for next patient":
                _nextPt.Name + ", " + _nextPt.Age + "-year-old " + _nextPt.Gender.toLowerCase() + ". Ward: " + _nextPt.Ward + ". Diagnosis: " + _nextPt.Diagnosis + ". Status: " + _nextPt.Status + ". " + (_nextPt.Allergies.length > 0 ? "Known allergies: " + _nextPt.Allergies.join(", ") + "." : "No known allergies."),
            "How many patients do I have today?":
                "You have " + appointmentsData.length + " appointments scheduled today.",
            "Are there any allergic patients today?":
                _allergyText
        };
    }

    function _replyToAiMsg(text) {
        var chat = $("#ai-chat").data("kendoChat");
        if (!chat) return;

        chat.loading(true);

        if (text === "Summary for next patient" && _nextPt) {
            setTimeout(function () {
                chat.loading(false);
                chat.postMessage({
                    authorId:   _aiAssistant.id,
                    authorName: _aiAssistant.name,
                    text:       "@@PATIENT_SUMMARY@@",
                    timestamp:  new Date()
                });
            }, 500);
            return;
        }

        var reply = _aiResponses[text] ||
            '<div class="ai-msg-content ai-demo-disclaimer">' +
            '<p>\u24D8 <strong>This is a demo assistant.</strong></p>' +
            '<p>Free-text queries are not supported in this preview. In your production app, connect a <strong>real AI service</strong> (e.g. OpenAI, Azure OpenAI, or your own clinical LLM) to handle any message.</p>' +
            '<p><strong>In this demo, you can use the suggestion chips</strong> to see pre-built responses.</p>' +
            '</div>';
        setTimeout(function () {
            chat.loading(false);
            chat.postMessage({
                authorId:   _aiAssistant.id,
                authorName: _aiAssistant.name,
                type:       "text",
                text:       reply
            });
        }, 500);
    }

    _initAiChatIfNeeded = function () {
        if (_aiChatReady) return;
        _aiChatReady = true;

        var aiChat = $("#ai-chat").data("kendoChat");
        if (!aiChat) return;

        _homeAiChatSendMessage = function (e) {
            if (!e.generating) {
                _replyToAiMsg(e.message.text);
            }
        };

        _homeAiChatMessageTemplate = function (message) {
            if (message.text === "@@PATIENT_SUMMARY@@" && _nextPt) {
                var pt   = _nextPt;
                var html = '<div class="ai-summary-msg">';
                html += '<p class="ai-pt-intro">Hi there! I will give you important information regarding your next patient:</p>';
                html += '<div class="ai-patient-card">';
                html += '<p><strong>Name:</strong> '   + kendo.htmlEncode(pt.Name)         + '</p>';
                html += '<p><strong>Age:</strong> '    + kendo.htmlEncode(String(pt.Age))   + ' years</p>';
                html += '<p><strong>Gender:</strong> ' + kendo.htmlEncode(pt.Gender)        + '</p>';
                if (pt.Allergies && pt.Allergies.length) {
                    html += '<p><strong>Allergy:</strong> ' + kendo.htmlEncode(pt.Allergies.join(", ")) + '</p>';
                }
                if (pt.Visits && pt.Visits.length) {
                    html += '<p class="ai-pt-section"><strong>Medical History:</strong></p><ul class="ai-pt-history">';
                    var maxV = Math.min(pt.Visits.length, 3);
                    for (var i = 0; i < maxV; i++) {
                        html += '<li>' + kendo.htmlEncode(pt.Visits[i].Reason) + '</li>';
                    }
                    html += '</ul>';
                }
                if (pt.Medications && pt.Medications.length) {
                    html += '<p class="ai-pt-section"><strong>Current Medications:</strong></p><ul class="ai-pt-history">';
                    var maxM = Math.min(pt.Medications.length, 3);
                    for (var j = 0; j < maxM; j++) {
                        var med = pt.Medications[j];
                        html += '<li>' + kendo.htmlEncode(med.Drug + ' ' + med.Dose + ' ' + med.Frequency) + '</li>';
                    }
                    html += '</ul>';
                }
                html += '</div>';
                html += '<div class="ai-feedback-actions">' +
                    '<button class="ai-feedback-btn" title="Helpful">' +
                        '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"/><path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/></svg>' +
                    '</button>' +
                    '<button class="ai-feedback-btn" title="Not helpful">' +
                        '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z"/><path d="M17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17"/></svg>' +
                    '</button>' +
                    '<button class="ai-feedback-btn" title="Regenerate">' +
                        '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>' +
                    '</button>' +
                '</div>';
                html += '</div>';
                return html;
            }

            if (isAiMarkupMessage(message.text || "")) {
                return message.text;
            }

            var encodedText = kendo.htmlEncode(message.text || "").replace(/\n/g, "<br>");
            return '<div class="ai-msg-content">' + encodedText + '</div>';
        };

        aiChat.postMessage({
            authorId:   _aiAssistant.id,
            authorName: _aiAssistant.name,
            type:       "text",
            timestamp:  new Date(),
            text: "\uD83D\uDC4B Hello! I\u2019m your AI Assistant.\n\nI can help you with your daily clinical tasks, patient information, and quick actions. Try one of the suggestions below!"
        });
        // Defer scroll so the welcome message is fully rendered before scrolling
        setTimeout(function () { aiChat.scrollToBottom(); }, 0);

        $(document).on("click", ".ai-chat-header-close", function () {
            var dlg = $("#dialog-ai-assistant").data("kendoDialog");
            if (dlg) {
                dlg.close();
            }
        });
    };

    // Initialize AI Float Button click — FAB created by Html Helper
    function updateFabOffset() {
        if (!_fab) {
            _fab = $("#ai-float-btn").data("kendoFloatingActionButton");
        }
        if (!_fab) return;
        var isSmall = window.innerWidth < 1440;
        _fab.setOptions({
            positionMode: isSmall ? "fixed" : "absolute",
            alignOffset: isSmall ? { x: 10, y: 10 } : { x: -28, y: 10 }
        });
    }

    setTimeout(updateFabOffset, 0);
    $(window).on("resize", updateFabOffset);
});
