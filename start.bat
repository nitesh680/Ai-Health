@echo off
echo Starting MindWell Backend Server...
cd "C:\Users\nites\Desktop\ai health\backend"
start "MindWell Backend" cmd /k "npm run dev"

echo Starting MindWell Frontend Server...
cd "C:\Users\nites\Desktop\ai health\frontend"
start "MindWell Frontend" cmd /k "npm run dev"

echo Both servers are starting up! Please open http://localhost:5173 once the frontend says "VITE... ready"
pause
