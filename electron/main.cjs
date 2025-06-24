const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { Reader } = require('@maxmind/geoip2-node');

// Global reference to the main window
let mainWindow;

// Load the GeoIP2 database
let geoReader = null;
const loadGeoDatabase = () => {
  try {
    // In development mode, load from the current working directory
    const dbPath = process.env.NODE_ENV === 'development' 
      ? path.join(process.cwd(), 'GeoLite2-City.mmdb')
      : path.join(app.getAppPath(), 'GeoLite2-City.mmdb');
      
    console.log('Looking for database at:', dbPath);
    
    if (fs.existsSync(dbPath)) {
      const dbBuffer = fs.readFileSync(dbPath);
      geoReader = Reader.openBuffer(dbBuffer);
      console.log('GeoIP2 database loaded successfully');
      return true;
    } else {
      console.error('GeoIP2 database not found at:', dbPath);
      return false;
    }
  } catch (error) {
    console.error('Error loading GeoIP2 database:', error);
    return false;
  }
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
  });

  // In development, load from Vite dev server
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:8082');
    // Open DevTools in development mode
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built app
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
  loadGeoDatabase();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Handle IPC messages from the renderer process
ipcMain.handle('geo-database-status', async () => {
  try {
    if (geoReader) {
      const dbPath = process.env.NODE_ENV === 'development' 
        ? path.join(process.cwd(), 'GeoLite2-City.mmdb')
        : path.join(app.getAppPath(), 'GeoLite2-City.mmdb');
      
      const stats = fs.statSync(dbPath);
      const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(1);
      
      return {
        available: true,
        size: fileSizeMB
      };
    } else {
      return {
        available: false,
        size: 0
      };
    }
  } catch (error) {
    console.error('Error getting database status:', error);
    return {
      available: false,
      size: 0,
      error: error.message
    };
  }
});

ipcMain.handle('geo-lookup', async (event, ips) => {
  try {
    if (!geoReader) {
      return { 
        useMock: true,
        error: 'GeoIP2 database not available'
      };
    }
    
    const results = {};
    
    for (const ip of ips) {
      try {
        const response = geoReader.city(ip);
        results[ip] = {
          country: response.country?.isoCode || 'Unknown',
          city: response.city?.names?.en || 'Unknown'
        };
      } catch (err) {
        results[ip] = { country: 'Unknown', city: 'Unknown' };
      }
    }
    
    return { results };
  } catch (error) {
    console.error('Error performing geo lookup:', error);
    return { 
      useMock: true,
      error: error.message 
    };
  }
}); 