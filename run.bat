@echo off
title LifePause SaaS - Emergency Digital Manager
echo =======================================================================
echo               L I F E P A U S E   -   S A A S   P L A T F O R M
echo =======================================================================
echo.
echo Launching local development environment...
echo.

:: 1. Launch Backend Node Server
echo [1/3] Starting backend Node/Express server...
start "LifePause Backend Server" cmd /c "cd backend && echo Installing backend modules if missing... && npm install && echo Starting Express Server... && npm start"

:: 2. Launch Frontend Vite Server
echo [2/3] Starting frontend Vite React app...
start "LifePause Frontend Client" cmd /c "cd frontend && echo Installing frontend modules if missing... && npm install && echo Starting Vite Dev Server... && npm run dev"

:: 3. Launch Web browser to local dev url
echo [3/3] Launching web browser...
timeout /t 5 >nul
start http://localhost:3000

echo.
echo All processes initiated. You can close this control window now.
echo Keep the new database and client server windows running.
echo =======================================================================
pause
