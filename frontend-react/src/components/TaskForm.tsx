import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import {
  createTaskItem,
  updateTaskItem,
} from '../api/taskItemsApi'
import type { TaskCategory } from '../types/taskCategory'
import type { TaskItem } from '../types/taskItem'

interface TaskFormProps {
  categories: TaskCategory[]
  taskToEdit: TaskItem | null
  onTaskSaved: (task: TaskItem) => void
  onCancelEdit: () => void
}

function toDateTimeLocal(value: string | null) {
  if (value === null) {
    return ''
  }

  const date = new Date(value)
  const timezoneOffset = date.getTimezoneOffset()

  return new Date(
    date.getTime() - timezoneOffset * 60_000,
  )
    .toISOString()
    .slice(0, 16)
}

export function TaskForm({
  categories,
  taskToEdit,
  onTaskSaved,
  onCancelEdit,
}: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [categoryId, setCategoryId] = useState(
    categories[0]?.id ?? '',
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEditing = taskToEdit !== null

  useEffect(() => {
    if (taskToEdit !== null) {
      setTitle(taskToEdit.title)
      setDescription(taskToEdit.description ?? '')
      setDueDate(toDateTimeLocal(taskToEdit.dueDateUtc))
      setCategoryId(taskToEdit.categoryId)
    } else {
      setTitle('')
      setDescription('')
      setDueDate('')
      setCategoryId(categories[0]?.id ?? '')
    }

    setError(null)
  }, [taskToEdit, categories])

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

      const request = {
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
      }

      const savedTask = isEditing
        ? await updateTaskItem(taskToEdit.id, request)
        : await createTaskItem(request)

      onTaskSaved(savedTask)

      if (!isEditing) {
        setTitle('')
        setDescription('')
        setDueDate('')
      }
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
          <p className="panel-label">
            {isEditing ? 'Update item' : 'New item'}
          </p>

          <h2>
            {isEditing ? 'Edit task' : 'Create a task'}
          </h2>
        </div>

        <p>
          {isEditing
            ? 'Modify the selected task.'
            : 'Add something you want to complete.'}
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
            onChange={(event) =>
              setTitle(event.target.value)
            }
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
          {isEditing && (
            <button
              className="ghost-button"
              type="button"
              disabled={isSubmitting}
              onClick={onCancelEdit}
            >
              Cancel
            </button>
          )}

          <button
            className="primary-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Saving...'
              : isEditing
                ? 'Save changes'
                : 'Create task'}
          </button>
        </div>
      </form>
    </section>
  )
}