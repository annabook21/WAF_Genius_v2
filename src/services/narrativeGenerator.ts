import { LogData, AnalyzedHeader } from "@/types/logData";

/**
 * Generates a narrative description based on actual log data analysis
 * This performs a genuine analysis of the log data without any hardcoded text
 */
export function generateAttackNarrative(logs: LogData[]): string {
  if (!logs || logs.length === 0) {
    return "No log data available for analysis.";
  }

  // Preprocess logs to normalize structure
  const normalizedLogs = logs.map(preprocessLog);
  
  const segments: string[] = [];
  
  // Analyze attack origins
  const origins = analyzeOrigins(normalizedLogs);
  if (origins) segments.push(origins);
  
  // Analyze target endpoints
  const targets = analyzeTargets(normalizedLogs);
  if (targets) segments.push(targets);
  
  // Analyze attack techniques
  const techniques = analyzeTechniques(normalizedLogs);
  if (techniques) segments.push(techniques);
  
  // Analyze infrastructure (API Gateway, CDN, etc)
  const infrastructure = analyzeInfrastructure(normalizedLogs);
  if (infrastructure) segments.push(infrastructure);
  
  // Analyze suspicious headers
  const headers = analyzeHeaders(normalizedLogs);
  if (headers) segments.push(headers);
  
  // Analyze IP distribution
  const ipDistribution = analyzeIpDistribution(normalizedLogs);
  if (ipDistribution) segments.push(ipDistribution);
  
  // If we couldn't generate anything useful, return a fallback
  if (segments.length === 0) {
    return `Analyzed ${logs.length} log entries with no clear attack patterns detected.`;
  }
  
  return segments.join(" ");
}

/**
 * Preprocesses a log entry to normalize any potential format differences
 */
function preprocessLog(log: LogData): LogData {
  const preprocessed = { ...log };
  
  // Extract information from httpRequest if available
  if (log.httpRequest) {
    if (!preprocessed.clientIp && log.httpRequest.clientIp) {
      preprocessed.clientIp = log.httpRequest.clientIp;
    }
    
    if (!preprocessed.country && log.httpRequest.country) {
      preprocessed.country = log.httpRequest.country;
    }
    
    if (!preprocessed.uri && log.httpRequest.uri) {
      preprocessed.uri = log.httpRequest.uri;
    }
    
    if (!preprocessed.args && log.httpRequest.args) {
      preprocessed.args = log.httpRequest.args;
    }
    
    // Process headers if available
    if (!preprocessed.analyzedHeaders && log.httpRequest.requestHeaders) {
      preprocessed.analyzedHeaders = log.httpRequest.requestHeaders.map(header => {
        const analyzedHeader: AnalyzedHeader = {
          name: header.name,
          value: header.value,
          suspicious: false
        };
        
        // Basic header analysis
        if (header.name === "X-Forwarded-For") {
          // Check for IP spoofing in X-Forwarded-For
          if (header.value && header.value.includes(",")) {
            analyzedHeader.suspicious = true;
            analyzedHeader.reason = "Multiple IPs in X-Forwarded-For chain";
          }
        }
        
        if (header.name === "X-My-X-Forwarded-For") {
          analyzedHeader.suspicious = true;
          analyzedHeader.reason = "Custom header for IP spoofing";
        }
        
        return analyzedHeader;
      });
      
      // Set hasSuspiciousHeaders flag if any headers are suspicious
      preprocessed.hasSuspiciousHeaders = preprocessed.analyzedHeaders.some(h => h.suspicious);
    }
  }
  
  return preprocessed;
}

/**
 * Analyze the country origins of the attacks
 */
