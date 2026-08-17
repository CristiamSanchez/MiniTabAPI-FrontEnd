namespace MiniTask.Application.Categories;

public sealed class TaskCategoryAlreadyExistsException(string name)
    : Exception($"A task category named '{name}' already exists.")
{
}
