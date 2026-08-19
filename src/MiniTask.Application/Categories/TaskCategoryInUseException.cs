namespace MiniTask.Application.Categories;

public sealed class TaskCategoryInUseException(
    Guid categoryId)
    : InvalidOperationException(
        $"Task category '{categoryId}' cannot be deleted " +
        "because it contains tasks.");