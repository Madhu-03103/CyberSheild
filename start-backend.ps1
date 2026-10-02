Write-Host "Starting CyberShield AI Backend..." -ForegroundColor Cyan
Write-Host ""

Set-Location backend

if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"

Write-Host "Installing dependencies..." -ForegroundColor Yellow
pip install -q -r requirements.txt

if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    Copy-Item .env.example .env
}

Write-Host "Initializing database..." -ForegroundColor Yellow
python init_db.py

Write-Host ""
Write-Host "Backend setup complete!" -ForegroundColor Green
Write-Host "Starting server on http://localhost:8000" -ForegroundColor Cyan
Write-Host "API Docs at http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
