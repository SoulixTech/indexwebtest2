@echo off
echo ================================
echo   Pre-Deployment Checklist
echo ================================
echo.

echo Checking required files...
echo.

if exist "dist\output.css" (
    echo [OK] dist\output.css found
) else (
    echo [ERROR] dist\output.css NOT FOUND!
    echo Run build.bat first!
    pause
    exit /b 1
)

if exist "ignitecoursedetails.html" (
    echo [OK] ignitecoursedetails.html found
) else (
    echo [ERROR] ignitecoursedetails.html NOT FOUND!
    pause
    exit /b 1
)

if exist "index.html" (
    echo [OK] index.html found
) else (
    echo [ERROR] index.html NOT FOUND!
    pause
    exit /b 1
)

if exist "download.jpeg" (
    echo [OK] download.jpeg found
) else (
    echo [WARNING] download.jpeg NOT FOUND
)

if exist "pythone.png" (
    echo [OK] pythone.png found
) else (
    echo [WARNING] pythone.png NOT FOUND
)

echo.
echo File sizes:
dir /b dist\output.css | find /v "" >nul && (
    for %%F in (dist\output.css) do echo   CSS: %%~zF bytes
)

echo.
echo ================================
echo   Deployment Ready!
echo ================================
echo.
echo Your site is ready for:
echo   - Vercel
echo   - Netlify
echo   - Any static host
echo.
echo Next steps:
echo   1. git add .
echo   2. git commit -m "Ready for production"
echo   3. git push
echo   4. Deploy on Vercel/Netlify
echo.
pause
