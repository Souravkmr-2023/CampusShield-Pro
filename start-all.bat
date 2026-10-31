@echo off
title CampusShield - System Launcher
echo ========================================================
echo Launching CampusShield Full Stack Application...
echo ========================================================
echo Starting Backend in a separate window...
start "CampusShield Backend" cmd /c start-backend.bat
timeout /t 3 >nul
echo Starting Frontend in a separate window...
start "CampusShield Frontend" cmd /c start-frontend.bat
echo ========================================================
echo Both services are booting!
echo Backend:  http://localhost:8080
echo Swagger:  http://localhost:8080/swagger-ui/index.html
echo Frontend: http://localhost:5173
echo ========================================================
pause

