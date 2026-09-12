# Espera las senales que deja sesion-capturas.ps1 dentro de VS Code y toma una
# captura de pantalla por cada evidencia terminada.

. (Join-Path $PSScriptRoot 'comun.ps1')

$sync = Join-Path $RaizArboles 'sync'
$destino = Join-Path $RaizRepo 'docs\capturas'
New-Item -ItemType Directory -Path $sync -Force | Out-Null
New-Item -ItemType Directory -Path $destino -Force | Out-Null
Get-ChildItem -LiteralPath $sync -File -ErrorAction SilentlyContinue | Remove-Item -Force

$nombres = @{
    1 = '01-suite-python.png'
    2 = '02-suite-javascript.png'
    3 = '03-suite-php.png'
    4 = '04-ciclo-python.png'
    5 = '05-ciclo-javascript.png'
    6 = '06-ciclo-php.png'
    7 = '07-historial-git.png'
}

# Maximizar la ventana de VS Code antes de la primera captura.
$firma = @'
using System;
using System.Runtime.InteropServices;
public static class Ventana {
    [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int n);
    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
}
'@
if (-not ('Ventana' -as [type])) { Add-Type -TypeDefinition $firma }

function Enfocar-VSCode {
    $proceso = Get-Process -Name 'Code' -ErrorAction SilentlyContinue |
        Where-Object { $_.MainWindowTitle -like '*crud-tdd-tres-lenguajes*' } |
        Select-Object -First 1

    if ($proceso) {
        [Ventana]::ShowWindow($proceso.MainWindowHandle, 3) | Out-Null   # 3 = maximizar
        [Ventana]::SetForegroundWindow($proceso.MainWindowHandle) | Out-Null
        return $true
    }
    return $false
}

$capturar = Join-Path $PSScriptRoot 'capturar.ps1'
$limiteGlobal = (Get-Date).AddMinutes(20)

foreach ($numero in 1..7) {
    $senal = Join-Path $sync "listo-$numero"

    while (-not (Test-Path -LiteralPath $senal)) {
        if ((Get-Date) -gt $limiteGlobal) {
            Write-Output "AGOTADO esperando la evidencia $numero"
            return
        }
        Start-Sleep -Milliseconds 250
    }

    Enfocar-VSCode | Out-Null
    Start-Sleep -Seconds 2          # dejar que VS Code termine de dibujar

    & $capturar -Destino (Join-Path $destino $nombres[$numero])
    Remove-Item -LiteralPath $senal -Force
}

Write-Output 'Las siete capturas quedaron guardadas.'