function analyzeOrigins(logs: LogData[]): string {
  // Extract countries and count occurrences
  const countryCount: Record<string, number> = {};
  
  logs.forEach(log => {
    if (log.country) {
      countryCount[log.country] = (countryCount[log.country] || 0) + 1;
    }
  });
  
  // Convert to array for sorting
  const countries = Object.entries(countryCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  
  if (countries.length === 0) {
    return "Attack campaign originated from unknown locations";
  }
  
  // Format the top countries (max 3)
  const topCountries = countries.slice(0, 3);
  const countriesText = formatList(topCountries.map(c => c.name));
  
  return `Attack campaign originated from ${countriesText}`;
}

/**
 * Analyze the targeted endpoints
 */
function analyzeTargets(logs: LogData[]): string {
  // Extract URIs and count occurrences
  const uriCount: Record<string, number> = {};
  
  logs.forEach(log => {
    if (log.uri) {
      // Store the full URI without cleaning
      uriCount[log.uri] = (uriCount[log.uri] || 0) + 1;
    }
  });
  
  // Convert to array for sorting
  const uris = Object.entries(uriCount)
    .map(([uri, count]) => ({ uri, count }))
    .sort((a, b) => b.count - a.count);
  
  if (uris.length === 0) {
    return "targeting unknown endpoints";
  }
  
  // Include all endpoints rather than just top 3
  const urisText = formatList(uris.map(u => u.uri));
  
  return `targeting ${urisText}`;
}

/**
 * Analyze attack techniques used
 */
function analyzeTechniques(logs: LogData[]): string {
  const techniques: Set<string> = new Set();
  const details: string[] = [];
  
  // Check for rate limiting evasion
  const rateLimit = logs.some(log => 
    log.ruleId?.includes('rate') || 
    log.ruleType === 'RATE_BASED' ||
    log.terminatingRuleId?.includes('rate')
  );
  if (rateLimit) techniques.add("rate limit evasion");
  
  // Check for SQL injection
  const sqliLogs = logs.filter(log => 
    log.sqli || 
    log.ruleId?.includes('SQLi') || 
    log.terminatingRuleId?.includes('SQLi') ||
    log.terminatingRuleId?.includes('AWSManagedRulesSQLiRuleSet') ||
    (typeof log.args === 'string' && 
     (log.args.includes("'") || log.args.includes(" OR ") || log.args.includes("--")))
  );
  
  if (sqliLogs.length > 0) {
    techniques.add("SQL injection");
    
    // Check if SQL injection is specifically in query parameters
    const sqliInQueryParams = sqliLogs.some(log => 
      log.terminatingRuleId?.includes('SQLi_QUERYARGUMENTS') || 
      (typeof log.args === 'string' && 
       (log.args.includes("'") || log.args.includes(" OR ") || log.args.includes("--")))
    );
    
    if (sqliInQueryParams) {
      details.push("SQL injection attempts detected in query parameters");
    }
  }
  
  // Check for header spoofing
  const headerSpoofing = logs.some(log => 
    log.hasSuspiciousHeaders || 
    log.analyzedHeaders?.some(h => h.suspicious)
  );
  if (headerSpoofing) techniques.add("header spoofing");
  
  // Check for bot activity
  const botActivity = logs.some(log =>
    log.analyzedHeaders?.some(h => 
      h.name.toLowerCase() === "user-agent" && 
      (h.suspicious || h.value?.toLowerCase().includes("bot"))
    )
  );
  if (botActivity) techniques.add("bot activity");
  
  let result = "";
  
  if (techniques.size > 0) {
    result = `Attackers utilized ${formatList(Array.from(techniques))} techniques.`;
    
    // Add any additional details
    if (details.length > 0) {
      result += " " + details.join(". ") + ".";
    }
  }
  
  return result;
}

/**
 * Analyze infrastructure used in the attack
 */
function analyzeInfrastructure(logs: LogData[]): string {
  const segments: string[] = [];
  
  // Check for API Gateway
  const apiGateway = logs.some(log => 
    (log.uri && log.uri.includes("/ProxyStage/")) ||
    (log.httpSourceName === "API Gateway") ||
    (typeof log.httpSourceId === 'string' && log.httpSourceId.includes("execute-api"))
  );
  
  if (apiGateway) {
    segments.push("Evidence of AWS API Gateway proxy usage detected, suggesting a deliberate attempt to bypass rate limiting");
    
    // Analyze regions if API Gateway is used
    const regions = extractAwsRegions(logs);
    if (regions.size > 1) {
      segments.push(`Attack was distributed across ${regions.size} different AWS regions, indicating a sophisticated distributed attack pattern`);
    }
  }
  
  return segments.join(". ") + (segments.length > 0 ? "." : "");
}

/**
 * Extract AWS regions from logs
 */
function extractAwsRegions(logs: LogData[]): Set<string> {
  const regions = new Set<string>();
  
  logs.forEach(log => {
    // Check for region in hostnames
    log.analyzedHeaders?.forEach(header => {
      if (header.name.toLowerCase() === 'host' && header.value) {
        const match = header.value.match(/\.execute-api\.([a-z0-9-]+)\.amazonaws\.com/i);
        if (match && match[1]) {
          regions.add(match[1]);
        }
      }
    });
    
    // Check httpSourceId field
    if (typeof log.httpSourceId === 'string' && log.httpSourceId.includes('execute-api')) {
      const match = log.httpSourceId.match(/\.execute-api\.([a-z0-9-]+)\.amazonaws\.com/i);
      if (match && match[1]) {
        regions.add(match[1]);
      }
    }
  });
  
  return regions;
}

/**
 * Analyze suspicious headers
 */
function analyzeHeaders(logs: LogData[]): string {
  const techniques: Set<string> = new Set();
  
  logs.forEach(log => {
    if (!log.analyzedHeaders) return;
    
    log.analyzedHeaders.forEach(header => {
      if (!header.suspicious) return;
      
      const name = header.name.toLowerCase();
      const reason = header.reason?.toLowerCase() || "";
      
      if (name === "x-forwarded-for" && 
          (reason.includes("mismatch") || reason.includes("chain"))) {
        techniques.add("IP spoofing");
      }
      
      if (name === "x-my-x-forwarded-for") {
        techniques.add("custom IP header injection");
      }
      
      if (reason.includes("newlines") || reason.includes("unicode")) {
        techniques.add("header injection");
      }
    });
  });
  
  if (techniques.size === 0) {
    return "";
  }
  
  return `Header manipulation techniques detected, including ${formatList(Array.from(techniques))}.`;
}

/**
 * Analyze IP distribution
 */
function analyzeIpDistribution(logs: LogData[]): string {
  const uniqueIPs = new Set<string>();
  
  logs.forEach(log => {
    if (log.clientIp) {
      uniqueIPs.add(log.clientIp);
    }
  });
  
  if (uniqueIPs.size <= 1) {
    return "";
  }
  
  return `Attackers employed IP rotation across ${uniqueIPs.size} different source addresses.`;
}

/**
 * Format a list of items into a readable string
 */
function formatList(items: string[]): string {
  if (!items.length) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  
  const allButLast = items.slice(0, -1);
  const last = items[items.length - 1];
  return `${allButLast.join(", ")}, and ${last}`;
} 