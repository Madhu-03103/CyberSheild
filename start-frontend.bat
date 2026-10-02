@echo off
echo 🎨 Starting CyberShield AI Frontend...
echo.

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
)

REM Check if .env.local exists
if not exist ".env.local" (
    echo ⚙️  Creating .env.local file...
    echo NEXT_PUBLIC_API_URL=http://localhost:8000 > .env.local
)

echo.
echo ✅ Frontend setup complete!
echo.
echo 🌐 Starting Next.js development server on http://localhost:3000
echo.

REM Start the development server
call npm run dev
