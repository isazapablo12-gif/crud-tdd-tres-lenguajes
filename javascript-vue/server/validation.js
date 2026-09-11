export function validateTask(payload, { requireCompleted = false } = {}) {
  const errors = {}
  const rawTitle = payload?.title
  const title = typeof rawTitle === 'string' ? rawTitle.trim() : ''

  if (!title) {
    errors.title = ['Title is required']
  } else if (title.length > 100) {
    errors.title = ['Title must not exceed 100 characters']
  }

  const description = payload?.description ?? null
  if (description !== null && typeof description !== 'string') {
    errors.description = ['Description must be a string or null']
  } else if (description?.length > 500) {
    errors.description = ['Description must not exceed 500 characters']
  }

  const completedWasProvided = Object.hasOwn(payload ?? {}, 'completed')
  const completed = completedWasProvided ? payload.completed : false
  if ((requireCompleted && !completedWasProvided) || typeof completed !== 'boolean') {
    errors.completed = ['Completed must be a boolean']
  }

  return {
    errors,
    value: { title, description, completed },
  }
}

