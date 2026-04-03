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
    window.location.href = "/schedule";
}

var _initAiChatIfNeeded = function () {};
var _homeAiChatSendMessage = function () {};
var _homeAiChatMessageTemplate = function (message) {
    var encodedText = kendo.htmlEncode((message && message.text) || "").replace(/\n/g, "<br>");
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

function onHomeAiChatSuggestionClick(e) {
    //e.preventDefault();
    //_homeSkipSuggestionSend = true;
    //var chat = e.sender;
    //var input = chat.element.find(".k-input-inner")[0];
    //if (input) {
    //    input.value = e.text;
    //    input.dispatchEvent(new Event("input", { bubbles: true }));
    //    input.focus();
    //}
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
            '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            '</span></div></div></div>';
    });
    $list.html(html);
}

/* ═══════════════════════════════════════════════
   LAB TEST LIST RENDERING (global — used by handler)
═══════════════════════════════════════════════ */
function renderLabList(filter) {
    var q = (filter || "").toLowerCase().trim();
    var items = labTests.filter(function (t) {
        return !q || t.toLowerCase().indexOf(q) !== -1;
    });
    var $list = $("#lab-test-list").empty();
    if (items.length === 0) {
        $list.append('<div class="lab-test-empty">No tests match your search.</div>');
        return;
    }
    items.forEach(function (t) {
        var checked = selectedLabTests.indexOf(t) !== -1;
        var id = "lab-chk-" + t.replace(/[^a-z0-9]/gi, "-");
        $list.append(
            '<label class="lab-test-item' + (checked ? ' selected' : '') + '" data-test="' + t + '">' +
                '<span class="lab-test-check">' + (checked ? '<span class="lab-chk-tick">&#10003;</span>' : '') + '</span>' +
                '<span class="lab-test-name">' + t + '</span>' +
            '</label>'
        );
    });
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
    /* Badges are now created by Html Helpers — nothing to initialize */
}

function onNewNoteDiscard() {
    $("#note-textarea").val("");
    var ddl = $("#note-patient-ddl").data("kendoDropDownList");
    if (ddl) ddl.select(0);
    return true;
}

function onNewNoteSave() {
    var ddl  = $("#note-patient-ddl").data("kendoDropDownList");
    var text = $("#note-textarea").val().trim();
    if (!ddl || !ddl.value()) {
        alert("Please select a patient.");
        return false;
    }
    if (!text) {
        alert("Please enter a clinical note.");
        return false;
    }
    var patientId = ddl.value();
    $.ajax({
        url:         "/api/patients/" + encodeURIComponent(patientId) + "/add-note",
        type:        "POST",
        contentType: "application/json",
        data:        JSON.stringify({ text: text }),
        error: function () {
            alert("Could not save the note. Please try again.");
        }
    });
    $("#note-textarea").val("");
    return true;
}

function onNewNoteOpen() {
    var ddl = $("#note-patient-ddl").data("kendoDropDownList");
    if (ddl && patientsData.length && ddl.dataSource.total() === 0) {
        ddl.setDataSource(new kendo.data.DataSource({
            data: patientsData.map(function (p) { return { text: p.Name + " (" + p.Id + ")", value: p.Id }; })
        }));
    }
    setTimeout(function () { $("#note-textarea").focus(); }, 100);
}

function onLabTestDiscard() {
    selectedLabTests = [];
    $("#lab-test-search").val("");
    $("#lab-search-clear").hide();
    var ddl = $("#lab-patient-ddl").data("kendoDropDownList");
    if (ddl) ddl.select(0);
    return true;
}

function onLabTestSend() {
    var ddl = $("#lab-patient-ddl").data("kendoDropDownList");
    if (!ddl || !ddl.value()) {
        alert("Please select a patient.");
        return false;
    }
    if (selectedLabTests.length === 0) {
        alert("Please select at least one lab test.");
        return false;
    }
    console.log("Lab request for:", ddl.text(), "Tests:", selectedLabTests);
    selectedLabTests = [];
    $("#lab-test-search").val("");
    $("#lab-search-clear").hide();
    return true;
}

