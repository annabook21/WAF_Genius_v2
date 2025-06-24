import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Shield, Clock } from 'lucide-react';
import { LogData } from '@/types/logData';

interface DemoNarrativePanelProps {
  logData: LogData[];
}

const DemoNarrativePanel: React.FC<DemoNarrativePanelProps> = ({ logData }) => {
  // Static accurate narrative for the demo
  const narrative = "Attack campaign originated from US and JP, targeting /v1/status, /checkout, and /api/user. Attackers utilized rate limit evasion, header spoofing, and SQL injection techniques. Evidence of AWS API Gateway proxy usage detected, suggesting a deliberate attempt to bypass rate limiting. Attack was distributed across 6 different AWS regions, indicating a sophisticated distributed attack pattern. Header manipulation techniques detected, including IP spoofing and custom IP header injection. SQL injection attempts detected in query parameters. Attackers employed IP rotation across 6 different source addresses.";
  
  return (
    <Card className="cyber-panel mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg font-mono text-cyber-green">
          <Shield className="mr-2 h-5 w-5" />
          Attack Narrative
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-cyber-dark p-4 rounded-md">
          <p className="text-gray-200">{narrative}</p>
          
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="flex items-center text-xs text-cyber-yellow">
              <Clock className="mr-2 h-4 w-4" />
              <span>Analysis based on {logData.length} events from AWS API Gateway attack logs</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemoNarrativePanel; 