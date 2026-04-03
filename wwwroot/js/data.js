/* ═══════════════════════════════════════════════════════════════════════
   SHARED DATA  —  single source of truth for the healthcare application
   Include data.js BEFORE any page-specific script.
═══════════════════════════════════════════════════════════════════════ */

/* ── Schedule Event Types ─────────────────────────────────────────── */
var sharedEventTypes = [
    { text: "Follow-up",    value: "Follow-up"    },
    { text: "Consultation", value: "Consultation" },
    { text: "Lab Review",   value: "Lab Review"   },
    { text: "Diagnostics",  value: "Diagnostics"  },
    { text: "Emergency",    value: "Emergency"    }
];

/* ── Room Options ─────────────────────────────────────────────────── */
var sharedRoomOptions = [
    "204 (Floor 2)", "456 (Floor 4)", "79A (Floor 0)",
    "ER-1", "ER-3", "Imaging 1B", "Imaging 2A", "Lab Office"
];

/* ── Shared data — sourced from the server API, not generated client-side ── */
var sharedPatients = [];

/* ── Lookup helpers ───────────────────────────────────────────────── */
function getPatientById(id) { return sharedPatients.filter(function (p) { return p.Id === id; })[0]; }

/* ── Global patient search (name, id, or phone) ───────────────────── */
function findPatient(query) {
    var q = query.toLowerCase().trim();
    if (!q) return null;
    return sharedPatients.find(function (p) {
        return p.Name.toLowerCase().indexOf(q) !== -1 ||
               p.Id.toLowerCase() === q ||
               p.Phone.replace(/\D/g, "").indexOf(q.replace(/\D/g, "")) !== -1;
    }) || null;
}

/* ── Lab Test Catalogue (for dialogs / dropdowns) ─────────────────── */
var sharedLabCatalogue = [
    "Complete Blood Count (CBC)", "Basic Metabolic Panel (BMP)", "Comprehensive Metabolic Panel (CMP)",
    "Lipid Panel", "Thyroid Stimulating Hormone (TSH)", "Hemoglobin A1c (HbA1c)",
    "Prothrombin Time (PT/INR)", "Partial Thromboplastin Time (PTT)", "C-Reactive Protein (CRP)",
    "Erythrocyte Sedimentation Rate (ESR)", "Urinalysis (UA)", "Urine Culture", "Blood Culture",
    "Liver Function Tests (LFT)", "Kidney Function Tests (KFT)", "Serum Electrolytes",
    "Fasting Blood Glucose", "Postprandial Blood Glucose", "Iron Studies", "Ferritin Level",
    "Vitamin D (25-OH)", "Vitamin B12", "Folate Level", "Magnesium Level", "Phosphorus Level",
    "Uric Acid", "Troponin I", "D-Dimer", "Brain Natriuretic Peptide (BNP)", "Arterial Blood Gas (ABG)"
];

function getStatusChipOptions(status) {
    switch (status) {
        case "Complete":
            return { themeColor: "success", fillMode: "solid" };
        case "Stable":
            return { themeColor: "success", fillMode: "solid" };
        case "In Progress":
            return { themeColor: "secondary", fillMode: "solid" };
        case "Monitoring":
        case "Warning":
            return { themeColor: "warning", fillMode: "solid" };
        case "Upcoming":
            return { themeColor: "tertiary", fillMode: "outline" };
        case "Cancelled":
            return { themeColor: "info", fillMode: "outline" };
        case "Critical":
            return { themeColor: "error", fillMode: "solid" };
        default:
            return { themeColor: "base", fillMode: "solid" };
    }
}

function getStatusBadgeOptions(status) {
    switch (status) {
        case "Complete":
            return { themeColor: "success", fillMode: "solid" };
        case "Stable":
            return { themeColor: "success", fillMode: "solid" };
        case "In Progress":
            return { themeColor: "secondary", fillMode: "solid" };
        case "Monitoring":
        case "Warning":
            return { themeColor: "warning", fillMode: "solid" };
        case "Upcoming":
            return { themeColor: "tertiary", fillMode: "outline" };
        case "Cancelled":
            return { themeColor: "info", fillMode: "outline" };
        case "Critical":
            return { themeColor: "error", fillMode: "solid" };
        default:
            return { themeColor: "default", fillMode: "solid" };
    }
}

function initKendoStatusBadges($container) {
    $container.find(".k-badge-status:not(.k-badge)").each(function () {
        var $el     = $(this);
        var status  = $el.attr("data-status");
        var options = getStatusBadgeOptions(status);
        $el.kendoBadge({
            text:       status,
            themeColor: options.themeColor,
            fillMode:   options.fillMode,
            rounded:    "full",
            size:       "large"
        });
    });
}

/**
 * Initialise all un-initialised Kendo Chip placeholders inside a container.
 * Status chips:  <span class="k-chip-status" data-status="Complete"></span>
 * Allergy chips: <span class="k-chip-allergy" data-label="Penicillin"></span>
 */
function initKendoChips($container) {
    $container.find(".k-chip-status:not(.k-chip)").each(function () {
        var $el     = $(this);
        var status  = $el.attr("data-status");
        var options = getStatusChipOptions(status);
        $el.kendoChip({
            label:     status,
            themeColor: options.themeColor,
            fillMode:  options.fillMode,
            rounded:   "full",
            size:      "large"
        });
    });
    $container.find(".k-chip-allergy:not(.k-chip)").each(function () {
        var $el   = $(this);
        var label = $el.attr("data-label");
        $el.kendoChip({
            label:     "\u26A0 " + label,
            themeColor: "error",
            fillMode:  "solid",
            rounded:   "full",
            size:      "large"
        });
    });
}

function initAllergyBadges($container) {
    $container.find(".k-badge-allergy:not(.k-badge)").each(function () {
        var $el   = $(this);
        var label = $el.attr("data-label");
        $el.kendoBadge({
            text:       "\u26A0 " + label,
            themeColor: "error",
            fillMode:   "solid",
            rounded:    "full",
            size:       "large"
        });
    });
}
