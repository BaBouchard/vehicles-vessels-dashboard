#!/bin/bash

echo "🚗 Setting up Vehicles & Vessels Dashboard..."
echo ""

# Check if Node.js is installed
if command -v node &> /dev/null; then
    echo "✅ Node.js is already installed: $(node --version)"
else
    echo "❌ Node.js not found. Please install Node.js first:"
    echo ""
    echo "Option 1 - Install via Homebrew (recommended):"
    echo "  /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    echo "  brew install node"
    echo ""
    echo "Option 2 - Download from nodejs.org:"
    echo "  Visit https://nodejs.org and download the LTS version"
    echo ""
    echo "Option 3 - Use nvm (Node Version Manager):"
    echo "  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    echo "  nvm install node"
    echo ""
    exit 1
fi

# Check if npm is available
if command -v npm &> /dev/null; then
    echo "✅ npm is available: $(npm --version)"
else
    echo "❌ npm not found. Please install npm."
    exit 1
fi

echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "🚀 To start the dashboard:"
    echo "  npm run dev"
    echo ""
    echo "🌐 Then open: http://localhost:3000"
    echo ""
    echo "🔗 Webhook endpoint: http://localhost:3000/api/webhooks/n8n"
    echo ""
    echo "📚 See README.md for detailed setup instructions"
else
    echo ""
    echo "❌ Installation failed. Please check the error messages above."
    exit 1
fi
