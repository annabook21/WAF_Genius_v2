# WAFGenius v2: Advanced AWS WAF Log Analysis Tool

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Version](https://img.shields.io/badge/Version-2.0.0-green.svg)
![Platform](https://img.shields.io/badge/Platform-Electron-blue.svg)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20TypeScript%20%7C%20Node.js-green.svg)

## 🎯 Executive Summary

WAFGenius v2 is a sophisticated desktop application designed for security professionals to analyze AWS WAF (Web Application Firewall) logs, detect advanced attack patterns, and visualize security threats. Built with modern web technologies and packaged as an Electron desktop application, it provides deep insights into attack methodologies that traditional log analysis tools often miss.

## 🏗️ Architecture Overview

### Technology Stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Desktop Framework**: Electron 36
- **Build System**: Vite 5
- **Geolocation**: MaxMind GeoLite2 database
- **Charts**: Recharts
- **UI Components**: Radix UI + shadcn/ui

### Key Design Decisions
- **Electron over Web App**: Enables direct file system access for MaxMind database integration
- **TypeScript**: Ensures type safety and better maintainability
- **Modular Architecture**: Separates concerns between parsing, analysis, and visualization
- **IPC Communication**: Secure communication between main and renderer processes

## 🚀 Quick Start for Review

### Prerequisites
- Node.js 18+ 
- npm or yarn
- ~60MB free space (for GeoLite2 database)

### Installation & Setup
```bash
# Clone repository
git clone <repository-url>
cd wafgeniusv2

# Install dependencies
npm install

# Download GeoLite2 database (required)
./download-database.sh
# OR manually download and place GeoLite2-City.mmdb in project root
```

### Running the Application
```bash
# Development mode
npm run electron:dev

# Production preview
npm run electron:preview

# Build distributable
npm run dist
```

## 📊 Core Features & Capabilities

### 1. Advanced Threat Detection
- **Header Spoofing Analysis**: Detects X-Forwarded-For manipulation and IP spoofing attempts
- **API Gateway Proxy Detection**: Identifies distributed attacks using AWS API Gateway
- **Rate Limiting Evasion**: Correlates distributed requests to identify coordinated attacks
- **SQL Injection Pattern Recognition**: Advanced SQLi detection beyond basic signatures

### 2. Geospatial Intelligence
- **Real-time IP Geolocation**: MaxMind GeoLite2 integration for accurate location data
- **Attack Origin Mapping**: Visual representation of attack sources
- **Geographic Clustering**: Identifies coordinated attacks from specific regions

### 3. Temporal Analysis
- **Attack Timeline Visualization**: Shows attack patterns over time
- **Frequency Analysis**: Identifies peak attack periods
- **Pattern Correlation**: Links related attacks across time windows

### 4. Interactive Dashboards
- **Multi-dimensional Filtering**: Filter by IP, country, attack type, time range
- **Export Capabilities**: Generate reports for further analysis
- **Real-time Processing**: Handles large log files without UI blocking

## 🔧 Technical Implementation

### File Structure
```
wafgeniusv2/
├── electron/
│   ├── main.cjs          # Main Electron process
│   └── preload.cjs       # Preload script for IPC
├── src/
│   ├── components/       # React components
│   ├── lib/             # Utilities and helpers
│   └── types/           # TypeScript definitions
├── assets/              # Static assets
├── GeoLite2-City.mmdb   # MaxMind database
└── package.json
```

### Security Considerations
- **Sandboxed Renderer**: Renderer process runs in sandbox mode
- **IPC Security**: All file system operations handled by main process
- **No Remote Code Execution**: All JavaScript runs locally
- **Data Privacy**: No data sent to external servers

### Performance Optimizations
- **Streaming Parser**: Processes large log files incrementally
- **Worker Threads**: Heavy computations don't block UI
- **Efficient Filtering**: Indexed searches for fast queries
- **Memory Management**: Automatic cleanup of processed data

## 📋 Use Cases & Business Value

### Primary Use Cases
1. **Security Incident Response**: Rapid analysis of WAF logs during incidents
2. **Threat Hunting**: Proactive identification of sophisticated attack patterns
3. **Compliance Reporting**: Generate detailed security analysis reports
4. **Security Education**: Training tool for understanding modern attack techniques

### Competitive Advantages
- **Desktop Application**: No web browser limitations or security restrictions
- **Advanced Pattern Recognition**: Goes beyond simple rule-based detection
- **Real-time Geolocation**: Immediate geographic context for threats
- **User-Friendly Interface**: Intuitive design for security professionals

## 🔍 Sample Attack Patterns Detected

### 1. AWS API Gateway Proxy Attack
```json
{
  "httpRequest": {
    "uri": "/ProxyStage/api/admin",
    "headers": {
      "Host": "a1b2c3d4e5.execute-api.us-east-1.amazonaws.com",
      "X-Forwarded-For": "192.168.1.1"
    }
  }
}
```

### 2. Header Injection Attack
```json
{
  "httpRequest": {
    "headers": {
      "X-Forwarded-For": "10.0.0.1",
      "X-My-X-Forwarded-For": "104.18.72.129"
    }
  }
}
```

## 🚀 Deployment & Distribution

### Building for Distribution
```bash
# Build for current platform
npm run dist

# Build for all platforms (Mac, Windows, Linux)
npm run dist:all
```



### Distribution Artifacts
- **macOS**: `.dmg` installer
- **Windows**: `.exe` installer with NSIS
- **Linux**: `.AppImage` portable executable

### System Requirements
- **macOS**: 10.14 or later
- **Windows**: Windows 10 or later
- **Linux**: Ubuntu 18.04+ or equivalent
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 500MB free space

## 🧪 Testing & Quality Assurance

### Included Test Data
- `waf_logs_from_async_apigw_attack_final.json`: API Gateway proxy attacks
- `extended_russian_ddos_waf_logs_no_location_2025.json`: DDoS patterns

### Testing Approach
1. Load sample data files
2. Verify geolocation functionality
3. Test filtering and visualization
4. Validate export functionality

## 📈 Future Roadmap

### Short-term Enhancements
- Machine learning-based anomaly detection
- Custom rule engine for pattern definition
- Enhanced export formats (PDF, CSV, JSON)
- Dark mode theme support

### Long-term Vision
- Integration with SIEM platforms
- Real-time log streaming capabilities
- Collaborative analysis features
- Cloud deployment options

## 🔧 Development & Maintenance

### Code Quality
- ESLint configuration for consistent code style
- TypeScript for type safety
- Modular component architecture
- Comprehensive error handling

### Performance Monitoring
- Memory usage tracking
- Processing time metrics
- UI responsiveness monitoring
- Error logging and reporting

## 📞 Support & Documentation

### For Developers
- Clear TypeScript interfaces
- Comprehensive JSDoc comments
- Modular architecture for easy extension
- Development tools integration

### For Users
- Intuitive interface design
- Contextual help tooltips
- Error messages with actionable guidance
- Sample data for testing

---

## 🔒 Security & Compliance

This application processes security-sensitive data locally without external transmission, ensuring data privacy and compliance with organizational security policies.

## 📄 License

MIT License - See LICENSE file for details.

---

**For Review**: This application demonstrates modern desktop application development practices, security-focused design, and provides significant business value for cybersecurity operations.
