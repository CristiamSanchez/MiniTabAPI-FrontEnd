using MiniTask.Domain.Entities;

namespace MiniTask.Domain.Tests.Entities;

public sealed class TaskItemTests
{
    private static readonly Guid CategoryId = Guid.NewGuid();


    [Fact]
    public void ChangeCategory_WithValidId_ShouldChangeCategory()
    {
        var task = CreateTask();
        var newCategoryId = Guid.NewGuid();

        task.ChangeCategory(newCategoryId);

        Assert.Equal(newCategoryId, task.CategoryId);
    }

    [Fact]
    public void ChangeCategory_WithEmptyId_ShouldThrowArgumentException()
    {
        var task = CreateTask();

        Assert.Throws<ArgumentException>(
            () => task.ChangeCategory(Guid.Empty));
    }


    [Fact]
    public void Constructor_WithValidValues_ShouldCreateOpenTask()
    {
        var dueDate = DateTime.UtcNow.AddDays(3);

        var task = new TaskItem(
            "  Study EF Core  ",
            "  Review relationships  ",
            dueDate,
            CategoryId);

        Assert.NotEqual(Guid.Empty, task.Id);
        Assert.Equal("Study EF Core", task.Title);
        Assert.Equal("Review relationships", task.Description);
        Assert.Equal(dueDate, task.DueDateUtc);
        Assert.Equal(CategoryId, task.CategoryId);
        Assert.False(task.IsCompleted);
        Assert.Null(task.CompletedAtUtc);
        Assert.NotEqual(default, task.CreatedAtUtc);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Constructor_WithEmptyTitle_ShouldThrowArgumentException(
        string invalidTitle)
    {
        Assert.Throws<ArgumentException>(
            () => new TaskItem(
                invalidTitle,
                null,
                null,
                CategoryId));
    }

    [Fact]
    public void Constructor_WithEmptyCategoryId_ShouldThrowArgumentException()
    {
        Assert.Throws<ArgumentException>(
            () => new TaskItem(
                "Study",
                null,
                null,
                Guid.Empty));
    }

    [Fact]
    public void ChangeDescription_WithWhitespace_ShouldSetNull()
    {
        var task = CreateTask();

        task.ChangeDescription("   ");

        Assert.Null(task.Description);
    }

    [Fact]
    public void MarkAsCompleted_WhenOpen_ShouldCompleteTask()
    {
        var task = CreateTask();

        task.MarkAsCompleted();

        Assert.True(task.IsCompleted);
        Assert.NotNull(task.CompletedAtUtc);
    }

    [Fact]
    public void MarkAsCompleted_WhenAlreadyCompleted_ShouldThrow()
    {
        var task = CreateTask();
        task.MarkAsCompleted();

        Assert.Throws<InvalidOperationException>(
            task.MarkAsCompleted);
    }

    [Fact]
    public void Reopen_WhenCompleted_ShouldOpenTaskAndClearCompletionDate()
    {
        var task = CreateTask();
        task.MarkAsCompleted();

        task.Reopen();

        Assert.False(task.IsCompleted);
        Assert.Null(task.CompletedAtUtc);
    }

    [Fact]
    public void Reopen_WhenAlreadyOpen_ShouldThrow()
    {
        var task = CreateTask();

        Assert.Throws<InvalidOperationException>(task.Reopen);
    }

    private static TaskItem CreateTask()
    {
        return new TaskItem(
            "Study EF Core",
            null,
            null,
            CategoryId);
    }
}