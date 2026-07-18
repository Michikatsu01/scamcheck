$ErrorActionPreference = 'Stop'
$root = [IO.Path]::GetFullPath($PSScriptRoot)
$port = 8765
$prefix = "http://127.0.0.1:$port/"
$chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'

if (-not (Test-Path -LiteralPath $chrome)) {
    throw 'Google Chrome was not found.'
}

$server = Start-Job -ScriptBlock {
    param($siteRoot, $listenerPrefix)
    $listener = [System.Net.HttpListener]::new()
    $listener.Prefixes.Add($listenerPrefix)
    $listener.Start()
    try {
        for ($requestNumber = 0; $requestNumber -lt 80; $requestNumber += 1) {
            $context = $listener.GetContext()
            $relative = [Uri]::UnescapeDataString($context.Request.Url.AbsolutePath.TrimStart('/'))
            if ($relative -eq '__stop') {
                $context.Response.StatusCode = 204
                $context.Response.Close()
                break
            }
            if (-not $relative) { $relative = 'index.html' }
            $path = [IO.Path]::GetFullPath((Join-Path $siteRoot $relative))
            if (-not $path.StartsWith($siteRoot, [StringComparison]::OrdinalIgnoreCase) -or -not (Test-Path -LiteralPath $path)) {
                $context.Response.StatusCode = 404
                $context.Response.Close()
                continue
            }
            $bytes = [IO.File]::ReadAllBytes($path)
            $context.Response.ContentType = switch ([IO.Path]::GetExtension($path)) {
                '.html' { 'text/html; charset=utf-8' }
                '.js' { 'application/javascript; charset=utf-8' }
                '.css' { 'text/css; charset=utf-8' }
                '.svg' { 'image/svg+xml' }
                default { 'application/octet-stream' }
            }
            $context.Response.ContentLength64 = $bytes.Length
            $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
            $context.Response.Close()
        }
    } finally {
        $listener.Stop()
        $listener.Close()
    }
} -ArgumentList $root, $prefix

$stdout = New-TemporaryFile
$stderr = New-TemporaryFile
try {
    Start-Sleep -Milliseconds 500
    $arguments = @(
        '--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run',
        "--user-data-dir=$env:TEMP\scamcheck-self-test-$PID",
        '--virtual-time-budget=12000', '--dump-dom', "${prefix}index.html?selftest=1"
    )
    $process = Start-Process -FilePath $chrome -ArgumentList $arguments -WindowStyle Hidden -RedirectStandardOutput $stdout.FullName -RedirectStandardError $stderr.FullName -PassThru
    if (-not $process.WaitForExit(30000)) {
        $process.Kill()
        $process.WaitForExit()
        throw 'Chrome did not finish the tests within 30 seconds.'
    }
    $dom = Get-Content -Raw -Encoding utf8 $stdout.FullName
    $errors = Get-Content -Raw -Encoding utf8 $stderr.FullName
    if ($dom -notmatch 'data-self-test="passed"') {
        Write-Error "Self-tests failed. $errors"
        exit 1
    }
    Write-Host 'PASS: parser, 12 edge cases, URL, domain, and phone filtering.'
} finally {
    try { Invoke-WebRequest -UseBasicParsing -Uri "${prefix}__stop" -TimeoutSec 2 | Out-Null } catch { }
    Wait-Job -Job $server -Timeout 5 -ErrorAction SilentlyContinue | Out-Null
    Stop-Job -Job $server -ErrorAction SilentlyContinue
    Remove-Job -Job $server -Force -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath $stdout.FullName, $stderr.FullName -Force -ErrorAction SilentlyContinue
}
