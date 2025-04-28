import React, { useState, useEffect } from 'react';
import { Plus, Search, Grid, List } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import PropertyCard, { PropertyCardProps } from '@/components/properties/PropertyCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import PropertyForm from '@/components/properties/PropertyForm';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import LiquidatePropertyModal from '@/components/properties/LiquidatePropertyModal';

// Dados de exemplo
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

const Properties = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [properties, setProperties] = useState<PropertyCardProps[]>(exampleProperties);
  const [editingProperty, setEditingProperty] = useState<PropertyCardProps | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [liquidateProperty, setLiquidateProperty] = useState<PropertyCardProps | null>(null);
  
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  
  const handleEdit = (id: string) => {
    const property = properties.find(p => p.id === id);
    if (property) {
      setEditingProperty(property);
      setOpenDialog(true);
    }
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este imóvel?')) {
      setProperties(properties.filter(p => p.id !== id));
      toast({
        title: 'Imóvel excluído',
        description: 'O imóvel foi removido com sucesso.',
      });
    }
  };
  
  const handleLiquidate = (id: string) => {
    const property = properties.find(p => p.id === id);
    if (property) {
      setLiquidateProperty(property);
    }
  };
  
  const handleLiquidateConfirm = (data: any) => {
    setLoading(true);
    
    // Simula uma chamada de API
    setTimeout(() => {
      if (liquidateProperty) {
        // Remove a propriedade da lista
        setProperties(properties.filter(p => p.id !== liquidateProperty.id));
        
        toast({
          title: 'Imóvel liquidado',
          description: `O imóvel ${liquidateProperty.name} foi vendido por ${new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(parseFloat(data.saleValue))} com lucro líquido de ${new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(parseFloat(data.netProfit))}.`,
        });
      }
      
      setLoading(false);
      setLiquidateProperty(null);
    }, 1000);
  };
  
  const handleFormSubmit = (data: any) => {
    setLoading(true);
    
    // Simula uma chamada de API
    setTimeout(() => {
      if (editingProperty) {
        // Atualizar propriedade existente
        setProperties(properties.map(property => 
          property.id === editingProperty.id ? { ...property, ...data } : property
        ));
        
        toast({
          title: 'Imóvel atualizado',
          description: 'As informações do imóvel foram atualizadas com sucesso.',
        });
      } else {
        // Adicionar nova propriedade
        const newProperty = {
          id: `${properties.length + 1}`,
          ...data,
          ownerId: user?.id || '1',
        };
        
        setProperties([...properties, newProperty]);
        
        toast({
          title: 'Imóvel adicionado',
          description: 'O novo imóvel foi adicionado com sucesso.',
        });
      }
      
      setLoading(false);
      setOpenDialog(false);
      setEditingProperty(null);
    }, 1000);
  };
  
  // Filtra propriedades com base no tipo de usuário e no termo de busca
  const filteredProperties = properties.filter((property) => {
    // Primeiro filtra por proprietário se não for admin
    if (!isAdmin && property.ownerId !== user?.id) {
      return false;
    }
    
    // Depois filtra pelo termo de busca
    const searchLower = searchTerm.toLowerCase();
    return (
      property.name.toLowerCase().includes(searchLower) ||
      property.type.toLowerCase().includes(searchLower) ||
      property.address.toLowerCase().includes(searchLower)
    );
  });

  const filterProperties = () => {
    let filtered = filteredProperties;
    
    switch (activeTab) {
      case 'rented':
        return filtered.filter(p => p.rentAmount && parseFloat(p.rentAmount) > 0);
      case 'vacant':
        return filtered.filter(p => !p.rentAmount || parseFloat(p.rentAmount) === 0);
      default:
        return filtered;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            {isAdmin ? 'Todos os Imóveis' : 'Meus Imóveis'}
          </h1>
          <Button onClick={() => {
            setEditingProperty(null);
            setOpenDialog(true);
          }} className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Adicionar Imóvel
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar imóveis..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4 items-center">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="rented">Alugados</TabsTrigger>
                <TabsTrigger value="vacant">Vagos</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex items-center border rounded-md">
              <Button
                variant={view === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setView('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={view === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setView('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className={view === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "flex flex-col gap-4"
        }>
          {filterProperties().map((property) => (
            <PropertyCard
              key={property.id}
              {...property}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onLiquidate={handleLiquidate}
              layout={view}
            />
          ))}
          {filterProperties().length === 0 && (
            <div className="col-span-full text-center p-12 bg-muted rounded-lg">
              <p className="text-muted-foreground">Nenhum imóvel encontrado</p>
            </div>
          )}
        </div>
      </div>
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProperty ? 'Editar Imóvel' : 'Adicionar Novo Imóvel'}</DialogTitle>
            <DialogDescription>
              Preencha os detalhes do seu imóvel. Todos os campos marcados com * são obrigatórios.
            </DialogDescription>
          </DialogHeader>
          <PropertyForm 
            onSubmit={handleFormSubmit} 
            isSubmitting={loading} 
            initialData={editingProperty || undefined}
          />
        </DialogContent>
      </Dialog>
      
      {liquidateProperty && (
        <LiquidatePropertyModal
          property={liquidateProperty}
          open={!!liquidateProperty}
          onOpenChange={(open) => {
            if (!open) {
              setLiquidateProperty(null);
            }
          }}
          onConfirm={handleLiquidateConfirm}
        />
      )}
    </MainLayout>
  );
};

export default Properties;
