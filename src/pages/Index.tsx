import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import PageWrapper from '@/components/layout/PageWrapper';
import FileUpload from '@/components/FileUpload';
import AnalysisTabs from '@/components/AnalysisTabs';
import { Button } from '@/components/ui/button';
import { createLogParserWorker, geoLookup } from '../services/logParser';
import { LogData } from '../types/logData';
import SuspiciousCodeWarning from '../components/SuspiciousCodeWarning';
import GeoInfoBanner from '../components/GeoInfoBanner';

const Index = () => {
  const { toast } = useToast();
  const [logData, setLogData] = useState<LogData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  
  const processLogFile = async (content: string) => {
    setIsLoading(true);
    setHasResults(false);
    
    try {
      // Create a new worker for each analysis
      const worker = createLogParserWorker();
      
      // Handle worker messages
      worker.onmessage = async (e) => {
        if (e.data.error) {
          toast({
            title: "Error parsing log file",
            description: e.data.error,
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
        
        // Process the normalized data
        const normalizedData = e.data.data;
        
        // Extract unique IPs for geo lookup
        const uniqueIPs = [...new Set(normalizedData
          .map(d => d.clientIp)
          .filter(Boolean))];
          
        // Perform real geo lookup using MaxMind database
        const geoData = await geoLookup(uniqueIPs as string[]);
        
        // Check if we're using real data by looking at the first result
        const isUsingRealData = uniqueIPs.length > 0 && 
          geoData[uniqueIPs[0] as string]?.country !== 'Unknown';
        
        if (isUsingRealData) {
          toast({
            title: "Using real geolocation data",
            description: "MaxMind GeoLite2 database is being used for accurate IP locations",
            variant: "default"
          });
        }
        
        // Enhance log data with geo information
        const enhancedData = normalizedData.map(entry => {
          if (entry.clientIp && geoData[entry.clientIp]) {
            entry.country = geoData[entry.clientIp].country;
            entry.city = geoData[entry.clientIp].city;
          }
          return entry;
        });
        
        // Update state with the processed data
        setLogData(enhancedData);
        setHasResults(true);
        setIsLoading(false);
        
        toast({
          title: "Log analysis complete",
          description: `Processed ${enhancedData.length} log entries`
        });
        
        // Clean up worker
        worker.terminate();
      };
      
      // Send data to worker
      worker.postMessage(content);
      
    } catch (error) {
      console.error('Error processing log file:', error);
      toast({
        title: "Error processing log file",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setLogData([]);
    setHasResults(false);
  };
  
  return (
    <PageWrapper>
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-black tracking-wider mb-1">
            <span className="cyber-title">WAFGenius</span>
            <span className="text-white font-black text-2xl ml-1 drop-shadow-[0_0_5px_rgba(0,255,255,0.7)]">v2</span>
            <span className="text-cyber-gray">:</span>
            <span className="text-white ml-2">Log Analyzer</span>
          </h1>
          <div className="flex items-center">
            <span className="text-white font-bold tracking-wider text-lg mr-2">DUB</span>
            <span className="text-xs text-cyber-gray italic">EDITION</span>
          </div>
        </div>
        
        <SuspiciousCodeWarning />
        
        <GeoInfoBanner />
        
        {!hasResults ? (
          <FileUpload onFileSelect={processLogFile} />
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl cyber-text">Analysis Results</h2>
              <Button 
                onClick={handleReset}
                variant="outline"
                className="border-cyber-red text-cyber-red hover:bg-cyber-red/10"
              >
                Reset
              </Button>
            </div>
            <AnalysisTabs logData={logData} />
          </>
        )}
        
        {isLoading && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-cyber-dark p-8 rounded-md border border-cyber-green animate-pulse-glow">
              <h3 className="text-xl font-bold mb-4 cyber-text animate-pulse">Processing WAF Logs...</h3>
              <div className="relative h-2 bg-cyber-dark border border-cyber-green rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-green to-cyber-blue" 
                     style={{animation: "scanline 2s linear infinite"}}>
                </div>
              </div>
              <p className="mt-4 text-sm text-cyber-gray">Analyzing and extracting patterns...</p>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default Index;
