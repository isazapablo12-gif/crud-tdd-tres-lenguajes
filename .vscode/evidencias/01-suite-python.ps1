. (Join-Path $PSScriptRoot 'comun.ps1')

Write-Titulo 'EVIDENCIA 1  -  Python y FastAPI  -  suite completa con cobertura'
Push-Location (Join-Path $RaizRepo 'python-fastapi')
try {
    Write-Host "> .venv\Scripts\python.exe -m pytest --cov=app --cov-report=term-missing" -ForegroundColor Yellow
    & $PythonVenv -m pytest --cov=app --cov-report=term-missing -p no:warnings
}
finally { Pop-Location }
