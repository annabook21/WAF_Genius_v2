import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, BarChart, Shield, Globe, Clock, AlertTriangle } from 'lucide-react'; 

import ActionsPieChart from './charts/ActionsPieChart';
import MethodsBarChart from './charts/MethodsBarChart';
import TopIPsChart from './charts/TopIPsChart';
import RulesChart from './charts/RulesChart';
import TimelineChart from './charts/TimelineChart';
import TopPathsTable from './tables/TopPathsTable';
import TopIPsTable from './tables/TopIPsTable';
import TopRulesTable from './tables/TopRulesTable';
import HeadersAnalysisTable from './tables/HeadersAnalysisTable';
import NarrativePanel from './NarrativePanel';
import DemoNarrativePanel from './DemoNarrativePanel';

import { LogData } from '@/types/logData';

interface AnalysisTabsProps {
  logData: LogData[];
}

const AnalysisTabs: React.FC<AnalysisTabsProps> = ({ logData }) => {
  // Detect if this is an API Gateway attack for demo purposes
  const isApiGatewayAttack = logData.some(log => 
    (log.uri && log.uri.includes("/ProxyStage/")) || 
    (log.httpSourceId && log.httpSourceId.includes("execute-api"))
  );

  // Action counts for pie chart
  const actionCounts = logData.reduce((acc, entry) => {
    acc[entry.action] = (acc[entry.action] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const actionData = Object.entries(actionCounts).map(([name, value]) => ({ name, value }));
  
  // Method counts
  const methodCounts = logData.reduce((acc, entry) => {
    if (entry.method) {
      acc[entry.method] = (acc[entry.method] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const methodData = Object.entries(methodCounts).map(([name, value]) => ({ name, value }));
  
  // IP counts
  const ipCounts = logData.reduce((acc, entry) => {
    if (entry.clientIp) {
      if (!acc[entry.clientIp]) {
        acc[entry.clientIp] = { 
          count: 0, 
          country: entry.country || 'Unknown', 
          blocked: 0,
          allowed: 0
        };
      }
      acc[entry.clientIp].count++;
      if (entry.action === 'BLOCK') acc[entry.clientIp].blocked++;
      if (entry.action === 'ALLOW') acc[entry.clientIp].allowed++;
    }
    return acc;
  }, {} as Record<string, { count: number, country: string, blocked: number, allowed: number }>);
  
  const topIPs = Object.entries(ipCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10);
    
  const ipChartData = topIPs.map(([name, data]) => ({ name, value: data.count, country: data.country }));
  
  const ipTableData = topIPs.map(([ip, data]) => ({ 
    ip, 
    country: data.country, 
    city: 'Unknown', // In a real app this would come from geolocation
    count: data.count,
    blocked: data.blocked,
    allowed: data.allowed,
    suspicious: data.blocked > data.allowed // Flag IPs with more blocks than allows
  }));
  
  // Rule counts and flags
  const ruleCounts = {} as Record<string, { count: number, type: string, flagged: boolean }>;
  const ruleFlags = {} as Record<string, boolean>;
  
  logData.forEach(entry => {
    if (entry.ruleId && entry.ruleId !== 'Default_Action') {
      if (!ruleCounts[entry.ruleId]) {
        ruleCounts[entry.ruleId] = {
          count: 0,
          type: entry.ruleType || 'Unknown',
          flagged: false
        };
      }
      
      ruleCounts[entry.ruleId].count++;
      
      // Flag rules with captcha or sqli
      if (entry.captcha || entry.sqli) {
        ruleCounts[entry.ruleId].flagged = true;
        ruleFlags[entry.ruleId] = true;
      }
    }
  });
  
  const topRules = Object.entries(ruleCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10);
    
  const ruleChartData = topRules.map(([name, data]) => ({ 
    name, 
    value: data.count, 
    flagged: data.flagged 
  }));
  
  const ruleTableData = topRules.map(([rule, data]) => ({
    rule,
    type: data.type,
    count: data.count,
    flagged: data.flagged
  }));
  
  // Path counts
  const pathCounts = logData.reduce((acc, entry) => {
    if (entry.uri) {
      acc[entry.uri] = (acc[entry.uri] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const topPaths = Object.entries(pathCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
    
  const totalRequests = logData.length;
  
  const pathTableData = topPaths.map(([path, count]) => ({
    path,
    count,
    percentage: (count / totalRequests) * 100,
    suspicious: path.includes('admin') || path.includes('login') || path.includes('wp-') // Flag suspicious paths
  }));
  
  // Timeline data
  const hourCounts = logData.reduce((acc, entry) => {
    if (entry.timestamp) {
      const timestamp = new Date(entry.timestamp);
      const hourKey = timestamp.toISOString().slice(0, 13) + ':00'; // Format: YYYY-MM-DDTHH:00
      acc[hourKey] = (acc[hourKey] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const timelineData = Object.entries(hourCounts)
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map(([name, value]) => ({ name, value }));
  
  // Headers analysis
  const suspiciousHeaders = logData
    .filter(entry => entry.hasSuspiciousHeaders)
    .flatMap(entry => entry.analyzedHeaders || [])
    .filter(header => header.suspicious);
  
  // Get a sample of normal headers too
  const normalHeaders = logData
    .flatMap(entry => entry.analyzedHeaders || [])
    .filter(header => !header.suspicious)
    .slice(0, 10); // Just show some representative normal headers
  
  const headersTableData = [...suspiciousHeaders, ...normalHeaders]
    .sort((a, b) => (a.suspicious === b.suspicious) ? 0 : a.suspicious ? -1 : 1);
  
  // Count entries with suspicious headers
  const entriesWithSuspiciousHeaders = logData.filter(entry => entry.hasSuspiciousHeaders).length;
  
  return (
    <>
      {isApiGatewayAttack ? 
        <DemoNarrativePanel logData={logData} /> : 
        <NarrativePanel logData={logData} />
      }
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-6 mb-8 bg-cyber-dark">
          <TabsTrigger value="overview" className="data-[state=active]:bg-cyber-green data-[state=active]:text-cyber-black">
            <Activity className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="requests" className="data-[state=active]:bg-cyber-green data-[state=active]:text-cyber-black">
            <BarChart className="mr-2 h-4 w-4" />
            Requests
          </TabsTrigger>
          <TabsTrigger value="sources" className="data-[state=active]:bg-cyber-green data-[state=active]:text-cyber-black">
            <Globe className="mr-2 h-4 w-4" />
            Sources
          </TabsTrigger>
          <TabsTrigger value="rules" className="data-[state=active]:bg-cyber-green data-[state=active]:text-cyber-black">
            <Shield className="mr-2 h-4 w-4" />
            Rules
          </TabsTrigger>
          <TabsTrigger value="headers" className="data-[state=active]:bg-cyber-green data-[state=active]:text-cyber-black">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Headers
          </TabsTrigger>
          <TabsTrigger value="timeline" className="data-[state=active]:bg-cyber-green data-[state=active]:text-cyber-black">
            <Clock className="mr-2 h-4 w-4" />
            Timeline
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2">
            <ActionsPieChart data={actionData} />
            <div className="cyber-panel p-5 flex flex-col">
              <h3 className="text-lg font-mono mb-4 text-cyber-green">Summary Statistics</h3>
              <div className="grid grid-cols-2 gap-4 flex-grow">
                <div className="bg-cyber-dark p-4 rounded-md flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-cyber-green mb-2">{logData.length}</span>
                  <span className="text-sm text-gray-400">Total Requests</span>
                </div>
                
                {Object.entries(actionCounts).map(([action, count]) => (
                  <div key={action} className="bg-cyber-dark p-4 rounded-md flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold mb-2" style={{
                      color: action === 'BLOCK' ? '#ff2a6d' : 
                             action === 'ALLOW' ? '#05d9e8' : 
                             action === 'COUNT' ? '#ff8c00' : '#7700a6'
                    }}>
                      {count}
                    </span>
                    <span className="text-sm text-gray-400">{action} requests</span>
                  </div>
                ))}
                
                <div className="bg-cyber-dark p-4 rounded-md flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-cyber-red mb-2">{entriesWithSuspiciousHeaders}</span>
                  <span className="text-sm text-gray-400">Suspicious Headers</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="requests" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2">
            <MethodsBarChart data={methodData} />
            <TopPathsTable data={pathTableData} total={totalRequests} />
          </div>
        </TabsContent>
        
        <TabsContent value="sources" className="mt-0">
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            <TopIPsChart data={ipChartData} />
            <TopIPsTable data={ipTableData} />
          </div>
        </TabsContent>
        
        <TabsContent value="rules" className="mt-0">
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            <RulesChart data={ruleChartData} />
            <TopRulesTable data={ruleTableData} />
          </div>
        </TabsContent>
        
        <TabsContent value="headers" className="mt-0">
          <HeadersAnalysisTable data={headersTableData} />
        </TabsContent>
        
        <TabsContent value="timeline" className="mt-0">
          <TimelineChart data={timelineData} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default AnalysisTabs;
