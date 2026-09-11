const baseUrl = '/api/tasks'

export function listTasks() {
  return request(baseUrl)
}

export function createTask(task) {
  return request(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  })
}

export function updateTask(id, task) {
  return request(`${baseUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  })
}

export function deleteTask(id) {
  return request(`${baseUrl}/${id}`, { method: 'DELETE' })
}

async function request(url, options) {
  const response = await fetch(url, options)
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    const message = body.error ?? 'No fue posible completar la solicitud'
    throw new Error(message)
  }

  if (response.status === 204) {
    return undefined
  }

  return response.json()
}

