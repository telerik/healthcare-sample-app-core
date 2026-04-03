using Kendo.Mvc.UI;

namespace HealthcareApp.Models;

public class ScheduleAppointment : ISchedulerEvent
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string PatientName { get; set; } = "";
    public string Reason { get; set; } = "";
    public string Room { get; set; } = "";
    public string EventType { get; set; } = "";
    public DateTime Start { get; set; }
    public DateTime End { get; set; }
    public string Description { get; set; } = "";
    public bool IsAllDay { get; set; }
    public string StartTimezone { get; set; } = "";
    public string EndTimezone { get; set; } = "";
    public string RecurrenceRule { get; set; } = "";
    public string RecurrenceException { get; set; } = "";
}

public class TodayAppointment
{
    public int Id { get; set; }
    public string Time { get; set; } = "";
    public string PatientId { get; set; } = "";
    public string PatientName { get; set; } = "";
    public string Reason { get; set; } = "";
    public string Status { get; set; } = "";
    public string Room { get; set; } = "";
}

public class PatientAlert
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Time { get; set; } = "";
    public string Severity { get; set; } = "";
    public string PatientId { get; set; } = "";
}

public class EventType
{
    public string Text { get; set; } = "";
    public string Value { get; set; } = "";
    public string Color { get; set; } = "";
}
