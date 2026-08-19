import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  createTaskCategory,
  deleteTaskCategory,
  updateTaskCategory,
} from '../api/taskCategoriesApi'
import type { TaskCategory } from '../types/taskCategory'

interface CategoryManagerProps {
  categories: TaskCategory[]
  onCategoryCreated: (category: TaskCategory) => void
  onCategoryUpdated: (category: TaskCategory) => void
  onCategoryDeleted: (categoryId: string) => void
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

export function CategoryManager({
  categories,
  onCategoryCreated,
  onCategoryUpdated,
  onCategoryDeleted,
}: CategoryManagerProps) {
  const [name, setName] = useState('')
  const [categoryToEdit, setCategoryToEdit] =
    useState<TaskCategory | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingCategoryId, setDeletingCategoryId] =
    useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isEditing = categoryToEdit !== null

  function resetForm() {
    setName('')
    setCategoryToEdit(null)
    setError(null)
  }

  function handleEdit(category: TaskCategory) {
    setCategoryToEdit(category)
    setName(category.name)
    setError(null)
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (name.trim().length === 0) {
      setError('Category name is required.')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      if (categoryToEdit !== null) {
        const updatedCategory =
          await updateTaskCategory(
            categoryToEdit.id,
            { name },
          )

        onCategoryUpdated(updatedCategory)
      } else {
        const createdCategory =
          await createTaskCategory({ name })

        onCategoryCreated(createdCategory)
      }

      resetForm()
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

  async function handleDelete(category: TaskCategory) {
    const confirmed = window.confirm(
      `Delete category "${category.name}"?`,
    )

    if (!confirmed) {
      return
    }

    try {
      setDeletingCategoryId(category.id)
      setError(null)

      await deleteTaskCategory(category.id)

      onCategoryDeleted(category.id)

      if (categoryToEdit?.id === category.id) {
        resetForm()
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'An unexpected error occurred.',
      )
    } finally {
      setDeletingCategoryId(null)
    }
  }

  return (
    <div className="category-manager">
      <form
        className="category-form"
        onSubmit={handleSubmit}
      >
        <label className="form-field">
          <span>
            {isEditing
              ? 'Edit category'
              : 'New category'}
          </span>

          <div className="category-form-row">
            <input
              type="text"
              value={name}
              maxLength={80}
              placeholder="Example: Personal"
              required
              onChange={(event) =>
                setName(event.target.value)
              }
            />

            {isEditing && (
              <button
                className="ghost-button"
                type="button"
                disabled={isSubmitting}
                onClick={resetForm}
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
                  ? 'Save'
                  : 'Add'}
            </button>
          </div>
        </label>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </form>

      {categories.length === 0 ? (
        <div className="category-placeholder">
          <span className="category-dot" />
          <p>No categories have been created yet.</p>
        </div>
      ) : (
        <ul className="category-list">
          {categories.map((category) => (
            <li
              className="category-item"
              key={category.id}
            >
              <div className="category-summary">
                <span className="category-dot" />

                <div>
                  <strong>{category.name}</strong>
                  <small>
                    Created {formatDate(category.createdAtUtc)}
                  </small>
                </div>
              </div>

              <div className="category-actions">
                <button
                  className="category-action-button"
                  type="button"
                  disabled={
                    isSubmitting ||
                    deletingCategoryId === category.id
                  }
                  onClick={() => handleEdit(category)}
                >
                  Edit
                </button>

                <button
                  className="category-delete-button"
                  type="button"
                  disabled={
                    isSubmitting ||
                    deletingCategoryId === category.id
                  }
                  onClick={() => {
                    void handleDelete(category)
                  }}
                >
                  {deletingCategoryId === category.id
                    ? 'Deleting...'
                    : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}