# Creates frontend.zip with forward-slash paths (required by Elastic Beanstalk on Linux).
# Run AFTER: npm run build (with REACT_APP_API_URL set).

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$frontend = Join-Path $root "INF124"
$zip = Join-Path $root "frontend.zip"
$build = Join-Path $frontend "build"

if (-not (Test-Path (Join-Path $build "index.html"))) {
    Write-Error "Run npm run build in INF124 first. Missing $build\index.html"
}

Push-Location $frontend
try {
    if (Test-Path $zip) { Remove-Item $zip -Force }
    tar -a -c -f $zip server.js Procfile package.json package-lock.json build
    $size = (Get-Item $zip).Length
    Write-Host "Created $zip ($size bytes)"
} finally {
    Pop-Location
}
