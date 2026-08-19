using MiniTask.Domain.Entities;

namespace MiniTask.Application.Abstractions.Persistence;

public interface ITaskCategoryRepository
{
    Task<bool> ExistsByNameAsync(
        string name,
        CancellationToken cancellationToken = default);

    Task<TaskCategory?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task AddAsync(
        TaskCategory category,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<TaskCategory>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task SaveChangesAsync(
        CancellationToken cancellationToken = default);

    Task<bool> HasTasksAsync(
    Guid categoryId,
    CancellationToken cancellationToken = default);
    void Remove(TaskCategory category);
}