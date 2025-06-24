
import React, { useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Shield } from 'lucide-react';

interface ActionData {
  name: string;
  value: number;
}

interface ActionsPieChartProps {
  data: ActionData[];
}

const ActionsPieChart: React.FC<ActionsPieChartProps> = ({ data }) => {
  const colors = {
    BLOCK: '#ff2a6d',    // cyber-red
    ALLOW: '#05d9e8',    // cyber-green
    COUNT: '#ff8c00',     // cyber-yellow
    CAPTCHA: '#7700a6',  // cyber-purple
    CHALLENGE: '#005678', // cyber-blue
    UNKNOWN: '#535353',   // cyber-gray
  };

  const getColor = (action: string) => {
    return colors[action as keyof typeof colors] || colors.UNKNOWN;
  };

  return (
    <Card className="cyber-panel">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Shield className="mr-2 h-4 w-4 text-cyber-green" />
          <CardTitle className="text-lg font-mono">Actions</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.name)} stroke={getColor(entry.name)} strokeWidth={1} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value} requests`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionsPieChart;
