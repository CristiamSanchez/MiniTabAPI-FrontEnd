namespace MiniTask.Domain.Entities;

public sealed class TaskCategory
{
    private readonly List<TaskItem> _tasks = [];

    public Guid Id { get; private set; }

    public string Name { get; private set; } = string.Empty;

    public DateTime CreatedAtUtc { get; private set; }

    public IReadOnlyCollection<TaskItem> Tasks => _tasks.AsReadOnly();

    private TaskCategory()
    {
    }

    public TaskCategory(string name)
    {
        Rename(name);

        Id = Guid.NewGuid();
        CreatedAtUtc = DateTime.UtcNow;
    }

    public void Rename(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException(
                "Category name is required.",
                nameof(name));
        }

        var normalizedName = name.Trim();

        if (normalizedName.Length > 80)
        {
            throw new ArgumentException(
                "Category name cannot exceed 80 characters.",
                nameof(name));
        }

        Name = normalizedName;
    }
}