
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
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
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Dados de exemplo para despesas
const expenseTransactions: Transaction[] = [
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
    id: '9',
    date: '2023-06-12',
    amount: 350,
    description: 'IPTU',
    category: 'Impostos',
    type: 'expense',
    propertyId: '2',
    propertyName: 'Casa Jardins',
  },
  {
    id: '10',
    date: '2023-06-15',
    amount: 280,
    description: 'Seguro Residencial',
    category: 'Seguros',
    type: 'expense',
    propertyId: '2',
    propertyName: 'Casa Jardins',
  },
  {
    id: '11',
    date: '2023-05-05',
    amount: 800,
    description: 'Condomínio',
    category: 'Condomínio',
    type: 'expense',
    propertyId: '1',
    propertyName: 'Apartamento Centro',
  },
  {
    id: '12',
    date: '2023-05-12',
    amount: 350,
    description: 'IPTU',
    category: 'Impostos',
    type: 'expense',
    propertyId: '2',
    propertyName: 'Casa Jardins',
  },
];

// Dados para o gráfico de barras
const monthlyExpenseData = [
  { month: 'Jan', value: 1800 },
  { month: 'Fev', value: 1850 },
  { month: 'Mar', value: 1920 },
  { month: 'Abr', value: 1750 },
  { month: 'Mai', value: 2100 },
  { month: 'Jun', value: 1880 },
  { month: 'Jul', value: 0 },
  { month: 'Ago', value: 0 },
  { month: 'Set', value: 0 },
  { month: 'Out', value: 0 },
  { month: 'Nov', value: 0 },
  { month: 'Dez', value: 0 },
];

// Dados para o gráfico de pizza
const expenseCategoriesData = [
  { name: 'Condomínio', value: 1600 },
  { name: 'Impostos', value: 700 },
  { name: 'Manutenção', value: 450 },
  { name: 'Seguros', value: 280 },
  { name: 'Outros', value: 150 },
];

// Cores para o gráfico de pizza
const EXPENSE_COLORS = ['#0D9488', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1'];

// Dados para o resumo
const expenseSummary = {
  totalExpenses: 3180,
  averageMonthly: 1880,
  yearToDate: 11300,
  expenseRatio: 32.5, // Percentual das receitas
};

const Expenses = () => {
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
          <h1 className="text-3xl font-bold tracking-tight">Despesas</h1>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Nova Despesa
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Despesas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-expense">
                {formatCurrency(expenseSummary.totalExpenses)}
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
              <div className="text-2xl font-bold text-expense">
                {formatCurrency(expenseSummary.averageMonthly)}
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
              <div className="text-2xl font-bold text-expense">
                {formatCurrency(expenseSummary.yearToDate)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Jan - Jun 2023
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Relação Despesa/Receita
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {expenseSummary.expenseRatio}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Das receitas vão para despesas
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle>Despesas Mensais</CardTitle>
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
                    data={monthlyExpenseData}
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
                    <Bar name="Despesas" dataKey="value" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle>Despesas por Categoria</CardTitle>
                <Tabs defaultValue="pie">
                  <TabsList className="grid w-[180px] grid-cols-2">
                    <TabsTrigger value="pie">Pizza</TabsTrigger>
                    <TabsTrigger value="bar">Barras</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <TabsContent value="pie" className="mt-0">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseCategoriesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {expenseCategoriesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="bar" className="mt-0">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={expenseCategoriesData}
                      layout="vertical"
                      margin={{
                        top: 20,
                        right: 30,
                        left: 80,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(value) => `R$${value}`} />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Bar dataKey="value" fill="#EF4444" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </div>
        
        <TransactionList 
          transactions={expenseTransactions}
          title="Despesas Recentes"
          loading={loading}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
        />
      </div>
    </MainLayout>
  );
};

export default Expenses;
