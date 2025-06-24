
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, ShieldAlert } from 'lucide-react';

interface RuleEntry {
  rule: string;
  type: string;
  count: number;
  flagged: boolean;
}

interface TopRulesTableProps {
  data: RuleEntry[];
}

const TopRulesTable: React.FC<TopRulesTableProps> = ({ data }) => {
  return (
    <Card className="cyber-panel">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <ShieldAlert className="mr-2 h-4 w-4 text-cyber-green" />
          <CardTitle className="text-lg font-mono">Top Terminating Rules</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rule ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Count</TableHead>
              <TableHead className="w-[100px] text-center">Flag</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index} className={item.flagged ? "suspicious-item" : ""}>
                <TableCell className="font-mono">{item.rule}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell className="text-right">{item.count}</TableCell>
                <TableCell className="text-center">
                  {item.flagged && <AlertTriangle className="h-4 w-4 text-cyber-red mx-auto" />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TopRulesTable;
