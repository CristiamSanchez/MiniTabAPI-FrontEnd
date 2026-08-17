import './App.css'

function App() {
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

        <span className="status-badge">Frontend ready</span>
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
                The task list will appear here when we connect
                the React application to the API.
              </p>
            </div>
          </article>

          <aside className="panel categories-panel">
            <div className="panel-header">
              <div>
                <p className="panel-label">Organization</p>
                <h2>Categories</h2>
              </div>
            </div>

            <div className="category-placeholder">
              <span className="category-dot" />

              <p>
                Categories will be displayed here after the first
                API request.
              </p>
            </div>
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