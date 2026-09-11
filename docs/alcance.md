# Alcance del proyecto

## Problema

Se construirá un administrador de tareas tres veces, una por cada lenguaje. El
dominio se mantiene intencionalmente pequeño para concentrar el trabajo en CRUD,
pruebas automatizadas y TDD.

## Entidad Task

| Campo | Tipo | Obligatorio | Regla |
| --- | --- | --- | --- |
| `id` | entero positivo | generado | Identificador autoincremental |
| `title` | texto | sí | Entre 1 y 100 caracteres después de quitar espacios en los extremos |
| `description` | texto o `null` | no | Máximo 500 caracteres |
| `completed` | booleano | sí en actualización | `false` por defecto al crear |

## Historias de usuario

1. Como usuario, quiero crear una tarea para registrar algo pendiente.
2. Como usuario, quiero ver todas las tareas para conocer su estado.
3. Como usuario, quiero consultar una tarea para revisar sus detalles.
4. Como usuario, quiero actualizar una tarea para corregirla o completarla.
5. Como usuario, quiero eliminar una tarea que ya no necesito.

## Criterios de aceptación

- Una tarea válida se guarda y recibe un identificador.
- El listado se ordena por `id` de menor a mayor.
- Una consulta por identificador devuelve la tarea correcta.
- Una actualización reemplaza los datos editables de una tarea existente.
- Una eliminación remueve definitivamente la tarea.
- Consultar, actualizar o eliminar un identificador inexistente devuelve HTTP 404.
- Crear o actualizar con datos inválidos devuelve HTTP 422.
- Cada prueba utiliza almacenamiento aislado y repetible.
- Las tres implementaciones pueden ejecutarse de manera independiente.
- La implementación JavaScript incluye una interfaz creada con Vue.

## Fuera del alcance

Para mantener una complejidad apropiada para la actividad, no se incluirán:

- Autenticación ni autorización.
- Usuarios, roles o permisos.
- Relaciones entre tablas.
- Archivos adjuntos.
- Paginación, filtros o búsqueda avanzada.
- Notificaciones.
- Despliegue de producción.
- Sincronización de datos entre las tres aplicaciones.

## Decisiones técnicas

- Cada implementación usa su propia base SQLite.
- Las bases locales y de pruebas no se versionan en Git.
- Las respuestas exitosas comparten la misma estructura JSON.
- El cuerpo concreto de los errores puede conservar el estilo de cada framework,
  pero siempre debe incluir un mensaje legible y el código HTTP acordado.
- Las versiones exactas de dependencias quedan registradas en los archivos de
  bloqueo de cada ecosistema.

