
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Plus, Search, Grid, List } from 'lucide-react';
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import PropertyForm from '@/components/properties/PropertyForm';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import PropertyOverview from '@/components/dashboard/PropertyOverview';

// Dados de exemplo
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
  {
    id: '4',
    name: 'Terreno Zona Sul',
    type: 'Terreno',
    address: 'Rua das Palmeiras, 101 - Zona Sul',
    purchaseValue: 180000,
    currentValue: 210000,
    ownerId: '2',
  },
  {
    id: '5',
    name: 'Apartamento Praia',
    type: 'Apartamento',
    address: 'Av. Beira Mar, 555 - Praia Grande',
    purchaseValue: 420000,
    currentValue: 460000,
    rentAmount: 0,
    roi: 0,
    ownerId: '1',
  },
];

// Lista de proprietários de exemplo
const ownersSample = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@exemplo.com',
    properties: 3,
    lastAccess: '2023-06-15T14:30:00Z',
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    email: 'maria@exemplo.com',
    properties: 2,
    lastAccess: '2023-06-18T09:45:00Z',
  },
  {
    id: '3',
    name: 'Carlos Santos',
    email: 'carlos@exemplo.com',
    properties: 2,
    lastAccess: '2023-06-14T16:20:00Z',
  }
];

// Métricas para o dashboard
const dashboardMetrics = {
  totalProperties: 3,
  totalValue: 1050000,
  occupancyRate: 66.7,
  monthlyIncome: 4500,
  annualReturn: 5.14,
  valueGrowth: 7.8,
};

const OwnerDetails = () => {
  const { ownerId } = useParams();
  const [owner, setOwner] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [properties, setProperties] = useState<PropertyCardProps[]>([]);
  const [editingProperty, setEditingProperty] = useState<PropertyCardProps | null>(null);
  
  const { toast } = useToast();
  
  // Carregar dados do proprietário
  useEffect(() => {
    if (ownerId) {
      // Simulando uma busca ao backend
      const foundOwner = ownersSample.find(o => o.id === ownerId);
      if (foundOwner) {
        setOwner(foundOwner);
        
        // Filtrar imóveis deste proprietário
        const ownerProperties = exampleProperties.filter(p => p.ownerId === ownerId);
        setProperties(ownerProperties);
      }
    }
  }, [ownerId]);
  
  // Funções de gerenciamento de imóveis
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
          ownerId: ownerId,
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
  
  // Filtra propriedades com base no termo de busca
  const filteredProperties = properties.filter((property) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      property.name.toLowerCase().includes(searchLower) ||
      property.type.toLowerCase().includes(searchLower) ||
      property.address.toLowerCase().includes(searchLower)
    );
  });

  if (!owner) {
    return (
      <MainLayout requireAdmin>
        <div className="text-center p-12">
          <p>Proprietário não encontrado.</p>
          <Button asChild className="mt-4">
            <Link to="/owners">Voltar para Lista de Proprietários</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout requireAdmin>
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link to="/owners">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {owner.name}
            </h1>
            <p className="text-muted-foreground">{owner.email}</p>
          </div>
        </div>
        
        <Tabs defaultValue="properties">
          <TabsList className="mb-6">
            <TabsTrigger value="properties">Imóveis</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>
          
          <TabsContent value="properties">
            <div className="space-y-6">
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
                  <Button onClick={() => {
                    setEditingProperty(null);
                    setOpenDialog(true);
                  }} className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Adicionar Imóvel
                  </Button>
                  
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
              
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="rented">Alugados</TabsTrigger>
                  <TabsTrigger value="vacant">Vagos</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-6">
                  <div className={view === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "flex flex-col gap-4"
                  }>
                    {filteredProperties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        {...property}
                        layout={view}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                    {filteredProperties.length === 0 && (
                      <div className="col-span-full text-center p-12 bg-muted rounded-lg">
                        <p className="text-muted-foreground">Nenhum imóvel encontrado</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="rented" className="mt-6">
                  <div className={view === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "flex flex-col gap-4"
                  }>
                    {filteredProperties
                      .filter(p => p.rentAmount && p.rentAmount > 0)
                      .map((property) => (
                        <PropertyCard
                          key={property.id}
                          {...property}
                          layout={view}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      ))}
                    {filteredProperties.filter(p => p.rentAmount && p.rentAmount > 0).length === 0 && (
                      <div className="col-span-full text-center p-12 bg-muted rounded-lg">
                        <p className="text-muted-foreground">Nenhum imóvel alugado encontrado</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="vacant" className="mt-6">
                  <div className={view === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "flex flex-col gap-4"
                  }>
                    {filteredProperties
                      .filter(p => !p.rentAmount || p.rentAmount === 0)
                      .map((property) => (
                        <PropertyCard
                          key={property.id}
                          {...property}
                          layout={view}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      ))}
                    {filteredProperties.filter(p => !p.rentAmount || p.rentAmount === 0).length === 0 && (
                      <div className="col-span-full text-center p-12 bg-muted rounded-lg">
                        <p className="text-muted-foreground">Nenhum imóvel vago encontrado</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
          
          <TabsContent value="dashboard">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dados do Proprietário</CardTitle>
                  <CardDescription>
                    Resumo dos imóveis e indicadores financeiros
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PropertyOverview 
                    totalProperties={properties.length} 
                    totalValue={properties.reduce((sum, prop) => sum + prop.purchaseValue, 0)}
                    occupancyRate={Math.round((properties.filter(p => p.rentAmount && p.rentAmount > 0).length / properties.length) * 100) || 0}
                    monthlyIncome={properties.reduce((sum, prop) => sum + (prop.rentAmount || 0), 0)}
                    annualReturn={properties.filter(p => p.roi).reduce((sum, prop) => sum + (prop.roi || 0), 0) / (properties.filter(p => p.roi).length || 1)}
                    valueGrowth={properties.filter(p => p.currentValue).reduce((sum, prop) => sum + ((prop.currentValue || 0) - prop.purchaseValue), 0) / properties.filter(p => p.currentValue).reduce((sum, prop) => sum + prop.purchaseValue, 0) * 100 || 0}
                    loading={loading}
                  />
                </CardContent>
              </Card>
              
              <DashboardCharts loading={loading} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProperty ? 'Editar Imóvel' : 'Adicionar Novo Imóvel'}</DialogTitle>
            <DialogDescription>
              Preencha os detalhes do imóvel. Todos os campos marcados com * são obrigatórios.
            </DialogDescription>
          </DialogHeader>
          <PropertyForm 
            onSubmit={handleFormSubmit} 
            isSubmitting={loading} 
            initialData={editingProperty || undefined}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default OwnerDetails;
