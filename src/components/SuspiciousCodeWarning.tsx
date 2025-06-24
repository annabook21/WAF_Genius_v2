import React from 'react';
import { AlertTriangle, Shield, Code } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const SuspiciousCodeWarning = () => (
  <Alert className="bg-cyber-red/10 border border-cyber-red rounded-md mb-6">
    <div className="flex items-start">
      <AlertTriangle className="h-5 w-5 text-cyber-red mr-2 mt-1 flex-shrink-0" />
      <div>
        <AlertTitle className="text-cyber-red font-bold mb-2">
          ⚠️ WAFGenius v2: Advanced WAF Log Analysis Tool ⚠️
        </AlertTitle>
        <AlertDescription>
          <p className="text-sm text-gray-200 mb-2">
            WAFGenius is a sophisticated tool for analyzing AWS WAF logs to detect and visualize advanced attack patterns. 
            It provides security professionals with deep insights into attack techniques that traditional tools might miss.
          </p>
          <div className="bg-black/30 p-3 my-2 border-l-2 border-cyber-yellow font-mono text-xs">
            <p className="text-cyber-yellow">// Header Spoofing Attack Pattern Example</p>
            <p className="text-gray-400">X-Forwarded-For: 192.168.1.1</p>
            <p className="text-gray-400">X-My-X-Forwarded-For: 104.18.72.129</p>
            <p className="text-gray-400">Host: a1b2c3d4e5.execute-api.us-east-1.amazonaws.com</p>
            <p className="text-gray-400">URI: /ProxyStage/api/sensitive-endpoint</p>
          </div>
          <p className="text-sm text-gray-200">
            The pattern above reveals a sophisticated API Gateway proxy attack attempting to bypass rate limits and mask the true origin through header manipulation.
          </p>
          <div className="flex items-center mt-2 text-xs">
            <Shield className="h-3 w-3 text-cyber-yellow mr-1" />
            <span className="text-cyber-yellow">Detecting: IP spoofing, header injection, distributed attacks, and rate limit evasion</span>
          </div>
        </AlertDescription>
      </div>
    </div>
  </Alert>
);

export default SuspiciousCodeWarning;
