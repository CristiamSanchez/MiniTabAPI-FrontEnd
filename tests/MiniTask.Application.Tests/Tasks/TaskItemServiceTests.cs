using MiniTask.Application.Tasks;
using MiniTask.Application.Tests.Fakes;
using MiniTask.Domain.Entities;

namespace MiniTask.Application.Tests.Tasks;

public sealed class TaskItemServiceTests
{
    [Fact]
    public async Task CreateAsync_WithValidRequest_ShouldCreateTask()
    {
        var categoryRepository =
            new FakeTaskCategoryRepository();

        var taskItemRepository =
            new FakeTaskItemRepository();

        var category = new TaskCategory("Work");

        await categoryRepository.AddAsync(category);

        var service = new TaskItemService(
            taskItemRepository,
            categoryRepository);

        var dueDateUtc = DateTime.UtcNow.AddDays(3);

        var request = new CreateTaskItemRequest(
            "  Study React  ",
            "  Complete the components section  ",
            dueDateUtc,
            category.Id);

        var response = await service.CreateAsync(request);

        Assert.NotEqual(Guid.Empty, response.Id);
        Assert.Equal("Study React", response.Title);
        Assert.Equal(
            "Complete the components section",
            response.Description);
        Assert.Equal(dueDateUtc, response.DueDateUtc);
        Assert.False(response.IsCompleted);
        Assert.Null(response.CompletedAtUtc);
        Assert.NotEqual(default, response.CreatedAtUtc);
        Assert.Equal(category.Id, response.CategoryId);
        Assert.Equal("Work", response.CategoryName);

        Assert.Equal(1, taskItemRepository.AddCallCount);
        Assert.Equal(
            1,
            taskItemRepository.SaveChangesCallCount);

        Assert.Single(taskItemRepository.TaskItems);
    }

    [Fact]
    public async Task CreateAsync_WithUnknownCategory_ShouldThrow()
    {
        var categoryRepository =
            new FakeTaskCategoryRepository();

        var taskItemRepository =
            new FakeTaskItemRepository();

        var service = new TaskItemService(
            taskItemRepository,
            categoryRepository);

        var unknownCategoryId = Guid.NewGuid();

        var request = new CreateTaskItemRequest(
            "Study React",
            null,
            null,
            unknownCategoryId);

        var exception =
            await Assert.ThrowsAsync<
                TaskCategoryNotFoundException>(
                () => service.CreateAsync(request));

        Assert.Equal(
            unknownCategoryId,
            exception.CategoryId);

        Assert.Equal(0, taskItemRepository.AddCallCount);
        Assert.Equal(
            0,
            taskItemRepository.SaveChangesCallCount);

        Assert.Empty(taskItemRepository.TaskItems);
    }

    [Fact]
    public async Task GetAllAsync_WhenRepositoryIsEmpty_ShouldReturnEmptyList()
    {
        var categoryRepository =
            new FakeTaskCategoryRepository();

        var taskItemRepository =
            new FakeTaskItemRepository();

        var service = new TaskItemService(
            taskItemRepository,
            categoryRepository);

        var result = await service.GetAllAsync();

        Assert.Empty(result);
    }

    [Fact]
    public async Task GetByIdAsync_WithUnknownId_ShouldReturnNull()
    {
        var categoryRepository =
            new FakeTaskCategoryRepository();

        var taskItemRepository =
            new FakeTaskItemRepository();

        var service = new TaskItemService(
            taskItemRepository,
            categoryRepository);

        var result = await service.GetByIdAsync(
            Guid.NewGuid());

        Assert.Null(result);
    }
    
}