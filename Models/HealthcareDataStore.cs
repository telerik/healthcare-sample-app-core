using Microsoft.AspNetCore.Http;

namespace HealthcareApp.Models;

/// <summary>
/// Scoped service that provides per-session isolated data.
///
/// On first access within a browser session the master lists (loaded from
/// SQLite by the singleton seed store) are deep-copied into a
/// UserSessionData entry keyed by the ASP.NET session ID.
/// All subsequent reads and mutations within that session hit only that
/// private copy — no other session is affected.
///
/// This mirrors the IUserDataCache / IHttpContextAccessor pattern used in
/// the Kendo UI demos service.
/// </summary>
public class HealthcareDataStore
{
    private readonly IUserDataCache        _cache;
    private readonly IHttpContextAccessor  _http;
    private readonly HealthcareSeedStore   _seed;

    public HealthcareDataStore(
        IUserDataCache       cache,
        IHttpContextAccessor http,
        HealthcareSeedStore  seed)
    {
        _cache = cache;
        _http  = http;
        _seed  = seed;
    }

    // ── Resolve the per-session data bag ──────────────────────────────────

    private UserSessionData Session()
    {
        // Ensure there is an ASP.NET session and it has an ID
        var httpCtx = _http.HttpContext
            ?? throw new InvalidOperationException("No active HTTP context.");

        httpCtx.Session.SetString("_init", "1"); // touches the session to assign an ID
        var sessionId = httpCtx.Session.Id;

        return _cache.GetOrCreate(sessionId, () => new UserSessionData
        {
            // Deep-copy from the shared seed so edits are fully isolated
            Patients          = _seed.Patients.Select(DeepCopyPatient).ToList(),
            Appointments      = _seed.Appointments.Select(ShallowCopyAppt).ToList(),
            Tasks             = _seed.Tasks.Select(ShallowCopyTask).ToList(),
            TodayAppointments = _seed.TodayAppointments.Select(ShallowCopyTodayAppt).ToList(),
            Alerts            = _seed.Alerts.Select(ShallowCopyAlert).ToList(),
            Analytics         = _seed.Analytics.ToDictionary(kvp => kvp.Key, kvp => DeepCopyAnalytics(kvp.Value)),
            Profile           = new DoctorProfile(),
        });
    }

    // ── Patients ──────────────────────────────────────────────────────────

    public List<PatientRecord> GetPatients()     => Session().Patients.ToList();
    public PatientRecord? GetPatient(string id)  => Session().Patients.FirstOrDefault(p => p.Id == id);

    public void UpdatePatient(PatientRecord updated)
    {
        var list = Session().Patients;
        var idx  = list.FindIndex(p => p.Id == updated.Id);
        if (idx < 0) return;

        list[idx].Status = updated.Status;
        list[idx].Notes  = updated.Notes;
        list[idx].Doctor = updated.Doctor;
    }

    public DoctorProfile GetProfile() => new()
    {
        FullName = Session().Profile.FullName,
        Email    = Session().Profile.Email,
        Phone    = Session().Profile.Phone,
        Avatar   = Session().Profile.Avatar,
    };

    public DoctorProfile UpdateProfile(DoctorProfile updated)
    {
        var profile = Session().Profile;
        profile.FullName = updated.FullName;
        profile.Email    = updated.Email;
        profile.Phone    = updated.Phone;
        profile.Avatar   = updated.Avatar;
        return GetProfile();
    }

    public DoctorProfile UpdateProfileAvatar(string avatar)
    {
        var profile = Session().Profile;
        profile.Avatar = avatar;
        return GetProfile();
    }

    // ── Schedule Appointments ─────────────────────────────────────────────

    public List<ScheduleAppointment> GetScheduleAppointments() =>
        Session().Appointments.ToList();

    public ScheduleAppointment CreateScheduleAppointment(ScheduleAppointment appt)
    {
        var list = Session().Appointments;
        appt.Id  = list.Count > 0 ? list.Max(a => a.Id) + 1 : 1;
        list.Add(appt);
        return appt;
    }

    public bool UpdateScheduleAppointment(ScheduleAppointment updated)
    {
        var list = Session().Appointments;
        var idx  = list.FindIndex(a => a.Id == updated.Id);
        if (idx < 0) return false;

        list[idx].Title       = updated.Title;
        list[idx].PatientName = updated.PatientName;
        list[idx].Reason      = updated.Reason;
        list[idx].Room        = updated.Room;
        list[idx].EventType   = updated.EventType;
        list[idx].Start       = updated.Start;
        list[idx].End         = updated.End;
        return true;
    }

    public bool DeleteScheduleAppointment(int id)
    {
        var list = Session().Appointments;
        var item = list.FirstOrDefault(a => a.Id == id);
        if (item == null) return false;
        list.Remove(item);
        return true;
    }

    // ── Daily Tasks ───────────────────────────────────────────────────────

    public List<DailyTask> GetTasks() => Session().Tasks.ToList();

    public bool UpdateTask(DailyTask updated)
    {
        var list = Session().Tasks;
        var idx  = list.FindIndex(t => t.Id == updated.Id);
        if (idx < 0) return false;

        list[idx].Task        = updated.Task;
        list[idx].Priority    = updated.Priority;
        list[idx].Done        = updated.Done;
        list[idx].Description = updated.Description;
        return true;
    }

