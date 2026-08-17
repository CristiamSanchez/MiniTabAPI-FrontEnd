namespace MiniTask.Application.Categories;

public interface ITaskCategoryService
{
    Task<TaskCategoryResponse> CreateAsync(
        CreateTaskCategoryRequest request,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<TaskCategoryResponse>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<TaskCategoryResponse?> GetByIdAsync(
    Guid id,
    CancellationToken cancellationToken = default);
    
    Task<TaskCategoryResponse?> UpdateAsync(
    Guid id,
    UpdateTaskCategoryRequest request,
    CancellationToken cancellationToken = default);
    
    Task<bool> DeleteAsync(
    Guid id,
    CancellationToken cancellationToken = default);
    
}