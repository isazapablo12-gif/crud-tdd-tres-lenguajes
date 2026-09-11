# CRUD con TDD en tres lenguajes

Proyecto académico que implementa el mismo CRUD de tareas en tres lenguajes
diferentes y aplica desarrollo guiado por pruebas (TDD).

## Implementaciones

| Carpeta | Lenguaje | Tecnologías | Alcance |
| --- | --- | --- | --- |
| `javascript-vue/` | JavaScript | Vue 3, Express, SQLite y Vitest | API REST e interfaz web |
| `python-fastapi/` | Python | FastAPI, SQLite y pytest | API REST |
| `php-laravel/` | PHP | Laravel, SQLite y Pest | API REST |

Las tres aplicaciones son independientes, almacenan sus propios datos y
respetan el contrato descrito en [`docs/contrato-api.md`](docs/contrato-api.md).

## Objetivo académico

El repositorio permite demostrar:

- Las operaciones Create, Read, Update y Delete.
- La implementación de una misma especificación en tres lenguajes.
- El uso de Vue como framework de frontend.
- El ciclo TDD: rojo, verde y refactorización.
- Pruebas automatizadas aisladas de los datos de desarrollo.
- Colaboración y revisión mediante Git y GitHub.

## Documentación

- [`docs/alcance.md`](docs/alcance.md): requisitos y límites del proyecto.
- [`docs/contrato-api.md`](docs/contrato-api.md): comportamiento común de las API.
- [`docs/estrategia-tdd.md`](docs/estrategia-tdd.md): forma de trabajo y evidencia TDD.
- [`docs/guia-companeros.md`](docs/guia-companeros.md): guía para estudiar, probar y exponer cada lenguaje.

## Estado

El proyecto se encuentra en construcción. Cada implementación tendrá su propio
README con instrucciones verificadas de instalación, ejecución y pruebas.

