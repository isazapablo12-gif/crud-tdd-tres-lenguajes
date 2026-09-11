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
})

