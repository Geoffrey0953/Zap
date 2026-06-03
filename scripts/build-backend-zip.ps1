# Creates backend.zip with forward-slash paths (required by Elastic Beanstalk on Linux).
# Do NOT use Compress-Archive — it uses backslashes and EB deployment will fail.

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$backend = Join-Path $root "backend"
$zip = Join-Path $root "backend.zip"

if (-not (Test-Path (Join-Path $backend "package.json"))) {
    Write-Error "Run this from the repo. Expected backend at $backend"
}

Push-Location $backend
try {
    if (Test-Path $zip) { Remove-Item $zip -Force }
    tar -a -c -f $zip package.json package-lock.json Procfile src .platform
    $size = (Get-Item $zip).Length
    Write-Host "Created $zip ($size bytes)"
    Write-Host "First entries:"
    tar -tf $zip | Select-Object -First 8
} finally {
    Pop-Location
}
