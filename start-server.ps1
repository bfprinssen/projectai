# Stop any running Node processes
Write-Host "Stopping any running Node processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 1

# Start the server
Write-Host "Starting server..." -ForegroundColor Green
npm start
