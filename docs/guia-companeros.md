# Guía para estudiar, probar y exponer el proyecto

Esta guía está dirigida a los integrantes que estudiarán el repositorio y
presentarán una de las implementaciones. Los comandos definitivos se completarán
y verificarán a medida que cada aplicación quede terminada.

## Qué debe poder hacer cada expositor

Cada compañero debe poder:

1. Explicar qué parte del proyecto utiliza su lenguaje.
2. Identificar las operaciones CRUD y sus rutas.
3. Ejecutar las pruebas automatizadas.
4. Ejecutar la aplicación.
5. crear, consultar, actualizar y eliminar una tarea.
6. Mostrar un caso inválido y explicar el código HTTP recibido.
7. Explicar un ciclo rojo-verde-refactorización del historial.

## Reparto sugerido

| Expositor | Tema principal | Aspectos que debe explicar |
| --- | --- | --- |
| 1 | JavaScript, Vue y Express | Componentes, consumo de API, pruebas de interfaz y CRUD visual |
| 2 | Python y FastAPI | Rutas, validación, persistencia y pruebas con pytest |
| 3 | PHP y Laravel | Rutas, controlador, modelo, migración y pruebas Feature con Pest |

## Guion común de cinco minutos

1. Presentar brevemente el lenguaje y las herramientas.
2. Mostrar la estructura de la carpeta correspondiente.
3. Ejecutar la suite y enseñar que todas las pruebas pasan.
4. Levantar la aplicación.
5. Demostrar Create, Read, Update y Delete.
6. Mostrar una validación o un 404.
7. Enseñar en Git un ciclo TDD representativo.

## Preguntas que todos deben poder responder

- ¿Qué significan Create, Read, Update y Delete?
- ¿Qué diferencia existe entre una prueba unitaria y una prueba de integración?
- ¿Qué significan rojo, verde y refactorización?
- ¿Por qué la base de pruebas está separada de la base de desarrollo?
- ¿Por qué una entrada inválida produce 422?
- ¿Por qué un identificador inexistente produce 404?
- ¿Qué comprueba GitHub Actions?

## Regla para estudiar

No basta con memorizar comandos. Cada expositor debe leer al menos una prueba,
localizar el código que la hace pasar y relacionarla con un criterio de aceptación
de `contrato-api.md`.

