. (Join-Path $PSScriptRoot 'comun.ps1')

$prueba = 'test_valid_payload_creates_task_and_returns_201'

Write-Titulo 'EVIDENCIA 6  -  Ciclo TDD en PHP  -  crear y validar una tarea'
Write-Host '  La MISMA prueba se ejecuta contra dos commits consecutivos del historial.' -ForegroundColor Gray

Write-Paso 'ROJO  ' '9557c74' 'test(php): define creacion y validacion' 'Red'
Push-Location (Join-Path $RaizArboles 'php-9557c74\php-laravel')
try { & '.\vendor\bin\phpunit' --testdox --filter=$prueba }
finally { Pop-Location }

Write-Paso 'VERDE ' 'f88e046' 'feat(php): crea y valida tareas' 'Green'
Push-Location (Join-Path $RaizArboles 'php-f88e046\php-laravel')
try { & '.\vendor\bin\phpunit' --testdox --filter=$prueba }
finally { Pop-Location }
