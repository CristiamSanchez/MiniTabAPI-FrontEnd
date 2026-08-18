import type {
  CreateTaskItemRequest,
  TaskItem,
  UpdateTaskItemRequest,
} from '../types/taskItem'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

async function getApiError(
  response: Response,
  fallbackMessage: string,
) {
  const problem = (await response.json()) as {
    detail?: string
  }

  return problem.detail ?? fallbackMessage
}

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
    throw new Error(
      await getApiError(
        response,
        `Could not create task. Status: ${response.status}`,
      ),
    )
  }

  return response.json() as Promise<TaskItem>
}

export async function updateTaskItem(
  taskId: string,
  request: UpdateTaskItemRequest,
): Promise<TaskItem> {
  const response = await fetch(
    `${apiBaseUrl}/api/tasks/${taskId}`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    },
  )

  if (!response.ok) {
    throw new Error(
      await getApiError(
        response,
        `Could not update task. Status: ${response.status}`,
      ),
    )
  }

  return response.json() as Promise<TaskItem>
}


async function changeTaskState(
  taskId: string,
  action: 'complete' | 'reopen',
): Promise<TaskItem> {
  const response = await fetch(
    `${apiBaseUrl}/api/tasks/${taskId}/${action}`,
    {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
      },
    },
  )

  if (!response.ok) {
    throw new Error(
      await getApiError(
        response,
        `Could not ${action} task. Status: ${response.status}`,
      ),
    )
  }

  return response.json() as Promise<TaskItem>
}

export function completeTask(
  taskId: string,
): Promise<TaskItem> {
  return changeTaskState(taskId, 'complete')
}

export function reopenTask(
  taskId: string,
): Promise<TaskItem> {
  return changeTaskState(taskId, 'reopen')
}

export async function deleteTask(
  taskId: string,
): Promise<void> {
  const response = await fetch(
    `${apiBaseUrl}/api/tasks/${taskId}`,
    {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    },
  )

  if (!response.ok) {
    throw new Error(
      await getApiError(
        response,
        `Could not delete task. Status: ${response.status}`,
      ),
    )
  }
}
