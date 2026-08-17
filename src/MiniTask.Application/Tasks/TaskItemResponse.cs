namespace MiniTask.Application.Tasks;

public sealed record TaskItemResponse(
    Guid Id,
    string Title,
    string? Description,
    DateTime? DueDateUtc,
    bool IsCompleted,
    DateTime? CompletedAtUtc,
    DateTime CreatedAtUtc,
    Guid CategoryId,
    string CategoryName);