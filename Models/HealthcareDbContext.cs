using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace HealthcareApp.Models;

public class HealthcareDbContext(DbContextOptions<HealthcareDbContext> options) : DbContext(options)
{
    public DbSet<PatientRecord>       Patients              => Set<PatientRecord>();
    public DbSet<ScheduleAppointment> ScheduleAppointments  => Set<ScheduleAppointment>();
    public DbSet<DailyTask>           DailyTasks            => Set<DailyTask>();
    public DbSet<TodayAppointment>    TodayAppointments     => Set<TodayAppointment>();
    public DbSet<PatientAlert>        PatientAlerts         => Set<PatientAlert>();
    public DbSet<PatientAnalytics>    PatientAnalytics      => Set<PatientAnalytics>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        // ── Value converters shared across JSON list properties ─────────
        var jsonStringListConverter = new ValueConverter<List<string>, string>(
            v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
            v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>());

        var jsonStringListComparer = new ValueComparer<List<string>>(
            (a, b) => JsonSerializer.Serialize(a, (JsonSerializerOptions?)null) ==
                      JsonSerializer.Serialize(b, (JsonSerializerOptions?)null),
            v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null).GetHashCode(),
            v => new List<string>(v));

        // ── Patients ────────────────────────────────────────────────────
        mb.Entity<PatientRecord>(e =>
        {
            e.ToTable("Patients");
            e.HasKey(p => p.Id);

            e.Property(p => p.Allergies)
             .HasColumnType("TEXT")
             .HasConversion(jsonStringListConverter, jsonStringListComparer);

            // Owned single objects stored as JSON columns
            e.OwnsOne(p => p.Vitals,          v => v.ToJson("Vitals"));
            e.OwnsOne(p => p.AdmissionDetails, a => a.ToJson("AdmissionDetails"));

            // Owned collections stored as JSON arrays
            e.OwnsMany(p => p.Labs,        l => l.ToJson("Labs"));
            e.OwnsMany(p => p.Medications, m => m.ToJson("Medications"));
            e.OwnsMany(p => p.Visits,      v => v.ToJson("Visits"));
        });

        // ── ScheduleAppointments ────────────────────────────────────────
        mb.Entity<ScheduleAppointment>(e =>
        {
            e.ToTable("ScheduleAppointments");
            e.HasKey(a => a.Id);
            e.Property(a => a.Id).ValueGeneratedOnAdd();
            // ISchedulerEvent properties not stored in DB
            e.Ignore(a => a.Description);
            e.Ignore(a => a.IsAllDay);
            e.Ignore(a => a.StartTimezone);
            e.Ignore(a => a.EndTimezone);
            e.Ignore(a => a.RecurrenceRule);
            e.Ignore(a => a.RecurrenceException);
        });

        // ── DailyTasks ──────────────────────────────────────────────────
        mb.Entity<DailyTask>(e =>
        {
            e.ToTable("DailyTasks");
            e.HasKey(t => t.Id);
            e.Property(t => t.Id).ValueGeneratedOnAdd();
        });

        // ── TodayAppointments ───────────────────────────────────────────
        mb.Entity<TodayAppointment>(e =>
        {
            e.ToTable("TodayAppointments");
            e.HasKey(t => t.Id);
            e.Property(t => t.Id).ValueGeneratedOnAdd();
        });

        // ── PatientAlerts ───────────────────────────────────────────────
        mb.Entity<PatientAlert>(e =>
        {
            e.ToTable("PatientAlerts");
            e.HasKey(a => a.Id);
            e.Property(a => a.Id).ValueGeneratedOnAdd();
        });

        // ── PatientAnalytics ────────────────────────────────────────────
        mb.Entity<PatientAnalytics>(e =>
        {
            e.ToTable("PatientAnalytics");
            e.HasKey(a => a.PatientId);
            e.OwnsMany(a => a.VitalsHistory,  vh => vh.ToJson("VitalsHistory"));
            e.OwnsMany(a => a.LabResults,     lr => lr.ToJson("LabResults"));
            e.OwnsMany(a => a.AlertsOverTime, ao => ao.ToJson("AlertsOverTime"));
            e.OwnsMany(a => a.AlertsByType,   at => at.ToJson("AlertsByType"));
        });
    }
}
