@echo off
echo ========================================
echo    MERN Stack Development Server
echo ========================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed or not in PATH
    pause
    exit /b 1
)

echo [INFO] Checking dependencies...
echo.

:: Install backend dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo [INFO] Installing backend dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install backend dependencies
        pause
        exit /b 1
    )
)

:: Install frontend dependencies if node_modules doesn't exist
if not exist "brahmi-frontend\node_modules" (
    echo [INFO] Installing frontend dependencies...
    cd brahmi-frontend
    npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install frontend dependencies
        pause
        exit /b 1
    )
    cd ..
)

echo [INFO] Starting development servers...
echo.
echo [INFO] Backend will run on: http://localhost:4000
echo [INFO] Frontend will run on: http://localhost:5173
echo.
echo [INFO] Press Ctrl+C to stop both servers
echo ========================================
echo.

:: Start both servers concurrently
npm run dev:full

pause
