<script setup>
import { onMounted, reactive, ref } from 'vue'

import { createTask, listTasks } from './api/tasksApi.js'

const tasks = ref([])
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const form = reactive({
  title: '',
  description: '',
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
  saving.value = true

  try {
    const created = await createTask({
      title: form.title.trim(),
      description: form.description.trim() || null,
      completed: false,
    })
    tasks.value.push(created)
    form.title = ''
    form.description = ''
  } catch (requestError) {
    error.value = requestError.message
  } finally {
    saving.value = false
  }
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
      <h2 id="form-title">Nueva tarea</h2>
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

        <button type="submit" :disabled="saving">
          {{ saving ? 'Guardando…' : 'Crear tarea' }}
        </button>
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
          <div>
            <h3>{{ task.title }}</h3>
            <p v-if="task.description">{{ task.description }}</p>
          </div>
          <span :class="['status', { done: task.completed }]">
            {{ task.completed ? 'Completada' : 'Pendiente' }}
          </span>
        </li>
      </ul>
    </section>
  </main>
</template>

