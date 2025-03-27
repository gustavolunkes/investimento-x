
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import PropertyOverview from '@/components/dashboard/PropertyOverview';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import TransactionList, { Transaction } from '@/components/transactions/TransactionList';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Dados de exemplo
const dashboardMetrics = {
  totalProperties: 5,
  totalValue: 1750000,
  occupancyRate: 80,
  monthlyIncome: 8500,
  annualReturn: 5.82,
  valueGrowth: 4.5,
};

// Transações de exemplo
const recentTransactions: Transaction[] = [
  {
    id: '1',
    date: '2023-06-01',
    amount: 2500,
    description: 'Aluguel',
    category: 'Receita de Aluguel',
    type: 'income',
    propertyId: '1',
    propertyName: 'Apartamento Centro',
  },
  {
    id: '2',
    date: '2023-06-02',
    amount: 1500,
    description: 'Aluguel',
    category: 'Receita de Aluguel',
    type: 'income',
    propertyId: '2',
    propertyName: 'Casa Jardins',
  },
  {
    id: '3',
    date: '2023-06-05',
    amount: 800,
    description: 'Condomínio',
    category: 'Condomínio',
    type: 'expense',
    propertyId: '1',
    propertyName: 'Apartamento Centro',
  },
  {
    id: '4',
    date: '2023-06-10',
    amount: 450,
    description: 'Manutenção Ar Condicionado',
    category: 'Manutenção',
    type: 'expense',
    propertyId: '1',
    propertyName: 'Apartamento Centro',
  },
  {
    id: '5',
    date: '2023-06-15',
    amount: 2000,
    description: 'Aluguel',
    category: 'Receita de Aluguel',
    type: 'income',
    propertyId: '3',
    propertyName: 'Sala Comercial',
  },
];

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  
  const handleEditTransaction = (id: string) => {
    console.log(`Editar transação ${id}`);
  };
  
  const handleDeleteTransaction = (id: string) => {
    console.log(`Excluir transação ${id}`);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Novo Imóvel
            </Button>
          </div>
        </div>
        
        <PropertyOverview {...dashboardMetrics} loading={loading} />
        
        <DashboardCharts loading={loading} />
        
        <div className="mt-8">
          <Tabs defaultValue="recent">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="recent">Transações Recentes</TabsTrigger>
                <TabsTrigger value="upcoming">Próximos Pagamentos</TabsTrigger>
              </TabsList>
              
              <Button variant="outline" className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Nova Transação
              </Button>
            </div>
            
            <TabsContent value="recent">
              <TransactionList 
                transactions={recentTransactions}
                loading={loading}
                onEdit={handleEditTransaction}
                onDelete={handleDeleteTransaction}
              />
            </TabsContent>
            
            <TabsContent value="upcoming">
              <TransactionList 
                transactions={recentTransactions.filter(t => t.type === 'expense').slice(0, 2)}
                title="Próximos Pagamentos"
                loading={loading}
                onEdit={handleEditTransaction}
                onDelete={handleDeleteTransaction}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
