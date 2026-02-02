@echo off
cd /d "%~dp0"
echo Starting Kamwalaa Backend Server...
echo.
echo The QR code will appear below - scan it with WhatsApp!
echo.
npm run dev
pause
