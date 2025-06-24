
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock } from 'lucide-react';

interface TimeData {
  name: string;
  value: number;
}

interface TimelineChartProps {
  data: TimeData[];
}

const TimelineChart: React.FC<TimelineChartProps> = ({ data }) => {
  return (
    <Card className="cyber-panel">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Clock className="mr-2 h-4 w-4 text-cyber-green" />
          <CardTitle className="text-lg font-mono">Timeline (Hourly)</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="name" 
                stroke="#eee"
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#eee" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a1c', 
                  borderColor: '#05d9e8',
                  color: '#fff'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                name="Requests/hr"
                stroke="#05d9e8" 
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimelineChart;
