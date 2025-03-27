
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
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
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Area,
} from 'recharts';

// Dados para evolução patrimonial
const assetGrowthData = [
  { month: 'Jan 2022', value: 1530000 },
  { month: 'Fev 2022', value: 1535000 },
  { month: 'Mar 2022', value: 1540000 },
  { month: 'Abr 2022', value: 1545000 },
  { month: 'Mai 2022', value: 1550000 },
  { month: 'Jun 2022', value: 1560000 },
  { month: 'Jul 2022', value: 1570000 },
  { month: 'Ago 2022', value: 1580000 },
  { month: 'Set 2022', value: 1590000 },
  { month: 'Out 2022', value: 1600000 },
  { month: 'Nov 2022', value: 1610000 },
  { month: 'Dez 2022', value: 1620000 },
  { month: 'Jan 2023', value: 1650000 },
  { month: 'Fev 2023', value: 1670000 },
  { month: 'Mar 2023', value: 1690000 },
  { month: 'Abr 2023', value: 1710000 },
  { month: 'Mai 2023', value: 1730000 },
  { month: 'Jun 2023', value: 1750000 },
];

// Dados de retorno mensal
const monthlyReturnData = [
  { month: 'Jan 2023', income: 6000, expenses: 1800, net: 4200, roi: 3.1 },
  { month: 'Fev 2023', income: 6000, expenses: 1850, net: 4150, roi: 3.0 },
  { month: 'Mar 2023', income: 6000, expenses: 1920, net: 4080, roi: 2.9 },
  { month: 'Abr 2023', income: 6000, expenses: 1750, net: 4250, roi: 3.0 },
  { month: 'Mai 2023', income: 6000, expenses: 2100, net: 3900, roi: 2.7 },
  { month: 'Jun 2023', income: 6000, expenses: 1880, net: 4120, roi: 2.8 },
];

// Dados de distribuição por tipo de imóvel
const propertyTypeData = [
  { name: 'Apartamentos', value: 950000 },
  { name: 'Casas', value: 500000 },
  { name: 'Comercial', value: 280000 },
  { name: 'Terrenos', value: 180000 },
];

// Dados de comparação de ROI por imóvel
const propertyRoiData = [
  { property: 'Apto Centro', roi: 8.57 },
  { property: 'Casa Jardins', value: 7.64 },
  { property: 'Sala Comercial', roi: 8.28 },
  { property: 'Terreno Zona Sul', roi: 0 },
  { property: 'Apto Praia', roi: 0 },
];

// Cores para o gráfico de pizza
const PROPERTY_COLORS = ['#1E3A8A', '#0D9488', '#0369A1', '#0284C7', '#0891B2'];

// Dados para estatísticas
const analyticsStats = {
  totalValue: 1750000,
  annualGrowthRate: 7.4,
  cashOnCash: 5.8,
  occupancyRate: 80,
  capRate: 6.2,
  projectedAnnualReturn: 9.5,
};

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('1y');
  
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
          <h1 className="text-3xl font-bold tracking-tight">Análises</h1>
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
                Valor Total do Portfólio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(analyticsStats.totalValue)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taxa de Valorização Anual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-income">
                {formatPercentage(analyticsStats.annualGrowthRate)}
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
                {formatPercentage(analyticsStats.occupancyRate)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Cash-on-Cash Return
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPercentage(analyticsStats.cashOnCash)}
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
                {formatPercentage(analyticsStats.capRate)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Retorno Anual Projetado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-income">
                {formatPercentage(analyticsStats.projectedAnnualReturn)}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="cashflow">Fluxo de Caixa</TabsTrigger>
            <TabsTrigger value="distribution">Distribuição</TabsTrigger>
            <TabsTrigger value="comparison">Comparativo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Evolução Patrimonial</CardTitle>
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
                        name="Valor do Patrimônio"
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
                        tickFormatter={(value) => `R$${value / 1000}k`}
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
          
          <TabsContent value="distribution" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Tipo de Imóvel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={propertyTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, value, percent }) => `${name}: ${formatCurrency(value)} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {propertyTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PROPERTY_COLORS[index % PROPERTY_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="comparison" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Comparativo de ROI por Imóvel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={propertyRoiData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 20,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="property" angle={-45} textAnchor="end" height={50} />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                      <Bar 
                        dataKey="roi" 
                        name="ROI Anual" 
                        fill="#0D9488"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Analytics;
