
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
} from 'recharts';

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

// Dados de exemplo para transações de receita
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
    date: '2023-05-01',
    amount: 2500,
    description: 'Aluguel',
    category: 'Receita de Aluguel',
    type: 'income',
    propertyId: '1',
    propertyName: 'Apartamento Centro',
  },
  {
    id: '3',
    date: '2023-04-01',
    amount: 2500,
    description: 'Aluguel',
    category: 'Receita de Aluguel',
    type: 'income',
    propertyId: '1',
    propertyName: 'Apartamento Centro',
  },
  {
    id: '4',
    date: '2023-06-02',
    amount: 3500,
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
];

// Dados para o gráfico
const monthlyIncomeData = [
  { month: 'Jan', value: 2500 },
  { month: 'Fev', value: 2500 },
  { month: 'Mar', value: 2500 },
  { month: 'Abr', value: 2500 },
  { month: 'Mai', value: 2500 },
  { month: 'Jun', value: 2500 },
  { month: 'Jul', value: 0 },
  { month: 'Ago', value: 0 },
  { month: 'Set', value: 0 },
  { month: 'Out', value: 0 },
  { month: 'Nov', value: 0 },
  { month: 'Dez', value: 0 },
];

const PropertyIncomes = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Encontra a propriedade pelo ID
  const property = exampleProperties.find(p => p.id === propertyId);
  
  // Filtra transações apenas desta propriedade
  const propertyIncomes = incomeTransactions.filter(t => t.propertyId === propertyId);
  
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
  
  // Calcula o resumo de receitas da propriedade
  const totalIncome = propertyIncomes.reduce((sum, t) => sum + t.amount, 0);
  const monthlyAverage = property.rentAmount || 0;
  const annualProjection = monthlyAverage * 12;
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigate(`/properties/${propertyId}`)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Receitas: {property.name}</h1>
          </div>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Nova Receita
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Recebido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-income">
                {formatCurrency(totalIncome)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total já recebido deste imóvel
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Receita Mensal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-income">
                {formatCurrency(monthlyAverage)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Valor mensal de aluguel
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
              <div className="text-2xl font-bold text-income">
                {formatCurrency(annualProjection)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Receita esperada para 12 meses
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Histórico de Receitas do Imóvel</CardTitle>
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
          transactions={propertyIncomes}
          title="Receitas Registradas"
          loading={loading}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
        />
      </div>
    </MainLayout>
  );
};

export default PropertyIncomes;