function onLabTestOpen() {
    var ddl = $("#lab-patient-ddl").data("kendoDropDownList");
    if (ddl && patientsData.length && ddl.dataSource.total() === 0) {
        ddl.setDataSource(new kendo.data.DataSource({
            data: patientsData.map(function (p) { return { text: p.Name + " (" + p.Id + ")", value: p.Id }; })
        }));
    }
    $("#lab-search-clear").hide();
    $("#lab-test-search").val("");
    renderLabList("");
}

function onNurseChatDiscard() {
    var cb = $("#nurse-msg-to").data("kendoComboBox");
    if (cb) cb.value("");
    $("#nurse-msg-subject").val("");
    $("#nurse-msg-body").val("");
    return true;
}

function onNurseChatSend() {
    var cb      = $("#nurse-msg-to").data("kendoComboBox");
    var to      = cb ? cb.value().trim() : $("#nurse-msg-to").val().trim();
    var subject = $("#nurse-msg-subject").val().trim();
    var body    = $("#nurse-msg-body").val().trim();
    if (!to) { alert("Please specify a recipient."); return false; }
    if (!subject) { alert("Please enter a subject."); return false; }
    if (!body) { alert("Please enter a message."); return false; }
    return true;
}

function onNurseChatOpen() {
    /* ComboBox is initialized by the HTML Helper with static data — nothing to do here */
}

function onAiAssistantDialogOpen() {
    var self = this;
    self.wrapper.addClass("ai-dialog-wrapper");
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


    /* Notification badge is managed by profile.js initNotifDropdown() */

    /* ═══════════════════════════════════════════════
       DAILY ALERTS + PATIENTS — loaded together
    ═════════════════════════════════════════════ */
    $.when(
        $.getJSON("/api/alerts"),
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
    $(document).on("click", ".alert-review", function () {
        var idx = parseInt($(this).data("alert-idx"), 10);
        _currentAlertIdx = idx;

        $.get("/Home/AlertReviewPartial", { alertIndex: idx }, function (html) {
            var dlg = $("#dialog-alert-review").data("kendoDialog");
            dlg.content(html);
            dlg.open();
        });
    });

    $(document).on("click", ".ar-profile-link", function (e) {
        e.preventDefault();
        var patientId = $(this).data("patient-id");
        if (patientId) {
            sessionStorage.setItem("openPatientId", patientId);
            window.location.href = "/patients";
        }
    });

    /* ═══════════════════════════════════════════════
       DIALOG — REASON FOR VISIT (initialized via Html Helper)
    ═══════════════════════════════════════════════ */

    $("#link-reason-details").on("click", function (e) {
        e.preventDefault();
        $("#dialog-reason-visit").data("kendoDialog").open();
    });

    $("#link-allergy-details").on("click", function (e) {
        e.preventDefault();
        $("#dialog-allergy-details").data("kendoDialog").open();
    });

    $(document).on("click", "#lab-test-list .lab-test-item", function () {
        var t = $(this).data("test");
        var idx = selectedLabTests.indexOf(t);
        if (idx === -1) {
            selectedLabTests.push(t);
        } else {
            selectedLabTests.splice(idx, 1);
        }
        renderLabList($("#lab-test-search").val());
    });

    $(document).on("input", "#lab-test-search", function () {
        var q = $(this).val();
        $("#lab-search-clear").toggle(q.length > 0);
        renderLabList(q);
    });

    $(document).on("click", "#lab-search-clear", function () {
        $("#lab-test-search").val("");
        $(this).hide();
        renderLabList("");
    });



    /* ═══════════════════════════════════════════════
       NEXT PATIENT — ACTION BUTTONS
    ═══════════════════════════════════════════════ */
    $(".view-profile-link").on("click", function (e) {
        e.preventDefault();
        var pid = $(this).data("patient-id") || (_nextPt && _nextPt.Id);
        if (pid) sessionStorage.setItem("openPatientId", pid);
        window.location.href = "/patients";
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
        if (_fab) { $("#ai-float-btn").show(); }

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

        var reply = _aiResponses[text] || "I\u2019m sorry, I don\u2019t have information on that right now.";
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
    _fab = $("#ai-float-btn").data("kendoFloatingActionButton");
});
