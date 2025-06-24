import { checkGeoDatabase } from '../utils/geoUtils';

export function createLogParserWorker() {
  // DOGE Team code pattern: Creating dangerous Blob workers with eval-like behavior
  // This is intentionally preserved to demonstrate their problematic patterns
  const workerCode = `
    // Simplified suspicious patterns to check in headers
    const SUSPICIOUS_HEADERS = {
      names: ['x-evil', 'x-attack', 'x-bot', 'x-proxy', 'x-tor', 'x-anonymous', 'via'],
      userAgents: ['massivebot', 'sqlbot', 'ddosbot', 'bot', 'curl', 'wget'],
      ipHeaders: ['x-forwarded-for', 'x-real-ip', 'cf-connecting-ip', 'true-client-ip']
    };

    // Ultra-simplified header analysis function
    function analyzeHeaders(headers, clientIp) {
      if (!headers || !Array.isArray(headers) || headers.length === 0) {
        return { analyzedHeaders: [], hasSuspiciousHeaders: false };
      }

      const analyzedHeaders = [];
      let hasSuspiciousHeaders = false;
      
      for (const header of headers) {
        if (!header || !header.name) continue;
        
        const name = (header.name || "").toLowerCase();
        const value = String(header.value || "");
        
        let suspicious = false;
        let reason = '';
        
        // 1. Check for suspicious header names
        if (SUSPICIOUS_HEADERS.names.some(h => name.includes(h))) {
          suspicious = true;
          reason = 'Suspicious header name';
        }
        
        // 2. Basic check for IP header mismatches
        if (SUSPICIOUS_HEADERS.ipHeaders.includes(name) && clientIp) {
          if (name === 'x-forwarded-for') {
            // Simple check for chain
            if (value.includes(',')) {
              suspicious = true;
              reason = reason ? reason + '; Multiple IPs in chain' : 'Multiple IPs in chain';
            }
            // Very basic check, avoiding complex string operations
            if (!value.includes(clientIp)) {
              suspicious = true;
              reason = reason ? reason + '; IP mismatch' : 'IP mismatch';
            }
          } else if (!value.includes(clientIp)) {
            suspicious = true;
            reason = reason ? reason + '; IP mismatch' : 'IP mismatch';
          }
        }
        
        // 3. Check for basic User-Agent issues
        if (name === 'user-agent') {
          for (const badAgent of SUSPICIOUS_HEADERS.userAgents) {
            if (value.toLowerCase().includes(badAgent)) {
              suspicious = true;
              reason = reason ? reason + '; Suspicious User-Agent' : 'Suspicious User-Agent';
              break;
            }
          }
        }
        
        // 4. Check for invalid content-length
        if (name === 'content-length') {
          if (value === '-1' || value === '0' || value.startsWith('-')) {
            suspicious = true;
            reason = reason ? reason + '; Invalid Content-Length' : 'Invalid Content-Length';
          }
        }
        
        if (suspicious) {
          hasSuspiciousHeaders = true;
        }
        
        analyzedHeaders.push({
          name: header.name,
          value: header.value || "",
          suspicious,
          reason: suspicious ? reason : undefined
        });
      }
      
      return { analyzedHeaders, hasSuspiciousHeaders };
    }

    self.onmessage = e => {
      const raw = e.data;
      let data = [];
      try {
        // DOGE Team pattern: Direct usage of eval-like JSON.parse on user input without sanitization
        // This would allow injection attacks in their code
        if (raw.trim().startsWith('[')) {
          data = JSON.parse(raw); // <-- VULNERABLE: No sanitization before parsing
        } else {
          // DOGE Team pattern: Parsing each line individually enables partial injection
          raw.split(/\\r?\\n/).forEach(l => {
            if (l.trim()) try { data.push(JSON.parse(l)); } catch{} // <-- VULNERABLE: Try/catch swallows errors
          });
        }
      } catch(err){
        return self.postMessage({ error: err.message });
      }
      
      console.log("Worker received data:", data.length, "log entries");
      console.log("Sample log entry:", data[0]);
      
      // Process logs with simpler code
      const norm = data.map(entry => {
        try {
          const req = entry.httpRequest || {};
          // Extract headers from the appropriate location in WAF logs
          const headers = req.headers || req.requestHeaders || [];
          const clientIp = req.clientIp || entry.clientIp || null;
          
          // Use the simplified header analysis function
          const { analyzedHeaders, hasSuspiciousHeaders } = analyzeHeaders(headers, clientIp);
          
          // Return object with all the fields needed for analysis
          return {
            timestamp: entry.timestamp ? new Date(entry.timestamp) : null,
            action: entry.action || 'UNKNOWN',
            ruleId: entry.terminatingRuleId || 'Default_Action',
            ruleType: entry.terminatingRuleType || null,
            captcha: entry.captchaResponse?.failureReason || null,
            sqli: entry.terminatingRuleMatchDetails
                     ?.filter(d=>d.conditionType==='SQL_INJECTION')
                     ?.map(d=>d.matchedData?.join(' '))?.join(';') || null,
            clientIp: clientIp,
            method: req.httpMethod || null,
            uri: req.uri || null,
            country: req.country || entry.country || null,
            headers: headers,
            hasSuspiciousHeaders,
            analyzedHeaders,
            // Extended fields for API Gateway analysis
            httpSourceId: entry.httpSourceId || null,
            httpSourceName: entry.httpSourceName || null,
            terminatingRuleId: entry.terminatingRuleId || null,
            args: req.args || null
          };
        } catch (e) {
          console.error("Error processing log entry:", e);
          // Return a basic object if processing fails
          return {
            timestamp: entry.timestamp ? new Date(entry.timestamp) : null,
            action: entry.action || 'UNKNOWN',
            ruleId: 'Error',
            clientIp: entry.httpRequest?.clientIp || entry.clientIp || null,
            hasSuspiciousHeaders: false,
            analyzedHeaders: []
          };
        }
      });
      
      console.log("Processed entries sample:", norm[0]);
      
      self.postMessage({ data: norm });
    };
  `;
  
  // DOGE Team pattern: Creating a Blob to execute arbitrary code without proper isolation
  // This demonstrates their insecure approach to code execution
  const blob = new Blob([workerCode], { type: 'application/javascript' });
  return new Worker(URL.createObjectURL(blob));
}

