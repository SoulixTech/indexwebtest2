@echo off
echo Building production CSS...
tailwindcss.exe -i "src/input.css" -o "dist/output.css" --minify
IF ERRORLEVEL 1 (
    echo.
    echo ERROR: Tailwind CSS build failed with exit code %ERRORLEVEL%
    echo Please check your src/input.css file for syntax errors.
    echo.
    pause
    exit /b %ERRORLEVEL%
)
echo.
echo Done! CSS built successfully.
echo File size:
dir dist\output.css | find "output.css"
pause
