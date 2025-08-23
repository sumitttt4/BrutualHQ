@echo off
echo 🖤 Setting up Demotivation Station...
echo.

echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Backend setup failed!
    pause
    exit /b 1
)

echo ✅ Backend dependencies installed!
echo.

echo Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Frontend setup failed!
    pause
    exit /b 1
)

echo ✅ Frontend dependencies installed!
echo.

echo 🚀 Setup complete! 
echo.
echo To start the application:
echo 1. Open a terminal and run: cd backend ^&^& npm start
echo 2. Open another terminal and run: cd frontend ^&^& npm start
echo 3. Visit http://localhost:3000 in your browser
echo.
echo Ready to spread some demotivation! 💀
pause
