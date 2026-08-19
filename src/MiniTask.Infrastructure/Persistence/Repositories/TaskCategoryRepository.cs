using Microsoft.EntityFrameworkCore;
using MiniTask.Application.Abstractions.Persistence;
using MiniTask.Domain.Entities;

namespace MiniTask.Infrastructure.Persistence.Repositories;

public sealed class TaskCategoryRepository(
    MiniTaskDbContext dbContext)
    : ITaskCategoryRepository
{
    public Task<bool> ExistsByNameAsync(
        string name,
        CancellationToken cancellationToken = default)
    {
        return dbContext.TaskCategories.AnyAsync(
            category => category.Name.ToLower() == name.ToLower(),
            cancellationToken);
    }

    public async Task AddAsync(
        TaskCategory category,
        CancellationToken cancellationToken = default)
    {
        await dbContext.TaskCategories.AddAsync(
            category,
            cancellationToken);
    }

    public async Task<IReadOnlyList<TaskCategory>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        return await dbContext.TaskCategories
            .AsNoTracking()
            .OrderBy(category => category.Name)
            .ToListAsync(cancellationToken);
    }

   public Task<TaskCategory?> GetByIdAsync(
    Guid id,
    CancellationToken cancellationToken = default)
    {
        return dbContext.TaskCategories.FirstOrDefaultAsync(
            category => category.Id == id,
            cancellationToken);
    }

    public Task<bool> HasTasksAsync(
        Guid categoryId,
        CancellationToken cancellationToken = default)
    {
        return dbContext.TaskItems
            .AsNoTracking()
            .AnyAsync(
                task => task.CategoryId == categoryId,
                cancellationToken);
    }

    public void Remove(TaskCategory category)
    {
        dbContext.TaskCategories.Remove(category);
    }
    
    public async Task SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        await dbContext.SaveChangesAsync(cancellationToken);
    }

}