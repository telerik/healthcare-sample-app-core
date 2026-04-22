// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
if (typeof appBasePath === "undefined") {
    var baseEl = document.querySelector("base[href]");
    var appBasePath = baseEl ? baseEl.getAttribute("href") : "/";
}

/* Measure the native scrollbar width and expose it as a CSS custom property
   so non-scrolling elements (appbar, headers) can align with #page-content. */
(function () {
    var outer = document.createElement('div');
    outer.style.cssText = 'position:absolute;top:-9999px;width:100px;height:100px;overflow:scroll';
    document.documentElement.appendChild(outer);
    var w = outer.offsetWidth - outer.clientWidth;
    document.documentElement.removeChild(outer);
    document.documentElement.style.setProperty('--scrollbar-width', w + 'px');
})();

/* Declared before the eager call so the in-flight XHR reference is
   not overwritten when the var declaration is executed later in the file. */
var patientSearchRequest = null;

/* ═══════════════════════════════════════════════════════
   PAGE-HEADER WIDGET DISPATCHERS — Layout renders Html Helper
   buttons/DDLs for every page header; Kendo captures the
   function reference at init time.  These dispatchers
   forward to _impl variables that page-specific scripts set.
═══════════════════════════════════════════════════════ */
var _aiAssistanceClickImpl       = null;
var _patientsExportClickImpl     = null;
var _patientSelectChangeImpl     = null;
var _analyticsExportClickImpl    = null;
var _patientSelectTemplateImpl   = null;
var _patientSelectValueTemplateImpl = null;

/* Patients header */
function onAiAssistanceClick(e)   { if (_aiAssistanceClickImpl)   _aiAssistanceClickImpl.call(this, e); }
function onPatientsExportClick(e) { if (_patientsExportClickImpl) _patientsExportClickImpl.call(this, e); }
/* Analytics header */
function onPatientSelectChange(e) { if (_patientSelectChangeImpl) _patientSelectChangeImpl.call(this, e); }
function onAnalyticsExportClick(e){ if (_analyticsExportClickImpl)_analyticsExportClickImpl.call(this, e); }
function patientSelectTemplate(d) { return _patientSelectTemplateImpl ? _patientSelectTemplateImpl(d) : kendo.htmlEncode(d.Name || ""); }
function patientSelectValueTemplate(d) { return _patientSelectValueTemplateImpl ? _patientSelectValueTemplateImpl(d) : kendo.htmlEncode(d.Name || ""); }

/* Start fetching the patient list eagerly — before DOM ready — so
   the autocomplete data is available as soon as the widget initialises. */
ensurePatientSearchData();

/* ═══════════════════════════════════════════════════════
   PJAX — keep the appbar alive, swap only #page-content
═══════════════════════════════════════════════════════ */
var _pjaxBusy = false;
var _currentPageScript = null;   // <script> element of the active page

