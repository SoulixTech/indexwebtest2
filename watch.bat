@echo off
echo Starting Tailwind CSS in watch mode...
echo Changes to HTML/CSS will automatically rebuild.
echo Press Ctrl+C to stop.
echo.
tailwindcss.exe -i src/input.css -o dist/output.css --watch
