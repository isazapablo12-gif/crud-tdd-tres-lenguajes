# Guiones de evidencia TDD

Estos guiones producen las ejecuciones y las capturas de
[`docs/evidencias-visuales.md`](../../docs/evidencias-visuales.md). No forman parte
de ninguna de las tres aplicaciones: son herramientas para demostrar cómo se
construyeron.

## Cómo se usan

Desde VS Code, con la carpeta del proyecto abierta: **Terminal → Ejecutar tarea…**
y elegir la evidencia. Las tareas están declaradas en [`../tasks.json`](../tasks.json).

| Guion | Qué hace |
| --- | --- |
| `01-suite-python.ps1` | pytest con cobertura sobre `python-fastapi` |
| `02-suite-javascript.ps1` | Vitest con cobertura sobre `javascript-vue` |
| `03-suite-php.ps1` | PHPUnit en formato `--testdox` sobre `php-laravel` |
| `04-ciclo-python.ps1` | La prueba de creación contra `d034d7a` (falla) y `5ff760d` (pasa) |
| `05-ciclo-javascript.ps1` | Lo mismo contra `9790944` y `bedc127` |
| `06-ciclo-php.ps1` | Lo mismo contra `9557c74` y `f88e046` |
| `07-historial-git.ps1` | El historial filtrado a los pares `test(...)` y `feat(...)` |

## Piezas auxiliares

- `comun.ps1` — rutas y funciones compartidas. Las copias de trabajo se buscan en
  `%TEMP%\claude\tdd-evidencias`; se puede cambiar con la variable de entorno
  `TDD_ARBOLES`.
- `capturar.ps1` — guarda la pantalla principal en un PNG.
- `sesion-capturas.ps1` y `vigilante-capturas.ps1` — ejecutan las siete evidencias
  seguidas y capturan cada una. El primero corre dentro de VS Code y el segundo
  por fuera; se coordinan con archivos de señal, de modo que la captura ocurre
  cuando la salida ya está completa en pantalla.

## Requisito de las evidencias 4, 5 y 6

Necesitan los commits antiguos materializados con `git worktree`. El apéndice de
[`docs/evidencias-visuales.md`](../../docs/evidencias-visuales.md) explica cómo
crearlos, incluida la advertencia sobre por qué `vendor` de PHP debe copiarse y
no enlazarse.
