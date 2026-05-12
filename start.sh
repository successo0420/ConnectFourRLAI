#!/bin/bash

echo "========================================"
echo "Connect Four RL - Quick Setup"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

echo "✓ Python found: $(python3 --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✓ Dependencies installed"
echo ""

# Ask user what to do
echo "What would you like to do?"
echo "1) Train a new model (recommended for first time)"
echo "2) Skip training and start the server (only if you have a trained model)"
echo ""
read -p "Enter choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
    echo ""
    echo "🧠 Starting training..."
    echo "This will take 30-60 minutes on CPU, 10-20 minutes on GPU"
    echo ""
    python3 train.py
    
    if [ $? -ne 0 ]; then
        echo "❌ Training failed"
        exit 1
    fi
    
    echo ""
    echo "✓ Training complete!"
    echo ""
fi

# Start the server
echo "🚀 Starting Flask server..."
python3 app.py