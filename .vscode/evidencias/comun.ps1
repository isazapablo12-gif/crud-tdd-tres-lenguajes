# Definiciones compartidas por los guiones de evidencia TDD.
# Este archivo no se versiona: .vscode/ esta en el .gitignore del repositorio.

$RaizRepo = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$PythonVenv = Join-Path $RaizRepo 'python-fastapi\.venv\Scripts\python.exe'

# Donde viven las copias de trabajo de los commits antiguos (ver el apendice de
# docs/evidencias-visuales.md). Se puede reubicar con la variable TDD_ARBOLES.
$RaizArboles = if ($env:TDD_ARBOLES) {
    $env:TDD_ARBOLES
}
else {
    Join-Path $env:TEMP 'claude\tdd-evidencias'
}

function Write-Titulo {
    param([string] $Texto, [string] $Color = 'Cyan')

    $linea = '=' * 78
    Write-Host ''
    Write-Host $linea -ForegroundColor $Color
    Write-Host "  $Texto" -ForegroundColor $Color
    Write-Host $linea -ForegroundColor $Color
    Write-Host ''
}

function Write-Paso {
    param([string] $Etiqueta, [string] $Commit, [string] $Detalle, [string] $Color)

    Write-Host ''
    Write-Host "  $Etiqueta  commit $Commit  -  $Detalle" -ForegroundColor $Color
    Write-Host ''
}
