/* ═══════════════════════════════════════════════
   EVENT HANDLERS for Html Helper–initialized widgets
═══════════════════════════════════════════════ */
var lastDonutSmall = null;

function updateDonutLabels() {
    var donut = $("#alerts-donut-chart").data("kendoChart");
    if (!donut) return;
    var isSmall = window.innerWidth < 730;
    if (isSmall === lastDonutSmall) return;
    lastDonutSmall = isSmall;
    var series = donut.options.series[0];
    series.labels.position = isSmall ? "insideEnd" : "outsideEnd";
    series.labels.distance = isSmall ? 0 : 20;
    series.labels.align = isSmall ? "circle" : "column";
    if (!series.labels.connectors) { series.labels.connectors = {}; }
    series.labels.connectors.width = isSmall ? 0 : 1;
    donut.redraw();
}

_analyticsExportClickImpl = function() {
    kendo.drawing.drawDOM($("#analytics-body"), {
        paperSize: "auto"
    }).then(function (group) {
        return kendo.drawing.exportPDF(group, { multiPage: true });
    }).done(function (data) {
        kendo.saveAs({
            dataURI:  data,
            fileName: "analytics-report.pdf"
        });
    });
};

/* ── DropDownList template & event handlers — wired by HTML Helper ── */
_patientSelectTemplateImpl = function(dataItem) {
    return '<span>' + kendo.htmlEncode(dataItem.Name) + ' (' + kendo.htmlEncode(dataItem.Id) + ')</span>';
};

_patientSelectValueTemplateImpl = function(dataItem) {
    return '<span>' + kendo.htmlEncode(dataItem.Name) + ' (' + kendo.htmlEncode(dataItem.Id) + ')</span>';
};

_patientSelectChangeImpl = function() {
    updateAllCharts(this.value());
};

/* ── ArcGauge center template — wired by HTML Helper ── */
function riskGaugeCenterTemplate(e) {
    var val = (e.value !== undefined && e.value !== null && !isNaN(e.value)) ? e.value : 0;
    return '<div class="risk-gauge-center"><span class="risk-score-pct" style="color: ' + e.color + ';">' + val + '%</span><span class="risk-score-outof">Out of 100</span></div>';
}

/* ═══════════════════════════════════════════════════════
   CLINICAL ANALYTICS PAGE — DATA loaded remotely from /api
═══════════════════════════════════════════════════════ */
var patientsData   = [];
var _selectedPatientId = null;

/* Kendo Chart DataSource .Data() callback */
function getSelectedPatientId() {
    return { patientId: _selectedPatientId || "" };
}

/* Bullet chart color handler — used by labs-chart HTML Helper */
function labsChartColor(e) {
    var d = e.dataItem;
    if (!d) return "#1a874a";
    if (d.Value > d.WarningMax) return "#c0345a";
    if (d.Value > d.NormalMax)  return "#b8860b";
    return "#1a874a";
}

/* ═══════════════════════════════════════════════════════
   LAB RESULTS — one bullet chart per metric
═══════════════════════════════════════════════════════ */
function buildLabCharts(labResults) {
    var $container = $("#labs-charts-container");

    // Destroy any existing per-metric charts
    $container.find("[id^='klab-']").each(function () {
        var w = $(this).data("kendoChart");
        if (w) { w.destroy(); }
    });
    $container.empty();

    $.each(labResults, function (i, d) {
        var isBelow  = d.Value < d.NormalMin;
        var isAbove  = d.Value > d.NormalMax;
        var barColor = isBelow ? "#e8735a" : (isAbove ? "#f5c842" : "#4ade80");
        var tVal     = isBelow ? d.NormalMin : d.NormalMax;

        var axisMax = Math.max(d.Value * 1.15, d.NormalMax + 0.8 * (d.NormalMax - d.NormalMin));

        var chartId = "klab-" + i;

        $container.append(
            '<div class="klab-row">' +
                '<span class="klab-label">' + kendo.htmlEncode(d.Name) + '</span>' +
                '<div id="' + chartId + '" class="klab-chart"></div>' +
            '</div>'
        );

        $("#" + chartId).kendoChart({
            legend: { visible: false },
            seriesDefaults: { type: "bullet", gap: 0.45, spacing: 0 },
            series: [{
                color: barColor,
                target: {
                    color: "#1e293b",
                    line:  { width: 3 }
                },
                data: [[d.Value, tVal]]
            }],
            categoryAxis: {
                categories: [d.Name],
                majorGridLines: { visible: false },
                labels: { visible: false }
            },
            valueAxis: {
                name: "v",
                min: 0,
                max: axisMax,
                plotBands: [
                    { from: 0,           to: d.NormalMin, color: "#b8b8b8" },
                    { from: d.NormalMin, to: d.NormalMax, color: "#d4d4d4" },
                    { from: d.NormalMax, to: axisMax,     color: "#ececec" }
                ],
                majorGridLines: { color: "#f0eeff" },
                labels: { format: "{0}" }
            },
            tooltip: {
                visible: true,
                template: (function (capturedD) {
                    return function (e) {
                        return "Min: " + capturedD.NormalMin + "  Max: " + capturedD.NormalMax + " " + capturedD.Unit +
                               "<br/>Result: <strong>" + e.value.current + "</strong> " + capturedD.Unit;
                    };
                })(d)
            },
            chartArea: { background: "transparent", height: 75 }
        });
    });
    // Re-apply responsive donut labels after data refresh
    lastDonutSmall = null;
    updateDonutLabels();}

