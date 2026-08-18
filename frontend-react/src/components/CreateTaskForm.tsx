import { useState } from 'react'
import type { FormEvent } from 'react'
import { createTaskItem } from '../api/taskItemsApi'
import type { TaskCategory } from '../types/taskCategory'
import type { TaskItem } from '../types/taskItem'

interface CreateTaskFormProps {
  categories: TaskCategory[]
  onTaskCreated: (task: TaskItem) => void
}

export function CreateTaskForm({
  categories,
  onTaskCreated,
}: CreateTaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [categoryId, setCategoryId] = useState(
    categories[0]?.id ?? '',
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (title.trim().length === 0) {
      setError('Task title is required.')
      return
    }

    if (categoryId.length === 0) {
      setError('A category is required.')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      const createdTask = await createTaskItem({
        title,
        description:
          description.trim().length > 0
            ? description
            : null,
        dueDateUtc:
          dueDate.length > 0
            ? new Date(dueDate).toISOString()
            : null,
        categoryId,
      })

      onTaskCreated(createdTask)

      setTitle('')
      setDescription('')
      setDueDate('')
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'An unexpected error occurred.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="create-task-panel">
      <div className="create-task-heading">
        <div>
          <p className="panel-label">New item</p>
          <h2>Create a task</h2>
        </div>

        <p>
          Add something you want to complete.
        </p>
      </div>

      <form
        className="create-task-form"
        onSubmit={handleSubmit}
      >
        <label className="form-field form-field--wide">
          <span>Title</span>

          <input
            type="text"
            value={title}
            maxLength={150}
            placeholder="Example: Study React components"
            required
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>

        <label className="form-field form-field--wide">
          <span>Description</span>

          <textarea
            value={description}
            maxLength={1000}
            rows={3}
            placeholder="Add optional details"
            onChange={(event) =>
              setDescription(event.target.value)
            }
          />
        </label>

        <label className="form-field">
          <span>Due date</span>

          <input
            type="datetime-local"
            value={dueDate}
            onChange={(event) =>
              setDueDate(event.target.value)
            }
          />
        </label>

        <label className="form-field">
          <span>Category</span>

          <select
            value={categoryId}
            required
            onChange={(event) =>
              setCategoryId(event.target.value)
            }
          >
            {categories.map((category) => (
              <option
                value={category.id}
                key={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </label>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <div className="form-actions">
          <button
            className="primary-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create task'}
          </button>
        </div>
      </form>
    </section>
  )
}