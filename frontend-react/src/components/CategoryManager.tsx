import { useState } from 'react'
import type { FormEvent } from 'react'
import { createTaskCategory } from '../api/taskCategoriesApi'
import type { TaskCategory } from '../types/taskCategory'

interface CategoryManagerProps {
  onCategoryCreated: (category: TaskCategory) => void
}

export function CategoryManager({
  onCategoryCreated,
}: CategoryManagerProps) {
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

      const category = await createTaskCategory({
        name,
      })

      onCategoryCreated(category)
      setName('')
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
    <form
      className="category-form"
      onSubmit={handleSubmit}
    >
      <label className="form-field">
        <span>New category</span>

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

          <button
            className="primary-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add'}
          </button>
        </div>
      </label>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}