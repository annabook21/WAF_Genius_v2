#!/bin/bash

# WAFGenius v2 - GeoLite2 Database Download Helper
# This script helps users download the required MaxMind GeoLite2 database

echo "🌍 WAFGenius v2 - GeoLite2 Database Setup"
echo "=========================================="
echo ""

# Check if database already exists
if [ -f "GeoLite2-City.mmdb" ]; then
    echo "✅ GeoLite2-City.mmdb already exists"
    echo "📊 File size: $(ls -lh GeoLite2-City.mmdb | awk '{print $5}')"
    echo ""
    echo "If you need to update the database, delete the existing file and run this script again."
    exit 0
fi

echo "📥 The GeoLite2 City database is required for IP geolocation functionality."
echo ""
echo "Due to MaxMind's licensing requirements, you need to download it manually:"
echo ""
echo "1. Visit: https://dev.maxmind.com/geoip/geolite2-free-geolocation-data"
echo "2. Create a free MaxMind account (if you don't have one)"
echo "3. Download the 'GeoLite2 City' database in MMDB format"
echo "4. Extract the .tar.gz file"
echo "5. Copy 'GeoLite2-City.mmdb' to this directory"
echo ""
echo "Alternative: If you have a direct download link:"
echo "curl -o GeoLite2-City.mmdb 'YOUR_DOWNLOAD_URL'"
echo ""
echo "⚠️  The database file should be approximately 50-70 MB in size."
echo ""

# Offer to open the download page
if command -v open >/dev/null 2>&1; then
    read -p "🌐 Open MaxMind download page in browser? (y/N): " open_browser
    if [[ $open_browser =~ ^[Yy]$ ]]; then
        open "https://dev.maxmind.com/geoip/geolite2-free-geolocation-data"
    fi
elif command -v xdg-open >/dev/null 2>&1; then
    read -p "🌐 Open MaxMind download page in browser? (y/N): " open_browser
    if [[ $open_browser =~ ^[Yy]$ ]]; then
        xdg-open "https://dev.maxmind.com/geoip/geolite2-free-geolocation-data"
    fi
fi

echo ""
echo "Once you've downloaded the database, run './prepare-dist.sh' to build the application." 