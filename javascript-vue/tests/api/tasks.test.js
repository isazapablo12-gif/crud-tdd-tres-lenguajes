import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import request from 'supertest'

import { createApp } from '../../server/app.js'

describe('Tasks API', () => {
  let app
  let database

  beforeEach(() => {
    const application = createApp({ databasePath: ':memory:' })
    app = application.app
    database = application.database
  })

  afterEach(() => {
    database.close()
  })

  test('lists an empty task collection', async () => {
    const response = await request(app).get('/api/tasks')

    expect(response.status).toBe(200)
    expect(response.body).toEqual([])
  })

  test('creates and persists a valid task', async () => {
    const response = await request(app).post('/api/tasks').send({
      title: 'Preparar exposición',
      description: 'Repasar el ciclo TDD',
    })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      id: 1,
      title: 'Preparar exposición',
      description: 'Repasar el ciclo TDD',
      completed: false,
    })

    const listResponse = await request(app).get('/api/tasks')
    expect(listResponse.body).toEqual([response.body])
  })

  test.each([
    [{}, 'missing title'],
    [{ title: '   ' }, 'blank title'],
    [{ title: 'a'.repeat(101) }, 'long title'],
    [{ title: 'Valid', description: 'a'.repeat(501) }, 'long description'],
  ])('rejects an invalid task: %s (%s)', async (payload) => {
    const response = await request(app).post('/api/tasks').send(payload)

    expect(response.status).toBe(422)
    expect(response.body).toHaveProperty('errors')
  })

  test('trims the title before validating and saving it', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({ title: `  ${'a'.repeat(100)}  ` })

    expect(response.status).toBe(201)
    expect(response.body.title).toHaveLength(100)
  })

  test('gets an existing task by id', async () => {
    const created = await createTask(app, { title: 'Documentar' })

    const response = await request(app).get(`/api/tasks/${created.id}`)

    expect(response.status).toBe(200)
    expect(response.body).toEqual(created)
  })

  test('returns 404 when a task does not exist', async () => {
    const response = await request(app).get('/api/tasks/999')

    expect(response.status).toBe(404)
    expect(response.body).toEqual({ error: 'Task not found' })
  })

  test('updates an existing task and persists the changes', async () => {
    const created = await createTask(app, { title: 'Borrador' })
    const payload = {
      title: 'Versión final',
      description: 'Lista para exponer',
      completed: true,
    }

    const response = await request(app)
      .put(`/api/tasks/${created.id}`)
      .send(payload)

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ id: created.id, ...payload })

    const getResponse = await request(app).get(`/api/tasks/${created.id}`)
    expect(getResponse.body).toEqual(response.body)
  })

  test('rejects invalid data when updating a task', async () => {
    const created = await createTask(app, { title: 'Borrador' })

    const response = await request(app)
      .put(`/api/tasks/${created.id}`)
      .send({ title: '   ', description: null, completed: false })

    expect(response.status).toBe(422)
  })

  test('returns 404 when updating a missing task', async () => {
    const response = await request(app).put('/api/tasks/999').send({
      title: 'No existe',
      description: null,
      completed: false,
    })

    expect(response.status).toBe(404)
    expect(response.body).toEqual({ error: 'Task not found' })
  })

  test('deletes an existing task', async () => {
    const created = await createTask(app, { title: 'Temporal' })

    const response = await request(app).delete(`/api/tasks/${created.id}`)

    expect(response.status).toBe(204)
    expect(response.text).toBe('')

    const getResponse = await request(app).get(`/api/tasks/${created.id}`)
    expect(getResponse.status).toBe(404)
  })

  test('returns 404 when deleting a missing task', async () => {
    const response = await request(app).delete('/api/tasks/999')

    expect(response.status).toBe(404)
    expect(response.body).toEqual({ error: 'Task not found' })
  })
})

async function createTask(app, payload) {
  const response = await request(app).post('/api/tasks').send(payload)
  return response.body
}