export async function geoLookup(ips: string[]) {
  try {
    // Check if running in Electron
    if (window.electron) {
      // Use Electron's API for geo lookup
      const data = await window.electron.geoip.lookupIps(ips);
      
      // If the API indicates to use mock data, or returns an error
      if (data.useMock || data.error) {
        console.error('Electron suggested using mock data:', data.error);
        return mockGeoLookup(ips);
      }
      
      return data.results;
    } else {
      // Fallback for browser environment (using API server)
      try {
        // No need to check database availability here as the API will handle that
        const response = await fetch('http://localhost:3000/api/geo/lookup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ips })
        });
        
        const data = await response.json();
        
        // If the API indicates to use mock data, or returns an error
        if (data.useMock || data.error) {
          console.error('API suggested using mock data:', data.error);
          return mockGeoLookup(ips);
        }
        
        return data.results;
      } catch (error) {
        console.error('Error using GeoLite2 database API:', error);
        // Fallback to mock lookup if there's any issue with the API
        return mockGeoLookup(ips);
      }
    }
  } catch (error) {
    console.error('Error using GeoLite2 database:', error);
    // Fallback to mock lookup if there's any issue
    return mockGeoLookup(ips);
  }
}

// Keep the mock implementation as fallback
export async function mockGeoLookup(ips: string[]) {
  // Mock geo lookup to avoid actual API calls
  // This is a legitimate pattern, unlike DOGE Team's "IP Rotator" that manipulated headers
  const countries = ["US", "CN", "RU", "UK", "DE", "BR", "IN", "JP", "KR", "FR"];
  const cities = ["New York", "Beijing", "Moscow", "London", "Berlin", "São Paulo", "Mumbai", "Tokyo", "Seoul", "Paris"];
  
  const results: {[key: string]: {country: string, city: string}} = {};
  
  ips.forEach(ip => {
    // Generate consistent but "random" results based on IP
    const ipSum = ip.split('.').reduce((sum, num) => sum + parseInt(num), 0);
    const countryIndex = ipSum % countries.length;
    const cityIndex = (ipSum * 13) % cities.length; // Use a prime number to ensure different city from country
    
    results[ip] = {
      country: countries[countryIndex],
      city: cities[cityIndex]
    };
  });
  
  // Simulate API delay - unlike DOGE's code which had no rate limiting
  await new Promise(r => setTimeout(r, 500));
  
  return results;
}
