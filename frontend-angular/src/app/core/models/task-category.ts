export interface TaskCategory {
  id: string;
  name: string;
  createdAtUtc: string;
}

export interface CreateTaskCategoryRequest {
  name: string;
}

export interface UpdateTaskCategoryRequest {
  name: string;
}