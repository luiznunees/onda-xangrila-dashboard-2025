
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import Sidebar from '@/components/dashboard/Sidebar';
import StatsCard from '@/components/dashboard/StatsCard';
import DataTable from '@/components/dashboard/DataTable';
import { Users, Calendar, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Tipo para equipe de apoio
type Apoio = {
  id: string;
  nome: string;
  whatsapp: string;
  tem_instagram: boolean;
  arroba_instagram: string | null;
  data_nascimento: string;
  nome_responsavel: string | null;
  telefone_responsavel: string | null;
  toma_medicamento_continuo: boolean;
  medicamento_qual: string | null;
  ja_fez_onda: boolean;
  onda_onde: string | null;
  onda_numero: number | null;
  tamanho_camiseta: string;
  equipe_trabalho: string;
  created_at: string;
  updated_at: string;
};

// Função para calcular a idade a partir da data de nascimento
const calcularIdade = (dataNascimento: string): number => {
  const hoje = new Date();
  const dataNasc = new Date(dataNascimento);
  let idade = hoje.getFullYear() - dataNasc.getFullYear();
  const m = hoje.getMonth() - dataNasc.getMonth();
  
  if (m < 0 || (m === 0 && hoje.getDate() < dataNasc.getDate())) {
    idade--;
  }
  
  return idade;
};

const Apoio = () => {
  const { toast } = useToast();
  
  const fetchApoio = async () => {
    try {
      const { data, error } = await supabase
        .from('fichas_apoio')
        .select('*')
        .order('nome', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar equipe de apoio:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar a equipe de apoio.",
        variant: "destructive"
      });
      return [];
    }
  };

  // Buscar dados com React Query
  const { data: equipeApoio, isLoading, refetch } = useQuery({
    queryKey: ['apoio'],
    queryFn: fetchApoio
  });
  
  // Processar dados para exibição
  const dadosProcessados = equipeApoio?.map(pessoa => ({
    ...pessoa,
    idade: calcularIdade(pessoa.data_nascimento),
  })) || [];
  
  // Função para excluir membro da equipe de apoio
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('fichas_apoio')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Recarregar os dados após exclusão
      refetch();
    } catch (error) {
      console.error('Erro ao excluir membro da equipe de apoio:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o membro da equipe de apoio.",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  // Função para exportar
  const handleExport = (format: 'csv' | 'pdf') => {
    toast({
      title: `Exportando em formato ${format.toUpperCase()}`,
      description: "Arquivo sendo gerado para download",
    });
    // Implementar a exportação real posteriormente
  };
  
  // Função para criar link do WhatsApp
  const formatWhatsAppLink = (numero: string) => {
    // Remove caracteres não numéricos
    const numeros = numero.replace(/\D/g, '');
    return `https://wa.me/${numeros}`;
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="container py-6">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Equipe de Apoio</h1>
          
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <StatsCard 
              title="Total na Equipe de Apoio" 
              value={equipeApoio?.length || 0}
              icon={<Users className="h-4 w-4" />}
              description="Pessoas envolvidas na organização"
            />
            <StatsCard 
              title="Média de Idade" 
              value={Math.round(dadosProcessados.reduce((acc, curr) => acc + curr.idade, 0) / (dadosProcessados.length || 1))}
              icon={<Calendar className="h-4 w-4" />}
              description="Idade média dos membros de apoio"
            />
            <StatsCard 
              title="Equipes de Trabalho" 
              value={new Set(dadosProcessados.map(item => item.equipe_trabalho)).size}
              icon={<Users className="h-4 w-4" />}
              description="Total de equipes diferentes"
            />
          </div>
          
          <div className="mb-6">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <p>Carregando dados...</p>
              </div>
            ) : (
              <DataTable 
                title="Lista da Equipe de Apoio"
                data={dadosProcessados}
                columns={[
                  { accessor: 'nome', header: 'Nome' },
                  { accessor: 'idade', header: 'Idade' },
                  { 
                    accessor: 'whatsapp', 
                    header: 'WhatsApp',
                    cell: (value) => (
                      <div className="flex items-center">
                        <span className="mr-2">{value}</span>
                        {value && (
                          <a 
                            href={formatWhatsAppLink(value)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-1 rounded-full bg-green-100 hover:bg-green-200 transition-colors"
                          >
                            <svg className="w-4 h-4 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                              <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    )
                  },
                  { 
                    accessor: 'equipe_trabalho', 
                    header: 'Equipe',
                    cell: (value) => (
                      <Badge className="bg-ocean-100 text-ocean-800">
                        {value}
                      </Badge>
                    )
                  },
                  { 
                    accessor: 'tamanho_camiseta', 
                    header: 'Camiseta',
                    cell: (value) => (
                      <Badge variant="outline">
                        {value}
                      </Badge>
                    )
                  }
                ]}
                detailFields={[
                  { label: 'Nome', accessor: 'nome' },
                  { label: 'Data de Nascimento', accessor: 'data_nascimento', 
                    render: (value) => value ? new Date(value).toLocaleDateString('pt-BR') : '-' },
                  { label: 'Idade', accessor: 'idade' },
                  { label: 'WhatsApp', accessor: 'whatsapp' },
                  { label: 'Instagram', accessor: 'arroba_instagram',
                    render: (value, row) => row.tem_instagram ? value : 'Não possui' },
                  { label: 'Equipe de Trabalho', accessor: 'equipe_trabalho' },
                  { label: 'Tamanho da Camiseta', accessor: 'tamanho_camiseta' },
                  { label: 'Já fez Onda', accessor: 'ja_fez_onda',
                    render: (value, row) => value ? `Sim (${row.onda_onde} ${row.onda_numero})` : 'Não' },
                  { label: 'Toma Medicamento', accessor: 'toma_medicamento_continuo',
                    render: (value, row) => value ? `Sim (${row.medicamento_qual})` : 'Não' },
                  { label: 'Nome do Responsável', accessor: 'nome_responsavel' },
                  { label: 'Telefone do Responsável', accessor: 'telefone_responsavel' },
                  { label: 'Cadastrado em', accessor: 'created_at',
                    render: (value) => value ? new Date(value).toLocaleDateString('pt-BR') : '-' }
                ]}
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

export default Apoio;
