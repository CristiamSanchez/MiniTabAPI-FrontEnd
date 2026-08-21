using MiniTask.Application;
using MiniTask.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

const string FrontendCorsPolicy = "Frontend";

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCorsPolicy, policy =>
    {
        policy
            .WithOrigins( "http://localhost:5173",   "http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors(FrontendCorsPolicy);

app.MapControllers();

app.MapGet("/", () => Results.Ok(new
{
    name = "MiniTask API",
    status = "Running",
    openApi = "/openapi/v1.json",
    categories = "/api/categories",
    tasks = "/api/tasks"
}));

app.Run();