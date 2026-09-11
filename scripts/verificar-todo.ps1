[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path

function Invoke-ProjectStep {
    param(
        [Parameter(Mandatory)]
        [string] $Name,

        [Parameter(Mandatory)]
        [scriptblock] $Action
    )

    Write-Host "`n=== $Name ===" -ForegroundColor Cyan
    & $Action

    if ($LASTEXITCODE -ne 0) {
        throw "El paso '$Name' terminó con código $LASTEXITCODE."
    }
}

try {
    Push-Location (Join-Path $projectRoot 'python-fastapi')
    $python = Join-Path (Get-Location) '.venv\Scripts\python.exe'

    if (-not (Test-Path -LiteralPath $python)) {
        throw 'Falta python-fastapi\.venv. Sigue primero la instalación de python-fastapi\README.md.'
    }

    Invoke-ProjectStep 'Python: pytest y cobertura mínima del 80 %' {
        & $python -m pytest --cov=app --cov-report=term-missing --cov-fail-under=80
    }
}
finally {
    Pop-Location
}

try {
    Push-Location (Join-Path $projectRoot 'javascript-vue')

    if (-not (Test-Path -LiteralPath 'node_modules')) {
        throw 'Falta javascript-vue\node_modules. Ejecuta npm install en esa carpeta.'
    }

    Invoke-ProjectStep 'JavaScript: Vitest y cobertura mínima del 80 %' {
        npm run test:coverage
    }

    Invoke-ProjectStep 'Vue: compilación de producción' {
        npm run build
    }
}
finally {
    Pop-Location
}

try {
    Push-Location (Join-Path $projectRoot 'php-laravel')

    if (-not (Test-Path -LiteralPath 'vendor\autoload.php')) {
        throw 'Falta php-laravel\vendor. Ejecuta composer install en esa carpeta.'
    }

    Invoke-ProjectStep 'PHP: PHPUnit' {
        php artisan test --compact
    }

    Invoke-ProjectStep 'PHP: formato con Pint' {
        php vendor\bin\pint --test
    }

    if (Get-Command composer -ErrorAction SilentlyContinue) {
        Invoke-ProjectStep 'PHP: auditoría de dependencias' {
            composer audit
        }
    }
    else {
        Write-Warning 'Composer no está en PATH; se omite únicamente composer audit.'
    }
}
finally {
    Pop-Location
}

Write-Host "`nTodas las verificaciones terminaron correctamente." -ForegroundColor Green
