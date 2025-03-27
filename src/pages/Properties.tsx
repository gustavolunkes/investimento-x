
import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

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
  },
  {
    id: '4',
    name: 'Terreno Zona Sul',
    type: 'Terreno',
    address: 'Rua das Palmeiras, 101 - Zona Sul',
    purchaseValue: 180000,
    currentValue: 210000,
  },
  {
    id: '5',
    name: 'Apartamento Praia',
    type: 'Apartamento',
    address: 'Av. Beira Mar, 555 - Praia Grande',
    purchaseValue: 420000,
    currentValue: 460000,
    rentAmount: 0, // Não está alugado
    roi: 0,
  },
];

const Properties = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  
  const handleEdit = (id: string) => {
    console.log(`Editar imóvel ${id}`);
  };
  
  const handleDelete = (id: string) => {
    console.log(`Excluir imóvel ${id}`);
  };
  
  const handleFormSubmit = (data: any) => {
    console.log('Dados do formulário:', data);
    setLoading(true);
    
    // Simula uma chamada de API
    setTimeout(() => {
      setLoading(false);
      setOpenDialog(false);
    }, 1000);
  };
  
  const filteredProperties = exampleProperties.filter((property) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      property.name.toLowerCase().includes(searchLower) ||
      property.type.toLowerCase().includes(searchLower) ||
      property.address.toLowerCase().includes(searchLower)
    );
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Meus Imóveis</h1>
          <Button onClick={() => setOpenDialog(true)} className="flex items-center gap-2">
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
          
          <Tabs defaultValue="all" className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="rented">Alugados</TabsTrigger>
              <TabsTrigger value="vacant">Vagos</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                {...property}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="rented" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties
              .filter(p => p.rentAmount && p.rentAmount > 0)
              .map((property) => (
                <PropertyCard
                  key={property.id}
                  {...property}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="vacant" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties
              .filter(p => !p.rentAmount || p.rentAmount === 0)
              .map((property) => (
                <PropertyCard
                  key={property.id}
                  {...property}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
          </div>
        </TabsContent>
      </div>
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Imóvel</DialogTitle>
            <DialogDescription>
              Preencha os detalhes do seu novo imóvel. Todos os campos marcados com * são obrigatórios.
            </DialogDescription>
          </DialogHeader>
          <PropertyForm onSubmit={handleFormSubmit} isSubmitting={loading} />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Properties;
