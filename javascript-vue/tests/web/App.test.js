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
})

