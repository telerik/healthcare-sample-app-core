using System.Diagnostics;
using HealthcareApp.Models;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Microsoft.AspNetCore.Mvc;

namespace HealthcareApp.Controllers;

public class HomeController : Controller
{
    private readonly HealthcareDataStore _store;

    public HomeController(HealthcareDataStore store)
    {
        _store = store;
    }

    public IActionResult Index()
    {
        ViewData["Title"]      = "Doctor Workspace — Dr. Carter";
        ViewData["ActivePage"] = "Home";
        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }

    public IActionResult TodayAppointments_Read([DataSourceRequest] DataSourceRequest request)
    {
        return Json(_store.GetTodayAppointments().ToDataSourceResult(request));
    }

    /// <summary>Returns the _AlertsList partial.</summary>
    public IActionResult AlertsPartial()
    {
        var alerts = _store.GetAlerts();
        return PartialView("_AlertsList", alerts);
    }

    /// <summary>Returns the _AlertReview partial for the review dialog.</summary>
    public IActionResult AlertReviewPartial(int alertIndex)
    {
        var alerts = _store.GetAlerts();
        if (alertIndex < 0 || alertIndex >= alerts.Count)
            return NotFound();

        var alert = alerts[alertIndex];
        var patient = !string.IsNullOrEmpty(alert.PatientId)
            ? _store.GetPatient(alert.PatientId)
            : null;

        var meta = GetAlertMeta(alert.Title);

        var vm = new AlertReviewViewModel
        {
            Alert = alert,
            Patient = patient,
            SeverityLabel = alert.Severity == "critical" ? "High" : "Medium",
            SeverityCss = alert.Severity == "critical" ? "ar-badge-high" : "ar-badge-medium",
            AlertType = meta.Type,
            AlertDescription = meta.Description
        };

        return PartialView("_AlertReview", vm);
    }

    /// <summary>Returns the _NotificationsPanel partial.</summary>
    [HttpPost]
    public IActionResult NotificationsPartial([FromBody] NotificationsPanelViewModel model)
    {
        model ??= new NotificationsPanelViewModel();
        return PartialView("~/Views/Shared/_NotificationsPanel.cshtml", model);
    }

    private static readonly Dictionary<string, (string Type, string Description)> AlertMeta = new()
    {
        ["CRP elevated"]              = ("Lab Result",  "C-Reactive Protein (CRP) levels are significantly elevated at 45 mg/L (normal: <10 mg/L), indicating acute inflammation or infection."),
        ["Blood pressure high"]       = ("Vital Sign",  "Systolic blood pressure has exceeded the safe threshold, indicating hypertensive urgency requiring immediate evaluation."),
        ["Glucose levels elevated"]   = ("Lab Result",  "Fasting blood glucose levels are elevated above the normal range (70\u2013100 mg/dL), suggesting poor glycaemic control requiring review."),
        ["High cholesterol detected"] = ("Lab Result",  "LDL cholesterol levels are significantly elevated above the optimal range (<100 mg/dL), increasing cardiovascular risk."),
        ["Oxygen saturation low"]     = ("Vital Sign",  "SpO\u2082 has dropped below 92%, indicating potential respiratory compromise. Supplemental oxygen and monitoring recommended."),
        ["Potassium level abnormal"]  = ("Lab Result",  "Serum potassium levels are outside the normal range (3.5\u20135.0 mEq/L), presenting risk of cardiac arrhythmia."),
        ["Heart rate irregular"]      = ("Vital Sign",  "Irregular heart rhythm detected with significant rate fluctuations. ECG monitoring and cardiology consultation recommended."),
        ["Creatinine elevated"]       = ("Lab Result",  "Serum creatinine levels are elevated above the normal range (0.6\u20131.2 mg/dL), indicating potential renal function decline."),
        ["Temperature spike noted"]   = ("Vital Sign",  "Core temperature has risen above normal, indicating a possible infectious process. Further evaluation advised."),
        ["HbA1c above target"]        = ("Lab Result",  "HbA1c measured above target (<7%), indicating suboptimal long-term glucose control. Therapy adjustment recommended."),
        ["Sodium level low"]          = ("Lab Result",  "Serum sodium is below the normal range (135\u2013145 mEq/L), indicating hyponatraemia. Fluid balance review and electrolyte replacement may be required."),
        ["INR out of range"]          = ("Lab Result",  "International Normalised Ratio is outside the therapeutic range, increasing the risk of bleeding or thromboembolic events. Anticoagulation review required."),
        ["Respiratory rate elevated"] = ("Vital Sign",  "Respiratory rate exceeds the normal range (12\u201320 breaths/min). Possible respiratory distress; further clinical assessment recommended."),
        ["Hemoglobin low"]            = ("Lab Result",  "Haemoglobin levels are below the normal threshold, indicating anaemia. Iron studies and further workup are advised."),
        ["White cell count elevated"] = ("Lab Result",  "White blood cell count is elevated above normal (4.5\u201311.0 \u00d710\u00b3/\u00b5L), suggesting infection, inflammation, or haematological disorder."),
        ["BMI critical range"]        = ("Vital Sign",  "Body Mass Index has reached a critical threshold associated with increased cardiovascular and metabolic risk. Dietary and lifestyle review advised."),
        ["Uric acid elevated"]        = ("Lab Result",  "Serum uric acid is elevated above the normal range, increasing the risk of gout and uric acid nephropathy. Dietary modification and medication review recommended."),
    };

    private static (string Type, string Description) GetAlertMeta(string title)
    {
        var baseTitle = (title ?? "").Split(" \u2013 ")[0].Split(" — ")[0].Split(" - ")[0].Trim();
        return AlertMeta.TryGetValue(baseTitle, out var meta) ? meta : ("Clinical", title ?? "");
    }
}
