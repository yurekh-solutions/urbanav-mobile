#!/bin/bash

echo "🚀 UrbanAV App - Quick Start Script"
echo "===================================="
echo ""

# Check if MongoDB is running
echo "📦 Checking MongoDB..."
if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB is running"
else
    echo "⚠️  MongoDB is not running. Please start it with: mongod"
fi

echo ""
echo "🔧 Starting Backend Server..."
cd server

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📥 Installing backend dependencies..."
    npm install
fi

# Seed database
echo "🌱 Seeding database..."
node scripts/seed.js

# Start server
echo "🖥️  Starting server on port 3001..."
node index.js &
BACKEND_PID=$!

cd ..

echo ""
echo "📱 Starting Mobile App..."
cd urbanav-mobile

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📥 Installing mobile dependencies..."
    npm install
fi

# Start Expo
echo "🎨 Starting Expo dev server..."
npx expo start

# Cleanup on exit
trap "kill $BACKEND_PID 2>/dev/null" EXIT
