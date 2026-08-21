import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { TaskCategoryService } from './core/services/task-category.service';
import { TaskItemService } from './core/services/task-item.service';
import type { TaskCategory } from './core/models/task-category';
import type { TaskItem } from './core/models/task-item';

@Component({
  selector: 'app-root',
  imports: [],
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

  protected readonly isLoading = signal(true);

  protected readonly error =
    signal<string | null>(null);

  protected readonly connectionStatus = computed(() => {
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

  protected formatDate(
    value: string | null,
  ): string {
    if (value === null) {
      return 'No due date';
    }

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(value));
  }

  private getErrorMessage(
    requestError: unknown,
  ): string {
    if (requestError instanceof HttpErrorResponse) {
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