    public DailyTask AddTask(DailyTask task)
    {
        var list = Session().Tasks;
        task.Task = (task.Task ?? string.Empty).Trim();
        task.Id   = list.Count > 0 ? list.Max(t => t.Id) + 1 : 1;
        task.Done = false;
        list.Insert(0, task);
        return task;
    }

    // ── Derived / computed (now served from DB seed) ────────────────────

    public List<PatientAlert>                   GetAlerts()            => Session().Alerts.ToList();
    public Dictionary<string, PatientAnalytics> GetAnalytics()         => new(Session().Analytics);
    public List<TodayAppointment>               GetTodayAppointments() => Session().TodayAppointments.ToList();

    // ── Copy helpers ──────────────────────────────────────────────────────

    private static PatientRecord DeepCopyPatient(PatientRecord p) => new()
    {
        Id        = p.Id,        Name      = p.Name,      Age       = p.Age,
        Gender    = p.Gender,    BloodType = p.BloodType, Ward      = p.Ward,
        Diagnosis = p.Diagnosis, Status    = p.Status,    Doctor    = p.Doctor,
        Phone     = p.Phone,     LastVisit = p.LastVisit, Avatar    = p.Avatar,
        Notes     = p.Notes,     RiskScore = p.RiskScore,
        Allergies  = [.. p.Allergies],
        Vitals     = new PatientVitals
        {
            Bp = p.Vitals.Bp, Systolic = p.Vitals.Systolic, Diastolic = p.Vitals.Diastolic,
            Hr = p.Vitals.Hr, Temp = p.Vitals.Temp, Spo2 = p.Vitals.Spo2,
            Weight = p.Vitals.Weight, Rr = p.Vitals.Rr
        },
        Labs        = p.Labs.Select(l        => new LabResult       { Test = l.Test, Result = l.Result, Flag = l.Flag, Date = l.Date }).ToList(),
        Medications = p.Medications.Select(m => new PatientMedication{ Drug = m.Drug, Dose = m.Dose, Frequency = m.Frequency, Duration = m.Duration }).ToList(),
        Visits      = p.Visits.Select(v      => new PatientVisit    { Date = v.Date, Reason = v.Reason }).ToList(),
        AdmissionDetails = new AdmissionInfo
        {
            Department = p.AdmissionDetails.Department, WardUnit = p.AdmissionDetails.WardUnit,
            Room = p.AdmissionDetails.Room, AdmissionDate = p.AdmissionDetails.AdmissionDate,
            AssignedNurse = p.AdmissionDetails.AssignedNurse
        }
    };

    private static ScheduleAppointment ShallowCopyAppt(ScheduleAppointment a) => new()
    {
        Id = a.Id, Title = a.Title, PatientName = a.PatientName,
        Reason = a.Reason, Room = a.Room, EventType = a.EventType,
        Start = a.Start, End = a.End
    };

    private static DailyTask ShallowCopyTask(DailyTask t) => new()
    {
        Id = t.Id, Task = t.Task, Priority = t.Priority, Done = t.Done, Description = t.Description
    };

    private static TodayAppointment ShallowCopyTodayAppt(TodayAppointment t) => new()
    {
        Id = t.Id, Time = t.Time, PatientId = t.PatientId,
        PatientName = t.PatientName, Reason = t.Reason,
        Status = t.Status, Room = t.Room
    };

    private static PatientAlert ShallowCopyAlert(PatientAlert a) => new()
    {
        Id = a.Id, Title = a.Title, Time = a.Time,
        Severity = a.Severity, PatientId = a.PatientId
    };

    private static PatientAnalytics DeepCopyAnalytics(PatientAnalytics a) => new()
    {
        PatientId = a.PatientId,
        RiskScore = a.RiskScore,
        VitalsHistory = a.VitalsHistory.Select(v => new VitalDataPoint
        {
            Date = v.Date, Systolic = v.Systolic, Diastolic = v.Diastolic,
            HeartRate = v.HeartRate, Spo2 = v.Spo2, Temperature = v.Temperature, Pulse = v.Pulse
        }).ToList(),
        LabResults = a.LabResults.Select(l => new LabChartResult
        {
            Name = l.Name, Value = l.Value, NormalMin = l.NormalMin, NormalMax = l.NormalMax,
            WarningMax = l.WarningMax, Unit = l.Unit
        }).ToList(),
        AlertsOverTime = a.AlertsOverTime.Select(ao => new AlertDataPoint
        {
            Day = ao.Day, Critical = ao.Critical, Warning = ao.Warning, Info = ao.Info
        }).ToList(),
        AlertsByType = a.AlertsByType.Select(at => new AlertCategory
        {
            Category = at.Category, Value = at.Value
        }).ToList()
    };
}

public class DailyTask
{
    public int    Id          { get; set; }
    public string Task        { get; set; } = "";
    public string Priority    { get; set; } = "Medium";
    public bool   Done        { get; set; }
    public string Description { get; set; } = "";
}