function pjaxNavigate(url, pushState) {
    if (_pjaxBusy) return;
    _pjaxBusy = true;

    var $content = $("#page-content");
    $content.removeClass("page-ready").addClass("page-loading");

    $.ajax({
        url: url,
        dataType: "html",
        cache: false
    }).done(function (html) {
        var parsed = $($.parseHTML(html, document, true));

        /* Extract the new page content */
        var newContent = parsed.filter("#page-content").add(parsed.find("#page-content"));
        if (!newContent.length) {
            window.location.href = url;
            return;
        }

        /* Find page-specific script(s) from the response body */
        var pageScripts = [];
        parsed.filter("script[src]").each(function () {
            var src = $(this).attr("src") || "";
            if (src.indexOf("/js/app.js")       !== -1 ||
                src.indexOf("/js/schedule.js")   !== -1 ||
                src.indexOf("/js/patients.js")   !== -1 ||
                src.indexOf("/js/analytics.js")  !== -1) {
                pageScripts.push(src);
            }
        });

        /* Scripts are placed in @section HeadScripts, so $.parseHTML strips them
           (it discards <head>). Fall back to a regex search on the raw HTML string. */
        if (!pageScripts.length) {
            var knownScripts = ["app.js", "schedule.js", "patients.js", "analytics.js"];
            for (var ki = 0; ki < knownScripts.length; ki++) {
                var km = new RegExp('src="([^"]*/' + knownScripts[ki] + '[^"]*)"').exec(html);
                if (km) { pageScripts.push(km[1]); break; }
            }
        }

        /* Close any open AIPrompt / AI Dialog popups before tearing down
           the page so they don't linger after navigation. */
        $("#notes-ai-prompt-container").hide();
        var aiDlg = $("#dialog-ai-assistant").data("kendoDialog");
        if (aiDlg && aiDlg.wrapper && aiDlg.wrapper.is(":visible")) { aiDlg.close(); }
        /* Close the patients-page AI chat dialog */
        if (typeof listAiDialog !== "undefined" && listAiDialog && listAiDialog.wrapper && listAiDialog.wrapper.is(":visible")) {
            listAiDialog.close();
        }

        /* Destroy all Kendo widgets in the old content to free memory. */
        kendo.destroy($content);

        /* Remove any floating popups / animation containers owned by old widgets,
           but keep the ones belonging to persistent layout widgets (appbar search,
           patient-select DDL). */
        var searchKeep = [];
        ["#appbar-search", "#patient-select"].forEach(function(sel) {
            var w = $(sel).data("kendoAutoComplete") || $(sel).data("kendoDropDownList");
            if (w && w.popup) {
                var pw = w.popup.wrapper;
                if (pw && pw[0] && searchKeep.indexOf(pw[0]) === -1) { searchKeep.push(pw[0]); }
                if (pw) {
                    pw.parents(".k-animation-container").each(function () {
                        if (searchKeep.indexOf(this) === -1) { searchKeep.push(this); }
                    });
                }
            }
        });
        $("body > .k-animation-container, body > .k-popup, body > .k-overlay").filter(function () {
            return searchKeep.indexOf(this) === -1;
        }).remove();

        /* Remove previously injected page script */
        if (_currentPageScript) {
            $(_currentPageScript).remove();
            _currentPageScript = null;
        }

        /* Update history */
        if (pushState !== false) {
            history.pushState({ pjax: true, url: url }, "", url);
        }

        /* Inject content and reveal the page. Called only after the page script
           has loaded so named event-handler functions are defined before Kendo's
           synchronous widget initialisation runs inside $content.html(). */
        function injectAndReveal() {
            $content.html(newContent.html());
            $content.removeClass("page-loading").addClass("page-ready");
            _pjaxBusy = false;
            /* Re-validate the search autocomplete after PJAX cleanup. */
            initContextualSearch();
            initPatientSelectIfNeeded();
        }

        /* Load the page script FIRST, then inject content on onload. */
        if (pageScripts.length) {
            var src = pageScripts[0].replace(/\?v=.*$/, "") + "?_=" + Date.now();
            var script = document.createElement("script");
            script.src = src;
            script.onload = injectAndReveal;
            script.onerror = injectAndReveal;
            _currentPageScript = script;
            document.body.appendChild(script);
        } else {
            injectAndReveal();
        }

    }).fail(function () {
        window.location.href = url;
    });
}

/* Browser back / forward */
$(window).on("popstate", function (e) {
    var state = e.originalEvent.state;
    if (state && state.pjax) {
        var seg = $("#appbar-nav").data("kendoSegmentedControl");
        var pageValue = _urlToPage(state.url);
        if (seg && pageValue) { seg.select(pageValue); }
        if (pageValue) { showPageHeader(pageValue); }
        pjaxNavigate(state.url, false);
    }
});

function _urlToPage(url) {
    var path = url.replace(/^https?:\/\/[^/]+/, "").toLowerCase();
    if (path === "/" || path === "")          return "Home";
    if (path.indexOf("/schedule") === 0)     return "Schedule";
    if (path.indexOf("/patients") === 0)     return "Patients";
    if (path.indexOf("/analytics") === 0)    return "Analytics";
    return null;
}

