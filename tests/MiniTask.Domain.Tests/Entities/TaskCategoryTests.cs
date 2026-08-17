using MiniTask.Domain.Entities;

namespace MiniTask.Domain.Tests.Entities;

public sealed class TaskCategoryTests
{
    [Fact]
    public void Constructor_WithValidName_ShouldCreateCategory()
    {
        var category = new TaskCategory("  Work  ");

        Assert.NotEqual(Guid.Empty, category.Id);
        Assert.Equal("Work", category.Name);
        Assert.NotEqual(default, category.CreatedAtUtc);
        Assert.Empty(category.Tasks);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Constructor_WithEmptyName_ShouldThrowArgumentException(
        string invalidName)
    {
        var exception = Assert.Throws<ArgumentException>(
            () => new TaskCategory(invalidName));

        Assert.Equal("name", exception.ParamName);
    }

    [Fact]
    public void Constructor_WithNameLongerThan80Characters_ShouldThrow()
    {
        var invalidName = new string('A', 81);

        Assert.Throws<ArgumentException>(
            () => new TaskCategory(invalidName));
    }

    [Fact]
    public void Rename_WithValidName_ShouldUpdateAndTrimName()
    {
        var category = new TaskCategory("Work");

        category.Rename("  Personal  ");

        Assert.Equal("Personal", category.Name);
    }
}