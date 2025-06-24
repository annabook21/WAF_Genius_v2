interface ElectronAPI {
  geoip: {
    getDatabaseStatus: () => Promise<{
      available: boolean;
      size: string;
      error?: string;
    }>;
    lookupIps: (ips: string[]) => Promise<{
      results?: Record<string, { country: string; city: string }>;
      useMock?: boolean;
      error?: string;
    }>;
  };
}

declare interface Window {
  electron: ElectronAPI;
} 