/* ═══════════════════════════════════════════════════════
   APPBAR NAV & SETTINGS — event handlers wired by HTML Helpers
   SegmentedControl HTML Helper requires Telerik.UI.for.AspNet.Core
   >= 2026.1.325; current version is 2026.1.212, so jQuery init is used.
═══════════════════════════════════════════════════════ */
/* navRoutes is defined in _Layout.cshtml via Url.Action() */

function onSettingsClick() {
    $("#page-content").toggleClass("page-dimmed");
    $("#appbar").toggleClass("page-dimmed");
}

/* ═══════════════════════════════════════════════════════
   PAGE HEADERS — toggle active header in the fixed zone
═══════════════════════════════════════════════════════ */
function showPageHeader(pageName) {
    $("#page-headers .page-header").each(function () {
        var $h = $(this);
        if ($h.attr("data-page") === pageName) { $h.addClass("active"); }
        else { $h.removeClass("active"); }
    });
}

function onAppBarNavChange(e) {
    var url = navRoutes[e.value];
    if (url) {
        showPageHeader(e.value);
        pjaxNavigate(url, true);
    }
}

$(document).ready(function () {

    /* ═══════════════════════════════════════════════
       APP BAR NAV — SegmentedControl (initialized via Html Helper)
    ═══════════════════════════════════════════════ */
    var activePage = (typeof serverActivePage !== "undefined" && serverActivePage)
        ? serverActivePage
        : "Home";

    /* Activate the correct page header on initial load */
    showPageHeader(activePage);

    /* Record the initial page in history so back-button works */
    history.replaceState({ pjax: true, url: window.location.href }, "", window.location.href);

    /* ═══════════════════════════════════════════════
       MOBILE NAV MENU (< 576px) — Kendo DropDownButton
    ═══════════════════════════════════════════════ */
    var navItems = [
        { text: "Home", value: "Home", icon: "home" },
        { text: "Schedule", value: "Schedule", icon: "calendar" },
        { text: "Patients", value: "Patients", icon: "user-outline" },
        { text: "Clinical Analytics", value: "Analytics", icon: "chart-bar-stacked" }
    ];

    $("#hamburger-btn").kendoDropDownButton({
        icon: "menu",
        fillMode: "flat",
        popup: {
            appendTo: "#appbar"
        },
        items: navItems.map(function (item) {
            return {
                text: item.text,
                icon: item.icon,
                attributes: {
                    "data-page": item.value
                },
                click: function () {
                    var url = navRoutes[item.value];
                    if (url) {
                        showPageHeader(item.value);
                        pjaxNavigate(url, true);
                    }
                }
            };
        }),
        open: function () {
            var items = this.items();
            items.removeClass("k-selected");
            items.filter("[data-page='" + activePage + "']").addClass("k-selected");
        }
    });

    /* ═══════════════════════════════════════════════
       MOBILE SEARCH ICON — toggle autocomplete
    ═══════════════════════════════════════════════ */
    $("#btn-search-toggle").on("click", function () {
        var $appbar = $("#appbar");
        var isOpen = $appbar.toggleClass("search-open").hasClass("search-open");
        if (isOpen) {
            var ac = $("#appbar-search").data("kendoAutoComplete");
            if (ac) { ac.focus(); }
        }
    });

    /* Close mobile search on click outside */
    $(document).on("click", function (e) {
        if (!$(e.target).closest("#appbar, .k-autocomplete-popup, .k-actionsheet, .k-actionsheet-item, .k-actionsheet-content, .k-actionsheet-titlebar").length) {
            $("#appbar").removeClass("search-open");
        }
    });
});

/* ═══════════════════════════════════════════════════════
   GLOBAL PATIENT HEADER SEARCH
   The app bar search is intentionally consistent across pages:
   it searches patient records and navigates to the patient profile.
   Widget is created by the Html Helper in _Layout.cshtml.
   initContextualSearch() only handles the PJAX re-init case
   (re-initialization after destroy, which is allowed by jQuery).
═══════════════════════════════════════════════════════ */

