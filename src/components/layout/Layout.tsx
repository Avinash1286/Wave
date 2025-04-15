import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
  
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleCollapse = () => {
    setSidebarCollapsed(prev => {
      const newState = !prev;
      localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
      return newState;
    });
  };

  return (
    <div className="h-screen flex">
      <Sidebar 
        isOpen={sidebarOpen} 
        closeSidebar={closeSidebar} 
        isCollapsed={sidebarCollapsed}
        toggleCollapse={toggleCollapse}
      />
      
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6 pb-16 md:pb-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
