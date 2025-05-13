import { useState, useEffect } from "react";
import { Plus, Search, List } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import PropertyCard from "@/components/properties/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PropertyForm from "@/components/properties/PropertyForm";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Api } from "@/service/api";
import {
  PropertiesAttributes,
  PropertiesDTOAttributes,
} from "@/service/route/properties/properties";

const Properties = () => {
  const api = new Api();

  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"list">("list");
  const [properties, setProperties] = useState<PropertiesAttributes[]>();
  const [editingProperty, setEditingProperty] =
    useState<PropertiesAttributes | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const { toast } = useToast();
  useEffect(() => {
    async function getProperties() {
      const response = await api.propertie.getByUser("4545d4rere");
      setProperties(response);
    }
    getProperties();
  }, []);

  const handleEdit = (id: Number) => {
    const property = properties.find((p) => p.id_imovel === id);
    if (property) {
      setEditingProperty(property);
      setOpenDialog(true);
    }
  };

  const handleDelete = (id: Number) => {
    if (window.confirm("Tem certeza que deseja excluir este imóvel?")) {
      setProperties(properties.filter((p) => p.id_imovel !== id));
      api.propertie.delete(id);
      toast({
        title: "Imóvel excluído",
        description: "O imóvel foi removido com sucesso.",
      });
    }
  };

  async function handleFormSubmit(propertieDTO: PropertiesDTOAttributes) {
    setLoading(true);

    setTimeout(() => {
      console.log(propertieDTO);
      api.propertie
        .create(propertieDTO)
        .then((response) => {
          setProperties([...properties, response]);
        })
        .catch((error) => {
          toast({
            title: "Erro ao adicionar imovel:" + error,
            description: "Tente novamento",
          });
        });

      toast({
        title: "Imóvel adicionado",
        description: "O novo imóvel foi adicionado com sucesso.",
      });

      setLoading(false);
      setOpenDialog(false);
      setEditingProperty(null);
    }, 1000);
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Meus Imóveis</h1>
          //{" "}
          <Button
            onClick={() => {
              setEditingProperty(null);
              setOpenDialog(true);
            }}
            className="flex items-center gap-2"
          >
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
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList>
                <TabsTrigger value="all">Todos</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center border rounded-md">
              <Button
                variant={view === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setView("list")}
                className="rounded-md"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className={"flex flex-col gap-4"}>
          {properties?.map((property) => (
            <PropertyCard
              key={property.nome_imovel}
              imovel={property}
              layout={view}
              onDelete={handleDelete}
            />
          ))}
          {properties?.length === 0 && (
            <div className="col-span-full text-center p-12 bg-muted rounded-lg">
              <p className="text-muted-foreground">Nenhum imóvel encontrado</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProperty ? "Editar Imóvel" : "Adicionar Novo Imóvel"}
            </DialogTitle>
            <DialogDescription>
              Preencha os detalhes do seu imóvel. Todos os campos marcados com *
              são obrigatórios.
            </DialogDescription>
          </DialogHeader>
          <PropertyForm
            onSubmit={handleFormSubmit}
            isSubmitting={loading}
            initialData={undefined}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Properties;
