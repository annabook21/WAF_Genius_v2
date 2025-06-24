import React from 'react';
import Header from './Header';

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper = ({ children }: PageWrapperProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-cyber-black text-white">
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default PageWrapper;
