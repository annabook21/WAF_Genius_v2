
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Flag, ShieldAlert } from 'lucide-react';

interface IPData {
  name: string;
  value: number;
  country?: string;
  suspicious?: boolean;
}

interface TopIPsChartProps {
  data: IPData[];
}

const TopIPsChart: React.FC<TopIPsChartProps> = ({ data }) => {
  // Identify potentially malicious IPs
  const enhancedData = data.map(item => ({
    ...item,
    suspicious: item.name.includes('192.168') || // Local network IPs
               item.country === 'RU' || item.country === 'CN', // Example countries for demo
    label: item.country ? `${item.name} (${item.country})` : item.name
  }));

  return (
    <Card className="cyber-panel">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Flag className="mr-2 h-4 w-4 text-cyber-green" />
            <CardTitle className="text-lg font-mono">Top 10 Source IPs</CardTitle>
          </div>
          <div className="flex items-center text-xs text-cyber-red">
            <ShieldAlert className="mr-1 h-3 w-3" />
            <span>Red = Suspicious Source</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={enhancedData} 
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" stroke="#eee" />
              <YAxis 
                dataKey="label" 
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
                  borderColor: '#ff8c00',
                  color: '#fff'
                }} 
                formatter={(value, name, props) => {
                  const ip = props.payload.name;
                  const country = props.payload.country || 'Unknown';
                  return [`${value} requests from ${ip} (${country})`, 'Traffic'];
                }}
              />
              <Bar dataKey="value" name="Requests">
                {enhancedData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.suspicious ? '#ff2a6d' : '#ff8c00'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 p-2 bg-black/30 rounded border border-cyber-green/30">
          <p className="text-xs text-cyber-gray">
            <span className="text-cyber-red font-bold">⚠️ Security Alert:</span> Suspicious traffic may attempt to mask source IPs through API gateways with fake headers - a primitive spoofing technique that modern firewalls can detect.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopIPsChart;
