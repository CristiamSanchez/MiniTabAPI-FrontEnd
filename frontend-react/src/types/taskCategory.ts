export interface TaskCategory {
  id: string
  name: string
  createdAtUtc: string
}

export interface CreateTaskCategoryRequest {
  name: string
}

export type UpdateTaskCategoryRequest =
  CreateTaskCategoryRequest