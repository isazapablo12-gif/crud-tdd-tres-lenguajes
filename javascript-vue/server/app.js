import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DatabaseSync } from 'node:sqlite'

import express from 'express'

import { validateTask } from './validation.js'

const currentDirectory = dirname(fileURLToPath(import.meta.url))
const defaultDatabasePath = resolve(currentDirectory, '..', 'data', 'tasks.sqlite')

export function createApp({ databasePath = defaultDatabasePath } = {}) {
  if (databasePath !== ':memory:') {
    mkdirSync(dirname(databasePath), { recursive: true })
  }

  const database = new DatabaseSync(databasePath)
  database.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      completed INTEGER NOT NULL DEFAULT 0
    )
  `)

  const app = express()
  app.use(express.json())

  app.get('/api/tasks', (_request, response) => {
    const tasks = database
      .prepare(
        'SELECT id, title, description, completed FROM tasks ORDER BY id',
      )
      .all()
      .map(toTask)

    response.json(tasks)
  })

  app.post('/api/tasks', (request, response) => {
    const { errors, value } = validateTask(request.body)
    if (Object.keys(errors).length > 0) {
      return response.status(422).json({ errors })
    }

    const result = database
      .prepare(
        `
          INSERT INTO tasks (title, description, completed)
          VALUES (?, ?, ?)
        `,
      )
      .run(value.title, value.description, Number(value.completed))
    const task = database
      .prepare(
        `
          SELECT id, title, description, completed
          FROM tasks
          WHERE id = ?
        `,
      )
      .get(result.lastInsertRowid)

    return response.status(201).json(toTask(task))
  })

  return { app, database }
}

function toTask(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    completed: Boolean(row.completed),
  }
}
