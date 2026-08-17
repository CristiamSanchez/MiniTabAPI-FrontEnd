using Microsoft.EntityFrameworkCore;
using MiniTask.Application.Abstractions.Persistence;
using MiniTask.Domain.Entities;

namespace MiniTask.Infrastructure.Persistence.Repositories;

public sealed class TaskItemRepository(
    MiniTaskDbContext dbContext)
    : ITaskItemRepository
{
    public async Task AddAsync(
        TaskItem taskItem,
        CancellationToken cancellationToken = default)
    {
        await dbContext.TaskItems.AddAsync(
            taskItem,
            cancellationToken);
    }

        public async Task<TaskItem?> GetByIdAsync(
    Guid id,
    CancellationToken cancellationToken = default)
    {
        return await dbContext.TaskItems
            .AsNoTracking()
            .Include(task => task.Category)
            .FirstOrDefaultAsync(
                task => task.Id == id,
                cancellationToken);
    }
    
    public async Task<TaskItem?> GetByIdForUpdateAsync(
    Guid id,
    CancellationToken cancellationToken = default)
    {
        return await dbContext.TaskItems
            .Include(task => task.Category)
            .FirstOrDefaultAsync(
                task => task.Id == id,
                cancellationToken);
    }

    public async Task<IReadOnlyList<TaskItem>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        return await dbContext.TaskItems
            .AsNoTracking()
            .Include(task => task.Category)
            .OrderBy(task => task.IsCompleted)
            .ThenBy(task => task.DueDateUtc)
            .ThenBy(task => task.Title)
            .ToListAsync(cancellationToken);
    }

    public void Remove(TaskItem taskItem)
    {
        dbContext.TaskItems.Remove(taskItem);
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        await dbContext.SaveChangesAsync(cancellationToken);
    }


}