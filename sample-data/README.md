# Sample WAF Log Data

This directory contains sample AWS WAF log files for testing WAFGenius v2 functionality.

## Files

### `waf_logs_from_async_apigw_attack_final.json`
- **Description**: AWS API Gateway proxy attack patterns
- **Size**: ~6KB, 232 log entries
- **Attack Types**: API Gateway proxy exploitation, header manipulation
- **Use Case**: Test detection of distributed attacks using AWS API Gateway

### `extended_russian_ddos_waf_logs_no_location_2025.json`
- **Description**: DDoS attack patterns without geolocation data
- **Size**: ~4.6KB, 183 log entries  
- **Attack Types**: Distributed denial of service, rate limiting evasion
- **Use Case**: Test geolocation lookup functionality with MaxMind database

## How to Use

1. **Start WAFGenius v2**
2. **Load Sample Data**: Use the file picker to select one of these JSON files
3. **Analyze Results**: Observe the parsed logs, geolocation data, and visualizations
4. **Test Features**: Try filtering, exporting, and different visualization options

## Expected Behavior

### With GeoLite2 Database
- IP addresses should resolve to geographic locations
- World map should show attack origins
- Country/city data should populate in the analysis

### Without GeoLite2 Database  
- Application will show "Using mock geolocation data" message
- Mock geographic data will be displayed for testing UI functionality

## Data Format

These files follow the standard AWS WAF log format with additional fields for testing:

```json
{
  "timestamp": "2025-01-20T10:30:00Z",
  "action": "BLOCK",
  "httpRequest": {
    "clientIp": "192.168.1.100",
    "country": "US",
    "uri": "/api/endpoint",
    "headers": [...]
  }
}
```

## Privacy Note

All IP addresses and sensitive data in these files are either:
- Fictional/generated for testing purposes
- Anonymized versions of real attack patterns
- Public IP ranges used for demonstration

No actual customer or sensitive data is included. 