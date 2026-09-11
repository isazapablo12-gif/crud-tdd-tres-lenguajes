// @vitest-environment jsdom

import { afterEach, describe, expect, test, vi } from 'vitest'

import {
  createTask,
  deleteTask,
  listTasks,
  updateTask,
} from '../../src/api/tasksApi.js'

describe('tasks API client', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('lists tasks from the REST API', async () => {
    const tasks = [{ id: 1, title: 'TDD', description: null, completed: false }]
    const fetchMock = vi.fn().mockResolvedValue(okResponse(tasks))
    vi.stubGlobal('fetch', fetchMock)

    await expect(listTasks()).resolves.toEqual(tasks)
    expect(fetchMock).toHaveBeenCalledWith('/api/tasks', undefined)
  })

  test('sends JSON when creating and updating', async () => {
    const task = { title: 'TDD', description: null, completed: false }
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(okResponse({ id: 1, ...task }, 201))
      .mockResolvedValueOnce(okResponse({ id: 1, ...task }))
    vi.stubGlobal('fetch', fetchMock)

    await createTask(task)
    await updateTask(1, task)

    expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    })
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/tasks/1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    })
  })

  test('handles a successful deletion without a response body', async () => {
    const fetchMock = vi.fn().mockResolvedValue(okResponse(undefined, 204))
    vi.stubGlobal('fetch', fetchMock)

    await expect(deleteTask(1)).resolves.toBeUndefined()
    expect(fetchMock).toHaveBeenCalledWith('/api/tasks/1', { method: 'DELETE' })
  })

  test('turns an API error into a JavaScript error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: vi.fn().mockResolvedValue({ error: 'Task not found' }),
      }),
    )

    await expect(listTasks()).rejects.toThrow('Task not found')
  })
})

function okResponse(body, status = 200) {
  return {
    ok: true,
    status,
    json: vi.fn().mockResolvedValue(body),
  }
}

