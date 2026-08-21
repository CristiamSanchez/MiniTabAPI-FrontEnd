import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { TaskItem } from '../models/task-item';

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
}