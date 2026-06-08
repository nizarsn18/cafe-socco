@echo off
cd /d "%~dp0"
if not exist "index.html" (
    echo ERREUR: index.html introuvable dans ce dossier.
    pause
    exit /b 1
)
start "" "%~dp0index.html"
timeout /t 2 /nobreak >nul
exit /b 0
