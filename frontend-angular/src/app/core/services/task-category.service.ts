import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  CreateTaskCategoryRequest,
  TaskCategory,
  UpdateTaskCategoryRequest,
} from '../models/task-category';

@Injectable({
  providedIn: 'root',
})
export class TaskCategoryService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiBaseUrl}/api/categories`;

  getAll(): Observable<TaskCategory[]> {
    return this.http.get<TaskCategory[]>(
      this.apiUrl,
    );
  }

  create(
    request: CreateTaskCategoryRequest,
  ): Observable<TaskCategory> {
    return this.http.post<TaskCategory>(
      this.apiUrl,
      request,
    );
  }

  update(
    categoryId: string,
    request: UpdateTaskCategoryRequest,
  ): Observable<TaskCategory> {
    return this.http.put<TaskCategory>(
      `${this.apiUrl}/${categoryId}`,
      request,
    );
  }

  delete(
    categoryId: string,
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${categoryId}`,
    );
  }
}