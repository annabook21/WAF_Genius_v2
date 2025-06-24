import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { checkGeoDatabase } from '../utils/geoUtils';

const GeoInfoBanner: React.FC = () => {
  const [dbStatus, setDbStatus] = useState<'loading' | 'available' | 'unavailable'>('loading');
  const [dbSize, setDbSize] = useState<string>('');
  
  useEffect(() => {
    const checkDatabase = async () => {
      try {
        const dbInfo = await checkGeoDatabase();
        
        if (dbInfo.available) {
          // Convert bytes to MB
          const fileSizeMB = (dbInfo.size / (1024 * 1024)).toFixed(1);
          setDbSize(fileSizeMB);
          setDbStatus('available');
        } else {
          setDbStatus('unavailable');
        }
      } catch (error) {
        console.error('Error checking GeoLite2 database:', error);
        setDbStatus('unavailable');
      }
    };
    
    checkDatabase();
  }, []);
  
  if (dbStatus === 'loading') {
    return null;
  }
  
  return (
    <div className={`mb-4 p-2 px-3 rounded-md flex items-center text-sm ${
      dbStatus === 'available' 
        ? 'bg-green-900/20 border border-green-800/30 text-green-400' 
        : 'bg-yellow-900/20 border border-yellow-800/30 text-yellow-400'
    }`}>
      {dbStatus === 'available' ? (
        <>
          <CheckCircle className="h-4 w-4 mr-2" />
          <span>
            Using MaxMind GeoLite2 database ({dbSize} MB) for accurate IP geolocation
          </span>
        </>
      ) : (
        <>
          <AlertTriangle className="h-4 w-4 mr-2" />
          <span>
            Using mock geolocation data - GeoLite2 database not available
          </span>
        </>
      )}
    </div>
  );
};

export default GeoInfoBanner; 