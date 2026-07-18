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

$server = Start-Job -ScriptBlock {
    param($siteRoot, $listenerPrefix)
    $listener = [System.Net.HttpListener]::new()
    $listener.Prefixes.Add($listenerPrefix)
    $listener.Start()
    try {
        while ($listener.IsListening) {
            $context = $listener.GetContext()
            $relative = [Uri]::UnescapeDataString($context.Request.Url.AbsolutePath.TrimStart('/'))
            if ($relative -eq '__stop') { $context.Response.StatusCode = 204; $context.Response.Close(); break }
            if (-not $relative) { $relative = 'evaluation.html' }
            $path = [IO.Path]::GetFullPath((Join-Path $siteRoot $relative))
            if (-not $path.StartsWith($siteRoot, [StringComparison]::OrdinalIgnoreCase) -or -not (Test-Path -LiteralPath $path)) {
                $context.Response.StatusCode = 404; $context.Response.Close(); continue
            }
            $bytes = [IO.File]::ReadAllBytes($path)
            $context.Response.ContentType = switch ([IO.Path]::GetExtension($path)) {
                '.html' { 'text/html; charset=utf-8' } '.js' { 'application/javascript; charset=utf-8' }
                '.css' { 'text/css; charset=utf-8' } '.svg' { 'image/svg+xml' }
                default { 'application/octet-stream' }
            }
            $context.Response.ContentLength64 = $bytes.Length
            $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
            $context.Response.Close()
        }
    } finally { $listener.Stop(); $listener.Close() }
} -ArgumentList $root, $prefix

try {
    Start-Sleep -Milliseconds 500
    Write-Host 'The evaluation starts automatically. Download the JSON report, then close Chrome.'
    $arguments = @('--no-first-run', "--user-data-dir=$env:TEMP\scamcheck-evaluation-$PID", "--app=${prefix}evaluation.html?autorun=1")
    Start-Process -FilePath $chrome -ArgumentList $arguments -Wait
} finally {
    try { Invoke-WebRequest -UseBasicParsing -Uri "${prefix}__stop" -TimeoutSec 2 | Out-Null } catch { }
    Wait-Job -Job $server -Timeout 5 -ErrorAction SilentlyContinue | Out-Null
    Stop-Job -Job $server -ErrorAction SilentlyContinue
    Remove-Job -Job $server -Force -ErrorAction SilentlyContinue
}
