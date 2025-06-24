
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileSearch } from 'lucide-react';

interface PathData {
  path: string;
  count: number;
  percentage: number;
  suspicious?: boolean;
}

interface TopPathsTableProps {
  data: PathData[];
  total: number;
}

const TopPathsTable: React.FC<TopPathsTableProps> = ({ data, total }) => {
  return (
    <Card className="cyber-panel">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <FileSearch className="mr-2 h-4 w-4 text-cyber-green" />
          <CardTitle className="text-lg font-mono">Top Request Paths</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>URI Path</TableHead>
              <TableHead className="w-[100px] text-right">Count</TableHead>
              <TableHead className="w-[100px] text-right">Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index} className={item.suspicious ? "suspicious-item" : ""}>
                <TableCell className="font-mono">{item.path}</TableCell>
                <TableCell className="text-right">{item.count}</TableCell>
                <TableCell className="text-right">{item.percentage.toFixed(1)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TopPathsTable;
