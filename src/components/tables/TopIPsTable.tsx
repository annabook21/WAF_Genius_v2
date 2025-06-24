
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapPin } from 'lucide-react';

interface IPEntry {
  ip: string;
  country: string;
  city: string;
  count: number;
  blocked: number;
  allowed: number;
  suspicious?: boolean;
}

interface TopIPsTableProps {
  data: IPEntry[];
}

const TopIPsTable: React.FC<TopIPsTableProps> = ({ data }) => {
  return (
    <Card className="cyber-panel">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <MapPin className="mr-2 h-4 w-4 text-cyber-green" />
          <CardTitle className="text-lg font-mono">Top Source IPs</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>IP Address</TableHead>
              <TableHead>Country/City</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Blocked</TableHead>
              <TableHead className="text-right">Allowed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index} className={item.suspicious ? "suspicious-item" : ""}>
                <TableCell className="font-mono">{item.ip}</TableCell>
                <TableCell>{`${item.country}/${item.city}`}</TableCell>
                <TableCell className="text-right">{item.count}</TableCell>
                <TableCell className="text-right text-cyber-red">{item.blocked}</TableCell>
                <TableCell className="text-right text-cyber-green">{item.allowed}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TopIPsTable;
