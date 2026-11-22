$ErrorActionPreference = 'Stop'
$projectRoot = Join-Path $PSScriptRoot '../sistema_chamado'
Push-Location (Join-Path $projectRoot 'frontend')
try {
    & npm.cmd ci
    if ($LASTEXITCODE -ne 0) { throw 'Falha ao instalar o frontend.' }
    & npm.cmd run build
    if ($LASTEXITCODE -ne 0) { throw 'Falha no build do frontend.' }
} finally { Pop-Location }
$staticPath = Join-Path $projectRoot 'src/main/resources/static'
if (Test-Path -LiteralPath $staticPath) {
    $resolvedRoot = [IO.Path]::GetFullPath($projectRoot)
    $resolvedStatic = (Resolve-Path -LiteralPath $staticPath).Path
    $expectedStatic = [IO.Path]::GetFullPath((Join-Path $resolvedRoot 'src/main/resources/static'))
    if ($resolvedStatic -ne $expectedStatic -or -not $resolvedStatic.StartsWith($resolvedRoot + [IO.Path]::DirectorySeparatorChar)) {
        throw 'Diretório de arquivos gerados fora do projeto.'
    }
    Remove-Item -LiteralPath $resolvedStatic -Recurse -Force
}
New-Item -ItemType Directory -Path $staticPath -Force | Out-Null
Copy-Item -Path (Join-Path $projectRoot 'frontend/dist/frontend/browser/*') -Destination $staticPath -Recurse -Force
Push-Location $projectRoot
try {
    & ./mvnw.cmd clean verify -B
    if ($LASTEXITCODE -ne 0) { throw 'Falha na validação do backend.' }
} finally { Pop-Location }
Write-Host 'Pronto: sistema_chamado/target/sistema_chamado-1.0.0-beta.1.jar'
