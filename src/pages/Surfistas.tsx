
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import Sidebar from '@/components/dashboard/Sidebar';
import DataTable from '@/components/dashboard/DataTable';
import SurfistasFilters from '@/components/dashboard/SurfistasFilters';
import SurfistaDetailSheet from '@/components/dashboard/SurfistaDetailSheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Waves, Download, UserCheck, Clock, AlertCircle, Camera } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Tipo para surfistas
type Surfista = {
  id: string;
  nome_surfista: string;
  data_nascimento: string;
  telefone_surfista: string;
  tamanho_camiseta_surfista: string;
  escola_serie_ano: string;
  status_inscricao: string;
  tipo_pagamento: string;
  status_pagamento: string;
  foto_url: string;
  comprovante_url: string;
  // ... outros campos
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
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);

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

  // Dados para exibir (filtrados ou todos)
  const dataToDisplay = filteredData.length > 0 || dadosProcessados?.length === 0 ? filteredData : dadosProcessados || [];
  
  // Função para exportar
  const handleExport = (format: 'csv' | 'pdf') => {
    toast({
      title: `Exportando em formato ${format.toUpperCase()}`,
      description: "Arquivo sendo gerado para download",
    });
  };
  
  // Função para criar link do WhatsApp
  const formatWhatsAppLink = (numero: string) => {
    const numeros = numero.replace(/\D/g, '');
    return `https://wa.me/${numeros}`;
  };

  // Função para abrir detalhes do surfista
  const handleViewDetails = (surfista: Surfista) => {
    setSelectedSurfista(surfista);
    setDetailSheetOpen(true);
  };

  // Função para obter badge do status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmado':
        return <Badge className="bg-green-100 text-green-800">Confirmado</Badge>;
      case 'pendente':
        return <Badge variant="secondary">Pendente</Badge>;
      case 'lista_espera':
        return <Badge variant="outline">Lista de Espera</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'pago':
        return <Badge className="bg-green-100 text-green-800">Pago</Badge>;
      case 'pendente':
        return <Badge variant="secondary">Pendente</Badge>;
      case 'nao_pago':
        return <Badge variant="destructive">Não Pago</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Estatísticas
  const stats = {
    total: dataToDisplay.length,
    confirmados: dataToDisplay.filter(s => s.status_inscricao === 'confirmado').length,
    pendentes: dataToDisplay.filter(s => s.status_inscricao === 'pendente').length,
    listaEspera: dataToDisplay.filter(s => s.status_inscricao === 'lista_espera').length,
    comFoto: dataToDisplay.filter(s => s.foto_url).length,
    pagamentoPendente: dataToDisplay.filter(s => s.status_pagamento === 'pendente' || s.status_pagamento === 'nao_pago').length,
  };

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
                <span className="font-medium">Total: {stats.total} surfistas</span>
              </div>
              <Button onClick={() => handleExport('pdf')} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>

          {/* Cards de Estatísticas */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Confirmados</CardTitle>
                <UserCheck className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.confirmados}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pendentes}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lista de Espera</CardTitle>
                <AlertCircle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.listaEspera}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Com Foto</CardTitle>
                <Camera className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.comFoto}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((stats.comFoto / stats.total) * 100) || 0}% do total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pagamento Pendente</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.pagamentoPendente}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Média de Idade</CardTitle>
                <Waves className="h-4 w-4 text-ocean-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-ocean-600">
                  {Math.round(dataToDisplay.reduce((acc, curr) => acc + curr.idade, 0) / (dataToDisplay.length || 1)) || 0}
                </div>
                <p className="text-xs text-muted-foreground">anos</p>
              </CardContent>
            </Card>
          </div>

          {/* Filtros */}
          {!isLoading && surfistas && (
            <SurfistasFilters 
              data={dadosProcessados}
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
                title="Lista de Surfistas"
                data={dataToDisplay}
                columns={[
                  { accessor: 'nome_surfista', header: 'Nome' },
                  { accessor: 'idade', header: 'Idade' },
                  { 
                    accessor: 'status_inscricao', 
                    header: 'Status',
                    cell: (value) => getStatusBadge(value)
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
                    accessor: 'status_pagamento', 
                    header: 'Pagamento',
                    cell: (value) => getPaymentStatusBadge(value)
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
                onView={handleViewDetails}
                onExport={handleExport}
                onDelete={handleDelete}
              />
            )}
          </div>

          {/* Sheet de Detalhes */}
          <SurfistaDetailSheet
            surfista={selectedSurfista}
            isOpen={detailSheetOpen}
            onOpenChange={setDetailSheetOpen}
            onUpdate={() => {
              refetch();
              // Atualizar dados filtrados se necessário
              if (filteredData.length > 0) {
                const updatedFiltered = filteredData.map(item => 
                  item.id === selectedSurfista?.id ? { ...selectedSurfista, ...item } : item
                );
                setFilteredData(updatedFiltered);
              }
            }}
          />
        </main>
      </div>
    </div>
  );
};

export default Surfistas;
