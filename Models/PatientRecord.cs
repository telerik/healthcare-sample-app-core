using System.ComponentModel.DataAnnotations.Schema;

namespace HealthcareApp.Models;

public class PatientVitals
{
    public string Bp { get; set; } = "";
    public int Systolic { get; set; }
    public int Diastolic { get; set; }
    public int Hr { get; set; }
    public double Temp { get; set; }
    public int Spo2 { get; set; }
    public int Weight { get; set; }
    public int Rr { get; set; }
}

public class LabResult
{
    public string Test { get; set; } = "";
    public string Result { get; set; } = "";
    public string Flag { get; set; } = "Normal";
    public string Date { get; set; } = "";
}

public class EnrichedLabRow
{
    public string Test { get; set; } = "";
    public string Result { get; set; } = "";
    public string Reference { get; set; } = "";
    public string Status { get; set; } = "";
    public string Note { get; set; } = "";
}

public class PatientMedication
{
    public string Drug { get; set; } = "";
    public string Dose { get; set; } = "";
    public string Frequency { get; set; } = "";
    public string Duration { get; set; } = "";
}

public class PatientVisit
{
    public string Date { get; set; } = "";
    public string Reason { get; set; } = "";
}

public class AdmissionInfo
{
    public string Department { get; set; } = "";
    public string WardUnit { get; set; } = "";
    public int Room { get; set; }
    public string AdmissionDate { get; set; } = "";
    public string AssignedNurse { get; set; } = "";
}

public class PatientRecord
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
    [NotMapped]
    public string Avatar { get; set; } = "";
    public List<string> Allergies { get; set; } = [];
    public PatientVitals Vitals { get; set; } = new();
    public List<LabResult> Labs { get; set; } = [];
    public List<PatientMedication> Medications { get; set; } = [];
    public List<PatientVisit> Visits { get; set; } = [];
    public string Notes { get; set; } = "";
    public AdmissionInfo AdmissionDetails { get; set; } = new();
    public int RiskScore { get; set; }
}
