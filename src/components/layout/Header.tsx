
import React from 'react';
import { Shield, AlertTriangle, Code } from 'lucide-react';

const Header = () => {
  return (
    <header className="p-4 border-b border-cyber-green">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-cyber-green cyber-glow" />
          <div>
            <h1 className="text-xl font-bold relative">
              <span className="cyber-title text-xl tracking-wide">WAFGenius</span>
              <span className="text-white font-black text-lg tracking-wider drop-shadow-[0_0_5px_rgba(0,255,255,0.7)]">v2</span>
              <div className="flex items-center">
                <span className="text-white font-black tracking-wider">DUB</span>
                <span className="text-xs text-cyber-gray ml-2 italic font-normal">EDITION</span>
              </div>
            </h1>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1 px-2 py-1 bg-cyber-dark/50 rounded-md border border-cyber-red/30">
            <Code className="h-3 w-3 text-cyber-red" />
            <span className="text-cyber-red">AWS WAF Log Analyzer</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-cyber-red cyber-glow"></div>
          <span className="text-xs text-cyber-red">Session Protected</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
