namespace MiniTask.Application.Tasks;

public sealed class TaskCategoryNotFoundException(Guid categoryId)
    : Exception(
        $"Task category '{categoryId}' was not found.")
{
    public Guid CategoryId { get; } = categoryId;
}