/* ── Appbar Search — template & event handlers wired by HTML Helper ── */
var _searchDataLoading = false;

function buildSearchItems(patients) {
    return patients.map(function (p) {
        return {
            text:      p.Name + " " + p.Id + " " + p.Phone,
            name:      p.Name,
            sub:       p.Id + " \u00b7 " + p.Phone,
            patientId: p.Id
        };
    });
}

function populateAppbarSearchDataSource(ac, patients) {
    if (!ac || !ac.dataSource) return;
    ac.dataSource.data(buildSearchItems(patients || []));
}

function appbarSearchTemplate(dataItem) {
    return '<div class="search-result-item"><span class="search-result-name">' +
        kendo.htmlEncode(dataItem.name) +
        '</span><span class="search-result-sub">' +
        kendo.htmlEncode(dataItem.sub) +
        '</span></div>';
}

function onAppbarSearchFiltering(e) {
    var ac = this;
    if (ac.dataSource.data().length === 0) {
        e.preventDefault();
        if (!_searchDataLoading) {
            _searchDataLoading = true;
            ensurePatientSearchData().done(function (patients) {
                ac.dataSource.data(buildSearchItems(patients));
                if (ac.value().length >= 1) {
                    ac.search(ac.value());
                }
            }).always(function () {
                _searchDataLoading = false;
            });
        }
    }
}

function onAppbarSearchSelect(e) {
    e.preventDefault();
    var item = e.dataItem;
    if (!item || typeof item.patientId === "undefined") { return; }
    var patient = getPatientById(item.patientId) || findPatient(item.patientId) || { Id: item.patientId };
    this.value(item.name);
    this.close();
    $("#appbar-search").removeClass("search-no-match");
    navigateToPatientProfile(patient);
}

function navigateToPatientProfile(patient) {
    if (!patient || !patient.Id) return;

    sessionStorage.setItem("openPatientId", patient.Id);

    if (window.location.pathname.toLowerCase().indexOf("/patients") !== -1) {
        window.location.hash = patient.Id;
        return;
    }

    window.location.href = navRoutes.Patients;
}

function ensurePatientSearchData(forceRefresh) {
    if (!forceRefresh && sharedPatients && sharedPatients.length) {
        return $.Deferred().resolve(sharedPatients).promise();
    }

    if (!forceRefresh && patientSearchRequest) {
        return patientSearchRequest;
    }

    patientSearchRequest = $.getJSON("./api/patients")
        .done(function (patients) {
            sharedPatients = patients || [];
        })
        .always(function () {
            patientSearchRequest = null;
        });

    return patientSearchRequest;
}

/* Re-initializes the appbar search AutoComplete when its popup
   container was lost (PJAX) or when the adaptive mode breakpoint
   is crossed on resize (forceReinit=true). */
function initContextualSearch(forceReinit) {
    var $input = $("#appbar-search");
    if (!$input.length) return;

    var existing = $input.data("kendoAutoComplete");
    if (existing) {
        if (!forceReinit && existing.popup && existing.popup.wrapper && existing.popup.wrapper.closest("body").length) {
            return; /* widget and popup are healthy */
        }
        /* Popup container was lost — destroy and reinitialize below. */
        var $wrapper = $input.closest(".k-input, .k-autocomplete");
        existing.destroy();
        $input.removeData("kendoAutoComplete");
        /* Strip all Kendo wrapper markup so re-init starts from a clean input */
        if ($wrapper.length && $wrapper[0] !== $input[0]) {
            $wrapper.before($input);
            $wrapper.remove();
        }
        $input.removeClass("k-input-inner");
        $input.removeAttr("role aria-autocomplete aria-expanded aria-owns aria-disabled aria-busy aria-activedescendant");
    }

    /* Re-create via jQuery (allowed: re-initialization after destroy) */
    $input.kendoAutoComplete({
        dataSource:    new kendo.data.DataSource({ data: [] }),
        dataTextField: "text",
        filter:        "contains",
        minLength:     1,
        rounded:       "full",
        clearButton:   true,
        adaptiveMode:  "auto",
        placeholder:   "Search patients by name, ID or phone\u2026",
        prefixOptions: { icon: "search", separator: false },
        template:      appbarSearchTemplate,
        filtering:     onAppbarSearchFiltering,
        select:        onAppbarSearchSelect
    });

    /* Populate the DataSource eagerly */
    if (sharedPatients && sharedPatients.length) {
        populateAppbarSearchDataSource($input.data("kendoAutoComplete"), sharedPatients);
    } else {
        ensurePatientSearchData().done(function (patients) {
            populateAppbarSearchDataSource($input.data("kendoAutoComplete"), patients);
        });
    }
}

