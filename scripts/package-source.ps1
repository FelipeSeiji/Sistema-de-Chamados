$ErrorActionPreference = 'Stop'
$sourceRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$outputDirectory = Join-Path $sourceRoot 'entrega'
New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
$zipPath = Join-Path $outputDirectory 'sistema-de-chamados-1.0.0-beta.1.zip'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
Push-Location $sourceRoot
try {
    $files = @(& git -c core.quotepath=false ls-files --cached --others --exclude-standard)
    if ($LASTEXITCODE -ne 0) { throw 'Não foi possível listar os arquivos do repositório.' }
    $files = $files | Sort-Object -Unique | Where-Object {
        $_ -notmatch '(^|/)(\.git|\.vscode|node_modules|target|dist|entrega)(/|$)' -and
        $_ -notmatch '\.sql$' -and $_ -notmatch '(^|/)\.env($|\.(?!example$))' -and
        $_ -notmatch '^sistema_chamado/src/main/resources/static/'
    }
    if (-not (Test-Path -LiteralPath 'docs/images/dashboard.jpg')) { throw 'Print do dashboard ausente.' }
    $stream = [IO.File]::Open($zipPath, [IO.FileMode]::Create)
    $zip = [IO.Compression.ZipArchive]::new($stream, [IO.Compression.ZipArchiveMode]::Create)
    try {
        foreach ($relative in $files) {
            $absolute = [IO.Path]::GetFullPath((Join-Path $sourceRoot $relative))
            if (-not $absolute.StartsWith($sourceRoot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) {
                throw "Arquivo fora do projeto: $relative"
            }
            if (Test-Path -LiteralPath $absolute -PathType Leaf) {
                [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $absolute, $relative.Replace('\', '/'), [IO.Compression.CompressionLevel]::Optimal) | Out-Null
            }
        }
    } finally { $zip.Dispose(); $stream.Dispose() }
    $hash = (Get-FileHash -LiteralPath $zipPath -Algorithm SHA256).Hash
    Set-Content -LiteralPath ($zipPath + '.sha256') -Value "$hash  $([IO.Path]::GetFileName($zipPath))" -Encoding ascii
    Write-Host "ZIP: $zipPath"
    Write-Host "SHA256: $hash"
} finally { Pop-Location }
