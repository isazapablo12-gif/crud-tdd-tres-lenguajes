import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DatabaseSync } from 'node:sqlite'

import express from 'express'

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

