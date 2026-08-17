using Microsoft.AspNetCore.Mvc;
using MiniTask.Application.Tasks;

namespace MiniTask.API.Controllers;

[ApiController]
[Route("api/tasks")]
public sealed class TasksController(
    ITaskItemService service)
    : ControllerBase
{
    [HttpPost]
    [ProducesResponseType<TaskItemResponse>(
        StatusCodes.Status201Created)]
    [ProducesResponseType<ProblemDetails>(
        StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(
        StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TaskItemResponse>> Create(
        CreateTaskItemRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var taskItem = await service.CreateAsync(
                request,
                cancellationToken);

            return Created(
                $"/api/tasks/{taskItem.Id}",
                taskItem);
        }
        catch (TaskCategoryNotFoundException exception)
        {
            return NotFound(new ProblemDetails
            {
                Title = "Task category not found",
                Detail = exception.Message,
                Status = StatusCodes.Status404NotFound
            });
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Invalid task",
                Detail = exception.Message,
                Status = StatusCodes.Status400BadRequest
            });
        }
    }

    [HttpGet]
    [ProducesResponseType<IReadOnlyList<TaskItemResponse>>(
        StatusCodes.Status200OK)]
    public async Task<ActionResult<
        IReadOnlyList<TaskItemResponse>>> GetAll(
        CancellationToken cancellationToken)
    {
        var taskItems = await service.GetAllAsync(
            cancellationToken);

        return Ok(taskItems);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType<TaskItemResponse>(
        StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(
        StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TaskItemResponse>> GetById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var taskItem = await service.GetByIdAsync(
            id,
            cancellationToken);

        if (taskItem is null)
        {
            return NotFound(new ProblemDetails
            {
                Title = "Task not found",
                Detail = $"Task '{id}' was not found.",
                Status = StatusCodes.Status404NotFound
            });
        }

        return Ok(taskItem);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType<TaskItemResponse>(
        StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(
        StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(
        StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TaskItemResponse>> Update(
        Guid id,
        UpdateTaskItemRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var taskItem = await service.UpdateAsync(
                id,
                request,
                cancellationToken);

            if (taskItem is null)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Task not found",
                    Detail = $"Task '{id}' was not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            return Ok(taskItem);
        }
        catch (TaskCategoryNotFoundException exception)
        {
            return NotFound(new ProblemDetails
            {
                Title = "Task category not found",
                Detail = exception.Message,
                Status = StatusCodes.Status404NotFound
            });
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Invalid task",
                Detail = exception.Message,
                Status = StatusCodes.Status400BadRequest
            });
        }
    }

    [HttpPatch("{id:guid}/complete")]
    [ProducesResponseType<TaskItemResponse>(
        StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(
        StatusCodes.Status404NotFound)]
    [ProducesResponseType<ProblemDetails>(
        StatusCodes.Status409Conflict)]
    public async Task<ActionResult<TaskItemResponse>> Complete(
        Guid id,
        CancellationToken cancellationToken)
    {
        try
        {
            var taskItem = await service.CompleteAsync(
                id,
                cancellationToken);

            if (taskItem is null)
            {
                return TaskNotFound(id);
            }

            return Ok(taskItem);
        }
        catch (InvalidOperationException exception)
        {
            return Conflict(new ProblemDetails
            {
                Title = "Invalid task state",
                Detail = exception.Message,
                Status = StatusCodes.Status409Conflict
            });
        }
    }

    [HttpPatch("{id:guid}/reopen")]
    [ProducesResponseType<TaskItemResponse>(
        StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(
        StatusCodes.Status404NotFound)]
    [ProducesResponseType<ProblemDetails>(
        StatusCodes.Status409Conflict)]
    public async Task<ActionResult<TaskItemResponse>> Reopen(
        Guid id,
        CancellationToken cancellationToken)
    {
        try
        {
            var taskItem = await service.ReopenAsync(
                id,
                cancellationToken);

            if (taskItem is null)
            {
                return TaskNotFound(id);
            }

            return Ok(taskItem);
        }
        catch (InvalidOperationException exception)
        {
            return Conflict(new ProblemDetails
            {
                Title = "Invalid task state",
                Detail = exception.Message,
                Status = StatusCodes.Status409Conflict
            });
        }
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(
        StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(
        Guid id,
        CancellationToken cancellationToken)
    {
        var deleted = await service.DeleteAsync(
            id,
            cancellationToken);

        if (!deleted)
        {
            return TaskNotFound(id);
        }

        return NoContent();
    }

    private NotFoundObjectResult TaskNotFound(Guid id)
    {
        return NotFound(new ProblemDetails
        {
            Title = "Task not found",
            Detail = $"Task '{id}' was not found.",
            Status = StatusCodes.Status404NotFound
        });
    }

}