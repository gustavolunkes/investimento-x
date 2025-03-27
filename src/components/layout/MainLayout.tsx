
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';

interface MainLayoutProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const MainLayout = ({ children, requireAdmin = false }: MainLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, isAdmin, isLoading } = useAuth();

  // Se estiver carregando, não renderiza nada
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  // Se não estiver autenticado, redireciona para o login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Se a página requer administrador e o usuário não é admin, redireciona para a página inicial
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className="flex-1 flex flex-col">
        <Header sidebarCollapsed={sidebarCollapsed} />
        <Tabs defaultValue="default">
          <TabsContent value="default" className="flex-1">
            <main className={cn(
              "flex-1 p-6 transition-all duration-300",
              sidebarCollapsed ? "ml-[80px]" : "ml-[250px]"
            )}>
              {children}
            </main>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MainLayout;