function initPatientSelectIfNeeded() {
    var $input = $("#patient-select");
    if (!$input.length) return;

    var existing = $input.data("kendoDropDownList");
    if (existing) {
        if (existing.popup && existing.popup.wrapper && existing.popup.wrapper.closest("body").length) {
            return; /* widget and popup are healthy */
        }

        var currentData = [];
        var currentValue = null;
        try {
            currentValue = existing.value();
        } catch (e) {
            /* Widget may be in an inconsistent state after PJAX; ignore */
        }
        try {
            if (existing.dataSource) {
                var data = existing.dataSource.data();
                currentData = data && data.toJSON ? data.toJSON() : Array.from(data || []);
            }
        } catch (e) {
            /* Ignore */
        }

        var $wrapper = existing.wrapper || $input.closest(".k-picker, .k-dropdownlist");
        try { existing.destroy(); } catch (e) { /* already destroyed */ }
        $input.removeData("kendoDropDownList");
        if ($wrapper && $wrapper.length && $wrapper[0] !== $input[0]) {
            $wrapper.before($input);
            $wrapper.remove();
        }
        $input.removeClass("k-input-inner");
        $input.removeAttr("role aria-expanded aria-owns aria-disabled aria-busy aria-activedescendant aria-describedby");

        $input.kendoDropDownList({
            dataTextField: "Name",
            dataValueField: "Id",
            rounded: "large",
            autoWidth: true,
            filter: "contains",
            autoBind: false,
            template: patientSelectTemplate,
            valueTemplate: patientSelectValueTemplate,
            change: onPatientSelectChange
        });

        var ddl = $input.data("kendoDropDownList");
        if (ddl && currentData.length) {
            ddl.setDataSource(new kendo.data.DataSource({ data: currentData }));
            if (currentValue) {
                ddl.value(currentValue);
            }
        }
    }
}

function applySharedDialogShell(dialog) {
    if (!dialog || !dialog.wrapper) return;
    dialog.wrapper.closest(".k-dialog-wrapper").addClass("app-dialog-shell");
}

/* Populate the HTML Helper–created AutoComplete DataSource eagerly
   and watch for adaptive-mode breakpoint crossings on resize. */
$(document).ready(function () {
    if (sharedPatients && sharedPatients.length) {
        populateAppbarSearchDataSource($("#appbar-search").data("kendoAutoComplete"), sharedPatients);
    } else {
        ensurePatientSearchData().done(function (patients) {
            populateAppbarSearchDataSource($("#appbar-search").data("kendoAutoComplete"), patients);
        });
    }

    /* The AutoComplete’s adaptive mode switches between popup and
       action-sheet rendering at 1024px, but internal list/popup
       references can become stale after the transition. Detect the
       breakpoint crossing and force a clean re-init. */
    var _lastWasAdaptive = window.innerWidth < 1024;
    var _adaptiveTimer = null;
    $(window).on("resize.appbarSearch", function () {
        clearTimeout(_adaptiveTimer);
        _adaptiveTimer = setTimeout(function () {
            var isAdaptive = window.innerWidth < 1024;
            if (isAdaptive !== _lastWasAdaptive) {
                _lastWasAdaptive = isAdaptive;
                initContextualSearch(true);
            }
        }, 250);
    });
});
