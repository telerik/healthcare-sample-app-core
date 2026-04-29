using HealthcareApp.Models;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Microsoft.AspNetCore.Mvc;

namespace HealthcareApp.Controllers;

[ApiController]
[Route("api")]
public class ApiController : ControllerBase
{
    private readonly HealthcareDataStore _store;

    public ApiController(HealthcareDataStore store)
    {
        _store = store;
    }

    // ── Patients ──────────────────────────────────────────────────────────

    [HttpGet("patients")]
    public IActionResult GetPatients() =>
        Ok(_store.GetPatients().Select(p => new
        {
            p.Id,
            p.Name,
            p.Age,
            p.Gender,
            p.BloodType,
            p.Ward,
            p.Diagnosis,
            p.Status,
            p.Doctor,
            p.Phone,
            p.LastVisit,
            p.Avatar,
            p.Allergies,
            p.Labs,
            p.Vitals,
        }));

    [HttpPost("patients/update")]
    public IActionResult UpdatePatient([FromBody] PatientRecord patient)
    {
        var existing = _store.GetPatient(patient.Id);
        if (existing == null) return NotFound();
        // Merge only fields that the grid can edit: status, notes
        existing.Status = patient.Status;
        existing.Notes  = patient.Notes;
        existing.Doctor = patient.Doctor;
        _store.UpdatePatient(existing);
        return Ok(existing);
    }

    [HttpPost("patients/{id}/notes")]
    public IActionResult SaveNotes(string id, [FromBody] NotesPayload payload)
    {
        var patient = _store.GetPatient(id);
        if (patient == null) return NotFound();
        patient.Notes = payload.Notes ?? "";
        _store.UpdatePatient(patient);
        return Ok(new { success = true });
    }

    [HttpPost("patients/{id}/add-note")]
    public IActionResult AddNote(string id, [FromBody] AddNotePayload payload)
    {
        var patient = _store.GetPatient(id);
        if (patient == null) return NotFound();
        var entry = payload.Text?.Trim() ?? "";
        patient.Notes = string.IsNullOrWhiteSpace(patient.Notes)
            ? entry
            : entry + "\n" + patient.Notes;
        _store.UpdatePatient(patient);
        return Ok(new { success = true });
    }

    [HttpPost("patients/{id}/status")]
    public IActionResult ChangeStatus(string id, [FromBody] StatusPayload payload)
    {
        var patient = _store.GetPatient(id);
        if (patient == null) return NotFound();
        patient.Status = payload.Status ?? patient.Status;
        _store.UpdatePatient(patient);
        return Ok(new { id = patient.Id, status = patient.Status });
    }

    // ── Alerts ────────────────────────────────────────────────────────────

    [HttpGet("alerts")]
    public IActionResult GetAlerts() =>
        Ok(_store.GetAlerts());

    // ── Today's Appointments (Home page grid) ────────────────────────────

    [HttpGet("today-appointments")]
    public IActionResult GetTodayAppointments() =>
        Ok(_store.GetTodayAppointments());

    // ── Schedule Appointments ─────────────────────────────────────────────

    [HttpGet("appointments")]
    public IActionResult GetAppointments()
    {
        var list = _store.GetScheduleAppointments();
        return Ok(list);
    }

    // ── Analytics ─────────────────────────────────────────────────────────

    [HttpGet("analytics")]
    public IActionResult GetAnalytics() =>
        Ok(_store.GetAnalytics());

    [HttpGet("analytics/{patientId}")]
    public IActionResult GetPatientAnalytics(string patientId)
    {
        var data = _store.GetAnalytics();
        if (!data.TryGetValue(patientId, out var analytics))
            return NotFound();
        return Ok(analytics);
    }

    // ── Event Types & Rooms ───────────────────────────────────────────────

    [HttpGet("event-types")]
    public IActionResult GetEventTypes() =>
        Ok(HealthcareDataRepository.GetEventTypes());

    [HttpGet("rooms")]
    public IActionResult GetRooms() =>
        Ok(HealthcareDataRepository.GetRoomOptions());

    // ── Tasks ─────────────────────────────────────────────────────────────

    [HttpGet("tasks")]
    public IActionResult GetTasks() =>
        Ok(_store.GetTasks());

    [HttpPost("tasks/create")]
    public IActionResult CreateTask([FromBody] DailyTask task)
    {
        if (task == null || string.IsNullOrWhiteSpace(task.Task))
            return BadRequest("Task name is required.");

        task.Task = task.Task.Trim();
        return Ok(_store.AddTask(task));
    }

    [HttpPost("tasks/update")]
    public IActionResult UpdateTask([FromBody] DailyTask task)
    {
        if (!_store.UpdateTask(task))
            return NotFound();
        return Ok(task);
    }

    // ── Profile ───────────────────────────────────────────────────────────

    [HttpGet("profile")]
    public IActionResult GetProfile() =>
        Ok(_store.GetProfile());

    [HttpPost("profile/update")]
    public IActionResult UpdateProfile([FromBody] DoctorProfilePayload payload)
    {
        if (payload == null)
            return BadRequest();

        var profile = _store.GetProfile();
        profile.FullName = string.IsNullOrWhiteSpace(payload.FullName) ? profile.FullName : payload.FullName.Trim();
        profile.Email    = string.IsNullOrWhiteSpace(payload.Email) ? profile.Email : payload.Email.Trim();
        profile.Phone    = string.IsNullOrWhiteSpace(payload.Phone) ? profile.Phone : payload.Phone.Trim();

        return Ok(_store.UpdateProfile(profile));
    }

    [HttpPost("profile/avatar")]
    public IActionResult UpdateProfileAvatar([FromBody] AvatarPayload payload)
    {
        if (payload == null || string.IsNullOrWhiteSpace(payload.Avatar))
            return BadRequest();

        return Ok(_store.UpdateProfileAvatar(payload.Avatar.Trim()));
    }

    [HttpPost("profile/avatar-upload")]
    public async Task<IActionResult> UploadProfileAvatar([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest();

        var allowed = new[] { "image/jpeg", "image/png", "image/gif", "image/webp" };
        if (!allowed.Contains(file.ContentType))
            return BadRequest("Invalid file type.");

        using var ms = new System.IO.MemoryStream();
        await file.CopyToAsync(ms);
        var base64 = $"data:{file.ContentType};base64,{Convert.ToBase64String(ms.ToArray())}";
        var profile = _store.UpdateProfileAvatar(base64);
        return Ok(profile);
    }

    [HttpPost("profile/avatar-remove")]
    public IActionResult RemoveProfileAvatar()
    {
        return Ok(new { success = true });
    }
}

// ── DTOs ──────────────────────────────────────────────────────────────────

public record NotesPayload(string? Notes);
public record AddNotePayload(string? Text);
public record StatusPayload(string? Status);
public record DoctorProfilePayload(string? FullName, string? Email, string? Phone);
public record AvatarPayload(string? Avatar);
