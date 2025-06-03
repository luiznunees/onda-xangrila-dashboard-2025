
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, Download, Loader2 } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import DataTable from "@/components/dashboard/DataTable";
import SurfistasFilters from "@/components/dashboard/SurfistasFilters";
import SurfistaDetailModal from "@/components/dashboard/SurfistaDetailModal";
import { Badge } from "@/components/ui/badge";
import StatusSelect from "@/components/dashboard/StatusSelect";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Interface local que corresponde exatamente aos dados do Supabase
interface SurfistaData {
  id: string;
  nome_surfista: string;
  idade: number;
  escola_serie_ano: string;
  tamanho_camiseta_surfista: string;
  status_inscricao?: string;
  status_pagamento?: string;
  tipo_pagamento?: string;
  created_at: string;
  updated_at?: string;
  // Todos os outros campos do Supabase
  alergia?: string;
  arroba_instagram?: string;
  comprovante_url?: string;
  data_nascimento?: string;
  endereco_completo_surfista?: string;
  foto_url?: string;
  instagram_responsavel?: string;
  medicacao?: string;
  nome_mae?: string;
  nome_pai?: string;
  nome_responsavel?: string;
  observacoes?: string;
  possui_alergia?: boolean;
  possui_medicacao?: boolean;
  qualidade_surfista?: string;
  tamanho_camiseta_responsavel?: string;
  telefone_responsavel?: string;
  tem_instagram?: boolean;
  toca_instrumento?: boolean;
  instrumento_qual?: string;
  tem_irmaos?: boolean;
  irmaos_nomes?: string;
  ja_participou?: boolean;
  anos_participacao?: string;
  como_conheceu?: string;
  expectativas?: string;
}

const Surfistas = () => {
  const [filteredData, setFilteredData] = useState<SurfistaData[]>([]);
  const [selectedSurfista, setSelectedSurfista] = useState<SurfistaData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: surfistas = [], isLoading, error } = useQuery({
    queryKey: ['surfistas'],
    queryFn: async () => {
      console.log('Fetching surfistas...');
      const { data, error } = await supabase
        .from('fichas_surfistas')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching surfistas:', error);
        throw error;
      }
      
      console.log('Surfistas fetched:', data);
      return data as SurfistaData[];
    },
  });

  const updateSurfistaMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SurfistaData> }) => {
      const { data, error } = await supabase
        .from('fichas_surfistas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surfistas'] });
      toast({
        title: "Sucesso",
        description: "Status atualizado com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error updating surfista:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status. Tente novamente.",
        variant: "destructive"
      });
    },
  });

  const handleStatusChange = (id: string, field: string, value: string) => {
    updateSurfistaMutation.mutate({ 
      id, 
      updates: { [field]: value }
    });
  };

  const handleViewDetails = (surfista: SurfistaData) => {
    setSelectedSurfista(surfista);
    setIsModalOpen(true);
  };

  const handleFilteredDataChange = (newFilteredData: SurfistaData[]) => {
    setFilteredData(newFilteredData);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Relatório de Surfistas - Onda Xangri-lá 2025', 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 32);
    doc.text(`Total de registros: ${filteredData.length}`, 14, 38);

    const tableData = filteredData.map(item => [
      item.nome_surfista || '',
      item.idade?.toString() || '',
      item.escola_serie_ano || '',
      item.tamanho_camiseta_surfista || '',
      getStatusLabel(item.status_inscricao || 'pendente'),
      getStatusLabel(item.status_pagamento || 'nao_pago'),
      new Date(item.created_at).toLocaleDateString('pt-BR')
    ]);

    autoTable(doc, {
      head: [['Nome', 'Idade', 'Escola/Série', 'Camiseta', 'Status Inscrição', 'Status Pagamento', 'Data']],
      body: tableData,
      startY: 45,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save(`surfistas-${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({
      title: "PDF Exportado",
      description: "Relatório exportado com sucesso!",
    });
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      'pendente': 'Pendente',
      'confirmado': 'Confirmado',
      'lista_espera': 'Lista de Espera',
      'nao_pago': 'Não Pago',
      'pago': 'Pago'
    };
    return statusMap[status] || status;
  };

  // Definir colunas para a tabela
  const columns = [
    {
      accessorKey: 'nome_surfista',
      header: 'Nome do Surfista',
    },
    {
      accessorKey: 'idade',
      header: 'Idade',
    },
    {
      accessorKey: 'escola_serie_ano',
      header: 'Escola/Série',
    },
    {
      accessorKey: 'tamanho_camiseta_surfista',
      header: 'Camiseta',
    },
    {
      accessorKey: 'status_inscricao',
      header: 'Status Inscrição',
      cell: ({ row }: { row: { original: SurfistaData } }) => (
        <StatusSelect
          value={row.original.status_inscricao || 'pendente'}
          onValueChange={(value) => handleStatusChange(row.original.id, 'status_inscricao', value)}
          type="inscricao"
        />
      ),
    },
    {
      accessorKey: 'status_pagamento',
      header: 'Status Pagamento',
      cell: ({ row }: { row: { original: SurfistaData } }) => (
        <StatusSelect
          value={row.original.status_pagamento || 'nao_pago'}
          onValueChange={(value) => handleStatusChange(row.original.id, 'status_pagamento', value)}
          type="pagamento"
        />
      ),
    },
    {
      accessorKey: 'tipo_pagamento',
      header: 'Tipo Pagamento',
      cell: ({ row }: { row: { original: SurfistaData } }) => {
        const tipo = row.original.tipo_pagamento;
        if (!tipo) return <span className="text-muted-foreground">-</span>;
        return (
          <Badge variant="outline">
            {tipo === 'pix' ? 'PIX' : 'Dinheiro'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Data da Inscrição',
      cell: ({ row }: { row: { original: SurfistaData } }) => 
        new Date(row.original.created_at).toLocaleDateString('pt-BR'),
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }: { row: { original: SurfistaData } }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleViewDetails(row.original)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  useEffect(() => {
    if (surfistas.length > 0) {
      setFilteredData(surfistas);
    }
  }, [surfistas]);

  if (error) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <main className="container py-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600">Erro ao carregar dados</h1>
              <p className="text-muted-foreground mt-2">
                Ocorreu um erro ao buscar os dados dos surfistas.
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="container py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Surfistas</h1>
              <p className="text-muted-foreground">
                Gerencie as fichas dos surfistas inscritos
              </p>
            </div>
            <Button onClick={exportToPDF} className="gap-2">
              <Download className="h-4 w-4" />
              Exportar PDF
            </Button>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {filteredData.filter(s => s.status_inscricao === 'confirmado').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Confirmados</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {filteredData.filter(s => s.status_inscricao === 'pendente').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {filteredData.filter(s => s.status_inscricao === 'lista_espera').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Lista de Espera</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{filteredData.length}</div>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <SurfistasFilters 
            data={surfistas} 
            onFilteredDataChange={handleFilteredDataChange}
          />

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Carregando surfistas...</span>
            </div>
          ) : (
            <DataTable 
              data={filteredData} 
              columns={columns} 
            />
          )}

          <SurfistaDetailModal
            surfista={selectedSurfista}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedSurfista(null);
            }}
            onUpdate={() => {
              queryClient.invalidateQueries({ queryKey: ['surfistas'] });
            }}
          />
        </main>
      </div>
    </div>
  );
};

export default Surfistas;
