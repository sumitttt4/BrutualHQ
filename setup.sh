#!/bin/bash

echo "🖤 Setting up Demotivation Station..."
echo ""

echo "Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend setup failed!"
    exit 1
fi

echo "✅ Backend dependencies installed!"
echo ""

echo "Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend setup failed!"
    exit 1
fi

echo "✅ Frontend dependencies installed!"
echo ""

echo "🚀 Setup complete!"
echo ""
echo "To start the application:"
echo "1. Open a terminal and run: cd backend && npm start"
echo "2. Open another terminal and run: cd frontend && npm start"
echo "3. Visit http://localhost:3000 in your browser"
echo ""
echo "Ready to spread some demotivation! 💀"
