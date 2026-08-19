using MiniTask.Application.Abstractions.Persistence;
using MiniTask.Domain.Entities;

namespace MiniTask.Application.Categories;

public sealed class TaskCategoryService(
    ITaskCategoryRepository repository)
    : ITaskCategoryService
{
    public async Task<TaskCategoryResponse> CreateAsync(
        CreateTaskCategoryRequest request,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var normalizedName = request.Name?.Trim() ?? string.Empty;

        var alreadyExists = await repository.ExistsByNameAsync(
            normalizedName,
            cancellationToken);

        if (alreadyExists)
        {
            throw new TaskCategoryAlreadyExistsException(normalizedName);
        }

        var category = new TaskCategory(normalizedName);

        await repository.AddAsync(category, cancellationToken);
        await repository.SaveChangesAsync(cancellationToken);

        return MapToResponse(category);
    }

    public async Task<IReadOnlyList<TaskCategoryResponse>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        var categories = await repository.GetAllAsync(cancellationToken);

        return categories
            .Select(MapToResponse)
            .ToList();
    }

        public async Task<TaskCategoryResponse?> UpdateAsync(
    Guid id,
    UpdateTaskCategoryRequest request,
    CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var category = await repository.GetByIdAsync(
            id,
            cancellationToken);

        if (category is null)
        {
            return null;
        }

        var normalizedName = request.Name?.Trim() ?? string.Empty;

        var nameChanged = !string.Equals(
            category.Name,
            normalizedName,
            StringComparison.OrdinalIgnoreCase);

        if (nameChanged)
        {
            var alreadyExists = await repository.ExistsByNameAsync(
                normalizedName,
                cancellationToken);

            if (alreadyExists)
            {
                throw new TaskCategoryAlreadyExistsException(
                    normalizedName);
            }
        }

        category.Rename(normalizedName);

        await repository.SaveChangesAsync(cancellationToken);

        return MapToResponse(category);
    }

    public async Task<TaskCategoryResponse?> GetByIdAsync(
            Guid id,
            CancellationToken cancellationToken = default)
        {
            var category = await repository.GetByIdAsync(
                id,
                cancellationToken);

            return category is null
                ? null
                : MapToResponse(category);
        } 
    private static TaskCategoryResponse MapToResponse(
        TaskCategory category)
    {
        return new TaskCategoryResponse(
            category.Id,
            category.Name,
            category.CreatedAtUtc);
    }

    public async Task<bool> DeleteAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var category = await repository.GetByIdAsync(
            id,
            cancellationToken);

        if (category is null)
        {
            return false;
        }

        var hasTasks = await repository.HasTasksAsync(
            id,
            cancellationToken);

        if (hasTasks)
        {
            throw new TaskCategoryInUseException(id);
        }

        repository.Remove(category);

        await repository.SaveChangesAsync(cancellationToken);

        return true;
    }

}