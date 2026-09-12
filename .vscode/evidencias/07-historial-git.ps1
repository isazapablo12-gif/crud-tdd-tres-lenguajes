. (Join-Path $PSScriptRoot 'comun.ps1')

Write-Titulo 'EVIDENCIA 7  -  Historial de Git  -  pares rojo (test) y verde (feat)'
Push-Location $RaizRepo
try {
    Write-Host "> git log --oneline --reverse --grep=`"^(test|feat)`" -E" -ForegroundColor Yellow
    Write-Host ''
    git log --oneline --reverse -E --grep="^(test|feat)\("
}
finally { Pop-Location }
