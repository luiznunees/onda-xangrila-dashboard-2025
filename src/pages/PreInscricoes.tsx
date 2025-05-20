import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Sidebar from "@/components/dashboard/Sidebar";
import StatsCard from "@/components/dashboard/StatsCard";
import DataTable from "@/components/dashboard/DataTable";
import { UserPlus, TrendingUp, UserCheck } from "lucide-react";

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
  const { data: preInscricoes, isLoading, refetch } = useQuery({
    queryKey: ['preInscricoes'],
    queryFn: fetchPreInscricoes
  });
  
  // Função para exclusão
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pre_inscricoes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Recarregar os dados após exclusão
      refetch();
    } catch (error) {
      console.error('Erro ao excluir pré-inscrição:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a pré-inscrição.",
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
          
          <div className="mb-6">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <p>Carregando dados...</p>
              </div>
            ) : (
              <DataTable 
                title="Lista de Pré-Inscrições"
                data={preInscricoes || []}
                columns={[
                  { accessor: 'nome_completo', header: 'Nome' },
                  { accessor: 'idade', header: 'Idade' },
                  { accessor: 'cidade', header: 'Cidade' },
                  { accessor: 'telefone_responsavel', header: 'Telefone' },
                  { 
                    accessor: 'created_at', 
                    header: 'Data de Inscrição',
                    cell: (value) => new Date(value).toLocaleDateString('pt-BR')
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

export default PreInscricoes;
