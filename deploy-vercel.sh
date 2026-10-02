#!/bin/bash

echo "🚀 CyberShield AI - Vercel Deployment"
echo "======================================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
else
    echo "✅ Vercel CLI already installed"
fi

echo ""
echo "🔨 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Deploying to Vercel..."
    echo ""
    vercel --prod
    echo ""
    echo "🎉 Deployment Complete!"
    echo ""
    echo "Your CyberShield AI platform is now LIVE!"
    echo "Check the URL above to access your deployed application."
else
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi
