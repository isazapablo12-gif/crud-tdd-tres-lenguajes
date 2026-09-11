# Estrategia TDD

## Ciclo de trabajo

Cada comportamiento se implementa mediante un ciclo pequeño:

1. **Rojo:** escribir una prueba que describa un comportamiento todavía ausente.
2. Ejecutar la prueba y comprobar que falla por la razón esperada.
3. **Verde:** agregar el código mínimo para hacerla pasar.
4. Ejecutar la prueba nueva y después la suite completa.
5. **Refactorización:** mejorar la estructura sin alterar el comportamiento.
6. Ejecutar nuevamente toda la suite.

## Orden de implementación

El mismo orden se utilizará en Python, JavaScript y PHP:

1. Listar una colección vacía.
2. Crear una tarea válida.
3. Validar título obligatorio, título vacío y longitud máxima.
4. Listar tareas persistidas.
5. Consultar por identificador y manejar 404.
6. Actualizar una tarea y manejar validación y 404.
7. Eliminar una tarea y manejar 404.

Para Vue se agregarán pruebas de interacción:

1. Mostrar estado vacío.
2. Mostrar tareas devueltas por la API.
3. Validar y enviar el formulario de creación.
4. Editar una tarea.
5. Eliminar una tarea.
6. Mostrar errores de comunicación.

## Convención de commits

```text
test(python): define listado vacío
feat(python): implementa listado mínimo
refactor(python): extrae repositorio de tareas
```

Se conservarán commits pequeños cuando resulte práctico. Un commit `test` puede
estar rojo temporalmente en su rama; la cabeza del pull request debe quedar verde.
No se hará squash de los ciclos cuya historia sea necesaria como evidencia.

## Evidencia

La evidencia se compondrá de:

- Pruebas automatizadas dentro de cada proyecto.
- Historial de commits con prefijos `test`, `feat` y `refactor`.
- Ejecuciones de integración continua en GitHub Actions.
- Una tabla final de ciclos y pruebas en este documento o en un anexo.

## Aislamiento de pruebas

- Las pruebas nunca modifican la base de desarrollo.
- Cada suite crea una base temporal o en memoria.
- Los datos de una prueba no deben filtrarse a otra.
- El orden de ejecución no debe modificar el resultado.
- No se harán solicitudes a servicios externos.

## Cobertura

La cobertura es un indicador complementario, no una demostración de TDD. La meta
inicial será cubrir al menos el 80 % del código propio, priorizando comportamientos
y ramas relevantes sobre líneas triviales de configuración.

