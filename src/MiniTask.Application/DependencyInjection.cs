using Microsoft.Extensions.DependencyInjection;
using MiniTask.Application.Categories;
using MiniTask.Application.Tasks;

namespace MiniTask.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(
        this IServiceCollection services)
    {
        services.AddScoped<
            ITaskCategoryService,
            TaskCategoryService>();
            
        services.AddScoped<ITaskItemService, TaskItemService>();

        return services;
    }
} 