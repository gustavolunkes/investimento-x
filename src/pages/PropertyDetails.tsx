import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, MapPin, Edit, Trash2, ArrowLeft, Receipt, Wallet, Tags } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import PropertyForm from '@/components/properties/PropertyForm';
import LiquidatePropertyModal from '@/components/properties/LiquidatePropertyModal';
import { useToast } from '@/components/ui/use-toast';
import { PropertyCardProps } from '@/components/properties/PropertyCard';

// Dados de exemplo - em uma aplicação real, esses dados viriam de uma API
const exampleProperties: PropertyCardProps[] = [
  {
    id: '1',
    name: 'Apartamento Centro',
    type: 'Apartamento',
    address: 'Rua das Flores, 123 - Centro',
    rentAmount: '2500',
    purchaseValue: '350000',
    currentValue: '400000',
    roi: 8.57,
    ownerId: '1',
  },
  {
    id: '2',
    name: 'Casa Jardins',
    type: 'Casa',
    address: 'Rua dos Jardins, 456 - Jardim Primavera',
    rentAmount: '3500',
    purchaseValue: '500000',
    currentValue: '550000',
    roi: 7.64,
    ownerId: '2',
  },
  {
    id: '3',
    name: 'Sala Comercial',
    type: 'Comercial',
    address: 'Av. Paulista, 789 - Centro',
    rentAmount: '2000',
    purchaseValue: '280000',
    currentValue: '290000',
    roi: 8.28,
    ownerId: '1',
  },
  {
    id: '4',
    name: 'Terreno Zona Sul',
    type: 'Terreno',
    address: 'Rua das Palmeiras, 101 - Zona Sul',
    purchaseValue: '180000',
    currentValue: '210000',
    rentAmount: '0',
    ownerId: '2',
  },
  {
    id: '5',
    name: 'Apartamento Praia',
    type: 'Apartamento',
    address: 'Av. Beira Mar, 555 - Praia Grande',
    purchaseValue: '420000',
    currentValue: '460000',
    rentAmount: '0',
    roi: 0,
    ownerId: '1',
  },
];

