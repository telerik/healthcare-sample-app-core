namespace HealthcareApp.Models;

/// <summary>
/// Lightweight projection of PatientRecord used by the patients grid and
/// client-side caching (patientsData). Excludes heavy fields such as Notes,
/// Labs, Medications, Visits, Vitals, and AdmissionDetails so the Ajax
/// DataSource payload stays small.
/// </summary>
public class PatientSummary
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public int Age { get; set; }
    public string Gender { get; set; } = "";
    public string BloodType { get; set; } = "";
    public string Ward { get; set; } = "";
    public string Diagnosis { get; set; } = "";
    public string Status { get; set; } = "";
    public string Doctor { get; set; } = "";
    public string Phone { get; set; } = "";
    public string LastVisit { get; set; } = "";
    public string Avatar { get; set; } = "";
    public List<string> Allergies { get; set; } = [];
}

/// <summary>Alert review dialog: alert metadata + optional patient info.</summary>
public class AlertReviewViewModel
{
    public PatientAlert Alert { get; set; } = new();
    public PatientRecord? Patient { get; set; }
    public string SeverityLabel { get; set; } = "";
    public string SeverityCss { get; set; } = "";
    public string AlertType { get; set; } = "";
    public string AlertDescription { get; set; } = "";
}

/// <summary>Change-status dialog body.</summary>
public class ChangeStatusViewModel
{
    public string PatientId { get; set; } = "";
    public string PatientName { get; set; } = "";
    public string CurrentStatus { get; set; } = "";
}

/// <summary>Appointment review dialog body.</summary>
public class AppointmentDialogViewModel
{
    public string PatientName { get; set; } = "";
    public string Room { get; set; } = "";
    public string Reason { get; set; } = "";
    public DateTime Start { get; set; }
    public DateTime End { get; set; }
    public bool Expanded { get; set; }
    public PatientRecord? Patient { get; set; }
}

/// <summary>A single notification for the dropdown panel.</summary>
public class NotificationItem
{
    public int Id { get; set; }
    public bool Read { get; set; }
    public string Severity { get; set; } = "";
    public string Icon { get; set; } = "";
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public string Time { get; set; } = "";
    public string Action { get; set; } = "";
    public string? PatientId { get; set; }
}

/// <summary>Notifications panel: items + unread count.</summary>
public class NotificationsPanelViewModel
{
    public List<NotificationItem> Items { get; set; } = [];
    public int UnreadCount { get; set; }
}
