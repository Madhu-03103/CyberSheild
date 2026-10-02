#!/bin/bash

echo "🎨 Starting CyberShield AI Frontend..."
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚙️  Creating .env.local file..."
    echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
fi

echo ""
echo "✅ Frontend setup complete!"
echo ""
echo "🌐 Starting Next.js development server on http://localhost:3000"
echo ""

# Start the development server
npm run dev