const PropertyDetails = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLiquidateModal, setShowLiquidateModal] = useState(false);
  
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
  
  const formatCurrency = (value: string) => {
    const numericValue = parseFloat(value);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numericValue);
  };
  
  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este imóvel?')) {
      toast({
        title: 'Imóvel excluído',
        description: 'O imóvel foi removido com sucesso.',
      });
      navigate('/properties');
    }
  };
  
  const handleFormSubmit = (data: any) => {
    setLoading(true);
    
    // Simula uma chamada de API
    setTimeout(() => {
      toast({
        title: 'Imóvel atualizado',
        description: 'As informações do imóvel foram atualizadas com sucesso.',
      });
      
      setLoading(false);
      setOpenDialog(false);
    }, 1000);
  };

  const handleLiquidateConfirm = (data: any) => {
    setLoading(true);
    
    // Simula uma chamada de API
    setTimeout(() => {
      toast({
        title: 'Imóvel liquidado',
        description: `O imóvel ${property.name} foi vendido por ${formatCurrency(data.saleValue)} com lucro líquido de ${formatCurrency(data.netProfit)}.`,
      });
      
      setLoading(false);
      setShowLiquidateModal(false);
      navigate('/properties');
    }, 1000);
  };

  const valueGrowth = property.currentValue && property.purchaseValue
    ? ((parseFloat(property.currentValue) - parseFloat(property.purchaseValue)) / parseFloat(property.purchaseValue)) * 100
    : 0;
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigate('/properties')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">{property.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate(`/properties/${propertyId}/incomes`)} className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-income" />
              <span>Receitas</span>
            </Button>
            <Button variant="outline" onClick={() => navigate(`/properties/${propertyId}/expenses`)} className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-expense" />
              <span>Despesas</span>
            </Button>
            <Button variant="outline" onClick={() => setOpenDialog(true)} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              <span>Editar</span>
            </Button>
            <Button variant="ghost" onClick={handleDelete} className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-4 w-4" />
              <span>Excluir</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Tipo de Imóvel</h3>
                  <p className="text-lg flex items-center gap-2 mt-1">
                    <Building2 className="h-4 w-4" />
                    {property.type}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Endereço</h3>
                  <p className="text-lg flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4" />
                    {property.address}
                  </p>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Valor de Compra</h3>
                    <p className="text-lg font-medium mt-1">{formatCurrency(property.purchaseValue)}</p>
                  </div>
                  
                  {property.currentValue && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Valor Atual</h3>
                      <p className="text-lg font-medium mt-1">{formatCurrency(property.currentValue)}</p>
                      <p className={`text-xs ${valueGrowth > 0 ? 'text-income' : 'text-expense'} mt-1`}>
                        {valueGrowth > 0 ? '↑' : '↓'} {Math.abs(valueGrowth).toFixed(2)}% de valorização
                      </p>
                    </div>
                  )}
                </div>
                
                {property.rentAmount !== undefined && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Aluguel Mensal</h3>
                      <p className="text-lg font-medium text-income mt-1">
                        {parseFloat(property.rentAmount) > 0 
                          ? formatCurrency(property.rentAmount) 
                          : 'Não alugado'}
                      </p>
                    </div>
                  </>
                )}
                
                {property.roi !== undefined && property.roi > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Retorno sobre Investimento (ROI)</h3>
                    <p className="text-lg font-medium text-income mt-1">{property.roi.toFixed(2)}% ao ano</p>
                  </div>
                )}

                <Separator />

                <Button 
                  onClick={() => setShowLiquidateModal(true)} 
                  className="w-full text-black bg-white border-black hover:bg-black hover:text-white"
                  variant="outline"
                >
                  <Tags className="h-5 w-5 mr-2" />
                  Liquidar este imóvel
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Resumo Financeiro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Receita Anual (Estimada)</h3>
                  <p className="text-lg font-medium text-income mt-1">
                    {parseFloat(property.rentAmount) > 0 
                      ? formatCurrency((parseFloat(property.rentAmount) * 12).toString()) 
                      : 'R$ 0,00'}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Despesas Anuais (Estimadas)</h3>
                  <p className="text-lg font-medium text-expense mt-1">
                    {parseFloat(property.rentAmount) > 0 
                      ? formatCurrency((parseFloat(property.rentAmount) * 0.3 * 12).toString()) 
                      : 'R$ 0,00'}
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Lucro Líquido Anual (Estimado)</h3>
                  <p className="text-lg font-medium mt-1">
                    {parseFloat(property.rentAmount) > 0 
                      ? formatCurrency((parseFloat(property.rentAmount) * 0.7 * 12).toString()) 
                      : 'R$ 0,00'}
                  </p>
                </div>
                
                <Separator />
                
                <div className="flex flex-col gap-2">
                  <Button variant="default" size="sm" className="w-full" onClick={() => navigate(`/properties/${propertyId}/incomes`)}>
                    <Receipt className="h-4 w-4 mr-2" />
                    Ver Receitas
                  </Button>
                  <Button variant="default" size="sm" className="w-full" onClick={() => navigate(`/properties/${propertyId}/expenses`)}>
                    <Wallet className="h-4 w-4 mr-2" />
                    Ver Despesas
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Imóvel</DialogTitle>
            <DialogDescription>
              Preencha os detalhes do seu imóvel. Todos os campos marcados com * são obrigatórios.
            </DialogDescription>
          </DialogHeader>
          <PropertyForm 
            onSubmit={handleFormSubmit} 
            isSubmitting={loading} 
            initialData={property}
          />
        </DialogContent>
      </Dialog>

      {showLiquidateModal && (
        <LiquidatePropertyModal
          property={property}
          open={showLiquidateModal}
          onOpenChange={setShowLiquidateModal}
          onConfirm={handleLiquidateConfirm}
        />
      )}
    </MainLayout>
  );
};

export default PropertyDetails;
