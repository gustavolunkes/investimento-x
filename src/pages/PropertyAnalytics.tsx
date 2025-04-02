
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PropertyCardProps } from '@/components/properties/PropertyCard';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  Area
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

// Dados para evolução patrimonial do imóvel
const assetGrowthData = [
  { month: 'Jan 2022', value: 350000 },
  { month: 'Fev 2022', value: 352000 },
  { month: 'Mar 2022', value: 354000 },
  { month: 'Abr 2022', value: 356000 },
  { month: 'Mai 2022', value: 360000 },
  { month: 'Jun 2022', value: 363000 },
  { month: 'Jul 2022', value: 367000 },
  { month: 'Ago 2022', value: 370000 },
  { month: 'Set 2022', value: 375000 },
  { month: 'Out 2022', value: 380000 },
  { month: 'Nov 2022', value: 385000 },
  { month: 'Dez 2022', value: 390000 },
  { month: 'Jan 2023', value: 392000 },
  { month: 'Fev 2023', value: 394000 },
  { month: 'Mar 2023', value: 396000 },
  { month: 'Abr 2023', value: 398000 },
  { month: 'Mai 2023', value: 399000 },
  { month: 'Jun 2023', value: 400000 },
];

// Dados de retorno mensal
const monthlyReturnData = [
  { month: 'Jan 2023', income: 2500, expenses: 800, net: 1700, roi: 0.7 },
  { month: 'Fev 2023', income: 2500, expenses: 800, net: 1700, roi: 0.7 },
  { month: 'Mar 2023', income: 2500, expenses: 800, net: 1700, roi: 0.7 },
  { month: 'Abr 2023', income: 2500, expenses: 1250, net: 1250, roi: 0.5 },
  { month: 'Mai 2023', income: 2500, expenses: 800, net: 1700, roi: 0.7 },
  { month: 'Jun 2023', income: 2500, expenses: 1600, net: 900, roi: 0.4 },
];

// Dados para estatísticas
const propertyStats = {
  totalValue: 400000,
  annualGrowthRate: 14.3,
  cashOnCash: 8.6,
  occupancyRate: 100,
  capRate: 7.5,
  projectedAnnualReturn: 10.2,
};

const PropertyAnalytics = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('1y');
  
  // Encontra a propriedade pelo ID
  const property = exampleProperties.find(p => p.id === propertyId);
  
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
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  const formatPercentage = (value: number) => {
    return `${value}%`;
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigate(`/properties/${propertyId}`)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Análises: {property.name}</h1>
          </div>
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6m">Últimos 6 meses</SelectItem>
              <SelectItem value="1y">Último ano</SelectItem>
              <SelectItem value="all">Todo o período</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Valor Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(property.currentValue || property.purchaseValue)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Valorização
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-income">
                {formatPercentage(propertyStats.annualGrowthRate)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Valorização desde a compra
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                ROI Anual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-income">
                {formatPercentage(property.roi || 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taxa de Ocupação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPercentage(propertyStats.occupancyRate)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Cap Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPercentage(propertyStats.capRate)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Retorno Projetado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-income">
                {formatPercentage(propertyStats.projectedAnnualReturn)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Próximos 12 meses
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Valorização</TabsTrigger>
            <TabsTrigger value="cashflow">Fluxo de Caixa</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Evolução do Valor do Imóvel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={assetGrowthData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 20,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" angle={-45} textAnchor="end" height={50} />
                      <YAxis tickFormatter={(value) => `R$${value / 1000}k`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        name="Valor do Imóvel"
                        stroke="#1E3A8A"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cashflow" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Fluxo de Caixa Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={monthlyReturnData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 20,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" angle={-45} textAnchor="end" height={50} />
                      <YAxis 
                        yAxisId="left" 
                        orientation="left"
                        tickFormatter={(value) => `R$${value}`}
                      />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right"
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (name === "roi") return [`${value}%`, "ROI Mensal"];
                          return [formatCurrency(Number(value)), name === "income" ? "Receitas" : name === "expenses" ? "Despesas" : "Líquido"];
                        }}
                      />
                      <Legend />
                      <Bar 
                        yAxisId="left" 
                        dataKey="income" 
                        name="Receitas" 
                        fill="#10B981"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        yAxisId="left" 
                        dataKey="expenses" 
                        name="Despesas" 
                        fill="#EF4444"
                        radius={[4, 4, 0, 0]}
                      />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="net"
                        name="Líquido"
                        fill="#1E3A8A"
                        stroke="#1E3A8A"
                        fillOpacity={0.1}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="roi"
                        name="ROI Mensal"
                        stroke="#0D9488"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle>Análise de Rentabilidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Valor Investido</h3>
                  <p className="text-lg font-medium mt-1">{formatCurrency(property.purchaseValue)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Valor de Mercado Atual</h3>
                  <p className="text-lg font-medium mt-1">{formatCurrency(property.currentValue || property.purchaseValue)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Receita Anual Bruta</h3>
                  <p className="text-lg font-medium text-income mt-1">
                    {formatCurrency((property.rentAmount || 0) * 12)}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Despesas Anuais Estimadas</h3>
                  <p className="text-lg font-medium text-expense mt-1">
                    {formatCurrency((property.rentAmount || 0) * 0.3 * 12)}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Receita Anual Líquida</h3>
                  <p className="text-lg font-medium text-income mt-1">
                    {formatCurrency((property.rentAmount || 0) * 0.7 * 12)}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Ganho de Capital</h3>
                  <p className="text-lg font-medium text-income mt-1">
                    {property.currentValue ? 
                      formatCurrency(property.currentValue - property.purchaseValue) :
                      "Sem dados suficientes"}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Análise de Retorno</h3>
                <p className="text-sm mt-2">
                  O imóvel {property.name} apresenta um retorno anual de {property.roi?.toFixed(2) || 0}% sobre o valor investido,
                  considerando o aluguel mensal de {formatCurrency(property.rentAmount || 0)}. 
                  O valor de mercado atual representa uma valorização de {propertyStats.annualGrowthRate}% desde a compra.
                </p>
                <p className="text-sm mt-2">
                  Com uma taxa de ocupação de {propertyStats.occupancyRate}% e um Cap Rate de {propertyStats.capRate}%,
                  o imóvel está com desempenho {property.roi && property.roi > 6 ? 'acima' : 'abaixo'} da média de mercado.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default PropertyAnalytics;
