import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TaskCategoryService } from './core/services/task-category.service';
import type { TaskCategory } from './core/models/task-category';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly taskCategoryService =
    inject(TaskCategoryService);

  protected readonly appName = 'MiniTask';
  protected readonly frontendName = 'Angular';

  protected readonly categories =
    signal<TaskCategory[]>([]);

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
    this.loadCategories();
  }

  protected loadCategories(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.taskCategoryService.getAll().subscribe({
      next: (categories) => {
        this.categories.set(categories);
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

  protected formatDate(value: string): string {
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
        'Could not load categories. ' +
        `Status: ${requestError.status}`
      );
    }

    return 'An unexpected error occurred.';
  }
}