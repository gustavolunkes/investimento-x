import React from 'react';
import { Building2, MapPin, TrendingUp, Home, BarChart3, Receipt, Wallet } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export interface PropertyCardProps {
  id: string;
  name: string;
  type: string;
  address: string;
  rentAmount: string;
  purchaseValue: string;
  currentValue?: string;
  roi?: number;
  image?: string;
  ownerId?: string;
  layout?: 'grid' | 'list';
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

const PropertyCard = ({
  id,
  name,
  type,
  address,
  rentAmount,
  purchaseValue,
  currentValue,
  roi,
  image,
  ownerId,
  layout = 'grid',
  onEdit,
  onDelete,
  className,
}: PropertyCardProps) => {
  const navigate = useNavigate();
  
  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Number(value));
  };

  const valueGrowth = currentValue && purchaseValue
    ? ((currentValue - purchaseValue) / purchaseValue) * 100
    : 0;
    
  const handleViewProperty = () => {
    navigate(`/properties/${id}`);
  };
  
  const handleViewIncomes = () => {
    navigate(`/properties/${id}/incomes`);
  };
  
  const handleViewExpenses = () => {
    navigate(`/properties/${id}/expenses`);
  };
  
  const handleViewAnalytics = () => {
    navigate(`/properties/${id}/analytics`);
  };

  // Layout específico para lista
  if (layout === 'list') {
    return (
      <Card className={cn("flex flex-row", className)}>
        <div className="relative h-auto w-28 bg-muted">
          {image ? (
            <img 
              src={image} 
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <Home className="h-8 w-8 text-muted-foreground/50" />
            </div>
          )}
        </div>
        <div className="flex flex-1 justify-between">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold truncate">{name}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{address}</span>
            </div>
            
            <div className="flex gap-4 mt-4">
              <div>
                <p className="text-xs text-muted-foreground">Valor da compra</p>
                <p className="font-medium">{formatCurrency(purchaseValue)}</p>
              </div>
              {currentValue && (
                <div>
                  <p className="text-xs text-muted-foreground">Valor atual</p>
                  <p className="font-medium">{formatCurrency(currentValue)}</p>
                </div>
              )}
              {rentAmount && rentAmount > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground">Aluguel mensal</p>
                  <p className="font-medium text-income">{formatCurrency(rentAmount)}</p>
                </div>
              )}
            </div>
          </CardContent>
          <div className="flex flex-col justify-center pr-4 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleViewProperty}
            >
              Ver detalhes
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleViewIncomes}
                className="h-8 w-8 text-income"
              >
                <Receipt className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleViewExpenses}
                className="h-8 w-8 text-expense"
              >
                <Wallet className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleViewAnalytics}
                className="h-8 w-8"
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEdit && onEdit(id)}
              >
                Editar
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-destructive"
                onClick={() => onDelete && onDelete(id)}
              >
                Excluir
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Layout padrão (grid)
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="relative h-40 bg-muted">
        {image ? (
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Home className="h-16 w-16 text-muted-foreground/50" />
          </div>
        )}
        <div className="absolute top-3 left-3 bg-white/90 text-foreground px-2 py-1 text-xs rounded-md flex items-center">
          <Building2 className="mr-1 h-3 w-3" />
          {type}
        </div>
        <Button 
          variant="outline" 
          size="sm"
          className="absolute top-3 right-3 bg-white/90"
          onClick={handleViewProperty}
        >
          Ver detalhes
        </Button>
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold truncate">{name}</h3>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
          <span className="truncate">{address}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-xs text-muted-foreground">Valor da compra</p>
            <p className="font-medium">{formatCurrency(purchaseValue)}</p>
          </div>
          {currentValue && (
            <div>
              <p className="text-xs text-muted-foreground">Valor atual</p>
              <p className="font-medium">{formatCurrency(currentValue)}</p>
            </div>
          )}
        </div>
        
        {rentAmount && rentAmount > 0 && (
          <div className="mt-4">
            <p className="text-xs text-muted-foreground">Aluguel mensal</p>
            <p className="font-medium text-income">{formatCurrency(rentAmount)}</p>
          </div>
        )}
        
        {roi !== undefined && roi > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1 text-income" />
                  <span className="text-sm font-medium">ROI: {roi.toFixed(2)}%</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Retorno sobre o investimento anualizado</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {valueGrowth !== 0 && (
          <div className="mt-2 flex items-center">
            <span className={cn(
              "text-xs font-medium",
              valueGrowth > 0 ? "text-income" : "text-expense"
            )}>
              {valueGrowth > 0 ? '↑' : '↓'} {Math.abs(valueGrowth).toFixed(2)}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">valorização</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleViewIncomes}
            className="h-8 w-8 text-income"
            title="Ver receitas"
          >
            <Receipt className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleViewExpenses}
            className="h-8 w-8 text-expense"
            title="Ver despesas"
          >
            <Wallet className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleViewAnalytics}
            className="h-8 w-8"
            title="Ver análises"
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit && onEdit(id)}
          >
            Editar
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-destructive"
            onClick={() => onDelete && onDelete(id)}
          >
            Excluir
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
