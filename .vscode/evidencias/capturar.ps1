# Captura la pantalla principal en un PNG.
#   .\capturar.ps1 -Destino "C:\ruta\captura.png"
param(
    [Parameter(Mandatory)]
    [string] $Destino
)

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Sin esto Windows entrega medidas en pixeles logicos y la captura sale recortada
# en pantallas con escalado distinto del 100 %.
$ppp = @'
using System;
using System.Runtime.InteropServices;
public static class Ppp {
    [DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
}
'@
if (-not ('Ppp' -as [type])) { Add-Type -TypeDefinition $ppp }
[Ppp]::SetProcessDPIAware() | Out-Null

$limites = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
$mapa = New-Object System.Drawing.Bitmap $limites.Width, $limites.Height
$lienzo = [System.Drawing.Graphics]::FromImage($mapa)

try {
    $lienzo.CopyFromScreen($limites.Location, [System.Drawing.Point]::Empty, $limites.Size)
    $carpeta = Split-Path -Parent $Destino
    if (-not (Test-Path -LiteralPath $carpeta)) {
        New-Item -ItemType Directory -Path $carpeta -Force | Out-Null
    }
    $mapa.Save($Destino, [System.Drawing.Imaging.ImageFormat]::Png)
    Write-Output "$($limites.Width)x$($limites.Height) -> $Destino"
}
finally {
    $lienzo.Dispose()
    $mapa.Dispose()
}
