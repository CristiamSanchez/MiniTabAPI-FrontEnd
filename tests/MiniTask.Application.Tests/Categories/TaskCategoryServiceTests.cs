using MiniTask.Application.Categories;
using MiniTask.Application.Tests.Fakes;

namespace MiniTask.Application.Tests.Categories;

public sealed class TaskCategoryServiceTests
{
    [Fact]
    public async Task CreateAsync_WithValidRequest_ShouldCreateCategory()
    {
        var repository = new FakeTaskCategoryRepository();
        var service = new TaskCategoryService(repository);
        var request = new CreateTaskCategoryRequest("  Work  ");

        var response = await service.CreateAsync(request);

        Assert.NotEqual(Guid.Empty, response.Id);
        Assert.Equal("Work", response.Name);
        Assert.NotEqual(default, response.CreatedAtUtc);
        Assert.Equal(1, repository.AddCallCount);
        Assert.Equal(1, repository.SaveChangesCallCount);
    }

    [Fact]
    public async Task CreateAsync_WithDuplicateName_ShouldThrow()
    {
        var repository = new FakeTaskCategoryRepository();
        var service = new TaskCategoryService(repository);

        await service.CreateAsync(
            new CreateTaskCategoryRequest("Work"));

        var exception =
            await Assert.ThrowsAsync<TaskCategoryAlreadyExistsException>(
                () => service.CreateAsync(
                    new CreateTaskCategoryRequest("work")));

        Assert.Contains("work", exception.Message);
        Assert.Equal(1, repository.AddCallCount);
        Assert.Equal(1, repository.SaveChangesCallCount);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public async Task CreateAsync_WithEmptyName_ShouldThrow(
        string invalidName)
    {
        var repository = new FakeTaskCategoryRepository();
        var service = new TaskCategoryService(repository);

        await Assert.ThrowsAsync<ArgumentException>(
            () => service.CreateAsync(
                new CreateTaskCategoryRequest(invalidName)));

        Assert.Equal(0, repository.AddCallCount);
        Assert.Equal(0, repository.SaveChangesCallCount);
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnCreatedCategories()
    {
        var repository = new FakeTaskCategoryRepository();
        var service = new TaskCategoryService(repository);

        await service.CreateAsync(
            new CreateTaskCategoryRequest("Work"));

        await service.CreateAsync(
            new CreateTaskCategoryRequest("Personal"));

        var result = await service.GetAllAsync();

        Assert.Equal(2, result.Count);
        Assert.Contains(result, category => category.Name == "Work");
        Assert.Contains(result, category => category.Name == "Personal");
    }

    [Fact]
    public async Task GetAllAsync_WhenRepositoryIsEmpty_ShouldReturnEmptyList()
    {
        var repository = new FakeTaskCategoryRepository();
        var service = new TaskCategoryService(repository);

        var result = await service.GetAllAsync();

        Assert.Empty(result);
    }

    [Fact]
    public async Task DeleteAsync_WhenCategoryDoesNotExist_ShouldReturnFalse()
    {
        var repository = new FakeTaskCategoryRepository();
        var service = new TaskCategoryService(repository);

        var deleted = await service.DeleteAsync(Guid.NewGuid());

        Assert.False(deleted);
        Assert.Equal(0, repository.RemoveCallCount);
        Assert.Equal(0, repository.SaveChangesCallCount);
    }

    [Fact]
    public async Task DeleteAsync_WhenCategoryHasTasks_ShouldThrow()
    {
        var repository = new FakeTaskCategoryRepository();
        var service = new TaskCategoryService(repository);

        var category = await service.CreateAsync(
            new CreateTaskCategoryRequest("Work"));

        repository.MarkAsInUse(category.Id);

        var exception =
            await Assert.ThrowsAsync<TaskCategoryInUseException>(
                () => service.DeleteAsync(category.Id));

        Assert.Contains("contains tasks", exception.Message);
        Assert.Equal(0, repository.RemoveCallCount);
        Assert.Equal(1, repository.SaveChangesCallCount);
    }

    [Fact]
    public async Task DeleteAsync_WhenCategoryHasNoTasks_ShouldDelete()
    {
        var repository = new FakeTaskCategoryRepository();
        var service = new TaskCategoryService(repository);

        var category = await service.CreateAsync(
            new CreateTaskCategoryRequest("Temporary"));

        var deleted = await service.DeleteAsync(category.Id);

        Assert.True(deleted);
        Assert.Equal(1, repository.RemoveCallCount);
        Assert.Equal(2, repository.SaveChangesCallCount);

        var result = await service.GetByIdAsync(category.Id);

        Assert.Null(result);
    }


}