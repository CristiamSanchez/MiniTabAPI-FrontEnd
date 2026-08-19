import { useEffect, useState } from 'react'
import { getTaskCategories } from './api/taskCategoriesApi'
import {
  completeTask,
  deleteTask,
  getTaskItems,
  reopenTask,
} from './api/taskItemsApi'
import { CategoryManager } from './components/CategoryManager'
import { TaskForm } from './components/TaskForm'
import type { TaskCategory } from './types/taskCategory'
import type { TaskItem } from './types/taskItem'
import './App.css'

function formatDate(value: string | null) {
  if (value === null) {
    return 'No due date'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

function App() {
  const [categories, setCategories] =
    useState<TaskCategory[]>([])

  const [tasks, setTasks] =
    useState<TaskItem[]>([])

  const [isLoading, setIsLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  const [updatingTaskId, setUpdatingTaskId] =
    useState<string | null>(null)

  const [deletingTaskId, setDeletingTaskId] =
    useState<string | null>(null)

  const [taskActionError, setTaskActionError] =
    useState<string | null>(null)

  const [taskToEdit, setTaskToEdit] =
    useState<TaskItem | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadDashboard() {
      try {
        setIsLoading(true)
        setError(null)

        const [categoryResult, taskResult] =
          await Promise.all([
            getTaskCategories(controller.signal),
            getTaskItems(controller.signal),
          ])

        setCategories(categoryResult)
        setTasks(taskResult)
      } catch (requestError) {
        if (
          requestError instanceof DOMException &&
          requestError.name === 'AbortError'
        ) {
          return
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : 'An unexpected error occurred.',
        )
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void loadDashboard()

    return () => {
      controller.abort()
    }
  }, [])

  const connectionStatus = isLoading
    ? 'Connecting...'
    : error
      ? 'API unavailable'
      : 'API connected'

  function handleCategoryCreated(
    category: TaskCategory,
  ) {
    setCategories((currentCategories) =>
      [...currentCategories, category].sort(
        (first, second) =>
          first.name.localeCompare(second.name),
      ),
    )
  }

  function handleCategoryUpdated(
    updatedCategory: TaskCategory,
  ) {
    setCategories((currentCategories) =>
      currentCategories
        .map((category) =>
          category.id === updatedCategory.id
            ? updatedCategory
            : category,
        )
        .sort((first, second) =>
          first.name.localeCompare(second.name),
        ),
    )

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.categoryId === updatedCategory.id
          ? {
              ...task,
              categoryName: updatedCategory.name,
            }
          : task,
      ),
    )
  }

  function handleCategoryDeleted(categoryId: string) {
    setCategories((currentCategories) =>
      currentCategories.filter(
        (category) => category.id !== categoryId,
      ),
    )
  }

  function handleTaskSaved(savedTask: TaskItem) {
    setTasks((currentTasks) => {
      const taskAlreadyExists = currentTasks.some(
        (task) => task.id === savedTask.id,
      )

      if (!taskAlreadyExists) {
        return [savedTask, ...currentTasks]
      }

      return currentTasks.map((task) =>
        task.id === savedTask.id
          ? savedTask
          : task,
      )
    })

    setTaskToEdit(null)
  }

  function handleTaskEdit(task: TaskItem) {
    setTaskActionError(null)
    setTaskToEdit(task)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  async function handleTaskStateChange(task: TaskItem) {
    try {
      setUpdatingTaskId(task.id)
      setTaskActionError(null)

      const updatedTask = task.isCompleted
        ? await reopenTask(task.id)
        : await completeTask(task.id)

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === updatedTask.id
            ? updatedTask
            : currentTask,
        ),
      )
    } catch (requestError) {
      setTaskActionError(
        requestError instanceof Error
          ? requestError.message
          : 'An unexpected error occurred.',
      )
    } finally {
      setUpdatingTaskId(null)
    }
  }

  async function handleTaskDelete(task: TaskItem) {
    const confirmed = window.confirm(
      `Delete task "${task.title}"?`,
    )

    if (!confirmed) {
      return
    }

    try {
      setDeletingTaskId(task.id)
      setTaskActionError(null)

      await deleteTask(task.id)

      setTasks((currentTasks) =>
        currentTasks.filter(
          (currentTask) =>
            currentTask.id !== task.id,
        ),
      )

      if (taskToEdit?.id === task.id) {
        setTaskToEdit(null)
      }
    } catch (requestError) {
      setTaskActionError(
        requestError instanceof Error
          ? requestError.message
          : 'An unexpected error occurred.',
      )
    } finally {
      setDeletingTaskId(null)
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <a className="brand" href="/">
          <span className="brand-mark">M</span>

          <span>
            <strong>MiniTask</strong>
            <small>Personal task manager</small>
          </span>
        </a>

        <span
          className={
            error
              ? 'status-badge status-badge--error'
              : 'status-badge'
          }
        >
          {connectionStatus}
        </span>
      </header>

      <main className="app-content">
        <section className="hero-section">
          <p className="eyebrow">Organize your day</p>

          <h1>Keep your tasks clear and manageable.</h1>

          <p className="hero-description">
            Create tasks, assign categories and keep track of what
            you have completed.
          </p>
        </section>

        {!isLoading &&
          !error &&
          categories.length > 0 && (
            <TaskForm
              categories={categories}
              taskToEdit={taskToEdit}
              onTaskSaved={handleTaskSaved}
              onCancelEdit={() => setTaskToEdit(null)}
            />
          )}

        <section className="dashboard-grid">
          <article className="panel tasks-panel">
            <div className="panel-header">
              <div>
                <p className="panel-label">Your workspace</p>
                <h2>Tasks</h2>
              </div>

              {!isLoading && !error && (
                <span className="counter-badge">
                  {tasks.length}{' '}
                  {tasks.length === 1
                    ? 'task'
                    : 'tasks'}
                </span>
              )}
            </div>

            {taskActionError && (
              <p
                className="task-action-error"
                role="alert"
              >
                {taskActionError}
              </p>
            )}

            {isLoading && (
              <div className="empty-state">
                <span className="empty-state-icon">
                  …
                </span>
                <h3>Loading tasks</h3>
                <p>Retrieving your tasks from the API.</p>
              </div>
            )}

            {error && (
              <div
                className="empty-state"
                role="alert"
              >
                <span className="empty-state-icon">
                  !
                </span>
                <h3>Tasks could not be loaded</h3>
                <p>{error}</p>
              </div>
            )}

            {!isLoading &&
              !error &&
              tasks.length === 0 && (
                <div className="empty-state">
                  <span className="empty-state-icon">
                    ✓
                  </span>
                  <h3>No tasks created yet</h3>
                  <p>Your first task will appear here.</p>
                </div>
              )}

            {!isLoading &&
              !error &&
              tasks.length > 0 && (
                <ul className="task-list">
                  {tasks.map((task) => (
                    <li
                      className={
                        task.isCompleted
                          ? 'task-item task-item--completed'
                          : 'task-item'
                      }
                      key={task.id}
                    >
                      <div className="task-content">
                        <div className="task-heading">
                          <h3>{task.title}</h3>

                          <span
                            className={
                              task.isCompleted
                                ? 'task-state task-state--completed'
                                : 'task-state task-state--open'
                            }
                          >
                            {task.isCompleted
                              ? 'Completed'
                              : 'Open'}
                          </span>
                        </div>

                        {task.description && (
                          <p className="task-description">
                            {task.description}
                          </p>
                        )}

                        <div className="task-meta">
                          <span>
                            {task.categoryName}
                          </span>

                          <span>
                            {formatDate(
                              task.dueDateUtc,
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="task-actions">
                        <button
                          className="secondary-button"
                          type="button"
                          disabled={
                            updatingTaskId === task.id ||
                            deletingTaskId === task.id
                          }
                          onClick={() => {
                            void handleTaskStateChange(
                              task,
                            )
                          }}
                        >
                          {updatingTaskId === task.id
                            ? 'Updating...'
                            : task.isCompleted
                              ? 'Reopen'
                              : 'Complete'}
                        </button>

                        <button
                          className="secondary-button"
                          type="button"
                          disabled={
                            updatingTaskId === task.id ||
                            deletingTaskId === task.id
                          }
                          onClick={() =>
                            handleTaskEdit(task)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="danger-button"
                          type="button"
                          disabled={
                            updatingTaskId === task.id ||
                            deletingTaskId === task.id
                          }
                          onClick={() => {
                            void handleTaskDelete(task)
                          }}
                        >
                          {deletingTaskId === task.id
                            ? 'Deleting...'
                            : 'Delete'}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
          </article>

          <aside className="panel categories-panel">
            <div className="panel-header">
              <div>
                <p className="panel-label">
                  Organization
                </p>
                <h2>Categories</h2>
              </div>

              {!isLoading && !error && (
                <span className="counter-badge">
                  {categories.length}
                </span>
              )}
            </div>

            {isLoading && (
              <div className="category-placeholder">
                <span className="category-dot" />
                <p>Loading categories...</p>
              </div>
            )}

            {error && (
              <div
                className="category-placeholder error-message"
                role="alert"
              >
                <span className="category-dot" />
                <p>{error}</p>
              </div>
            )}

            {!isLoading && !error && (
              <CategoryManager
                categories={categories}
                onCategoryCreated={
                  handleCategoryCreated
                }
                onCategoryUpdated={
                  handleCategoryUpdated
                }
                onCategoryDeleted={
                  handleCategoryDeleted
                }
              />
            )}
          </aside>
        </section>
      </main>

      <footer className="app-footer">
        MiniTask · React frontend
      </footer>
    </div>
  )
}

export default App