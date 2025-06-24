
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Shield, AlertTriangle } from 'lucide-react';

interface RuleData {
  name: string;
  value: number;
  flagged?: boolean;
}

interface RulesChartProps {
  data: RuleData[];
}

const RulesChart: React.FC<RulesChartProps> = ({ data }) => {
  return (
    <Card className="cyber-panel">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="mr-2 h-4 w-4 text-cyber-green" />
            <CardTitle className="text-lg font-mono">Top Terminating Rules</CardTitle>
          </div>
          <div className="flex items-center text-xs text-cyber-red">
            <AlertTriangle className="mr-1 h-3 w-3" />
            <span>Red = SQLi/CAPTCHA flags</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" stroke="#eee" />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={150}
                stroke="#eee" 
                tick={{ 
                  fontSize: 12,
                  width: 140,
                  overflow: "hidden",
                  textAnchor: "end"
                }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a1c', 
                  borderColor: '#7700a6',
                  color: '#fff'
                }}
              />
              <Bar dataKey="value" name="Trigger Count">
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.flagged ? '#ff2a6d' : '#7700a6'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RulesChart;
