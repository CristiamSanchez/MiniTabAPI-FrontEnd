import {
  Component,
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
import type { TaskItem } from '../../../core/models/task-item';

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

  readonly categories =
    input.required<TaskCategory[]>();

  readonly taskCreated =
    output<TaskItem>();

  protected readonly isSubmitting =
    signal(false);

  protected readonly error =
    signal<string | null>(null);

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

  private readonly selectDefaultCategory =
    effect(() => {
      const categories = this.categories();
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

    this.isSubmitting.set(true);
    this.error.set(null);

    this.taskItemService.create({
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
    })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isSubmitting.set(false);
        }),
      )
      .subscribe({
        next: (createdTask) => {
          this.taskCreated.emit(createdTask);

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
            this.getErrorMessage(requestError),
          );
        },
      });
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
        'Could not create the task. ' +
        `Status: ${requestError.status}`
      );
    }

    return 'An unexpected error occurred.';
  }
}
