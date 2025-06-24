export interface AnalyzedHeader {
  name: string;
  value: string;
  suspicious: boolean;
  reason?: string;
}

interface RequestHeader {
  name: string;
  value: string;
}

interface HttpRequest {
  clientIp?: string;
  country?: string;
  uri?: string;
  args?: string;
  httpMethod?: string;
  requestHeaders?: RequestHeader[];
}

export interface LogData {
  timestamp: Date | null;
  action: string;
  ruleId: string;
  ruleType: string | null;
  captcha: string | null;
  sqli: string | null;
  clientIp: string | null;
  method: string | null;
  uri: string | null;
  country: string | null;
  city?: string | null;
  headers?: Record<string, string>[];
  hasSuspiciousHeaders?: boolean;
  analyzedHeaders?: AnalyzedHeader[];
  // Extended fields for API Gateway analysis
  httpSourceId?: string;
  httpSourceName?: string;
  terminatingRuleId?: string;
  args?: string;
  httpRequest?: HttpRequest;
}
