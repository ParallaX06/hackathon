@echo off
REM Real-Time Public Transport Tracker - Windows Deployment Script
REM Smart India Hackathon 2025

echo 🚌 Starting deployment of Transport Tracker...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 16 or higher.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed. Please install npm.
    pause
    exit /b 1
)

REM Check if Firebase CLI is installed
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Firebase CLI is not installed. Installing...
    npm install -g firebase-tools
)

echo [INFO] All requirements satisfied!

REM Setup environment variables
if not exist .env (
    if exist .env.example (
        copy .env.example .env
        echo [WARNING] Created .env file from .env.example
        echo [WARNING] Please update .env with your actual Firebase and Google Maps API keys
    ) else (
        echo [ERROR] .env.example file not found
        pause
        exit /b 1
    )
) else (
    echo [SUCCESS] Environment file already exists
)

REM Install dependencies
echo [INFO] Installing dependencies...

REM Main app dependencies
call npm install

REM Driver app dependencies
cd driver-app
call npm install
cd ..

REM Functions dependencies
cd functions
call npm install
cd ..

echo [SUCCESS] Dependencies installed!

REM Build applications
echo [INFO] Building applications...

REM Build main app
call npm run build

REM Build driver app
cd driver-app
call npm run build
cd ..

REM Build functions
cd functions
call npm run build
cd ..

echo [SUCCESS] All applications built successfully!

REM Deploy to Firebase
echo [INFO] Deploying to Firebase...

REM Login and deploy
call firebase login
call firebase deploy

echo [SUCCESS] Deployment completed!

echo.
echo 🎉 Deployment completed successfully!
echo.
echo Next steps:
echo 1. Update your .env file with actual API keys
echo 2. Configure Firebase project settings
echo 3. Set up Google Maps API and enable required services
echo 4. Test the application in your deployed environment
echo.
echo For detailed setup instructions, see docs\SETUP.md

pause