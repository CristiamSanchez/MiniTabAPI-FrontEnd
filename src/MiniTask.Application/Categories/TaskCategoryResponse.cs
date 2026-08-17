namespace MiniTask.Application.Categories;

public sealed record TaskCategoryResponse(
    Guid Id,
    string Name,
    DateTime CreatedAtUtc);