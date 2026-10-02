Write-Host "Starting CyberShield AI Frontend..." -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

if (-not (Test-Path ".env.local")) {
    Write-Host "Creating .env.local file..." -ForegroundColor Yellow
    "NEXT_PUBLIC_API_URL=http://localhost:8000" | Out-File -FilePath .env.local -Encoding utf8
}

Write-Host ""
Write-Host "Frontend setup complete!" -ForegroundColor Green
Write-Host "Starting server on http://localhost:3000" -ForegroundColor Cyan
Write-Host ""

npm run dev
