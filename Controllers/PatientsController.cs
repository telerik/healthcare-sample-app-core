using HealthcareApp.Models;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Microsoft.AspNetCore.Mvc;

namespace HealthcareApp.Controllers;

public class PatientsController : Controller
{
    private readonly HealthcareDataStore _store;

    public PatientsController(HealthcareDataStore store)
    {
        _store = store;
    }

    public IActionResult Index()
    {
        ViewData["Title"]      = "Patients — Dr. Carter";
        ViewData["ActivePage"] = "Patients";
        return View();
    }

    public IActionResult Patients_Read([DataSourceRequest] DataSourceRequest request)
    {
        return Json(_store.GetPatients().ToDataSourceResult(request));
    }

    /// <summary>Returns the _PatientDetail partial for the drilldown view.</summary>
    public IActionResult DetailPartial(string patientId)
    {
        var patient = _store.GetPatient(patientId ?? "");
        if (patient == null) return NotFound();
        return PartialView("_PatientDetail", patient);
    }

    /// <summary>Returns the _PatientPreview partial for the side panel.</summary>
    public IActionResult PreviewPartial(string patientId)
    {
        var patient = _store.GetPatient(patientId ?? "");
        if (patient == null) return NotFound();
        return PartialView("_PatientPreview", patient);
    }

    /// <summary>Returns the _ChangeStatusContent partial for the status dialog.</summary>
    public IActionResult ChangeStatusPartial(string patientId)
    {
        var patient = _store.GetPatient(patientId ?? "");
        if (patient == null) return NotFound();
        return PartialView("_ChangeStatusContent", new ChangeStatusViewModel
        {
            PatientId = patient.Id,
            PatientName = patient.Name,
            CurrentStatus = patient.Status
        });
    }

    /// <summary>Returns the _PatientLabsGrid partial with the patient ID in ViewData.</summary>
    public IActionResult LabsPartial(string patientId)
    {
        ViewData["PatientId"] = patientId ?? "";
        return PartialView("_PatientLabsGrid");
    }

    /// <summary>Ajax DataSource read for the patient labs grid.</summary>
    public IActionResult PatientLabs_Read(string patientId, [DataSourceRequest] DataSourceRequest request)
    {
        var patient = _store.GetPatient(patientId ?? "");
        var labs = patient?.Labs ?? [];
        var rows = EnrichLabs(labs);
        return Json(rows.ToDataSourceResult(request));
    }

    private static readonly Dictionary<string, (string Ref, Dictionary<string, string> Notes)> LabMeta = new()
    {
        ["CBC"]         = ("4.5–11.0 ×10³/µL",  new() { ["High"] = "Leukocytosis — monitor for infection", ["Low"] = "Leukopenia — monitor closely", ["Normal"] = "Complete blood count within normal range" }),
        ["CRP"]         = ("<5.0 mg/L",           new() { ["High"] = "Significant inflammatory elevation", ["Normal"] = "No significant inflammation detected" }),
        ["Lipid Panel"] = ("<100 mg/dL (LDL)",    new() { ["High"] = "Above target for cardiac risk patients", ["Normal"] = "Lipid levels within target range" }),
        ["HbA1c"]       = ("<5.7%",               new() { ["High"] = "Above target — review glycaemic management", ["Normal"] = "Glycaemic control within target" }),
        ["BNP"]         = ("<100 pg/mL",           new() { ["High"] = "Elevated — consider cardiac assessment", ["Normal"] = "BNP within normal limits" }),
        ["Troponin I"]  = ("<0.004 ng/mL",         new() { ["High"] = "Borderline — serial monitoring ordered", ["Normal"] = "No evidence of myocardial injury" }),
        ["Ferritin"]    = ("12–300 ng/mL",         new() { ["High"] = "Elevated — check for inflammatory cause", ["Low"] = "Iron deficiency — supplement and monitor", ["Normal"] = "Iron stores adequate" }),
        ["Vitamin D"]   = (">20 ng/mL",            new() { ["Low"] = "Deficiency — supplementation recommended", ["Normal"] = "Vitamin D levels adequate" }),
        ["TSH"]         = ("0.5–4.5 µIU/mL",      new() { ["High"] = "Elevated — consider hypothyroidism workup", ["Low"] = "Suppressed — consider hyperthyroidism", ["Normal"] = "Thyroid function normal" }),
        ["eGFR"]        = (">60 mL/min/1.73m²",   new() { ["Low"] = "Reduced — monitor renal function closely", ["Normal"] = "Adequate renal function" }),
        ["Creatinine"]  = ("0.6–1.2 mg/dL",       new() { ["High"] = "Elevated — assess hydration and kidney function", ["Normal"] = "Creatinine within normal range" }),
        ["Potassium"]   = ("3.5–5.0 mEq/L",       new() { ["High"] = "Hyperkalaemia — review medications and diet", ["Low"] = "Hypokalaemia — supplement as indicated", ["Normal"] = "Within normal limits" }),
        ["LFT"]         = ("ALT <40 U/L",          new() { ["High"] = "Liver enzymes elevated — assess hepatic function", ["Normal"] = "Liver function within normal range" }),
        ["ESR"]         = ("<20 mm/hr",            new() { ["High"] = "Elevated — consider inflammation or infection", ["Normal"] = "Erythrocyte sedimentation rate normal" }),
    };

    private static List<EnrichedLabRow> EnrichLabs(List<LabResult> labs)
    {
        return labs.Select(l =>
        {
            var flag = string.IsNullOrEmpty(l.Flag) ? "Normal" : l.Flag;
            var status = flag is "High" or "Abnormal" ? "Critical"
                       : flag == "Low" ? "Monitoring"
                       : "Stable";

            var reference = "See report";
            var note = flag == "Normal" ? "Within normal limits" : "Requires clinical review";

            if (LabMeta.TryGetValue(l.Test, out var meta))
            {
                reference = meta.Ref;
                if (meta.Notes.TryGetValue(flag, out var flagNote))
                    note = flagNote;
                else if (meta.Notes.TryGetValue("Normal", out var normalNote))
                    note = normalNote;
            }

            return new EnrichedLabRow
            {
                Test = l.Test,
                Result = l.Result,
                Reference = reference,
                Status = status,
                Note = note
            };
        }).ToList();
    }
}
