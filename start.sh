#!/bin/bash

# Investment Portfolio Startup Script
# This script checks environment setup and starts the development server

set -e  # Exit on error

echo "🚀 Starting Investment Portfolio..."
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
  echo "⚠️  Warning: .env file not found!"
  echo "📝 Creating .env from .env.example..."
  cp .env.example .env
  echo "✅ Created .env file"
  echo ""
  echo "🔑 Please add your Alpha Vantage API key to .env file:"
  echo "   VITE_ALPHA_VANTAGE_API_KEY=your_key_here"
  echo ""
  echo "   Get your free key at: https://www.alphavantage.co/support/#api-key"
  echo ""
fi

# Check if API key is set (not demo or placeholder)
API_KEY=$(grep -E "^VITE_ALPHA_VANTAGE_API_KEY=" .env | cut -d '=' -f2)
if [ -z "$API_KEY" ] || [ "$API_KEY" = "demo" ] || [ "$API_KEY" = "your_api_key_here" ]; then
  echo "⚠️  Warning: Using demo API key (limited functionality)"
  echo "   Get your free key at: https://www.alphavantage.co/support/#api-key"
  echo "   Update .env file with your key for full access"
  echo ""
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
  echo "✅ Dependencies installed"
  echo ""
fi

echo "📡 Starting development server..."
echo "   Port: 3000 (will auto-increment if busy)"
echo ""

# Start the dev server
npm run dev
