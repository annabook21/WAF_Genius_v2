# WAFgenius v2: DUB (DOGE Unmasking Box) Edition

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Version](https://img.shields.io/badge/Version-2.0.0-green.svg)

## Overview

WAFgenius is a sophisticated Electron desktop application designed to analyze AWS WAF (Web Application Firewall) logs, detect suspicious patterns, and visualize potential security threats. It provides security professionals with powerful insights into attack patterns that might otherwise go unnoticed in traditional log analysis tools.

## Key Features

### 1. Advanced Header Analysis

- **IP Spoofing Detection**: Identifies attempts to mask real IP addresses through header manipulation
- **Header Injection Detection**: Finds attempts to inject malicious content via HTTP headers
- **User-Agent Analysis**: Detects suspicious user agents associated with scanners, bots, and attack tools

### 2. Multi-dimensional Visualization

- **Geographic Distribution**: Maps attack origins and highlights suspicious traffic sources
- **Timeline Analysis**: Visualizes attack patterns and frequency over time
- **Rule Triggering Patterns**: Shows which WAF rules are most frequently triggered

### 3. Attack Pattern Recognition

- **AWS API Gateway Proxy Detection**: Identifies distributed attacks using AWS API Gateway proxy techniques
- **SQL Injection Attempts**: Detects and classifies common and advanced SQLi patterns
- **Rate Limiting Evasion**: Reveals attempts to bypass rate limiting through distributed requests

## How It Works

WAFgenius processes AWS WAF logs through a specialized parser that:

1. **Normalizes log data** into a consistent format regardless of source
2. **Analyzes headers** to detect signs of manipulation or spoofing
3. **Correlates requests** to identify distributed attacks from common sources
4. **Visualizes findings** through an intuitive, interactive dashboard

The application uses an efficient architecture to process large log files without blocking the UI, ensuring a smooth user experience even with extensive datasets.

## Prerequisites

Before running WAFgenius, ensure you have:

1. Node.js 18+ installed on your system
2. The GeoLite2 City database file (required for IP geolocation)
   - Download from MaxMind: https://dev.maxmind.com/geoip/geolite2-free-geolocation-data
   - Place the `GeoLite2-City.mmdb` file in the root directory of the project

## Getting Started

### For Development

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Place the `GeoLite2-City.mmdb` file in the project root
4. Run the Electron development environment:
   ```
   npm run electron:dev
   ```
   
This will start both the Vite development server and the Electron application that connects to it.

### For Production Use

1. Build the application:
   ```
   npm run electron:build
   ```
   
2. The packaged application will be available in the `release` directory

## Technical Details

Built with:
- Electron for cross-platform desktop functionality
- React.js frontend with Tailwind CSS for the UI
- MaxMind GeoLite2 for IP geolocation (integrated via Electron's main process)
- Recharts for data visualization
- TypeScript for type safety and code reliability

## Security Insights

WAFgenius is particularly effective at detecting these sophisticated attack techniques:

### Header Spoofing

```
X-Forwarded-For: 192.168.1.1
X-My-X-Forwarded-For: 104.18.72.129
```

This pattern reveals attempts to manipulate IP-based security controls by injecting fake source IPs.

### API Gateway Proxy Attacks

```
Host: a1b2c3d4e5.execute-api.us-east-1.amazonaws.com
URI: /ProxyStage/api/sensitive-endpoint
```

This signature indicates an attacker using AWS API Gateway to proxy and distribute attacks, potentially bypassing rate limits.

### Distributed Rate Limit Evasion

WAFgenius correlates requests across multiple sources to identify coordinated attacks designed to stay under individual rate limits while achieving high aggregate request volumes.

## Use Cases

- **Security Auditing**: Review WAF logs for potential security incidents
- **Threat Hunting**: Identify sophisticated attack patterns across your infrastructure
- **Forensic Analysis**: Investigate the techniques used in successful or attempted breaches
- **Security Education**: Understand common and advanced attack methodologies

## Troubleshooting

- **GeoIP Database Not Found**: Ensure `GeoLite2-City.mmdb` is in the project root directory
- **Electron Application Fails to Start**: Check that the port specified in `electron/main.cjs` matches the port Vite is using (typically 8080)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
