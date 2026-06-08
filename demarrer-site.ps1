# Serveur local Cafe Socco (fallback: ouvre index.html si echec)
$port = 8080
$root = $PSScriptRoot
$indexPath = Join-Path $root "index.html"

$mime = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}

function Open-SiteDirect {
    if (Test-Path $indexPath) {
        Start-Process $indexPath
    }
}

$listener = $null
$ports = @(8080, 8888, 5500, 3000)

foreach ($p in $ports) {
    try {
        $listener = New-Object System.Net.HttpListener
        [void]$listener.Prefixes.Add("http://127.0.0.1:$p/")
        $listener.Start()
        $port = $p
        break
    } catch {
        if ($listener) { $listener.Close(); $listener = $null }
    }
}

if (-not $listener) {
    Write-Host "Serveur impossible. Ouverture directe du fichier..." -ForegroundColor Yellow
    Open-SiteDirect
    Start-Sleep -Seconds 8
    exit 0
}

Write-Host ""
Write-Host "  Cafe Socco - serveur actif sur http://127.0.0.1:$port" -ForegroundColor Green
Write-Host "  Ne fermez pas cette fenetre." -ForegroundColor Gray
Write-Host ""

Start-Process "http://127.0.0.1:$port/"

while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response

    try {
        $urlPath = [Uri]::UnescapeDataString($req.Url.LocalPath)
        if ($urlPath -eq "/" -or $urlPath -eq "") { $urlPath = "/index.html" }

        $relative = $urlPath.TrimStart("/").Replace("/", [IO.Path]::DirectorySeparatorChar)
        $filePath = Join-Path $root $relative

        if ((Test-Path $filePath -PathType Leaf)) {
            $bytes = [IO.File]::ReadAllBytes($filePath)
            $ext = [IO.Path]::GetExtension($filePath).ToLower()
            $res.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { "application/octet-stream" }
            $res.StatusCode = 200
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $res.StatusCode = 404
            $res.ContentType = "text/html; charset=utf-8"
            $msg = [Text.Encoding]::UTF8.GetBytes("<h1>404</h1><p>$urlPath</p>")
            $res.OutputStream.Write($msg, 0, $msg.Length)
        }
    } finally {
        $res.Close()
    }
}
