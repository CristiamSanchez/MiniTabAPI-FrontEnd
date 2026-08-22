import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  CreateTaskItemRequest,
  TaskItem,
  UpdateTaskItemRequest,
} from '../models/task-item';

@Injectable({
  providedIn: 'root',
})
export class TaskItemService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiBaseUrl}/api/tasks`;

  getAll(): Observable<TaskItem[]> {
    return this.http.get<TaskItem[]>(
      this.apiUrl,
    );
  }

  create(
    request: CreateTaskItemRequest,
  ): Observable<TaskItem> {
    return this.http.post<TaskItem>(
      this.apiUrl,
      request,
    );
  }

  update(
    taskId: string,
    request: UpdateTaskItemRequest,
  ): Observable<TaskItem> {
    return this.http.put<TaskItem>(
      `${this.apiUrl}/${taskId}`,
      request,
    );
  }

  complete(
    taskId: string,
  ): Observable<TaskItem> {
    return this.changeState(
      taskId,
      'complete',
    );
  }

  reopen(
    taskId: string,
  ): Observable<TaskItem> {
    return this.changeState(
      taskId,
      'reopen',
    );
  }

  delete(
    taskId: string,
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${taskId}`,
    );
  }

  private changeState(
    taskId: string,
    action: 'complete' | 'reopen',
  ): Observable<TaskItem> {
    return this.http.patch<TaskItem>(
      `${this.apiUrl}/${taskId}/${action}`,
      null,
    );
  }
}