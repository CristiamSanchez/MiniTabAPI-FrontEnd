namespace MiniTask.Application.Tasks;

public interface ITaskItemService
{
    Task<TaskItemResponse> CreateAsync(
        CreateTaskItemRequest request,
        CancellationToken cancellationToken = default);

    Task<TaskItemResponse?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<TaskItemResponse>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<TaskItemResponse?> UpdateAsync(
    Guid id,
    UpdateTaskItemRequest request,
    CancellationToken cancellationToken = default);
    
    Task<TaskItemResponse?> CompleteAsync(
    Guid id,
    CancellationToken cancellationToken = default);

    Task<TaskItemResponse?> ReopenAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<bool> DeleteAsync(
        Guid id,
        CancellationToken cancellationToken = default);
        
}