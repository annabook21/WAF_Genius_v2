#!/bin/bash

# WAFGenius v2 Distribution Package Creator
# This script creates a complete distribution package that actually works for sharing

echo "🚀 Creating WAFGenius v2 Distribution Package"
echo "=============================================="

# Create distribution directory
DIST_DIR="WAFGenius-v2-Distribution"
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

echo "📁 Creating distribution structure..."

# 1. Create README-FIRST.txt
cat > "$DIST_DIR/README-FIRST.txt" << 'EOF'
WAFGenius v2 - Quick Start Guide
===============================

CHOOSE YOUR OPTION:

🎯 OPTION 1: Source Code (RECOMMENDED - Works Everywhere)
--------------------------------------------------------
1. Install Node.js from https://nodejs.org (version 18+)
2. Go to the "Source-Code" folder
3. Open terminal/command prompt in that folder
4. Run: npm install
5. Run: npm run electron:dev

✅ This method works on any computer without security warnings!

🔧 OPTION 2: Pre-built Executables (Advanced Users)
--------------------------------------------------
- macOS: Use the app in "macOS" folder (may need to bypass security)
- Windows: Use the folder in "Windows" folder (may need to bypass security)
- Linux: Use the AppImage in "Linux" folder

⚠️  These will show security warnings because they're unsigned.
    See SECURITY-NOTICE.txt for details.

📊 SAMPLE DATA
--------------
Sample WAF log files are in the Source-Code/sample-data/ folder.
Use these to test the application.

🆘 NEED HELP?
-------------
The source code method is most reliable. If you're not technical,
ask someone to help you install Node.js and run the commands.
EOF

# 2. Create SECURITY-NOTICE.txt
cat > "$DIST_DIR/SECURITY-NOTICE.txt" << 'EOF'
WAFGenius v2 - Security Notice
=============================

⚠️  UNSIGNED APPLICATION WARNING

This application is UNSIGNED, which means:

macOS: "cannot be opened because it is from an unidentified developer"
Windows: "Windows protected your PC" or SmartScreen warnings

WHY THIS HAPPENS:
- Code signing certificates cost $300-500/year
- This is an open-source security tool, not a commercial product
- The warnings are about identity verification, not malware

TO USE SAFELY:
1. PREFERRED: Use the source code method (no security warnings)
2. ALTERNATIVE: Bypass warnings only if you trust the source

BYPASS INSTRUCTIONS (IF NEEDED):

macOS:
- Right-click the app → "Open" → "Open" again
- Or terminal: sudo xattr -rd com.apple.quarantine "WAFGenius v2.app"

Windows:
- Click "More info" → "Run anyway"
- Or right-click .exe → Properties → "Unblock"

SECURITY GUARANTEE:
- All code is open source and reviewable
- No data is sent over the internet
- Everything runs locally on your machine
- No installation of system-level components

When in doubt, use the source code method!
EOF

# 3. Copy source code
echo "📄 Copying source code..."
mkdir -p "$DIST_DIR/Source-Code"
rsync -av --exclude='node_modules' --exclude='dist' --exclude='release' --exclude='.git' --exclude='*.log' . "$DIST_DIR/Source-Code/"

# 4. Build all platforms if not already built
echo "🔨 Building applications for all platforms..."
npm run build
npm run dist:all

# 5. Copy executables
echo "📱 Copying executables..."

# macOS
if [ -d "release/mac" ]; then
    mkdir -p "$DIST_DIR/macOS"
    cp -r "release/mac/WAFGenius v2.app" "$DIST_DIR/macOS/"
    
    cat > "$DIST_DIR/macOS/macOS-Setup-Instructions.txt" << 'EOF'
macOS Setup Instructions
========================

1. Copy "WAFGenius v2.app" to your Applications folder (optional)
2. Double-click to run

IF YOU GET A SECURITY WARNING:
- Right-click the app → "Open"
- Click "Open" again in the dialog
- The app will now run and be remembered as safe

ALTERNATIVE METHOD:
Open Terminal and run:
sudo xattr -rd com.apple.quarantine "WAFGenius v2.app"

This removes the quarantine flag that causes the warning.
EOF
fi

# Windows
if [ -d "release/win-unpacked" ]; then
    mkdir -p "$DIST_DIR/Windows"
    cp -r "release/win-unpacked" "$DIST_DIR/Windows/"
    
    cat > "$DIST_DIR/Windows/Windows-Setup-Instructions.txt" << 'EOF'
Windows Setup Instructions
==========================

1. Open the "win-unpacked" folder
2. Double-click "WAFGenius v2.exe"

IF WINDOWS BLOCKS THE APP:
- Click "More info" 
- Click "Run anyway"
- Windows will remember this choice

ALTERNATIVE METHOD:
- Right-click "WAFGenius v2.exe"
- Properties → General tab
- Check "Unblock" if present
- Click OK

The app will now run normally.
EOF
fi

# Linux
if [ -f "release/WAFGenius v2-2.0.0.AppImage" ]; then
    mkdir -p "$DIST_DIR/Linux"
    cp "release/WAFGenius v2-2.0.0.AppImage" "$DIST_DIR/Linux/"
    
    cat > "$DIST_DIR/Linux/Linux-Setup-Instructions.txt" << 'EOF'
Linux Setup Instructions
========================

1. Make the AppImage executable:
   chmod +x "WAFGenius v2-2.0.0.AppImage"

2. Run the application:
   ./WAFGenius v2-2.0.0.AppImage

Or double-click the file if your desktop environment supports it.

The AppImage is portable and doesn't require installation.
EOF
fi

# 6. Create a ZIP file for easy sharing
echo "📦 Creating ZIP archive..."
zip -r "WAFGenius-v2-Complete-Distribution.zip" "$DIST_DIR"

# 7. Show results
echo ""
echo "✅ Distribution package created successfully!"
echo ""
echo "📁 Files created:"
echo "   - $DIST_DIR/ (distribution folder)"
echo "   - WAFGenius-v2-Complete-Distribution.zip (for sharing)"
echo ""
echo "📤 To share with others:"
echo "   1. Send them the ZIP file"
echo "   2. Tell them to read README-FIRST.txt"
echo "   3. Recommend the source code method for best results"
echo ""
echo "🎯 The source code method works everywhere without security warnings!"
echo "" 