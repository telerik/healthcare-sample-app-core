using HealthcareApp.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews()
            .AddJsonOptions(options =>
                options.JsonSerializerOptions.PropertyNamingPolicy = null);

builder.Services.AddRouting(options => options.LowercaseUrls = true);

// Add Kendo UI services for Telerik UI for ASP.NET Core
builder.Services.AddKendo(x =>
{
    x.DeferToScriptFiles = false;
});

// SQLite database via EF Core — used read-only after initial seed
var dbPath = Path.Combine(builder.Environment.ContentRootPath, "healthcare.db");
builder.Services.AddDbContext<HealthcareDbContext>(o =>
    o.UseSqlite($"Data Source={dbPath}"));

// ── Per-user isolation (mirrors Kendo demos IUserDataCache pattern) ───────
//
//  HealthcareSeedStore  (singleton) — master read-only data loaded from SQLite
//  IUserDataCache       (singleton) — session-ID → UserSessionData dictionary
//  IHttpContextAccessor (singleton) — lets scoped services read the session ID
//  HealthcareDataStore  (scoped)    — per-request; deep-copies seed into the
//                                     caller's session on first access
// ─────────────────────────────────────────────────────────────────────────

builder.Services.AddSingleton<HealthcareSeedStore>(sp =>
{
    using var scope = sp.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<HealthcareDbContext>();
    HealthcareDbSeeder.Seed(db);          // no-op if DB already has data
    return new HealthcareSeedStore(db);   // loads master lists into the singleton
});

builder.Services.AddSingleton<IUserDataCache, UserDataCache>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<HealthcareDataStore>();

// ASP.NET session (in-process, cookie-based)
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(o =>
{
    o.IdleTimeout      = TimeSpan.FromHours(2);
    o.Cookie.HttpOnly  = true;
    o.Cookie.IsEssential = true;
});

var app = builder.Build();

app.UsePathBase("/aspnet-core-healthcare");

// Eagerly warm up the seed singleton so the first request is never slow
_ = app.Services.GetRequiredService<HealthcareSeedStore>();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();

// Serve patient images with a 30-day immutable cache so repeat page loads
// require zero network requests for these files.
app.UseStaticFiles(new StaticFileOptions
{
    RequestPath  = "/content/patient-images",
    FileProvider = new PhysicalFileProvider(
        Path.Combine(app.Environment.WebRootPath, "content", "patient-images")),
    OnPrepareResponse = ctx =>
    {
        ctx.Context.Response.Headers.CacheControl = "public, max-age=2592000, immutable";
    }
});

app.UsePathBase("/aspnet-core/healthcare/");

app.UseRouting();
app.UseSession();           // must be before MapControllerRoute
app.UseAuthorization();

app.MapStaticAssets();

app.MapControllers();   // attribute-routed API controllers ([ApiController])

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();

app.Run();


