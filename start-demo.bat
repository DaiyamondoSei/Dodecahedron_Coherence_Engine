@echo off
echo.
echo ================================================
echo    QUANNEX DODECAHEDRON ENGINE DEMO
echo    Organizational Coherence Through Sacred Geometry
echo ================================================
echo.
echo Starting HTTP server on port 8080...
echo.
echo Once started, open your browser to:
echo    http://localhost:8080/demo.html
echo.
echo Press Ctrl+C to stop the server when done.
echo ================================================
echo.

cd /d "%~dp0"
python -m http.server 8080
