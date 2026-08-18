import type { TaskCategory } from '../types/taskCategory'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

export async function getTaskCategories(
  signal?: AbortSignal,
): Promise<TaskCategory[]> {
  const response = await fetch(
    `${apiBaseUrl}/api/categories`,
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
      `Could not load categories. Status: ${response.status}`,
    )
  }

  return response.json() as Promise<TaskCategory[]>
}