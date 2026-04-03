using HealthcareApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace HealthcareApp.Controllers;

public class AnalyticsController : Controller
{
    private readonly HealthcareDataStore _store;

    public AnalyticsController(HealthcareDataStore store)
    {
        _store = store;
    }

    public IActionResult Index()
    {
        ViewData["Title"]      = "Clinical Analytics — Dr. Carter";
        ViewData["ActivePage"] = "Analytics";
        return View();
    }

    // ── Chart data endpoints ──────────────────────────────────────────

    [HttpGet]
    public IActionResult VitalsHistory(string patientId)
    {
        var analytics = _store.GetAnalytics();
        if (string.IsNullOrEmpty(patientId) || !analytics.TryGetValue(patientId, out var data))
            return Json(new List<VitalDataPoint>());
        return Json(data.VitalsHistory);
    }

    [HttpGet]
    public IActionResult AlertsOverTime(string patientId)
    {
        var analytics = _store.GetAnalytics();
        if (string.IsNullOrEmpty(patientId) || !analytics.TryGetValue(patientId, out var data))
            return Json(new List<AlertDataPoint>());
        return Json(data.AlertsOverTime);
    }

    [HttpGet]
    public IActionResult AlertsByCategory(string patientId)
    {
        var analytics = _store.GetAnalytics();
        if (string.IsNullOrEmpty(patientId) || !analytics.TryGetValue(patientId, out var data))
            return Json(new List<AlertCategory>());
        return Json(data.AlertsByType);
    }

    [HttpGet]
    public IActionResult LabResults(string patientId)
    {
        var analytics = _store.GetAnalytics();
        if (string.IsNullOrEmpty(patientId) || !analytics.TryGetValue(patientId, out var data))
            return Json(new List<LabChartResult>());
        return Json(data.LabResults);
    }

    [HttpGet]
    public IActionResult RiskScore(string patientId)
    {
        var analytics = _store.GetAnalytics();
        if (string.IsNullOrEmpty(patientId) || !analytics.TryGetValue(patientId, out var data))
            return Json(new { riskScore = 0 });
        return Json(new { riskScore = data.RiskScore });
    }
}
