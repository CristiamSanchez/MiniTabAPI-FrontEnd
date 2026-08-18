import { useEffect, useState } from 'react'
import { getTaskCategories } from './api/taskCategoriesApi'
import { getTaskItems } from './api/taskItemsApi'
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
  const [categories, setCategories] = useState<TaskCategory[]>([])
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
                  {tasks.length === 1 ? 'task' : 'tasks'}
                </span>
              )}
            </div>

            {isLoading && (
              <div className="empty-state">
                <span className="empty-state-icon">…</span>
                <h3>Loading tasks</h3>
                <p>Retrieving your tasks from the API.</p>
              </div>
            )}

            {error && (
              <div className="empty-state" role="alert">
                <span className="empty-state-icon">!</span>
                <h3>Tasks could not be loaded</h3>
                <p>{error}</p>
              </div>
            )}

            {!isLoading && !error && tasks.length === 0 && (
              <div className="empty-state">
                <span className="empty-state-icon">✓</span>
                <h3>No tasks created yet</h3>
                <p>Your first task will appear here.</p>
              </div>
            )}

            {!isLoading && !error && tasks.length > 0 && (
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
                        <span>{task.categoryName}</span>
                        <span>{formatDate(task.dueDateUtc)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </article>

          <aside className="panel categories-panel">
            <div className="panel-header">
              <div>
                <p className="panel-label">Organization</p>
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

            {!isLoading &&
              !error &&
              categories.length === 0 && (
                <div className="category-placeholder">
                  <span className="category-dot" />
                  <p>No categories have been created yet.</p>
                </div>
              )}

            {!isLoading &&
              !error &&
              categories.length > 0 && (
                <ul className="category-list">
                  {categories.map((category) => (
                    <li
                      className="category-item"
                      key={category.id}
                    >
                      <span className="category-dot" />

                      <div>
                        <strong>{category.name}</strong>
                        <small>
                          Created{' '}
                          {formatDate(category.createdAtUtc)}
                        </small>
                      </div>
                    </li>
                  ))}
                </ul>
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