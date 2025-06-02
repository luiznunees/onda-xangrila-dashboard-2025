
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import Sidebar from '@/components/dashboard/Sidebar';
import DataTable from '@/components/dashboard/DataTable';
import SurfistasFilters from '@/components/dashboard/SurfistasFilters';
import SurfistaDetailModal from '@/components/dashboard/SurfistaDetailModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Waves, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Tipo para surfistas com novos campos
type Surfista = {
  id: string;
  nome_surfista: string;
  data_nascimento: string;
  tem_instagram: boolean;
  arroba_instagram: string | null;
  escola_serie_ano: string;
  tamanho_camiseta_surfista: string;
  toca_instrumento: boolean;
  instrumento_qual: string | null;
  tem_irmaos: boolean;
  quantidade_irmaos: number | null;
  toma_medicamento_continuo: boolean;
  medicamento_qual: string | null;
  tem_alergia: boolean;
  alergia_qual: string | null;
  tem_fobia: boolean;
  fobia_qual: string | null;
  fez_crisma: boolean;
  fez_primeira_comunhao: boolean;
  telefone_surfista: string;
  endereco_completo_surfista: string;
  nome_pai: string;
  telefone_pai: string;
  nome_mae: string;
  telefone_mae: string;
  rg_cpf_surfista: string | null;
  informacao_adicional_surfista: string | null;
  status_inscricao: string | null;
  tipo_pagamento: string | null;
  status_pagamento: string | null;
  comprovante_url: string | null;
  foto_url: string | null;
  created_at: string;
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

const Surfistas = () => {
  const { toast } = useToast();
  const [filteredData, setFilteredData] = useState<Surfista[]>([]);
  const [selectedSurfista, setSelectedSurfista] = useState<Surfista | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const fetchSurfistas = async () => {
    try {
      const { data, error } = await supabase
        .from('fichas_surfistas')
        .select('*')
        .order('nome_surfista', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar surfistas:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os surfistas.",
        variant: "destructive"
      });
      return [];
    }
  };

  // Buscar dados com React Query
  const { data: surfistas, isLoading, refetch } = useQuery({
    queryKey: ['surfistas'],
    queryFn: fetchSurfistas
  });

  // Função para excluir surfista
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('fichas_surfistas')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Recarregar os dados após exclusão
      refetch();
    } catch (error) {
      console.error('Erro ao excluir surfista:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o surfista.",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  // Dados processados para exibição
  const dadosProcessados = surfistas?.map(surfista => ({
    ...surfista,
    idade: calcularIdade(surfista.data_nascimento),
  })) || [];
  
  // Função para exportar
  const handleExport = (format: 'csv' | 'pdf') => {
    toast({
      title: `Exportando em formato ${format.toUpperCase()}`,
      description: "Arquivo sendo gerado para download",
    });
    // Implementação real da exportação seria feita aqui
  };
  
  // Função para criar link do WhatsApp
  const formatWhatsAppLink = (numero: string) => {
    // Remove caracteres não numéricos
    const numeros = numero.replace(/\D/g, '');
    return `https://wa.me/${numeros}`;
  };

  // Função para exibir badge de status
  const getStatusBadge = (status: string, type: 'inscricao' | 'pagamento') => {
    const statusConfig = {
      inscricao: {
        'pendente': { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
        'confirmado': { label: 'Confirmado', color: 'bg-green-100 text-green-800' },
        'lista_espera': { label: 'Lista de Espera', color: 'bg-orange-100 text-orange-800' }
      },
      pagamento: {
        'nao_pago': { label: 'Não Pago', color: 'bg-red-100 text-red-800' },
        'pendente': { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
        'pago': { label: 'Pago', color: 'bg-green-100 text-green-800' }
      }
    };

    const config = statusConfig[type][status as keyof typeof statusConfig[typeof type]];
    return config ? (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    ) : <span>-</span>;
  };

  const handleViewDetails = (row: any) => {
    setSelectedSurfista(row);
    setIsDetailModalOpen(true);
  };

  const dataToDisplay = filteredData.length > 0 ? filteredData : dadosProcessados;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="container py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Surfistas</h1>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Waves className="h-5 w-5 text-ocean-600" />
                <span className="font-medium">Total: {dataToDisplay?.length || 0} surfistas</span>
              </div>
              <Button onClick={() => handleExport('pdf')} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>

          {/* Filtros */}
          <SurfistasFilters 
            data={dadosProcessados}
            onFilteredDataChange={setFilteredData}
          />
          
          <div className="mb-6">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <p>Carregando dados...</p>
              </div>
            ) : (
              <DataTable 
                title="Lista de Surfistas"
                data={dataToDisplay}
                columns={[
                  { accessor: 'nome_surfista', header: 'Nome' },
                  { accessor: 'idade', header: 'Idade' },
                  { 
                    accessor: 'status_inscricao', 
                    header: 'Status Inscrição',
                    cell: (value) => getStatusBadge(value || 'pendente', 'inscricao')
                  },
                  { 
                    accessor: 'status_pagamento', 
                    header: 'Status Pagamento',
                    cell: (value) => getStatusBadge(value || 'nao_pago', 'pagamento')
                  },
                  { 
                    accessor: 'telefone_surfista', 
                    header: 'WhatsApp',
                    cell: (value, row) => (
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
                    accessor: 'tamanho_camiseta_surfista', 
                    header: 'Camiseta',
                    cell: (value) => (
                      <Badge variant="outline" className="bg-ocean-50 text-ocean-800">
                        {value}
                      </Badge>
                    )
                  },
                ]}
                onDelete={handleDelete}
                onViewDetails={handleViewDetails}
              />
            )}
          </div>

          {/* Modal de detalhes */}
          <SurfistaDetailModal
            surfista={selectedSurfista}
            isOpen={isDetailModalOpen}
            onClose={() => {
              setIsDetailModalOpen(false);
              setSelectedSurfista(null);
            }}
            onUpdate={() => {
              refetch();
              // Atualizar os dados filtrados também
              const updated = dadosProcessados.map(s => 
                s.id === selectedSurfista?.id ? { ...selectedSurfista, ...s } : s
              );
              setFilteredData(updated.filter(s => filteredData.find(f => f.id === s.id)));
            }}
          />
        </main>
      </div>
    </div>
  );
};

export default Surfistas;
