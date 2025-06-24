import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Shield, AlertTriangle, Clock } from 'lucide-react';
import { generateAttackNarrative } from '@/services/narrativeGenerator';
import { LogData } from '@/types/logData';

interface NarrativePanelProps {
  logData: LogData[];
}

const NarrativePanel: React.FC<NarrativePanelProps> = ({ logData }) => {
  const [narrative, setNarrative] = useState<string>("");
  
  useEffect(() => {
    if (logData.length > 0) {
      const generatedNarrative = generateAttackNarrative(logData);
      setNarrative(generatedNarrative);
    }
  }, [logData]);
  
  if (!narrative) return null;
  
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
              <span>Analysis based on {logData.length} events from {formatTimeRange(logData)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper to format the time range of logs
function formatTimeRange(logs: LogData[]): string {
  if (!logs.length) return "no data";
  
  const timestamps = logs
    .filter(log => log.timestamp)
    .map(log => log.timestamp ? new Date(log.timestamp).getTime() : 0)
    .filter(time => time > 0);
  
  if (!timestamps.length) return "unknown timeframe";
  
  const startDate = new Date(Math.min(...timestamps));
  const endDate = new Date(Math.max(...timestamps));
  
  return `${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`;
}

export default NarrativePanel; 