using MiniTask.Application.Abstractions.Persistence;
using MiniTask.Domain.Entities;

namespace MiniTask.Application.Tests.Fakes;

internal sealed class FakeTaskItemRepository
    : ITaskItemRepository
{
    private readonly List<TaskItem> _taskItems = [];

    public int AddCallCount { get; private set; }

    public int SaveChangesCallCount { get; private set; }

    public int RemoveCallCount { get; private set; }

    public IReadOnlyList<TaskItem> TaskItems =>
        _taskItems.AsReadOnly();

    public Task AddAsync(
        TaskItem taskItem,
        CancellationToken cancellationToken = default)
    {
        AddCallCount++;
        _taskItems.Add(taskItem);

        return Task.CompletedTask;
    }

    public void Remove(TaskItem taskItem)
    {
        RemoveCallCount++;
        _taskItems.Remove(taskItem);
    }

    public Task<IReadOnlyList<TaskItem>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        IReadOnlyList<TaskItem> result = _taskItems.ToList();

        return Task.FromResult(result);
    }

    public Task SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        SaveChangesCallCount++;

        return Task.CompletedTask;
    }
    public Task<TaskItem?> GetByIdAsync(
    Guid id,
    CancellationToken cancellationToken = default)
    {
        var taskItem = _taskItems.FirstOrDefault(
            taskItem => taskItem.Id == id);

        return Task.FromResult(taskItem);
    }
    public Task<TaskItem?> GetByIdForUpdateAsync(
    Guid id,
    CancellationToken cancellationToken = default)
    {
        var taskItem = _taskItems.FirstOrDefault(
            taskItem => taskItem.Id == id);

        return Task.FromResult(taskItem);
    }

    
}