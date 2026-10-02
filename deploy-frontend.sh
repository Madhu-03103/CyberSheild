#!/bin/bash

# CyberShield AI - Frontend Deployment Script for Vercel
# This script will deploy the frontend to Vercel

echo "🚀 CyberShield AI - Vercel Deployment Script"
echo "============================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
    echo "✅ Vercel CLI installed"
else
    echo "✅ Vercel CLI found"
fi

echo ""
echo "📝 Please provide your backend API URL:"
echo "   Example: https://cybershield-backend.onrender.com"
read -p "Backend URL: " BACKEND_URL

if [ -z "$BACKEND_URL" ]; then
    echo "❌ Backend URL is required!"
    exit 1
fi

echo ""
echo "🔧 Setting environment variable..."
echo "NEXT_PUBLIC_API_URL=$BACKEND_URL"

echo ""
echo "🚀 Deploying to Vercel..."
echo ""

# Deploy to Vercel with environment variable
vercel --prod -e NEXT_PUBLIC_API_URL="$BACKEND_URL"

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "📊 Next steps:"
echo "1. Visit your Vercel dashboard to monitor deployment"
echo "2. Once deployed, test your application"
echo "3. Update backend CORS to include your Vercel URL"
echo ""
echo "🎉 Happy deploying!"
