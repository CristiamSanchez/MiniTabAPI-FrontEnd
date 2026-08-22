import {
  Component,
  DestroyRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TaskCategoryService } from '../../../core/services/task-category.service';
import type { TaskCategory } from '../../../core/models/task-category';

@Component({
  selector: 'app-category-manager',
  imports: [ReactiveFormsModule],
  templateUrl: './category-manager.html',
  styleUrl: './category-manager.css',
})
export class CategoryManager {
  private readonly formBuilder =
    inject(FormBuilder);

  private readonly categoryService =
    inject(TaskCategoryService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly categories =
    input.required<TaskCategory[]>();

  readonly categoryCreated =
    output<TaskCategory>();

  readonly categoryUpdated =
    output<TaskCategory>();

  readonly categoryDeleted =
    output<string>();

  protected readonly editingCategory =
    signal<TaskCategory | null>(null);

  protected readonly isSubmitting =
    signal(false);

  protected readonly deletingCategoryId =
    signal<string | null>(null);

  protected readonly error =
    signal<string | null>(null);

  protected readonly form =
    this.formBuilder.nonNullable.group({
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(80),
        ],
      ],
    });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const name =
      this.form.controls.name.value.trim();

    const editingCategory =
      this.editingCategory();

    this.isSubmitting.set(true);
    this.error.set(null);

    const operation =
      editingCategory === null
        ? this.categoryService.create({
            name,
          })
        : this.categoryService.update(
            editingCategory.id,
            {
              name,
            },
          );

    operation
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isSubmitting.set(false);
        }),
      )
      .subscribe({
        next: (savedCategory) => {
          if (editingCategory === null) {
            this.categoryCreated.emit(
              savedCategory,
            );
          } else {
            this.categoryUpdated.emit(
              savedCategory,
            );
          }

          this.resetForm();
        },
        error: (requestError: unknown) => {
          this.error.set(
            this.getErrorMessage(
              requestError,
              editingCategory === null
                ? 'create'
                : 'update',
            ),
          );
        },
      });
  }

  protected startEdit(
    category: TaskCategory,
  ): void {
    this.editingCategory.set(category);
    this.error.set(null);

    this.form.reset({
      name: category.name,
    });
  }

  protected cancelEdit(): void {
    this.resetForm();
  }

  protected deleteCategory(
    category: TaskCategory,
  ): void {
    const confirmed = window.confirm(
      `Delete category "${category.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    this.deletingCategoryId.set(
      category.id,
    );

    this.error.set(null);

    this.categoryService
      .delete(category.id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.deletingCategoryId.set(null);
        }),
      )
      .subscribe({
        next: () => {
          this.categoryDeleted.emit(
            category.id,
          );

          if (
            this.editingCategory()?.id ===
            category.id
          ) {
            this.resetForm();
          }
        },
        error: (requestError: unknown) => {
          this.error.set(
            this.getErrorMessage(
              requestError,
              'delete',
            ),
          );
        },
      });
  }

  protected formatDate(
    value: string,
  ): string {
    return new Intl.DateTimeFormat(
      'en-US',
      {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      },
    ).format(new Date(value));
  }

  private resetForm(): void {
    this.editingCategory.set(null);
    this.error.set(null);

    this.form.reset({
      name: '',
    });
  }

  private getErrorMessage(
    requestError: unknown,
    action: 'create' | 'update' | 'delete',
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
        `Could not ${action} the category. ` +
        `Status: ${requestError.status}`
      );
    }

    return 'An unexpected error occurred.';
  }
}