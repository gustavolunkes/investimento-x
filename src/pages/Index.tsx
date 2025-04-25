
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PropertyOverview from '@/components/dashboard/PropertyOverview';

const Dashboard = () => {
  const [loading] = React.useState(false);
  
  // Simplified dashboard metrics
  const dashboardMetrics = {
    totalProperties: 5,
    totalValue: 1750000,
    occupancyRate: 80,
    monthlyIncome: 8500,
    annualReturn: 5.82,
    valueGrowth: 4.5,
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        
        <PropertyOverview {...dashboardMetrics} loading={loading} />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
