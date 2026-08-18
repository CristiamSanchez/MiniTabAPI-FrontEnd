import type { TaskItem } from '../types/taskItem'

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