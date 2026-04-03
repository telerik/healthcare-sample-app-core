namespace HealthcareApp.Models;

public class VitalDataPoint
{
    public string Date { get; set; } = "";
    public int Systolic { get; set; }
    public int Diastolic { get; set; }
    public int HeartRate { get; set; }
    public int Spo2 { get; set; }
    public double Temperature { get; set; }
    public int Pulse { get; set; }
}

public class LabChartResult
{
    public string Name { get; set; } = "";
    public double Value { get; set; }
    public double NormalMin { get; set; }
    public double NormalMax { get; set; }
    public double WarningMax { get; set; }
    public string Unit { get; set; } = "";
}

public class AlertDataPoint
{
    public string Day { get; set; } = "";
    public int Critical { get; set; }
    public int Warning { get; set; }
    public int Info { get; set; }
}

public class AlertCategory
{
    public string Category { get; set; } = "";
    public int Value { get; set; }
}

public class PatientAnalytics
{
    public string PatientId { get; set; } = "";
    public int RiskScore { get; set; }
    public List<VitalDataPoint> VitalsHistory { get; set; } = [];
    public List<LabChartResult> LabResults { get; set; } = [];
    public List<AlertDataPoint> AlertsOverTime { get; set; } = [];
    public List<AlertCategory> AlertsByType { get; set; } = [];
}
