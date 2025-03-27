
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '@/lib/utils';
import { Tabs } from '@/components/ui/tabs';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className="flex-1 flex flex-col">
        <Header sidebarCollapsed={sidebarCollapsed} />
        <Tabs defaultValue="default" className="flex-1">
          <main className={cn(
            "flex-1 p-6 transition-all duration-300",
            sidebarCollapsed ? "ml-[80px]" : "ml-[250px]"
          )}>
            {children}
          </main>
        </Tabs>
      </div>
    </div>
  );
};

export default MainLayout;
