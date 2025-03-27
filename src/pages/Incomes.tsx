
import React, { useState } from 'react';
import { PlusCircle, Search } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import TransactionList, { Transaction } from '@/components/transactions/TransactionList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

// Dados de exemplo para receitas
const incomeTransactions: Transaction[] = [
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
    id: '5',
    date: '2023-06-15',
    amount: 2000,
    description: 'Aluguel',
    category: 'Receita de Aluguel',
    type: 'income',
    propertyId: '3',
    propertyName: 'Sala Comercial',
  },
  {
    id: '6',
    date: '2023-05-01',
    amount: 2500,
    description: 'Aluguel',
    category: 'Receita de Aluguel',
    type: 'income',
    propertyId: '1',
    propertyName: 'Apartamento Centro',
  },
  {
    id: '7',
    date: '2023-05-02',
    amount: 1500,
    description: 'Aluguel',
    category: 'Receita de Aluguel',
    type: 'income',
    propertyId: '2',
    propertyName: 'Casa Jardins',
  },
  {
    id: '8',
    date: '2023-05-15',
    amount: 2000,
    description: 'Aluguel',
    category: 'Receita de Aluguel',
    type: 'income',
    propertyId: '3',
    propertyName: 'Sala Comercial',
  },
];

// Dados para o gráfico
const monthlyIncomeData = [
  { month: 'Jan', value: 6000 },
  { month: 'Fev', value: 6000 },
  { month: 'Mar', value: 6000 },
  { month: 'Abr', value: 6000 },
  { month: 'Mai', value: 6000 },
  { month: 'Jun', value: 6000 },
  { month: 'Jul', value: 6000 },
  { month: 'Ago', value: 6000 },
  { month: 'Set', value: 6000 },
  { month: 'Out', value: 6000 },
  { month: 'Nov', value: 6000 },
  { month: 'Dez', value: 6000 },
];

// Dados para o resumo
const incomeSummary = {
  totalIncome: 18000,
  averageMonthly: 6000,
  yearToDate: 36000,
  projectedAnnual: 72000,
};

const Incomes = () => {
  const [period, setPeriod] = useState('all');
  const [loading, setLoading] = useState(false);
  
  const handleEditTransaction = (id: string) => {
    console.log(`Editar transação ${id}`);
  };
  
  const handleDeleteTransaction = (id: string) => {
    console.log(`Excluir transação ${id}`);
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Receitas</h1>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Nova Receita
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Receitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(incomeSummary.totalIncome)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Últimos 3 meses
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Média Mensal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(incomeSummary.averageMonthly)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Baseado nos últimos 3 meses
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Acumulado no Ano
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(incomeSummary.yearToDate)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Jan - Jun 2023
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Projeção Anual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(incomeSummary.projectedAnnual)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Baseado na média atual
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle>Histórico de Receitas</CardTitle>
              <Select defaultValue={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todo o período</SelectItem>
                  <SelectItem value="year">Este ano</SelectItem>
                  <SelectItem value="6months">Últimos 6 meses</SelectItem>
                  <SelectItem value="3months">Últimos 3 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyIncomeData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `R$${value / 1000}k`} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Bar name="Receitas" dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <TransactionList 
          transactions={incomeTransactions}
          title="Receitas Recentes"
          loading={loading}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
        />
      </div>
    </MainLayout>
  );
};

export default Incomes;
