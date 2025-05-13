import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Home, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CommandList } from "cmdk";
import { CityAttributes } from "@/service/route/city/city";
import { Api } from "@/service/api";
import { PropertiesDTOAttributes } from "@/service/route/properties/properties";

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  registrationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Formato de data inválido. Use AAAA-MM-DD",
  }),
  registrationValue: z
    .string()
    .refine((value) => !isNaN(Number(value)) && Number(value) > 0, {
      message: "O valor da matrícula deve ser um número positivo",
    }),
  acquisitionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Formato de data inválido. Use AAAA-MM-DD",
  }),
  purchaseValue: z
    .string()
    .refine((value) => !isNaN(Number(value)) && Number(value) > 0, {
      message: "O valor de compra deve ser um número positivo",
    }),
  currentValue: z
    .string()
    .refine((value) => !isNaN(Number(value)) && Number(value) >= 0, {
      message: "O valor atual deve ser um número positivo",
    })
    .optional(),
  street: z
    .string()
    .min(3, { message: "Rua deve ter pelo menos 3 caracteres" }),
  number: z.string().min(1, { message: "Número é obrigatório" }),
  city: z.string().min(2, { message: "Cidade é obrigatória" }),
  state: z.string().min(2, { message: "Estado é obrigatório" }),
  zipCode: z.string().min(5, { message: "CEP é obrigatório" }),
  size: z
    .string()
    .refine((value) => !isNaN(Number(value)) && Number(value) > 0, {
      message: "O tamanho deve ser um número positivo",
    }),
  bedrooms: z
    .string()
    .refine((value) => !isNaN(Number(value)) && Number(value) >= 0, {
      message: "O número de quartos deve ser um número não negativo",
    }),
  bathrooms: z
    .string()
    .refine((value) => !isNaN(Number(value)) && Number(value) >= 0, {
      message: "O número de banheiros deve ser um número não negativo",
    }),
  valuationResponsible: z.string().optional(),
  valuationDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Formato de data inválido. Use AAAA-MM-DD",
    })
    .optional(),
  valuationDescription: z.string().optional(),
  valuationValue: z
    .string()
    .refine(
      (value) => value === "" || (!isNaN(Number(value)) && Number(value) >= 0),
      {
        message: "O valor da avaliação deve ser um número não negativo",
      }
    )
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

const brazilianStates = [
  { id: 1, value: "AC", label: "Acre" },
  { id: 2, value: "AL", label: "Alagoas" },
  { id: 3, value: "AP", label: "Amapá" },
  { id: 4, value: "AM", label: "Amazonas" },
  { id: 5, value: "BA", label: "Bahia" },
  { id: 6, value: "CE", label: "Ceará" },
  { id: 7, value: "DF", label: "Distrito Federal" },
  { id: 8, value: "ES", label: "Espírito Santo" },
  { id: 9, value: "GO", label: "Goiás" },
  { id: 10, value: "MA", label: "Maranhão" },
  { id: 11, value: "MT", label: "Mato Grosso" },
  { id: 12, value: "MS", label: "Mato Grosso do Sul" },
  { id: 13, value: "MG", label: "Minas Gerais" },
  { id: 14, value: "PA", label: "Pará" },
  { id: 15, value: "PB", label: "Paraíba" },
  { id: 16, value: "PR", label: "Paraná" },
  { id: 17, value: "PE", label: "Pernambuco" },
  { id: 18, value: "PI", label: "Piauí" },
  { id: 19, value: "RJ", label: "Rio de Janeiro" },
  { id: 20, value: "RN", label: "Rio Grande do Norte" },
  { id: 21, value: "RS", label: "Rio Grande do Sul" },
  { id: 22, value: "RO", label: "Rondônia" },
  { id: 23, value: "RR", label: "Roraima" },
  { id: 24, value: "SC", label: "Santa Catarina" },
  { id: 25, value: "SP", label: "São Paulo" },
  { id: 26, value: "SE", label: "Sergipe" },
  { id: 27, value: "TO", label: "Tocantins" },
];

interface PropertyFormProps {
  initialData?: Partial<FormValues>;
  onSubmit: (propertieDto: PropertiesDTOAttributes) => void;
  isSubmitting?: boolean;
}

const PropertyForm = ({
  initialData,
  onSubmit,
  isSubmitting = false,
}: PropertyFormProps) => {
  const api = new Api();
  const today = new Date().toISOString().split("T")[0];
  const [propertieDTO, setPropertieDTO] = useState<PropertiesDTOAttributes>(
    {} as PropertiesDTOAttributes
  );
  const updateDTO = (field: keyof PropertiesDTOAttributes, value: any) => {
    setPropertieDTO((prev) => ({ ...prev, [field]: value }));
  };
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      registrationDate: initialData?.registrationDate || today,
      registrationValue: initialData?.registrationValue || "",
      acquisitionDate: initialData?.acquisitionDate || today,
      purchaseValue: initialData?.purchaseValue || "",
      currentValue: initialData?.currentValue || "",
      street: initialData?.street || "",
      number: initialData?.number || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      zipCode: initialData?.zipCode || "",
      size: initialData?.size || "",
      valuationResponsible: initialData?.valuationResponsible || "",
      valuationDate: initialData?.valuationDate || today,
      valuationDescription: initialData?.valuationDescription || "",
      valuationValue: initialData?.valuationValue || "",
    },
  });

  const [city, setCity] = useState<CityAttributes[]>([]);

  async function handleCity(id: Number) {
    const response = await api.city.getByState(id);
    setCity(response);
  }

  return (
    <Form {...form}>
      <form onSubmit={() => onSubmit(propertieDTO)} className="space-y-8">
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
                        <Input
                          placeholder="Apartamento Centro"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            updateDTO("nomeImovel", e.target.value);
                          }}
                        />
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
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              updateDTO("valueRegistration", e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                          <Input
                            placeholder="Nome da rua"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              updateDTO("street", e.target.value);
                            }}
                          />
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
                          <Input
                            placeholder="123"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              updateDTO("number", e.target.value);
                            }}
                          />
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
                                  ? city.find(
                                      (city) => city.nome === field.value
                                    )?.nome
                                  : "Selecione uma cidade"}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Buscar estado..." />
                              <CommandEmpty>
                                Nenhuma cidade encontrada.
                              </CommandEmpty>
                              <CommandList className="max-h-48 overflow-y-auto">
                                <CommandGroup>
                                  {city.map((city) => (
                                    <CommandItem
                                      key={city.nome}
                                      value={city.nome}
                                      onSelect={() => {
                                        form.setValue("city", city.nome);
                                        updateDTO("cityId", city.id);
                                      }}
                                    >
                                      {city.nome}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
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
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Buscar estado..." />
                              <CommandEmpty>
                                Nenhum estado encontrado.
                              </CommandEmpty>
                              <CommandList className="max-h-48 overflow-y-auto">
                                <CommandGroup>
                                  {brazilianStates.map((state) => (
                                    <CommandItem
                                      key={state.value}
                                      value={state.value}
                                      onSelect={() => {
                                        form.setValue("state", state.value);
                                        handleCity(state.id);
                                      }}
                                    >
                                      {state.label}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
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
                        <Input
                          placeholder="00000-000"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            updateDTO("cep", e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                        <Input
                          type="date"
                          {...field}
                          max={today}
                          onChange={(e) => {
                            field.onChange(e);
                            updateDTO("dateValue", e.target.value);
                          }}
                        />
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
                <Button
                  variant="outline"
                  type="button"
                  className="w-full flex items-center justify-center gap-2"
                >
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
