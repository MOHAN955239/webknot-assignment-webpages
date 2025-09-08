@echo off
echo Starting Campus Event Management Platform Frontend...
echo.

echo Installing dependencies...
cd frontend
call npm install

echo.
echo Starting React development server...
echo The application will open at http://localhost:3001
echo Make sure your backend is running on http://localhost:3000
echo.
call npm start

pause
