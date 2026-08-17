using MiniTask.Domain.Entities;

namespace MiniTask.Application.Abstractions.Persistence;

public interface ITaskItemRepository
{
    Task AddAsync(
        TaskItem taskItem,
        CancellationToken cancellationToken = default);

    Task<TaskItem?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<TaskItem?> GetByIdForUpdateAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<TaskItem>> GetAllAsync(
        CancellationToken cancellationToken = default);

    void Remove(TaskItem taskItem);

    Task SaveChangesAsync(
        CancellationToken cancellationToken = default);
}