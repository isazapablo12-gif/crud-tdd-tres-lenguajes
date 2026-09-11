<script setup>
import { onMounted, reactive, ref } from 'vue'

import {
  createTask,
  deleteTask,
  listTasks,
  updateTask,
} from './api/tasksApi.js'

const tasks = ref([])
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const editingId = ref(null)
const form = reactive({
  title: '',
  description: '',
  completed: false,
})

onMounted(loadTasks)

async function loadTasks() {
  try {
    tasks.value = await listTasks()
  } catch (requestError) {
    error.value = requestError.message
  } finally {
    loading.value = false
  }
}

async function submitTask() {
  error.value = ''
  const title = form.title.trim()
  if (!title) {
    error.value = 'El título es obligatorio'
    return
  }

  saving.value = true

  try {
    const payload = {
      title,
      description: form.description.trim() || null,
      completed: form.completed,
    }

    if (editingId.value === null) {
      const created = await createTask(payload)
      tasks.value.push(created)
    } else {
      const updated = await updateTask(editingId.value, payload)
      const index = tasks.value.findIndex((task) => task.id === editingId.value)
      tasks.value.splice(index, 1, updated)
    }

    resetForm()
  } catch (requestError) {
    error.value = requestError.message
  } finally {
    saving.value = false
  }
}

function startEditing(task) {
  editingId.value = task.id
  form.title = task.title
  form.description = task.description ?? ''
  form.completed = task.completed
  error.value = ''
}

function cancelEditing() {
  resetForm()
  error.value = ''
}

async function removeTask(taskId) {
  error.value = ''
  try {
    await deleteTask(taskId)
    tasks.value = tasks.value.filter((task) => task.id !== taskId)
    if (editingId.value === taskId) {
      resetForm()
    }
  } catch (requestError) {
    error.value = requestError.message
  }
}

function resetForm() {
  editingId.value = null
  form.title = ''
  form.description = ''
  form.completed = false
}
</script>

<template>
  <main class="page-shell">
    <header class="hero">
      <p class="eyebrow">JavaScript · Vue · Express</p>
      <h1>Mis tareas</h1>
      <p>Un CRUD visual construido mediante desarrollo guiado por pruebas.</p>
    </header>

    <section class="panel" aria-labelledby="form-title">
      <h2 id="form-title">
        {{ editingId === null ? 'Nueva tarea' : 'Editar tarea' }}
      </h2>
      <form @submit.prevent="submitTask">
        <label for="task-title">Título</label>
        <input
          id="task-title"
          v-model="form.title"
          name="title"
          maxlength="100"
          required
        />

        <label for="task-description">Descripción</label>
        <textarea
          id="task-description"
          v-model="form.description"
          name="description"
          maxlength="500"
          rows="3"
        />

        <label class="checkbox-row">
          <input v-model="form.completed" name="completed" type="checkbox" />
          Completada
        </label>

        <div class="form-actions">
          <button type="submit" :disabled="saving">
            {{
              saving
                ? 'Guardando…'
                : editingId === null
                  ? 'Crear tarea'
                  : 'Guardar cambios'
            }}
          </button>
          <button
            v-if="editingId !== null"
            class="secondary"
            type="button"
            @click="cancelEditing"
          >
            Cancelar
          </button>
        </div>
      </form>
    </section>

    <p v-if="error" class="message error" role="alert">{{ error }}</p>

    <section class="panel" aria-labelledby="list-title">
      <div class="section-heading">
        <h2 id="list-title">Listado</h2>
        <span class="counter">{{ tasks.length }}</span>
      </div>

      <p v-if="loading" class="message">Cargando tareas…</p>
      <p v-else-if="tasks.length === 0" class="message">
        No hay tareas todavía
      </p>

      <ul v-else class="task-list">
        <li v-for="task in tasks" :key="task.id" class="task-card">
          <div class="task-copy">
            <h3>{{ task.title }}</h3>
            <p v-if="task.description">{{ task.description }}</p>
          </div>
          <div class="task-actions">
            <span :class="['status', { done: task.completed }]">
              {{ task.completed ? 'Completada' : 'Pendiente' }}
            </span>
            <button
              class="small secondary"
              type="button"
              :data-test="`edit-${task.id}`"
              @click="startEditing(task)"
            >
              Editar
            </button>
            <button
              class="small danger"
              type="button"
              :data-test="`delete-${task.id}`"
              @click="removeTask(task.id)"
            >
              Eliminar
            </button>
          </div>
        </li>
      </ul>
    </section>
  </main>
</template>
