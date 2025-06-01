
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Sidebar from "@/components/dashboard/Sidebar";
import StatsCard from "@/components/dashboard/StatsCard";
import DataTable from "@/components/dashboard/DataTable";
import ConfirmadosFilters from "@/components/dashboard/ConfirmadosFilters";
import { UserPlus, TrendingUp, UserCheck } from "lucide-react";

// Tipo para confirmados
type Confirmado = {
  id: string;
  nome_completo: string;
  idade: number;
  cidade: string;
  bairro: string;
  nome_responsavel: string;
  telefone_responsavel: string;
  Status: string;
  created_at: string;
};

const Confirmados = () => {
  const { toast } = useToast();
  const [filteredData, setFilteredData] = useState<Confirmado[]>([]);
  
  const fetchConfirmados = async () => {
    try {
      const { data, error } = await supabase
        .from('confirmados')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar confirmados:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os confirmados.",
        variant: "destructive"
      });
      return [];
    }
  };
  
  // Buscar dados com React Query
  const { data: confirmados, isLoading, refetch } = useQuery({
    queryKey: ['confirmados'],
    queryFn: fetchConfirmados
  });

  // Dados para exibir (filtrados ou todos)
  const dataToDisplay = filteredData.length > 0 || confirmados?.length === 0 ? filteredData : confirmados || [];
  
  // Função para exclusão
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('confirmados')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Recarregar os dados após exclusão
      refetch();
    } catch (error) {
      console.error('Erro ao excluir confirmado:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o confirmado.",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  // Função para exportação
  const handleExport = (format: 'csv' | 'pdf') => {
    console.log(`Exportando em formato ${format.toUpperCase()} via DataTable`);
  };

  // Definição dos campos de detalhe para o DataTable
  const detailFields = [
    { label: "Nome Completo", accessor: "nome_completo" },
    { label: "Idade", accessor: "idade" },
    { label: "Cidade", accessor: "cidade" },
    { label: "Bairro", accessor: "bairro" },
    { label: "Nome do Responsável", accessor: "nome_responsavel" },
    { label: "Telefone do Responsável", accessor: "telefone_responsavel" },
    { label: "Status", accessor: "Status" },
    { 
      label: "Data de Confirmação", 
      accessor: "created_at",
      render: (value: string) => new Date(value).toLocaleDateString('pt-BR')
    }
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="container py-6">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Confirmados</h1>
          
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <StatsCard 
              title="Total de Confirmados" 
              value={confirmados?.length || 0}
              icon={<UserPlus className="h-4 w-4" />}
              description="Todas as pessoas confirmadas no retiro"
            />
            <StatsCard 
              title="Média de Idade" 
              value={Math.round(dataToDisplay.reduce((acc, curr) => acc + curr.idade, 0) / (dataToDisplay.length || 1)) || 0}
              icon={<TrendingUp className="h-4 w-4" />}
              description="Média de idade dos confirmados filtrados"
            />
            <StatsCard 
              title="Cidades Diferentes" 
              value={new Set(dataToDisplay.map(item => item.cidade)).size || 0}
              icon={<UserCheck className="h-4 w-4" />}
              description="Número de cidades representadas"
            />
          </div>

          {!isLoading && confirmados && (
            <ConfirmadosFilters 
              data={confirmados}
              onFilteredDataChange={setFilteredData}
            />
          )}
          
          <div className="mb-6">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <p>Carregando dados...</p>
              </div>
            ) : (
              <DataTable 
                title={`Lista de Confirmados (${dataToDisplay.length} registros)`}
                data={dataToDisplay}
                columns={[
                  { accessor: 'nome_completo', header: 'Nome' },
                  { accessor: 'idade', header: 'Idade' },
                  { accessor: 'cidade', header: 'Cidade' },
                  { accessor: 'telefone_responsavel', header: 'Telefone' },
                  { accessor: 'Status', header: 'Status' },
                  { 
                    accessor: 'created_at', 
                    header: 'Data de Confirmação',
                    cell: (value: string) => new Date(value).toLocaleDateString('pt-BR')
                  }
                ]}
                detailFields={detailFields}
                onExport={handleExport}
                onDelete={handleDelete}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Confirmados;
