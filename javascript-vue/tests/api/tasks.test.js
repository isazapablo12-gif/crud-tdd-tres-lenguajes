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
})
