# Contrato común de la API

Todas las rutas reciben y devuelven JSON. El prefijo común es `/api/tasks`.

## Representación de una tarea

```json
{
  "id": 1,
  "title": "Preparar exposición",
  "description": "Repasar el ciclo TDD",
  "completed": false
}
```

## 1. Crear una tarea

`POST /api/tasks`

Solicitud mínima:

```json
{
  "title": "Preparar exposición"
}
```

Solicitud completa:

```json
{
  "title": "Preparar exposición",
  "description": "Repasar el ciclo TDD",
  "completed": false
}
```

Respuesta válida: HTTP 201 con la tarea creada.

Reglas:

- `title` es obligatorio y no puede contener solamente espacios.
- `description` es opcional y toma el valor `null` cuando se omite.
- `completed` es opcional y toma el valor `false` cuando se omite.
- Los espacios de los extremos de `title` se eliminan antes de guardar.

## 2. Listar tareas

`GET /api/tasks`

Respuesta válida: HTTP 200 con un arreglo ordenado por `id` ascendente.

Cuando no existen tareas:

```json
[]
```

## 3. Consultar una tarea

`GET /api/tasks/{id}`

Respuesta válida: HTTP 200 con una tarea.

Si no existe: HTTP 404 con un mensaje legible.

## 4. Actualizar una tarea

`PUT /api/tasks/{id}`

El `PUT` representa el estado editable completo, por lo cual se envían los tres
campos editables:

```json
{
  "title": "Exponer el proyecto",
  "description": "Mostrar las tres implementaciones",
  "completed": true
}
```

Respuesta válida: HTTP 200 con la tarea actualizada.

Si no existe: HTTP 404. Si los datos son inválidos: HTTP 422.

## 5. Eliminar una tarea

`DELETE /api/tasks/{id}`

Respuesta válida: HTTP 204 sin cuerpo.

Si no existe: HTTP 404 con un mensaje legible.

## Matriz de comportamientos obligatorios

| Caso | Respuesta esperada |
| --- | --- |
| Listar sin registros | 200 y `[]` |
| Crear con datos válidos | 201 y tarea persistida |
| Crear sin `title` | 422 |
| Crear con `title` vacío | 422 |
| Crear con `title` de más de 100 caracteres | 422 |
| Consultar un ID existente | 200 y tarea correcta |
| Consultar un ID inexistente | 404 |
| Actualizar una tarea existente | 200 y datos persistidos |
| Actualizar con datos inválidos | 422 |
| Actualizar un ID inexistente | 404 |
| Eliminar una tarea existente | 204 y registro eliminado |
| Eliminar un ID inexistente | 404 |

