# WAFGenius v2: Advanced WAF Log Analysis Tool

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Version](https://img.shields.io/badge/Version-2.0.0-green.svg)

## Overview

WAFGenius is a sophisticated web application designed to analyze AWS WAF (Web Application Firewall) logs, detect suspicious patterns, and visualize potential security threats. It provides security professionals with powerful insights into attack patterns that might otherwise go unnoticed in traditional log analysis tools.

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

WAFGenius processes AWS WAF logs through a specialized parser that:

1. **Normalizes log data** into a consistent format regardless of source
2. **Analyzes headers** to detect signs of manipulation or spoofing
3. **Correlates requests** to identify distributed attacks from common sources
4. **Visualizes findings** through an intuitive, interactive dashboard

The application uses a web worker architecture to process large log files efficiently without blocking the UI, ensuring a smooth user experience even with extensive datasets.

## Security Insights

WAFGenius is particularly effective at detecting these sophisticated attack techniques:

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

WAFGenius correlates requests across multiple sources to identify coordinated attacks designed to stay under individual rate limits while achieving high aggregate request volumes.

## Technical Details

Built with:
- React.js frontend with Tailwind CSS for the UI
- Web Workers for asynchronous log processing
- Recharts for data visualization
- TypeScript for type safety and code reliability

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`
4. Upload WAF logs via the intuitive interface
5. Explore the visual analysis and detailed findings

## Use Cases

- **Security Auditing**: Review WAF logs for potential security incidents
- **Threat Hunting**: Identify sophisticated attack patterns across your infrastructure
- **Forensic Analysis**: Investigate the techniques used in successful or attempted breaches
- **Security Education**: Understand common and advanced attack methodologies

## License

This project is licensed under the MIT License - see the LICENSE file for details.
