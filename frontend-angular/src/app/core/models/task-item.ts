export interface TaskItem {
  id: string;
  title: string;
  description: string | null;
  dueDateUtc: string | null;
  isCompleted: boolean;
  completedAtUtc: string | null;
  createdAtUtc: string;
  categoryId: string;
  categoryName: string;
}

export interface CreateTaskItemRequest {
  title: string;
  description: string | null;
  dueDateUtc: string | null;
  categoryId: string;
}