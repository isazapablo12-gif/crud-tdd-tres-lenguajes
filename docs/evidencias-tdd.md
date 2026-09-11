# Evidencias del proceso TDD

El historial se diseñó para que el proceso sea auditable. En cada fila, el primer commit agrega una prueba que falla por una capacidad todavía ausente y el segundo agrega la implementación mínima que recupera el estado verde.

## Python y FastAPI

| Comportamiento | Commit rojo | Commit verde |
| --- | --- | --- |
| Listado vacío | `e2ab51b` | `4007544` |
| Crear y persistir | `dc7f609` | `64484b3` |
| Validar y normalizar título | `ecb2695` | `5cf297d` |
| Consultar por ID y devolver 404 | `198a0ec` | `2b37686` |
| Actualizar y validar | `40031a1` | `11f8366` |
| Eliminar y devolver 404 | `c770567` | `75cb4ea` |
| Validar límites después de normalizar | `218a76a` | `45d18f5` |

Verificación final local: 14 pruebas aprobadas y 98 % de cobertura del código de `app`.

## JavaScript, Express y Vue

| Comportamiento | Commit rojo | Commit verde |
| --- | --- | --- |
| Listado vacío de la API | `24c5685` | `76c376c` |
| Crear y validar en la API | `248c9e6` | `126fb1d` |
| Consultar por ID y devolver 404 | `23a59ee` | `cb2543d` |
| Actualizar una tarea | `c388398` | `f252999` |
| Eliminar una tarea | `c9489ab` | `2dcf84f` |
| Cargar y crear desde Vue | `876544f` | `e9ce970` |
| Editar, eliminar y mostrar errores en Vue | `b08c783` | `12f524f` |

El commit `71bd90f` agrega pruebas de caracterización del cliente HTTP cuando su comportamiento ya estaba presente. Se conserva como cobertura de regresión, pero no se presenta como un par rojo-verde.

Verificación final local: 25 pruebas aprobadas y más de 90 % en las cuatro métricas de cobertura. También pasó la compilación de producción de Vite.

## PHP y Laravel

| Comportamiento | Commit rojo | Commit verde |
| --- | --- | --- |
| Listado vacío | `239e6e7` | `06b4c33` |
| Crear y validar | `58e8ce9` | `9d10be2` |
| Consultar por ID y devolver 404 | `6c7469c` | `e0b9c83` |
| Actualizar y validar | `3124709` | `e48a406` |
| Eliminar y devolver 404 | `a991ae9` | `a672bf2` |

El commit `26f7eb6` agrega una prueba de caracterización sobre el orden y la representación del listado. Como ya pasaba al escribirse, se clasifica como protección de regresión y no como ciclo TDD rojo-verde.

Verificación final local: 17 pruebas y 52 aserciones aprobadas. Pint confirmó el formato y Composer no encontró avisos de seguridad en las dependencias bloqueadas.

## Cómo presentar una pareja

El ejemplo de Python puede inspeccionarse así:

```powershell
git show dc7f609
git show 64484b3
git diff dc7f609^ 64484b3
```

Durante la explicación conviene señalar:

1. Qué criterio de aceptación expresa la prueba.
2. Por qué fallaba en el commit rojo.
3. Qué código mínimo apareció en el commit verde.
4. Qué regresión evita desde ese momento.

No es necesario cambiar el repositorio a un commit rojo para demostrarlo. `git show` permite estudiar la evidencia sin abandonar la rama estable.

## Resultado automatizado esperado

| Suite | Resultado local de referencia | Control adicional |
| --- | ---: | --- |
| Python | 14 pruebas | Cobertura mínima 80 % |
| JavaScript/Vue | 25 pruebas | Cobertura mínima 80 % y build |
| PHP/Laravel | 17 pruebas, 52 aserciones | Pint y Composer audit |
| Total | 56 pruebas | Tres trabajos de GitHub Actions |

Las cifras describen la versión actual y pueden aumentar si se añaden comportamientos. La condición de entrega es que todas las suites sigan verdes.

