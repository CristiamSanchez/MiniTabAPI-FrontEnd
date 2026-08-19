using Microsoft.AspNetCore.Mvc;
using MiniTask.Application.Categories;

namespace MiniTask.API.Controllers;

[ApiController]
[Route("api/categories")]
public sealed class TaskCategoriesController(
    ITaskCategoryService service)
    : ControllerBase
{
    [HttpPost]
    [ProducesResponseType<TaskCategoryResponse>(
        StatusCodes.Status201Created)]
    [ProducesResponseType<ProblemDetails>(
        StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(
        StatusCodes.Status409Conflict)]
    public async Task<ActionResult<TaskCategoryResponse>> Create(
        CreateTaskCategoryRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var category = await service.CreateAsync(
                request,
                cancellationToken);

            return Created(
                $"/api/categories/{category.Id}",
                category);
        }
        catch (TaskCategoryAlreadyExistsException exception)
        {
            return Conflict(new ProblemDetails
            {
                Title = "Task category already exists",
                Detail = exception.Message,
                Status = StatusCodes.Status409Conflict
            });
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Invalid task category",
                Detail = exception.Message,
                Status = StatusCodes.Status400BadRequest
            });
        }
    }

    [HttpGet]
    [ProducesResponseType<IReadOnlyList<TaskCategoryResponse>>(
        StatusCodes.Status200OK)]
    public async Task<ActionResult<
        IReadOnlyList<TaskCategoryResponse>>> GetAll(
        CancellationToken cancellationToken)
    {
        var categories = await service.GetAllAsync(
            cancellationToken);

        return Ok(categories);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType<TaskCategoryResponse>(
        StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(
        StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TaskCategoryResponse>> GetById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var category = await service.GetByIdAsync(
            id,
            cancellationToken);

        if (category is null)
        {
            return NotFound(new ProblemDetails
            {
                Title = "Task category not found",
                Detail = $"Task category '{id}' was not found.",
                Status = StatusCodes.Status404NotFound
            });
        }

        return Ok(category);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType<TaskCategoryResponse>(
        StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(
        StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(
        StatusCodes.Status404NotFound)]
    [ProducesResponseType<ProblemDetails>(
        StatusCodes.Status409Conflict)]
    public async Task<ActionResult<TaskCategoryResponse>> Update(
        Guid id,
        UpdateTaskCategoryRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var category = await service.UpdateAsync(
                id,
                request,
                cancellationToken);

            if (category is null)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Task category not found",
                    Detail = $"Task category '{id}' was not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            return Ok(category);
        }
        catch (TaskCategoryAlreadyExistsException exception)
        {
            return Conflict(new ProblemDetails
            {
                Title = "Task category already exists",
                Detail = exception.Message,
                Status = StatusCodes.Status409Conflict
            });
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Invalid task category",
                Detail = exception.Message,
                Status = StatusCodes.Status400BadRequest
            });
        }
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(
        StatusCodes.Status404NotFound)]
    [ProducesResponseType<ProblemDetails>(
        StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Delete(
        Guid id,
        CancellationToken cancellationToken)
    {
        try
        {
            var deleted = await service.DeleteAsync(
                id,
                cancellationToken);

            if (!deleted)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Task category not found",
                    Detail =
                        $"Task category '{id}' was not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            return NoContent();
        }
        catch (TaskCategoryInUseException exception)
        {
            return Conflict(new ProblemDetails
            {
                Title = "Task category is in use",
                Detail = exception.Message,
                Status = StatusCodes.Status409Conflict
            });
        }
    }

}