#!/bin/bash

echo "🚀 Starting CyberShield AI Backend..."
echo ""

# Navigate to backend directory
cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate || . venv/Scripts/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file..."
    cp .env.example .env
    echo "✏️  Please edit backend/.env with your configuration"
fi

# Initialize database
echo "🗄️  Initializing database..."
python init_db.py

echo ""
echo "✅ Backend setup complete!"
echo ""
echo "🌐 Starting FastAPI server on http://localhost:8000"
echo "📚 API Documentation: http://localhost:8000/docs"
echo ""

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
