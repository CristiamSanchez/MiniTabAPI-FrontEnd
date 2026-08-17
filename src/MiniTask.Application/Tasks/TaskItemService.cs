using MiniTask.Application.Abstractions.Persistence;
using MiniTask.Domain.Entities;

namespace MiniTask.Application.Tasks;

public sealed class TaskItemService(
    ITaskItemRepository taskItemRepository,
    ITaskCategoryRepository taskCategoryRepository)
    : ITaskItemService
{
    public async Task<TaskItemResponse> CreateAsync(
        CreateTaskItemRequest request,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var category = await taskCategoryRepository.GetByIdAsync(
            request.CategoryId,
            cancellationToken);

        if (category is null)
        {
            throw new TaskCategoryNotFoundException(
                request.CategoryId);
        }

        var taskItem = new TaskItem(
            request.Title,
            request.Description,
            request.DueDateUtc,
            request.CategoryId);

        await taskItemRepository.AddAsync(
            taskItem,
            cancellationToken);

        await taskItemRepository.SaveChangesAsync(
            cancellationToken);

        return MapToResponse(taskItem, category.Name);
    }

    public async Task<TaskItemResponse?> GetByIdAsync(
    Guid id,
    CancellationToken cancellationToken = default)
    {
        var taskItem = await taskItemRepository.GetByIdAsync(
            id,
            cancellationToken);

        if (taskItem is null)
        {
            return null;
        }

        return MapToResponse(
            taskItem,
            taskItem.Category.Name);
    }
    public async Task<IReadOnlyList<TaskItemResponse>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        var taskItems = await taskItemRepository.GetAllAsync(
            cancellationToken);

        return taskItems
            .Select(taskItem => MapToResponse(
                taskItem,
                taskItem.Category.Name))
            .ToList();
    }

    private static TaskItemResponse MapToResponse(
        TaskItem taskItem,
        string categoryName)
    {
        return new TaskItemResponse(
            taskItem.Id,
            taskItem.Title,
            taskItem.Description,
            taskItem.DueDateUtc,
            taskItem.IsCompleted,
            taskItem.CompletedAtUtc,
            taskItem.CreatedAtUtc,
            taskItem.CategoryId,
            categoryName);
    }

    public async Task<TaskItemResponse?> UpdateAsync(
    Guid id,
    UpdateTaskItemRequest request,
    CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var taskItem = await taskItemRepository.GetByIdForUpdateAsync(
            id,
            cancellationToken);

        if (taskItem is null)
        {
            return null;
        }

        var category = await taskCategoryRepository.GetByIdAsync(
            request.CategoryId,
            cancellationToken);

        if (category is null)
        {
            throw new TaskCategoryNotFoundException(
                request.CategoryId);
        }

        taskItem.ChangeTitle(request.Title);
        taskItem.ChangeDescription(request.Description);
        taskItem.ChangeDueDate(request.DueDateUtc);
        taskItem.ChangeCategory(request.CategoryId);

        await taskItemRepository.SaveChangesAsync(
            cancellationToken);

        return MapToResponse(
            taskItem,
            category.Name);
    }

    public async Task<TaskItemResponse?> CompleteAsync(
    Guid id,
    CancellationToken cancellationToken = default)
    {
        var taskItem = await taskItemRepository.GetByIdForUpdateAsync(
            id,
            cancellationToken);

        if (taskItem is null)
        {
            return null;
        }

        taskItem.MarkAsCompleted();

        await taskItemRepository.SaveChangesAsync(
            cancellationToken);

        return MapToResponse(
            taskItem,
            taskItem.Category.Name);
    }

    public async Task<TaskItemResponse?> ReopenAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var taskItem = await taskItemRepository.GetByIdForUpdateAsync(
            id,
            cancellationToken);

        if (taskItem is null)
        {
            return null;
        }

        taskItem.Reopen();

        await taskItemRepository.SaveChangesAsync(
            cancellationToken);

        return MapToResponse(
            taskItem,
            taskItem.Category.Name);
    }

    public async Task<bool> DeleteAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var taskItem = await taskItemRepository.GetByIdForUpdateAsync(
            id,
            cancellationToken);

        if (taskItem is null)
        {
            return false;
        }

        taskItemRepository.Remove(taskItem);

        await taskItemRepository.SaveChangesAsync(
            cancellationToken);

        return true;
    }

}