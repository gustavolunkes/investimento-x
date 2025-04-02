
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TransactionList, { Transaction } from '@/components/transactions/TransactionList';
import { PropertyCardProps } from '@/components/properties/PropertyCard';
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

// Dados de exemplo de propriedades
const exampleProperties: PropertyCardProps[] = [
  {
    id: '1',
    name: 'Apartamento Centro',
    type: 'Apartamento',
    address: 'Rua das Flores, 123 - Centro',
    rentAmount: 2500,
    purchaseValue: 350000,
    currentValue: 400000,
    roi: 8.57,
    ownerId: '1',
  },
  {
    id: '2',
    name: 'Casa Jardins',
    type: 'Casa',
    address: 'Rua dos Jardins, 456 - Jardim Primavera',
    rentAmount: 3500,
    purchaseValue: 500000,
    currentValue: 550000,
    roi: 7.64,
    ownerId: '2',
  },
  {
    id: '3',
    name: 'Sala Comercial',
    type: 'Comercial',
    address: 'Av. Paulista, 789 - Centro',
    rentAmount: 2000,
    purchaseValue: 280000,
    currentValue: 290000,
    roi: 8.28,
    ownerId: '1',
  },
];

// Dados de exemplo para transações de despesa
const expenseTransactions: Transaction[] = [
  {
    id: '1',
    date: '2023-06-05',
    amount: 800,
    description: 'Condomínio',
    category: 'Condomínio',
    type: 'expense',
    propertyId: '1',
    propertyName: 'Apartamento Centro',
  },
  {
    id: '2',
    date: '2023-05-05',
    amount: 800,
    description: 'Condomínio',
    category: 'Condomínio',
    type: 'expense',
    propertyId: '1',
    propertyName: 'Apartamento Centro',
  },
  {
    id: '3',
    date: '2023-04-05',
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
    amount: 350,
    description: 'IPTU',
    category: 'Impostos',
    type: 'expense',
    propertyId: '1',
    propertyName: 'Apartamento Centro',
  },
];

// Dados para o gráfico de barras
const monthlyExpenseData = [
  { month: 'Jan', value: 800 },
  { month: 'Fev', value: 800 },
  { month: 'Mar', value: 800 },
  { month: 'Abr', value: 1250 },
  { month: 'Mai', value: 800 },
  { month: 'Jun', value: 1600 },
  { month: 'Jul', value: 0 },
  { month: 'Ago', value: 0 },
  { month: 'Set', value: 0 },
  { month: 'Out', value: 0 },
  { month: 'Nov', value: 0 },
  { month: 'Dez', value: 0 },
];

// Dados para o gráfico de pizza
const expenseCategoriesData = [
  { name: 'Condomínio', value: 2400 },
  { name: 'Impostos', value: 350 },
  { name: 'Manutenção', value: 450 },
  { name: 'Outros', value: 100 },
];

// Cores para o gráfico de pizza
const EXPENSE_COLORS = ['#0D9488', '#06B6D4', '#0EA5E9', '#3B82F6'];

const PropertyExpenses = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Encontra a propriedade pelo ID
  const property = exampleProperties.find(p => p.id === propertyId);
  
  // Filtra transações apenas desta propriedade
  const propertyExpenses = expenseTransactions.filter(t => t.propertyId === propertyId);
  
  if (!property) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-bold">Imóvel não encontrado</h2>
          <Button className="mt-4" onClick={() => navigate('/properties')}>
            Voltar para a lista de imóveis
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  const handleEditTransaction = (id: string) => {
    console.log(`Editar transação ${id}`);
  };
  
  const handleDeleteTransaction = (id: string) => {
    console.log(`Excluir transação ${id}`);
  };
  
  // Calcula o resumo de despesas da propriedade
  const totalExpenses = propertyExpenses.reduce((sum, t) => sum + t.amount, 0);
  const monthlyAverage = totalExpenses / (propertyExpenses.length ? Math.ceil(propertyExpenses.length / 3) : 1);
  const annualProjection = monthlyAverage * 12;
  const expenseRatio = property.rentAmount ? (monthlyAverage / property.rentAmount) * 100 : 0;
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigate(`/properties/${propertyId}`)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Despesas: {property.name}</h1>
          </div>
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
                {formatCurrency(totalExpenses)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total já gasto com este imóvel
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
                {formatCurrency(monthlyAverage)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Média mensal de despesas
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
              <div className="text-2xl font-bold text-expense">
                {formatCurrency(annualProjection)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Despesas esperadas para 12 meses
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
                {expenseRatio.toFixed(2)}%
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
              <CardTitle>Despesas Mensais</CardTitle>
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
                    <YAxis tickFormatter={(value) => `R$${value}`} />
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
              <div className="flex items-center justify-between">
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
          transactions={propertyExpenses}
          title="Despesas Registradas"
          loading={loading}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
        />
      </div>
    </MainLayout>
  );
};

export default PropertyExpenses;
