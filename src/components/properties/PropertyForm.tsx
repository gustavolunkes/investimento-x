
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Check, ChevronsUpDown, Home, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  registrationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { 
    message: 'Formato de data inválido. Use AAAA-MM-DD' 
  }),
  registrationValue: z.string().refine(value => !isNaN(Number(value)) && Number(value) > 0, {
    message: 'O valor da matrícula deve ser um número positivo',
  }),
  acquisitionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { 
    message: 'Formato de data inválido. Use AAAA-MM-DD' 
  }),
  purchaseValue: z.string().refine(value => !isNaN(Number(value)) && Number(value) > 0, {
    message: 'O valor de compra deve ser um número positivo',
  }),
  currentValue: z.string().refine(value => !isNaN(Number(value)) && Number(value) >= 0, {
    message: 'O valor atual deve ser um número positivo',
  }).optional(),
  street: z.string().min(3, { message: 'Rua deve ter pelo menos 3 caracteres' }),
  number: z.string().min(1, { message: 'Número é obrigatório' }),
  city: z.string().min(2, { message: 'Cidade é obrigatória' }),
  state: z.string().min(2, { message: 'Estado é obrigatório' }),
  zipCode: z.string().min(5, { message: 'CEP é obrigatório' }),
  size: z.string().refine(value => !isNaN(Number(value)) && Number(value) > 0, {
    message: 'O tamanho deve ser um número positivo',
  }),
  bedrooms: z.string().refine(value => !isNaN(Number(value)) && Number(value) >= 0, {
    message: 'O número de quartos deve ser um número não negativo',
  }),
  bathrooms: z.string().refine(value => !isNaN(Number(value)) && Number(value) >= 0, {
    message: 'O número de banheiros deve ser um número não negativo',
  }),
  valuationResponsible: z.string().optional(),
  valuationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { 
    message: 'Formato de data inválido. Use AAAA-MM-DD' 
  }).optional(),
  valuationDescription: z.string().optional(),
  valuationValue: z.string().refine(value => value === '' || (!isNaN(Number(value)) && Number(value) >= 0), {
    message: 'O valor da avaliação deve ser um número não negativo',
  }).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const brazilianStates = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
];

interface PropertyFormProps {
  initialData?: Partial<FormValues>;
  onSubmit: (data: FormValues) => void;
  isSubmitting?: boolean;
}

const PropertyForm = ({
  initialData,
  onSubmit,
  isSubmitting = false,
}: PropertyFormProps) => {
  const today = new Date().toISOString().split('T')[0];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      registrationDate: initialData?.registrationDate || today,
      registrationValue: initialData?.registrationValue || '',
      acquisitionDate: initialData?.acquisitionDate || today,
      purchaseValue: initialData?.purchaseValue || '',
      currentValue: initialData?.currentValue || '',
      street: initialData?.street || '',
      number: initialData?.number || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      zipCode: initialData?.zipCode || '',
      size: initialData?.size || '',
      bedrooms: initialData?.bedrooms || '',
      bathrooms: initialData?.bathrooms || '',
      valuationResponsible: initialData?.valuationResponsible || '',
      valuationDate: initialData?.valuationDate || today,
      valuationDescription: initialData?.valuationDescription || '',
      valuationValue: initialData?.valuationValue || '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Home className="mr-2 h-5 w-5" />
                Informações Básicas
              </h3>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Imóvel</FormLabel>
                      <FormControl>
                        <Input placeholder="Apartamento Centro" {...field} />
                      </FormControl>
                      <FormDescription>
                        Um nome para identificar seu imóvel
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="registrationDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data da Matrícula</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} max={today} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="registrationValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor da Matrícula (R$)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="acquisitionDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Aquisição</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} max={today} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="purchaseValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor de Compra (R$)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="currentValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Atual Estimado (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormDescription>
                        Estimativa do valor atual de mercado
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Localização e Características
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rua</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome da rua" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número</FormLabel>
                        <FormControl>
                          <Input placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input placeholder="São Paulo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? brazilianStates.find(
                                      (state) => state.value === field.value
                                    )?.label
                                  : "Selecione um estado"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Buscar estado..." />
                              <CommandEmpty>Nenhum estado encontrado.</CommandEmpty>
                              <CommandGroup>
                                {brazilianStates.map((state) => (
                                  <CommandItem
                                    key={state.value}
                                    value={state.value}
                                    onSelect={() => {
                                      form.setValue("state", state.value);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        state.value === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {state.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input placeholder="00000-000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Área (m²)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quartos</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bathrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banheiros</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Avaliação</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="valuationResponsible"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsável pela Avaliação</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do responsável" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="valuationDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data da Avaliação</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} max={today} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="valuationDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição da Avaliação</FormLabel>
                    <FormControl>
                      <Input placeholder="Detalhes da avaliação" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="valuationValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor da Avaliação (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pt-4">
                <Button variant="outline" type="button" className="w-full flex items-center justify-center gap-2">
                  Anexar Documento de Avaliação
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button">
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar Imóvel"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PropertyForm;
