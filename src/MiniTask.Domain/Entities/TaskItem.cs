namespace MiniTask.Domain.Entities;

public sealed class TaskItem
{
    public Guid Id { get; private set; }

    public string Title { get; private set; } = string.Empty;

    public string? Description { get; private set; }

    public DateTime? DueDateUtc { get; private set; }

    public bool IsCompleted { get; private set; }

    public DateTime? CompletedAtUtc { get; private set; }

    public DateTime CreatedAtUtc { get; private set; }

    public Guid CategoryId { get; private set; }

    public TaskCategory Category { get; private set; } = null!;

    private TaskItem()
    {
    }

    public TaskItem(
        string title,
        string? description,
        DateTime? dueDateUtc,
        Guid categoryId)
    {
        if (categoryId == Guid.Empty)
        {
            throw new ArgumentException(
                "A valid category is required.",
                nameof(categoryId));
        }

        Id = Guid.NewGuid();
        CategoryId = categoryId;
        CreatedAtUtc = DateTime.UtcNow;

        ChangeTitle(title);
        ChangeDescription(description);
        ChangeDueDate(dueDateUtc);
    }

    public void ChangeTitle(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
        {
            throw new ArgumentException(
                "Task title is required.",
                nameof(title));
        }

        var normalizedTitle = title.Trim();

        if (normalizedTitle.Length > 150)
        {
            throw new ArgumentException(
                "Task title cannot exceed 150 characters.",
                nameof(title));
        }

        Title = normalizedTitle;
    }

    public void ChangeDescription(string? description)
    {
        if (string.IsNullOrWhiteSpace(description))
        {
            Description = null;
            return;
        }

        var normalizedDescription = description.Trim();

        if (normalizedDescription.Length > 1000)
        {
            throw new ArgumentException(
                "Task description cannot exceed 1000 characters.",
                nameof(description));
        }

        Description = normalizedDescription;
    }

    public void ChangeDueDate(DateTime? dueDateUtc)
    {
        DueDateUtc = dueDateUtc;
    }

    public void ChangeCategory(Guid categoryId)
    {
        if (categoryId == Guid.Empty)
        {
            throw new ArgumentException(
                "A valid category is required.",
                nameof(categoryId));
        }

        CategoryId = categoryId;
    }
    public void MarkAsCompleted()
    {
        if (IsCompleted)
        {
            throw new InvalidOperationException(
                "The task is already completed.");
        }

        IsCompleted = true;
        CompletedAtUtc = DateTime.UtcNow;
    }

    public void Reopen()
    {
        if (!IsCompleted)
        {
            throw new InvalidOperationException(
                "The task is already open.");
        }

        IsCompleted = false;
        CompletedAtUtc = null;
    }
}