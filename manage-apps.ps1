# App management script for invoice proxy system

param(
    [string]$Action = "help",
    [string]$Name,
    [string]$Subdomain,
    [int]$Port,
    [string]$Description
)

$AppsFile = "apps.json"
$NginxConfFile = "nginx.conf"

function Show-Help {
    Write-Host @"
Invoice Proxy Management

Usage: .\manage-apps.ps1 -Action <action> [options]

Actions:
  list                  List all configured apps
  add                   Add a new app
  remove                Remove an app
  regenerate            Regenerate nginx.conf and restart Nginx
  generate              Generate nginx.conf only
  help                  Show this help

Examples:
  # Add a new app
  .\manage-apps.ps1 -Action add -Name api -Subdomain api -Port 3001 -Description "API server"

  # List apps
  .\manage-apps.ps1 -Action list

  # Remove an app
  .\manage-apps.ps1 -Action remove -Name api

  # Regenerate config and restart
  .\manage-apps.ps1 -Action regenerate
"@
}

function Show-Apps {
    if (-not (Test-Path $AppsFile)) {
        Write-Host "apps.json not found"
        return
    }

    $config = Get-Content $AppsFile | ConvertFrom-Json
    Write-Host "`nConfigured Apps:" -ForegroundColor Cyan
    Write-Host "Domain: $($config.settings.domain)" -ForegroundColor Gray

    foreach ($app in $config.apps) {
        $url = "$($app.subdomain).$($config.settings.domain):$($app.port)"
        Write-Host "  • $($app.name)" -ForegroundColor Green
        Write-Host "    URL: $url"
        Write-Host "    Desc: $($app.description)"
    }
    Write-Host ""
}

function Add-App {
    if (-not $Name -or -not $Subdomain -or -not $Port) {
        Write-Host "Error: -Name, -Subdomain, and -Port are required" -ForegroundColor Red
        return
    }

    if (-not (Test-Path $AppsFile)) {
        Write-Host "Error: apps.json not found" -ForegroundColor Red
        return
    }

    $config = Get-Content $AppsFile | ConvertFrom-Json

    # Check if app already exists
    if ($config.apps | Where-Object { $_.name -eq $Name }) {
        Write-Host "Error: App '$Name' already exists" -ForegroundColor Red
        return
    }

    # Check if subdomain already exists
    if ($config.apps | Where-Object { $_.subdomain -eq $Subdomain }) {
        Write-Host "Error: Subdomain '$Subdomain' already exists" -ForegroundColor Red
        return
    }

    $newApp = @{
        name = $Name
        subdomain = $Subdomain
        port = $Port
        description = $Description
    }

    $config.apps += $newApp
    $config | ConvertTo-Json | Set-Content $AppsFile

    Write-Host "✓ Added app '$Name' on $Subdomain (port $Port)" -ForegroundColor Green
}

function Remove-App {
    if (-not $Name) {
        Write-Host "Error: -Name is required" -ForegroundColor Red
        return
    }

    if (-not (Test-Path $AppsFile)) {
        Write-Host "Error: apps.json not found" -ForegroundColor Red
        return
    }

    $config = Get-Content $AppsFile | ConvertFrom-Json

    if (-not ($config.apps | Where-Object { $_.name -eq $Name })) {
        Write-Host "Error: App '$Name' not found" -ForegroundColor Red
        return
    }

    $config.apps = @($config.apps | Where-Object { $_.name -ne $Name })
    $config | ConvertTo-Json | Set-Content $AppsFile

    Write-Host "✓ Removed app '$Name'" -ForegroundColor Green
}

function Generate-NginxConfig {
    if (-not (Test-Path $AppsFile)) {
        Write-Host "Error: apps.json not found" -ForegroundColor Red
        return
    }

    python generate_nginx_config.py $AppsFile $NginxConfFile
}

function Regenerate-And-Restart {
    Write-Host "Generating Nginx config..." -ForegroundColor Cyan
    Generate-NginxConfig

    Write-Host "`nRestarting Nginx container..." -ForegroundColor Cyan
    docker-compose restart nginx

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Nginx restarted successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to restart Nginx" -ForegroundColor Red
    }
}

# Main
switch ($Action.ToLower()) {
    "list" { Show-Apps }
    "add" { Add-App }
    "remove" { Remove-App }
    "generate" { Generate-NginxConfig }
    "regenerate" { Regenerate-And-Restart }
    "help" { Show-Help }
    default { Show-Help }
}
