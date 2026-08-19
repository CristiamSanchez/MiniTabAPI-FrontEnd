import type {
  CreateTaskCategoryRequest,
  TaskCategory,
} from '../types/taskCategory'

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

export async function createTaskCategory(
  request: CreateTaskCategoryRequest,
): Promise<TaskCategory> {
  const response = await fetch(
    `${apiBaseUrl}/api/categories`,
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
        `Could not create category. Status: ${response.status}`,
      ),
    )
  }

  return response.json() as Promise<TaskCategory>
}