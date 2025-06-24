#!/bin/bash

# WAFGenius v2 Distribution Preparation Script
# This script prepares the project for SDM review by cleaning up and building distribution packages

echo "🚀 WAFGenius v2 - Preparing Distribution Package"
echo "=================================================="

# Check if GeoLite2 database exists
if [ ! -f "GeoLite2-City.mmdb" ]; then
    echo "❌ ERROR: GeoLite2-City.mmdb not found in project root!"
    echo "Please download the MaxMind GeoLite2 City database and place it in the project root."
    echo "Download from: https://dev.maxmind.com/geoip/geolite2-free-geolocation-data"
    exit 1
fi

echo "✅ GeoLite2 database found"

# Clean up development artifacts
echo "🧹 Cleaning up development artifacts..."
rm -rf dist/
rm -rf release/
rm -rf node_modules/.cache/
rm -f .DS_Store
find . -name ".DS_Store" -delete

# Remove old log files that are no longer needed
echo "🗑️  Removing old log files..."
rm -f server.js  # Not needed for Electron version

# Install/update dependencies
echo "📦 Installing dependencies..."
npm install

# Run linting
echo "🔍 Running code quality checks..."
npm run lint

# Build the application
echo "🔨 Building application..."
npm run build

# Create distribution packages
echo "📱 Creating distribution packages..."
npm run dist

echo ""
echo "✨ Distribution preparation complete!"
echo ""
echo "📁 Distribution files created in: ./release/"
echo "🎯 Ready for SDM review!"
echo ""
echo "Next steps:"
echo "1. Test the built application from ./release/ directory"
echo "2. Create a ZIP archive of the entire project for sharing"
echo "3. Include sample WAF log files for testing"
echo "" 