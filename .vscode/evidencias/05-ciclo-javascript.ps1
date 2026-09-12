. (Join-Path $PSScriptRoot 'comun.ps1')

$prueba = 'creates and persists a valid task'

Write-Titulo 'EVIDENCIA 5  -  Ciclo TDD en JavaScript  -  crear y validar una tarea'
Write-Host '  La MISMA prueba se ejecuta contra dos commits consecutivos del historial.' -ForegroundColor Gray

Write-Paso 'ROJO  ' '9790944' 'test(javascript): define creacion y validacion' 'Red'
Push-Location (Join-Path $RaizArboles 'js-9790944\javascript-vue')
try { npx vitest run -t $prueba }
finally { Pop-Location }

Write-Paso 'VERDE ' 'bedc127' 'feat(javascript): crea y valida tareas' 'Green'
# Informe compacto: en verde basta el resumen, el detalle importa cuando falla.
Push-Location (Join-Path $RaizArboles 'js-bedc127\javascript-vue')
try { npx vitest run -t $prueba --reporter=dot }
finally { Pop-Location }

# El fallo de Vitest ocupa muchas lineas y empuja el encabezado rojo fuera de
# pantalla, asi que se repiten los dos commits al cierre.
Write-Host ''
Write-Host '  ------------------------------------------------------------------------' -ForegroundColor DarkGray
Write-Host '   ROJO   9790944  test(javascript): define creacion y validacion  ->  1 failed' -ForegroundColor Red
Write-Host '   VERDE  bedc127  feat(javascript): crea y valida tareas          ->  1 passed' -ForegroundColor Green
Write-Host '  ------------------------------------------------------------------------' -ForegroundColor DarkGray
Write-Host ''
