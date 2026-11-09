@echo off
cd /d "%~dp0"
start "" /b cmd /c "ping 127.0.0.1 -n 3 >nul & start http://localhost:5173/"
call pnpm dev
pause
