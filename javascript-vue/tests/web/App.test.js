// @vitest-environment jsdom

import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import App from '../../src/App.vue'
import * as tasksApi from '../../src/api/tasksApi.js'

vi.mock('../../src/api/tasksApi.js', () => ({
  createTask: vi.fn(),
  deleteTask: vi.fn(),
  listTasks: vi.fn(),
  updateTask: vi.fn(),
}))

describe('Tasks application', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    tasksApi.listTasks.mockResolvedValue([])
  })

  test('loads tasks and shows the empty state', async () => {
    const wrapper = mount(App)
    await flushPromises()

    expect(tasksApi.listTasks).toHaveBeenCalledOnce()
    expect(wrapper.text()).toContain('No hay tareas todavía')
  })

  test('renders tasks returned by the API', async () => {
    tasksApi.listTasks.mockResolvedValue([
      {
        id: 1,
        title: 'Estudiar Vue',
        description: 'Revisar componentes',
        completed: false,
      },
    ])

    const wrapper = mount(App)
    await flushPromises()

    expect(wrapper.text()).toContain('Estudiar Vue')
    expect(wrapper.text()).toContain('Revisar componentes')
    expect(wrapper.text()).toContain('Pendiente')
  })

  test('creates a task from the form and adds it to the list', async () => {
    const created = {
      id: 1,
      title: 'Preparar exposición',
      description: 'Ensayar CRUD',
      completed: false,
    }
    tasksApi.createTask.mockResolvedValue(created)
    const wrapper = mount(App)
    await flushPromises()

    await wrapper.get('input[name="title"]').setValue(created.title)
    await wrapper
      .get('textarea[name="description"]')
      .setValue(created.description)
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(tasksApi.createTask).toHaveBeenCalledWith({
      title: created.title,
      description: created.description,
      completed: false,
    })
    expect(wrapper.text()).toContain(created.title)
    expect(wrapper.get('input[name="title"]').element.value).toBe('')
  })

  test('edits an existing task from the form', async () => {
    const original = {
      id: 1,
      title: 'Borrador',
      description: null,
      completed: false,
    }
    const updated = {
      id: 1,
      title: 'Versión final',
      description: 'Lista para exponer',
      completed: true,
    }
    tasksApi.listTasks.mockResolvedValue([original])
    tasksApi.updateTask.mockResolvedValue(updated)
    const wrapper = mount(App)
    await flushPromises()

    await wrapper.get('[data-test="edit-1"]').trigger('click')
    await wrapper.get('input[name="title"]').setValue(updated.title)
    await wrapper
      .get('textarea[name="description"]')
      .setValue(updated.description)
    await wrapper.get('input[name="completed"]').setValue(true)
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(tasksApi.updateTask).toHaveBeenCalledWith(1, {
      title: updated.title,
      description: updated.description,
      completed: true,
    })
    expect(wrapper.text()).toContain(updated.title)
    expect(wrapper.text()).toContain('Completada')
  })

  test('deletes a task and returns to the empty state', async () => {
    tasksApi.listTasks.mockResolvedValue([
      { id: 1, title: 'Temporal', description: null, completed: false },
    ])
    tasksApi.deleteTask.mockResolvedValue(undefined)
    const wrapper = mount(App)
    await flushPromises()

    await wrapper.get('[data-test="delete-1"]').trigger('click')
    await flushPromises()

    expect(tasksApi.deleteTask).toHaveBeenCalledWith(1)
    expect(wrapper.text()).not.toContain('Temporal')
    expect(wrapper.text()).toContain('No hay tareas todavía')
  })

  test('validates a blank title before calling the API', async () => {
    const wrapper = mount(App)
    await flushPromises()

    await wrapper.get('input[name="title"]').setValue('   ')
    await wrapper.get('form').trigger('submit')

    expect(tasksApi.createTask).not.toHaveBeenCalled()
    expect(wrapper.get('[role="alert"]').text()).toContain(
      'El título es obligatorio',
    )
  })

  test('shows API errors to the user', async () => {
    tasksApi.createTask.mockRejectedValue(new Error('No se pudo guardar'))
    const wrapper = mount(App)
    await flushPromises()

    await wrapper.get('input[name="title"]').setValue('Tarea válida')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(wrapper.get('[role="alert"]').text()).toContain('No se pudo guardar')
  })
})
