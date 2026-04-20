using System.Collections.Concurrent;

namespace HealthcareApp.Models;

/// <summary>
/// Holds one isolated copy of the mutable data for a single browser session.
/// Created on first access and kept alive as long as the session is valid.
/// </summary>
public class UserSessionData
{
    public List<PatientRecord>       Patients          { get; set; } = [];
    public List<ScheduleAppointment> Appointments      { get; set; } = [];
    public List<DailyTask>           Tasks             { get; set; } = [];
    public List<TodayAppointment>    TodayAppointments { get; set; } = [];
    public List<PatientAlert>        Alerts            { get; set; } = [];
    public Dictionary<string, PatientAnalytics> Analytics { get; set; } = [];
    public DoctorProfile             Profile           { get; set; } = new();
}

public class DoctorProfile
{
    public string FullName { get; set; } = "Emily Carter";
    public string Email    { get; set; } = "drcarter@email.com";
    public string Phone    { get; set; } = "+(555) 776-90-84";
    public string Avatar   { get; set; } = "./content/profile.jpg";
}

/// <summary>
/// Singleton dictionary that maps session IDs to their per-user data copies.
/// Mirrors the IUserDataCache pattern from the Kendo UI demos service.
/// </summary>
public interface IUserDataCache
{
    UserSessionData GetOrCreate(string sessionId, Func<UserSessionData> factory);
}

public class UserDataCache : IUserDataCache
{
    private readonly ConcurrentDictionary<string, UserSessionData> _store = new();

    public UserSessionData GetOrCreate(string sessionId, Func<UserSessionData> factory)
        => _store.GetOrAdd(sessionId, _ => factory());
}
