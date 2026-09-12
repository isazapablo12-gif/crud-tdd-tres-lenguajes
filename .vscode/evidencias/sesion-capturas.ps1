# Ejecuta las siete evidencias una tras otra dentro de la terminal de VS Code.
# Despues de cada una deja una senal en la carpeta de sincronizacion y espera a
# que el vigilante externo tome la captura y borre la senal.

. (Join-Path $PSScriptRoot 'comun.ps1')

$sync = Join-Path $RaizArboles 'sync'
New-Item -ItemType Directory -Path $sync -Force | Out-Null

$evidencias = @(
    @{ Numero = 1; Guion = '01-suite-python.ps1' }
    @{ Numero = 2; Guion = '02-suite-javascript.ps1' }
    @{ Numero = 3; Guion = '03-suite-php.ps1' }
    @{ Numero = 4; Guion = '04-ciclo-python.ps1' }
    @{ Numero = 5; Guion = '05-ciclo-javascript.ps1' }
    @{ Numero = 6; Guion = '06-ciclo-php.ps1' }
    @{ Numero = 7; Guion = '07-historial-git.ps1' }
)

foreach ($evidencia in $evidencias) {
    Clear-Host
    & (Join-Path $PSScriptRoot $evidencia.Guion)

    $senal = Join-Path $sync "listo-$($evidencia.Numero)"
    New-Item -ItemType File -Path $senal -Force | Out-Null

    $limite = (Get-Date).AddMinutes(3)
    while ((Test-Path -LiteralPath $senal) -and ((Get-Date) -lt $limite)) {
        Start-Sleep -Milliseconds 250
    }
}

Clear-Host
Write-Host ''
Write-Host '  Las siete evidencias se ejecutaron y quedaron capturadas.' -ForegroundColor Green
Write-Host ''
