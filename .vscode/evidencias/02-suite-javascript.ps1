. (Join-Path $PSScriptRoot 'comun.ps1')

Write-Titulo 'EVIDENCIA 2  -  JavaScript, Express y Vue  -  suite completa con cobertura'
Push-Location (Join-Path $RaizRepo 'javascript-vue')
try {
    Write-Host "> npm run test:coverage" -ForegroundColor Yellow
    npm run test:coverage
}
finally { Pop-Location }
