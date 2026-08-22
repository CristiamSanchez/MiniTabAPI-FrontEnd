import {
  Component,
  computed,
  DestroyRef,
  effect,
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
import { TaskItemService } from '../../../core/services/task-item.service';
import type { TaskCategory } from '../../../core/models/task-category';
import type {
  CreateTaskItemRequest,
  TaskItem,
  UpdateTaskItemRequest,
} from '../../../core/models/task-item';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm {
  private readonly formBuilder =
    inject(FormBuilder);

  private readonly taskItemService =
    inject(TaskItemService);

  private readonly destroyRef =
    inject(DestroyRef);

  private activeTaskId: string | null = null;

  readonly categories =
    input.required<TaskCategory[]>();

  readonly task =
    input<TaskItem | null>(null);

  readonly taskCreated =
    output<TaskItem>();

  readonly taskUpdated =
    output<TaskItem>();

  readonly editCancelled =
    output<void>();

  protected readonly isSubmitting =
    signal(false);

  protected readonly error =
    signal<string | null>(null);

  protected readonly isEditing =
    computed(() => this.task() !== null);

  protected readonly form =
    this.formBuilder.nonNullable.group({
      title: [
        '',
        [
          Validators.required,
          Validators.maxLength(150),
        ],
      ],
      description: [
        '',
        [
          Validators.maxLength(1000),
        ],
      ],
      dueDate: [''],
      categoryId: [
        '',
        [
          Validators.required,
        ],
      ],
    });

  private readonly synchronizeForm =
    effect(() => {
      const task = this.task();
      const categories = this.categories();

      if (task !== null) {
        this.activeTaskId = task.id;
        this.error.set(null);

        this.form.reset({
          title: task.title,
          description: task.description ?? '',
          dueDate:
            this.toLocalDateTimeValue(
              task.dueDateUtc,
            ),
          categoryId: task.categoryId,
        });

        return;
      }

      if (this.activeTaskId !== null) {
        this.activeTaskId = null;
        this.error.set(null);

        this.form.reset({
          title: '',
          description: '',
          dueDate: '',
          categoryId:
            categories[0]?.id ?? '',
        });

        return;
      }

      const categoryControl =
        this.form.controls.categoryId;

      if (
        categoryControl.value.length === 0 &&
        categories.length > 0
      ) {
        categoryControl.setValue(
          categories[0].id,
        );
      }
    });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue =
      this.form.getRawValue();

    const request = {
      title: formValue.title.trim(),
      description:
        formValue.description.trim().length > 0
          ? formValue.description.trim()
          : null,
      dueDateUtc:
        formValue.dueDate.length > 0
          ? new Date(
              formValue.dueDate,
            ).toISOString()
          : null,
      categoryId: formValue.categoryId,
    };

    const editingTask = this.task();

    this.isSubmitting.set(true);
    this.error.set(null);

    const operation = editingTask === null
      ? this.taskItemService.create(
          request as CreateTaskItemRequest,
        )
      : this.taskItemService.update(
          editingTask.id,
          request as UpdateTaskItemRequest,
        );

    operation
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isSubmitting.set(false);
        }),
      )
      .subscribe({
        next: (savedTask) => {
          if (editingTask !== null) {
            this.taskUpdated.emit(savedTask);
            return;
          }

          this.taskCreated.emit(savedTask);

          this.form.reset({
            title: '',
            description: '',
            dueDate: '',
            categoryId:
              formValue.categoryId,
          });
        },
        error: (requestError: unknown) => {
          this.error.set(
            this.getErrorMessage(
              requestError,
              editingTask !== null,
            ),
          );
        },
      });
  }

  protected cancelEdit(): void {
    this.error.set(null);
    this.editCancelled.emit();
  }

  private toLocalDateTimeValue(
    value: string | null,
  ): string {
    if (value === null) {
      return '';
    }

    const date = new Date(value);

    const localDate = new Date(
      date.getTime() -
      date.getTimezoneOffset() * 60_000,
    );

    return localDate
      .toISOString()
      .slice(0, 16);
  }

  private getErrorMessage(
    requestError: unknown,
    isEditing: boolean,
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

      const action = isEditing
        ? 'update'
        : 'create';

      return (
        `Could not ${action} the task. ` +
        `Status: ${requestError.status}`
      );
    }

    return 'An unexpected error occurred.';
  }
}