#!/bin/bash

# MERN Stack Development Server Script
# Unix/Linux version

echo "========================================"
echo "   MERN Stack Development Server"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "[ERROR] npm is not installed or not in PATH"
    exit 1
fi

echo "[INFO] Node.js version: $(node --version)"
echo "[INFO] npm version: $(npm --version)"
echo ""
echo "[INFO] Checking dependencies..."
echo ""

# Install backend dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "[INFO] Installing backend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "[ERROR] Failed to install backend dependencies"
        exit 1
    fi
fi

# Install frontend dependencies if node_modules doesn't exist
if [ ! -d "brahmi-frontend/node_modules" ]; then
    echo "[INFO] Installing frontend dependencies..."
    cd brahmi-frontend
    npm install
    if [ $? -ne 0 ]; then
        echo "[ERROR] Failed to install frontend dependencies"
        exit 1
    fi
    cd ..
fi

echo "[INFO] Starting development servers..."
echo ""
echo "[INFO] Backend will run on: http://localhost:4000"
echo "[INFO] Frontend will run on: http://localhost:5173"
echo ""
echo "[INFO] Press Ctrl+C to stop both servers"
echo "========================================"
echo ""

# Start both servers concurrently
npm run dev:full
