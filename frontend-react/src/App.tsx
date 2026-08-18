import { useEffect, useState } from 'react'
import { getTaskCategories } from './api/taskCategoriesApi'
import type { TaskCategory } from './types/taskCategory'
import './App.css'

function App() {
  const [categories, setCategories] = useState<TaskCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadCategories() {
      try {
        setIsLoading(true)
        setError(null)

        const result = await getTaskCategories(
          controller.signal,
        )

        setCategories(result)
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

    void loadCategories()

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

              <span className="counter-badge">0 tasks</span>
            </div>

            <div className="empty-state">
              <span className="empty-state-icon">✓</span>
              <h3>No tasks loaded yet</h3>
              <p>
                Tasks will be connected in the next frontend
                iteration.
              </p>
            </div>
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
                          {new Date(
                            category.createdAtUtc,
                          ).toLocaleDateString()}
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