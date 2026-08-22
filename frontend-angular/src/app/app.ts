import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize, forkJoin } from 'rxjs';
import { TaskCategoryService } from './core/services/task-category.service';
import { TaskItemService } from './core/services/task-item.service';
import type { TaskCategory } from './core/models/task-category';
import type { TaskItem } from './core/models/task-item';
import { TaskForm } from './features/tasks/task-form/task-form';

@Component({
  selector: 'app-root',
  imports: [TaskForm],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly taskCategoryService =
    inject(TaskCategoryService);

  private readonly taskItemService =
    inject(TaskItemService);

  protected readonly appName = 'MiniTask';

  protected readonly frontendName = 'Angular';

  protected readonly categories =
    signal<TaskCategory[]>([]);

  protected readonly tasks =
    signal<TaskItem[]>([]);

  protected readonly editingTask =
    signal<TaskItem | null>(null);

  protected readonly isLoading =
    signal(true);

  protected readonly error =
    signal<string | null>(null);

  protected readonly updatingTaskId =
    signal<string | null>(null);

  protected readonly deletingTaskId =
    signal<string | null>(null);

  protected readonly taskActionError =
    signal<string | null>(null);

  protected readonly connectionStatus =
    computed(() => {
      if (this.isLoading()) {
        return 'Connecting...';
      }

      if (this.error()) {
        return 'API unavailable';
      }

      return 'API connected';
    });

  ngOnInit(): void {
    this.loadDashboard();
  }

  protected loadDashboard(): void {
    this.isLoading.set(true);
    this.error.set(null);

    forkJoin({
      categories:
        this.taskCategoryService.getAll(),
      tasks:
        this.taskItemService.getAll(),
    }).subscribe({
      next: ({ categories, tasks }) => {
        this.categories.set(categories);
        this.tasks.set(tasks);
        this.isLoading.set(false);
      },
      error: (requestError: unknown) => {
        this.error.set(
          this.getErrorMessage(requestError),
        );

        this.isLoading.set(false);
      },
    });
  }

  protected handleTaskCreated(
    createdTask: TaskItem,
  ): void {
    this.tasks.update((currentTasks) => [
      createdTask,
      ...currentTasks,
    ]);
  }

    protected startTaskEdit(
    task: TaskItem,
  ): void {
    this.taskActionError.set(null);
    this.editingTask.set(task);
  }

  protected handleTaskUpdated(
    updatedTask: TaskItem,
  ): void {
    this.tasks.update((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask.id === updatedTask.id
          ? updatedTask
          : currentTask,
      ),
    );

    this.editingTask.set(null);
  }

  protected cancelTaskEdit(): void {
    this.editingTask.set(null);
  }

  protected changeTaskState(
    task: TaskItem,
  ): void {
    this.updatingTaskId.set(task.id);
    this.taskActionError.set(null);

    const request = task.isCompleted
      ? this.taskItemService.reopen(task.id)
      : this.taskItemService.complete(task.id);

    request
      .pipe(
        finalize(() => {
          this.updatingTaskId.set(null);
        }),
      )
      .subscribe({
        next: (updatedTask) => {
          this.tasks.update((currentTasks) =>
            currentTasks.map((currentTask) =>
              currentTask.id === updatedTask.id
                ? updatedTask
                : currentTask,
            ),
          );
        },
        error: (requestError: unknown) => {
          this.taskActionError.set(
            this.getTaskActionErrorMessage(
              requestError,
            ),
          );
        },
      });
  }

    protected deleteTask(
    task: TaskItem,
  ): void {
    const confirmed = window.confirm(
      `Delete task "${task.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    this.deletingTaskId.set(task.id);
    this.taskActionError.set(null);

    this.taskItemService
      .delete(task.id)
      .pipe(
        finalize(() => {
          this.deletingTaskId.set(null);
        }),
      )
      .subscribe({
                next: () => {
          this.tasks.update((currentTasks) =>
            currentTasks.filter(
              (currentTask) =>
                currentTask.id !== task.id,
            ),
          );

          if (
            this.editingTask()?.id === task.id
          ) {
            this.editingTask.set(null);
          }
        },
        error: (requestError: unknown) => {
          this.taskActionError.set(
            this.getTaskDeleteErrorMessage(
              requestError,
            ),
          );
        },
      });
  }


  protected formatDate(
    value: string | null,
  ): string {
    if (value === null) {
      return 'No due date';
    }

    return new Intl.DateTimeFormat(
      'en-US',
      {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      },
    ).format(new Date(value));
  }

    private getTaskDeleteErrorMessage(
    requestError: unknown,
  ): string {
    if (
      requestError instanceof
      HttpErrorResponse
    ) {
      const problemDetail =
        requestError.error?.detail;

      if (
        typeof problemDetail === 'string' &&
        problemDetail.length > 0
      ) {
        return problemDetail;
      }

      if (requestError.status === 0) {
        return (
          'Could not connect to the MiniTask API. ' +
          'Verify that the backend is running.'
        );
      }

      return (
        'Could not delete the task. ' +
        `Status: ${requestError.status}`
      );
    }

    return 'An unexpected error occurred.';
  }
  
  private getTaskActionErrorMessage(
    requestError: unknown,
  ): string {
    if (
      requestError instanceof
      HttpErrorResponse
    ) {
      const problemDetail =
        requestError.error?.detail;

      if (
        typeof problemDetail === 'string' &&
        problemDetail.length > 0
      ) {
        return problemDetail;
      }

      if (requestError.status === 0) {
        return (
          'Could not connect to the MiniTask API. ' +
          'Verify that the backend is running.'
        );
      }

      return (
        'Could not update the task. ' +
        `Status: ${requestError.status}`
      );
    }

    return 'An unexpected error occurred.';
  }

  private getErrorMessage(
    requestError: unknown,
  ): string {
    if (
      requestError instanceof
      HttpErrorResponse
    ) {
      const problemDetail =
        requestError.error?.detail;

      if (
        typeof problemDetail === 'string' &&
        problemDetail.length > 0
      ) {
        return problemDetail;
      }

      if (requestError.status === 0) {
        return (
          'Could not connect to the MiniTask API. ' +
          'Verify that the backend is running.'
        );
      }

      return (
        'Could not load the dashboard. ' +
        `Status: ${requestError.status}`
      );
    }

    return 'An unexpected error occurred.';
  }
}
