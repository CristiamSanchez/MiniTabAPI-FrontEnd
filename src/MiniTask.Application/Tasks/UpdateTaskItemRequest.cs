namespace MiniTask.Application.Tasks;

public sealed record UpdateTaskItemRequest(
    string Title,
    string? Description,
    DateTime? DueDateUtc,
    Guid CategoryId);