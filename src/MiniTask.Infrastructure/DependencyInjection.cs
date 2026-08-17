using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MiniTask.Infrastructure.Persistence;
using MiniTask.Application.Abstractions.Persistence;
using MiniTask.Infrastructure.Persistence.Repositories;
 
namespace MiniTask.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("Database")
            ?? throw new InvalidOperationException(
                "Connection string 'Database' was not found.");

        services.AddDbContext<MiniTaskDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddScoped<ITaskCategoryRepository,  TaskCategoryRepository>();

        services.AddScoped<ITaskItemRepository, TaskItemRepository>();
        
        return services;
    }
}