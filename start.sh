#!/bin/bash

# Investment Portfolio Startup Script
# This script starts the frontend development server
# Backend connection will be added later

echo "🚀 Starting Investment Portfolio Frontend..."
echo "📡 Starting on port 3000 (will auto-increment if busy)..."
echo ""

# Start the dev server in background and capture output
npm run dev > /tmp/vite-output.log 2>&1 &
SERVER_PID=$!

# Wait for server to start and extract the actual port
echo "⏳ Waiting for server to start..."
sleep 3

# Try to find the port from the log file
PORT=$(grep -oE "Local:.*:([0-9]+)" /tmp/vite-output.log | grep -oE "[0-9]+" | tail -1)

if [ -z "$PORT" ]; then
  PORT=3000  # Fallback to default
fi

echo "✅ Server started on http://localhost:$PORT"
echo "🌐 Opening Chrome..."

# Open Chrome to the actual port
open -a "Google Chrome" "http://localhost:$PORT"

# Bring the server to foreground
wait $SERVER_PID
