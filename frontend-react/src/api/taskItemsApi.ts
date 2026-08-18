import type {
  CreateTaskItemRequest,
  TaskItem,
} from '../types/taskItem'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

export async function getTaskItems(
  signal?: AbortSignal,
): Promise<TaskItem[]> {
  const response = await fetch(
    `${apiBaseUrl}/api/tasks`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal,
    },
  )

  if (!response.ok) {
    throw new Error(
      `Could not load tasks. Status: ${response.status}`,
    )
  }

  return response.json() as Promise<TaskItem[]>
}

export async function createTaskItem(
  request: CreateTaskItemRequest,
): Promise<TaskItem> {
  const response = await fetch(
    `${apiBaseUrl}/api/tasks`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    },
  )

  if (!response.ok) {
    const problem = (await response.json()) as {
      detail?: string
    }

    throw new Error(
      problem.detail ??
        `Could not create task. Status: ${response.status}`,
    )
  }

  return response.json() as Promise<TaskItem>
}