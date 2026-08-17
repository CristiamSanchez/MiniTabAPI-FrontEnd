namespace MiniTask.Application.Tasks;

public sealed record CreateTaskItemRequest(
    string Title,
    string? Description,
    DateTime? DueDateUtc,
    Guid CategoryId);