
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Code } from 'lucide-react';

interface MethodData {
  name: string;
  value: number;
}

interface MethodsBarChartProps {
  data: MethodData[];
}

const MethodsBarChart: React.FC<MethodsBarChartProps> = ({ data }) => {
  return (
    <Card className="cyber-panel">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Code className="mr-2 h-4 w-4 text-cyber-green" />
          <CardTitle className="text-lg font-mono">HTTP Methods</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#eee" />
              <YAxis stroke="#eee" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a1c', 
                  borderColor: '#05d9e8',
                  color: '#fff'
                }} 
              />
              <Bar dataKey="value" name="Requests" fill="#05d9e8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MethodsBarChart;
