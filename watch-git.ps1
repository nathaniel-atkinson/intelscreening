$ProjectPath = "C:\Servers\express\nodomain\intelScreening"
$DelaySeconds = 30

Set-Location $ProjectPath

$Watcher = New-Object System.IO.FileSystemWatcher
$Watcher.Path = $ProjectPath
$Watcher.IncludeSubdirectories = $true
$Watcher.EnableRaisingEvents = $true

$Watcher.Filter = "*.*"

$LastChange = Get-Date

$Action = {
    $global:LastChange = Get-Date
}

Register-ObjectEvent $Watcher "Changed" -Action $Action | Out-Null
Register-ObjectEvent $Watcher "Created" -Action $Action | Out-Null
Register-ObjectEvent $Watcher "Deleted" -Action $Action | Out-Null
Register-ObjectEvent $Watcher "Renamed" -Action $Action | Out-Null

Write-Host "Git watcher started."
Write-Host "Watching: $ProjectPath"
Write-Host "Push delay: $DelaySeconds seconds"
Write-Host "Press Ctrl+C to stop."

while ($true) {
    Start-Sleep -Seconds 5

    $Status = git status --porcelain

    if (-not $Status) {
        continue
    }

    $Elapsed = ((Get-Date) - $global:LastChange).TotalSeconds

    if ($Elapsed -lt $DelaySeconds) {
        continue
    }

    Write-Host ""
    Write-Host "Changes detected. Committing..."

    git add .

    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

    git commit -m "Auto update $Timestamp"

    if ($LASTEXITCODE -ne 0) {
        Write-Host "Commit failed."
        continue
    }

    Write-Host "Pushing to GitHub..."

    git push

    if ($LASTEXITCODE -eq 0) {
        Write-Host "Push successful."
        $global:LastChange = Get-Date
    }
    else {
        Write-Host "Push failed."
    }
}