import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Sidebar from "@/components/dashboard/Sidebar";
import DataChart from "@/components/dashboard/DataChart";
import DataTable from "@/components/dashboard/DataTable";
import StatsCard from "@/components/dashboard/StatsCard";
import { UserPlus, TrendingUp, UserCheck, Check, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

// Tipo para pré-inscrições
type PreInscricao = {
  id: string;
  nome_completo: string;
  idade: number;
  cidade: string;
  bairro: string;
  nome_responsavel: string;
  telefone_responsavel: string;
  created_at: string;
};

const PreInscricoes = () => {
  const { toast } = useToast();
  const [filtroInteresse, setFiltroInteresse] = useState<string | null>(null);
  
  const fetchPreInscricoes = async () => {
    try {
      const { data, error } = await supabase
        .from('pre_inscricoes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar pré-inscrições:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as pré-inscrições.",
        variant: "destructive"
      });
      return [];
    }
  };
  
  // Buscar dados com React Query
  const { data: preInscricoes, isLoading } = useQuery({
    queryKey: ['preInscricoes'],
    queryFn: fetchPreInscricoes
  });
  
  // Dados para o gráfico de tendência por mês
  const getTendenciaPorMes = () => {
    if (!preInscricoes) return [];
    
    const inscricoesPorMes = new Map<string, number>();
    
    preInscricoes.forEach((inscricao) => {
      // Extrair mês e ano da data de criação
      const data = new Date(inscricao.created_at);
      const mesAno = `${data.getMonth() + 1}/${data.getFullYear().toString().substr(-2)}`;
      
      inscricoesPorMes.set(mesAno, (inscricoesPorMes.get(mesAno) || 0) + 1);
    });
    
    // Ordenar por mês
    return Array.from(inscricoesPorMes.entries())
      .sort((a, b) => {
        const [mesA, anoA] = a[0].split('/');
        const [mesB, anoB] = b[0].split('/');
        return anoA === anoB ? parseInt(mesA) - parseInt(mesB) : anoA.localeCompare(anoB);
      })
      .map(([name, inscricoes]) => ({ name, inscricoes }));
  };
  
  // Dados para o gráfico de distribuição por cidade
  const getDistribuicaoPorCidade = () => {
    if (!preInscricoes) return [];
    
    const cidadesCount = new Map<string, number>();
    
    preInscricoes.forEach((inscricao) => {
      cidadesCount.set(inscricao.cidade, (cidadesCount.get(inscricao.cidade) || 0) + 1);
    });
    
    return Array.from(cidadesCount.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };
  
  // Função para exportação
  const handleExport = (format: 'csv' | 'pdf') => {
    toast({
      title: `Exportando em formato ${format.toUpperCase()}`,
      description: "Arquivo sendo gerado para download",
    });
    // Implementar a exportação real posteriormente
  };
  
  // Componente de filtros para a tabela
  const FiltersComponent = (
    <>
      <DropdownMenuItem onClick={() => setFiltroInteresse(null)}>
        Todas as cidades
      </DropdownMenuItem>
      {getDistribuicaoPorCidade().slice(0, 5).map(cidade => (
        <DropdownMenuItem key={cidade.name} onClick={() => setFiltroInteresse(cidade.name)}>
          Somente {cidade.name}
        </DropdownMenuItem>
      ))}
    </>
  );

  // Filtro para a tabela
  const filteredData = filtroInteresse 
    ? preInscricoes?.filter(item => item.cidade === filtroInteresse)
    : preInscricoes;

  // Definição dos campos de detalhe para o DataTable
  const detailFields = [
    { label: "Nome Completo", accessor: "nome_completo" },
    { label: "Idade", accessor: "idade" },
    { label: "Cidade", accessor: "cidade" },
    { label: "Bairro", accessor: "bairro" },
    { label: "Nome do Responsável", accessor: "nome_responsavel" },
    { label: "Telefone do Responsável", accessor: "telefone_responsavel" },
    { 
      label: "Data de Inscrição", 
      accessor: "created_at",
      render: (value) => new Date(value).toLocaleDateString('pt-BR')
    }
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="container py-6">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Pré-Inscrições</h1>
          
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <StatsCard 
              title="Total de Pré-Inscrições" 
              value={preInscricoes?.length || 0}
              icon={<UserPlus className="h-4 w-4" />}
              description="Todas as pessoas interessadas no retiro"
            />
            <StatsCard 
              title="Média de Idade" 
              value={Math.round(preInscricoes?.reduce((acc, curr) => acc + curr.idade, 0) / (preInscricoes?.length || 1)) || 0}
              icon={<TrendingUp className="h-4 w-4" />}
              description="Média de idade dos pré-inscritos"
            />
            <StatsCard 
              title="Cidades Diferentes" 
              value={new Set(preInscricoes?.map(item => item.cidade)).size || 0}
              icon={<UserCheck className="h-4 w-4" />}
              description="Número de cidades representadas"
            />
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <DataChart 
              type="line"
              title="Tendência de Pré-Inscrições"
              data={getTendenciaPorMes()}
              dataKey="inscricoes"
              nameKey="name"
            />
            
            <DataChart 
              type="pie"
              title="Distribuição por Cidade"
              data={getDistribuicaoPorCidade()}
              colors={['#0369a1', '#38bdf8', '#f97316', '#14b8a6', '#f43f5e']}
            />
          </div>
          
          <div className="mb-6">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <p>Carregando dados...</p>
              </div>
            ) : (
              <DataTable 
                title="Lista de Pré-Inscrições"
                data={filteredData || []}
                columns={[
                  { accessor: 'nome_completo', header: 'Nome', isCompact: true },
                  { accessor: 'idade', header: 'Idade', isCompact: true },
                  { accessor: 'cidade', header: 'Cidade', isCompact: true },
                  { accessor: 'telefone_responsavel', header: 'Telefone', isCompact: true },
                  { 
                    accessor: 'created_at', 
                    header: 'Data de Inscrição',
                    cell: (value) => new Date(value).toLocaleDateString('pt-BR'),
                    isCompact: true
                  }
                ]}
                detailFields={detailFields}
                onExport={handleExport}
                filters={FiltersComponent}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PreInscricoes;
