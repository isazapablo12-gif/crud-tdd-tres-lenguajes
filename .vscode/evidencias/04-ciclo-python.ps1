. (Join-Path $PSScriptRoot 'comun.ps1')

$prueba = 'tests/test_tasks_api.py::test_create_task_persists_and_returns_it'

Write-Titulo 'EVIDENCIA 4  -  Ciclo TDD en Python  -  crear y persistir una tarea'
Write-Host '  La MISMA prueba se ejecuta contra dos commits consecutivos del historial.' -ForegroundColor Gray
Write-Host '  Primero contra el commit que solo agrega la prueba, despues contra el que agrega el codigo.' -ForegroundColor Gray

Write-Paso 'ROJO  ' 'd034d7a' 'test(python): define creacion y persistencia' 'Red'
Push-Location (Join-Path $RaizArboles 'py-d034d7a\python-fastapi')
try { & $PythonVenv -m pytest -q -p no:warnings $prueba }
finally { Pop-Location }

Write-Paso 'VERDE ' '5ff760d' 'feat(python): crea y persiste tareas en SQLite' 'Green'
Push-Location (Join-Path $RaizArboles 'py-5ff760d\python-fastapi')
try { & $PythonVenv -m pytest -q -p no:warnings $prueba }
finally { Pop-Location }
