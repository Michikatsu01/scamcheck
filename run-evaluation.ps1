param([switch]$ConfirmApiCost)
$ErrorActionPreference = 'Stop'
if (-not $ConfirmApiCost) {
    throw 'This run makes 60 Gemini requests. Re-run with -ConfirmApiCost after checking quota.'
}

$root = [IO.Path]::GetFullPath($PSScriptRoot)
$port = 8766
$prefix = "http://127.0.0.1:$port/"
$chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
if (-not (Test-Path -LiteralPath $chrome)) { throw 'Google Chrome was not found.' }

$previousPort = $env:PORT
$env:PORT = [string]$port
$server = $null
try {
    $server = Start-Process -FilePath python -ArgumentList @('-m', 'backend.app') `
        -WorkingDirectory $root -WindowStyle Hidden -PassThru

    $ready = $false
    for ($attempt = 0; $attempt -lt 20; $attempt += 1) {
        Start-Sleep -Milliseconds 300
        try {
            $health = Invoke-RestMethod -Uri "${prefix}api/health" -TimeoutSec 2
            if ($health.status -eq 'ok') { $ready = $true; break }
        } catch { }
        if ($server.HasExited) { break }
    }
    if (-not $ready) {
        throw 'Flask backend did not start. Install requirements and check .env.'
    }

    Write-Host 'The evaluation starts automatically. Download the JSON report, then close Chrome.'
    $arguments = @(
        '--no-first-run',
        "--user-data-dir=$env:TEMP\scamcheck-evaluation-$PID",
        "--app=${prefix}evaluation.html?autorun=1"
    )
    Start-Process -FilePath $chrome -ArgumentList $arguments -Wait
} finally {
    if ($server -and -not $server.HasExited) {
        Stop-Process -Id $server.Id -Force -ErrorAction SilentlyContinue
    }
    $env:PORT = $previousPort
}
