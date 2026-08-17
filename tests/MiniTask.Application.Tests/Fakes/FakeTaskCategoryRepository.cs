using MiniTask.Application.Abstractions.Persistence;
using MiniTask.Domain.Entities;

namespace MiniTask.Application.Tests.Fakes;

internal sealed class FakeTaskCategoryRepository
    : ITaskCategoryRepository
{
    private readonly List<TaskCategory> _categories = [];

    public int AddCallCount { get; private set; }

    public int SaveChangesCallCount { get; private set; }

    public Task<bool> ExistsByNameAsync(
        string name,
        CancellationToken cancellationToken = default)
    {
        var exists = _categories.Any(category =>
            string.Equals(
                category.Name,
                name,
                StringComparison.OrdinalIgnoreCase));

        return Task.FromResult(exists);
    }

    public Task AddAsync(
        TaskCategory category,
        CancellationToken cancellationToken = default)
    {
        AddCallCount++;
        _categories.Add(category);

        return Task.CompletedTask;
    }

    public Task<IReadOnlyList<TaskCategory>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        IReadOnlyList<TaskCategory> result = _categories.ToList();

        return Task.FromResult(result);
    }

    public Task SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        SaveChangesCallCount++;

        return Task.CompletedTask;
    }

    public Task<TaskCategory?> GetByIdAsync(
    Guid id,
    CancellationToken cancellationToken = default)
    {
        var category = _categories.FirstOrDefault(
            category => category.Id == id);

        return Task.FromResult(category);
    }

    public void Remove(TaskCategory category)
    {
        _categories.Remove(category);
    }

}