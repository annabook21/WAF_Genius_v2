import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface HeaderData {
  name: string;
  value: string;
  suspicious: boolean;
  reason?: string;
}

interface HeadersAnalysisTableProps {
  data: HeaderData[];
}

const HeadersAnalysisTable: React.FC<HeadersAnalysisTableProps> = ({ data }) => {
  return (
    <div className="cyber-panel p-5">
      <h3 className="text-lg font-mono mb-4 text-cyber-green">Headers Analysis</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Header Name</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reason</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((header, index) => (
            <TableRow 
              key={index}
              className={header.suspicious ? "bg-cyber-red/10" : ""}
            >
              <TableCell className="font-mono">{header.name}</TableCell>
              <TableCell className="font-mono">{header.value}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded text-sm ${
                  header.suspicious 
                    ? "bg-cyber-red/20 text-cyber-red" 
                    : "bg-cyber-green/20 text-cyber-green"
                }`}>
                  {header.suspicious ? "Suspicious" : "Normal"}
                </span>
              </TableCell>
              <TableCell className="text-gray-400">
                {header.reason || (header.suspicious ? "Potentially malicious" : "No issues detected")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default HeadersAnalysisTable; 