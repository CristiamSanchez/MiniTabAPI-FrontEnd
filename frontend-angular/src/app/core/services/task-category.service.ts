import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { TaskCategory } from '../models/task-category';

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
}