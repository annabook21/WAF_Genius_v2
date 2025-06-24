/**
 * Check if the MaxMind GeoLite2 database is available
 * @returns An object with status and path information
 */
export async function checkGeoDatabase() {
  try {
    // Check if running in Electron
    if (window.electron) {
      // Use Electron's API to check database status
      const data = await window.electron.geoip.getDatabaseStatus();
      
      return {
        available: data.available,
        path: 'GeoLite2-City.mmdb',
        size: data.available ? parseFloat(data.size) * 1024 * 1024 : 0
      };
    } else {
      // Fallback for browser environment (using API server)
      try {
        // Call the API endpoint to check database status
        const response = await fetch('http://localhost:3000/api/geo/status');
        const data = await response.json();
        
        return {
          available: data.available,
          path: './GeoLite2-City.mmdb',
          size: data.available ? parseFloat(data.size) * 1024 * 1024 : 0
        };
      } catch (error) {
        console.error('Error checking GeoLite2 database from API:', error);
        return {
          available: false,
          path: '',
          size: 0,
          error
        };
      }
    }
  } catch (error) {
    console.error('Error checking GeoLite2 database:', error);
    
    return {
      available: false,
      path: '',
      size: 0,
      error
    };
  }
} 