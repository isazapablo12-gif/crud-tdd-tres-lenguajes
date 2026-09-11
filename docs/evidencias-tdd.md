# Evidencias del proceso TDD

El historial se diseñó para que el proceso sea auditable. En cada fila, el primer commit agrega una prueba que falla por una capacidad todavía ausente y el segundo agrega la implementación mínima que recupera el estado verde.

## Python y FastAPI

| Comportamiento | Commit rojo | Commit verde |
| --- | --- | --- |
| Listado vacío | `36cbcaf` | `38cf063` |
| Crear y persistir | `d034d7a` | `5ff760d` |
| Validar y normalizar título | `9eff3aa` | `5d2099f` |
| Consultar por ID y devolver 404 | `3eb9c9a` | `e1bdd5d` |
| Actualizar y validar | `18eb4a7` | `2962037` |
| Eliminar y devolver 404 | `19ddfd5` | `8e2b540` |
| Validar límites después de normalizar | `bf76048` | `c36e847` |

Verificación final local: 14 pruebas aprobadas y 98 % de cobertura del código de `app`.

## JavaScript, Express y Vue

| Comportamiento | Commit rojo | Commit verde |
| --- | --- | --- |
| Listado vacío de la API | `aabc231` | `9386e06` |
| Crear y validar en la API | `9790944` | `bedc127` |
| Consultar por ID y devolver 404 | `5d36eda` | `8abf6d9` |
| Actualizar una tarea | `7d80f77` | `5ffa3b9` |
| Eliminar una tarea | `d238bcf` | `eb46811` |
| Cargar y crear desde Vue | `e0ebe6c` | `b4302b6` |
| Editar, eliminar y mostrar errores en Vue | `dcf185e` | `0a5dd4a` |

El commit `a76ed1b` agrega pruebas de caracterización del cliente HTTP cuando su comportamiento ya estaba presente. Se conserva como cobertura de regresión, pero no se presenta como un par rojo-verde.

Verificación final local: 25 pruebas aprobadas y más de 90 % en las cuatro métricas de cobertura. También pasó la compilación de producción de Vite.

## PHP y Laravel

| Comportamiento | Commit rojo | Commit verde |
| --- | --- | --- |
| Listado vacío | `78f451b` | `c34058e` |
| Crear y validar | `9557c74` | `f88e046` |
| Consultar por ID y devolver 404 | `21ece0e` | `5e299b2` |
| Actualizar y validar | `515f755` | `c5d8b01` |
| Eliminar y devolver 404 | `e4e7b9e` | `dd2aff0` |

El commit `8c93ec6` agrega una prueba de caracterización sobre el orden y la representación del listado. Como ya pasaba al escribirse, se clasifica como protección de regresión y no como ciclo TDD rojo-verde.

Verificación final local: 17 pruebas y 52 aserciones aprobadas. Pint confirmó el formato y Composer no encontró avisos de seguridad en las dependencias bloqueadas.

## Cómo presentar una pareja

El ejemplo de Python puede inspeccionarse así:

```powershell
git show d034d7a
git show 5ff760d
git diff d034d7a^ 5ff760d
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

