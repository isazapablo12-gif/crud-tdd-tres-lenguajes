. (Join-Path $PSScriptRoot 'comun.ps1')

Write-Titulo 'EVIDENCIA 3  -  PHP y Laravel  -  suite completa'
Push-Location (Join-Path $RaizRepo 'php-laravel')
try {
    Write-Host "> vendor\bin\phpunit --testdox" -ForegroundColor Yellow
    & '.\vendor\bin\phpunit' --testdox
}
finally { Pop-Location }
