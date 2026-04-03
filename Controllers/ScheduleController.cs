using HealthcareApp.Models;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Microsoft.AspNetCore.Mvc;

namespace HealthcareApp.Controllers;

public class ScheduleController : Controller
{
    private readonly HealthcareDataStore _store;

    public ScheduleController(HealthcareDataStore store)
    {
        _store = store;
    }

    public IActionResult Index()
    {
        ViewData["Title"]      = "Schedule — Dr. Carter";
        ViewData["ActivePage"] = "Schedule";
        return View();
    }

    public IActionResult Appointments_Read([DataSourceRequest] DataSourceRequest request)
    {
        return Json(_store.GetScheduleAppointments().ToDataSourceResult(request));
    }

    public IActionResult Appointments_Create([DataSourceRequest] DataSourceRequest request, ScheduleAppointment appointment)
    {
        var created = _store.CreateScheduleAppointment(appointment);
        return Json(new[] { created }.ToDataSourceResult(request, ModelState));
    }

    public IActionResult Appointments_Update([DataSourceRequest] DataSourceRequest request, ScheduleAppointment appointment)
    {
        _store.UpdateScheduleAppointment(appointment);
        return Json(new[] { appointment }.ToDataSourceResult(request, ModelState));
    }

    public IActionResult Appointments_Destroy([DataSourceRequest] DataSourceRequest request, ScheduleAppointment appointment)
    {
        _store.DeleteScheduleAppointment(appointment.Id);
        return Json(new[] { appointment }.ToDataSourceResult(request, ModelState));
    }

    public IActionResult Tasks_Read([DataSourceRequest] DataSourceRequest request)
    {
        return Json(_store.GetTasks().ToDataSourceResult(request));
    }

    /// <summary>Returns the _AppointmentDialog partial for the appointment review dialog.</summary>
    public IActionResult AppointmentDialogPartial(string patientName, string room, string reason,
        DateTime start, DateTime end, bool expanded)
    {
        PatientRecord? patient = null;
        if (expanded && !string.IsNullOrEmpty(patientName))
        {
            var patients = _store.GetPatients();
            patient = patients.FirstOrDefault(p =>
                string.Equals(p.Name, patientName, StringComparison.OrdinalIgnoreCase));
        }

        var vm = new AppointmentDialogViewModel
        {
            PatientName = patientName ?? "",
            Room = room ?? "",
            Reason = reason ?? "",
            Start = start,
            End = end,
            Expanded = expanded,
            Patient = patient
        };

        return PartialView("_AppointmentDialog", vm);
    }
}