/* ═══════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════ */
function avg(arr, field) {
    var sum = arr.reduce(function (acc, d) { return acc + d[field]; }, 0);
    return Math.round(sum / arr.length);
}

function legendItemVisual(e) {
        var color = e.options.markers.background;
        var labelColor = e.options.labels.color;
        var labelText = e.text || e.series.name || "";
        var rect = new kendo.geometry.Rect([0, 0], [150, 75]);
        var layout = new kendo.drawing.Layout(rect, {
            spacing: 4,
            alignItems: "center"
        });
        var circle = new kendo.drawing.Circle(new kendo.geometry.Circle([0, 0], 5), {
            fill:   { color: color },
            stroke: { color: color }
        });
        var label = new kendo.drawing.Text(labelText, [0, 0], {
            fill: { color: labelColor }
        });
        layout.append(circle, label);
        layout.reflow();
        return layout;
}

/* ═══════════════════════════════════════════════════════
   CHART DATA REFRESH
═══════════════════════════════════════════════════════ */
function updateAllCharts(id) {
    _selectedPatientId = id;

    // Vitals line chart — read from remote endpoint
    var vitalsChart = $("#vitals-chart").data("kendoChart");
    if (vitalsChart) { vitalsChart.dataSource.read(); }

    // Alerts stacked column — read from remote endpoint
    var colChart = $("#alerts-column-chart").data("kendoChart");
    if (colChart) { colChart.dataSource.read(); }

    // Alerts donut — read from remote endpoint
    var donutChart = $("#alerts-donut-chart").data("kendoChart");
    if (donutChart) { donutChart.dataSource.read(); }

    // Labs bullet charts — per metric, fetched from remote endpoint
    $.getJSON("/Analytics/LabResults", { patientId: id }, function (data) {
        buildLabCharts(data || []);
    });

    // Risk gauge — fetch from endpoint
    $.getJSON("/Analytics/RiskScore", { patientId: id }, function (data) {
        var gauge = $("#risk-gauge").data("kendoArcGauge");
        if (gauge && data) {
            var score = parseFloat(data.riskScore != null ? data.riskScore : data.RiskScore);
            gauge.value(isNaN(score) ? 0 : score);
        }
    });
}

/* ═══════════════════════════════════════════════════════
   DOCUMENT READY
═══════════════════════════════════════════════════════ */
$(document).ready(function () {
    if (window.initPatientSelectIfNeeded) {
        window.initPatientSelectIfNeeded();
    }

    // ── Patient Selection — populate the Html Helper–created DropDownList ──
    $.when(
        ensurePatientSearchData(),
        $.getJSON("/api/analytics")
    ).done(function (patientsResp, analyticsResp) {
        patientsData = Array.isArray(patientsResp[0]) ? patientsResp[0] : (Array.isArray(patientsResp) ? patientsResp : []);

        var ddl = $("#patient-select").data("kendoDropDownList");
        if (ddl) {
            ddl.setDataSource(new kendo.data.DataSource({ data: patientsData }));
            if (patientsData.length > 0) {
                ddl.value(patientsData[0].Id);
                updateAllCharts(patientsData[0].Id);
            }
        }

        $("#page-content").removeClass("page-loading").addClass("page-ready");
    });

    // ── Resize charts on window resize ────────────────
    var resizeTimer;

    $(window).on("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            $("#vitals-chart, #alerts-column-chart, #alerts-donut-chart").each(function () {
                var chart = $(this).data("kendoChart");
                if (chart) { chart.resize(); }
            });
            kendo.resize($("#risk-gauge"));
            $("[id^='klab-']").each(function () {
                var chart = $(this).data("kendoChart");
                if (chart) { chart.resize(); }
            });
            updateDonutLabels();
        }, 150);
    });

    // Apply on initial load too
    setTimeout(updateDonutLabels, 300);

});
