
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import Sidebar from '@/components/dashboard/Sidebar';
import DataChart from '@/components/dashboard/DataChart';
import DataTable from '@/components/dashboard/DataTable';
import StatsCard from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, LifeBuoy, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

// Tipo para marujos
type Marujo = {
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
  onda_onde: string;
  onda_numero: number;
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

const Marujos = () => {
  const { toast } = useToast();
  const [filtroEquipe, setFiltroEquipe] = useState<string | null>(null);
  
  const fetchMarujos = async () => {
    try {
      const { data, error } = await supabase
        .from('fichas_marujos')
        .select('*')
        .order('nome', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar marujos:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os marujos.",
        variant: "destructive"
      });
      return [];
    }
  };

  // Buscar dados com React Query
  const { data: marujos, isLoading } = useQuery({
    queryKey: ['marujos'],
    queryFn: fetchMarujos
  });
  
  // Processar dados para exibição
  const dadosProcessados = marujos?.map(marujo => ({
    ...marujo,
    idade: calcularIdade(marujo.data_nascimento),
  })) || [];
  
  // Filtro para a tabela
  const dadosFiltrados = filtroEquipe 
    ? dadosProcessados.filter(item => item.equipe_trabalho === filtroEquipe)
    : dadosProcessados;
  
  // Obter lista de equipes de trabalho únicas
  const equipes = [...new Set(dadosProcessados.map(item => item.equipe_trabalho))];
  
  // Função para exportar
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
      <DropdownMenuItem onClick={() => setFiltroEquipe(null)}>
        Todas as equipes
      </DropdownMenuItem>
      {equipes.map(equipe => (
        <DropdownMenuItem key={equipe} onClick={() => setFiltroEquipe(equipe)}>
          Equipe: {equipe}
        </DropdownMenuItem>
      ))}
      <DropdownMenuItem className="flex justify-end pt-2 border-t mt-2">
        <Badge variant="outline" onClick={() => setFiltroEquipe(null)} className="cursor-pointer">
          Limpar filtro
        </Badge>
      </DropdownMenuItem>
    </>
  );
  
  // Dados para o gráfico de distribuição por equipe
  const getDistribuicaoPorEquipe = () => {
    if (!dadosProcessados.length) return [];
    
    const equipesCount = new Map<string, number>();
    
    dadosProcessados.forEach((pessoa) => {
      equipesCount.set(pessoa.equipe_trabalho, (equipesCount.get(pessoa.equipe_trabalho) || 0) + 1);
    });
    
    return Array.from(equipesCount.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };
  
  // Dados para o gráfico de onda de origem
  const getDistribuicaoPorOnda = () => {
    if (!dadosProcessados.length) return [];
    
    const ondasCount = new Map<string, number>();
    
    dadosProcessados.forEach((pessoa) => {
      const ondaLabel = `${pessoa.onda_onde} ${pessoa.onda_numero}`;
      ondasCount.set(ondaLabel, (ondasCount.get(ondaLabel) || 0) + 1);
    });
    
    return Array.from(ondasCount.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="container py-6">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Marujos</h1>
          
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <StatsCard 
              title="Total de Marujos" 
              value={marujos?.length || 0}
              icon={<LifeBuoy className="h-4 w-4" />}
              description="Participantes com experiência"
            />
            <StatsCard 
              title="Média de Idade" 
              value={Math.round(dadosProcessados.reduce((acc, curr) => acc + curr.idade, 0) / (dadosProcessados.length || 1))}
              icon={<Calendar className="h-4 w-4" />}
              description="Idade média dos marujos"
            />
            <StatsCard 
              title="Equipes Diferentes" 
              value={equipes.length}
              icon={<Users className="h-4 w-4" />}
              description="Total de equipes de marujos"
            />
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <DataChart 
              type="pie"
              title="Distribuição por Equipe de Trabalho"
              data={getDistribuicaoPorEquipe()}
              colors={['#0369a1', '#38bdf8', '#14b8a6', '#f97316', '#f43f5e', '#8b5cf6']}
            />
            
            <DataChart 
              type="bar"
              title="Distribuição por Onda de Origem"
              data={getDistribuicaoPorOnda()}
              colors={['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#f43f5e']}
            />
          </div>
          
          <div className="mb-6">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <p>Carregando dados...</p>
              </div>
            ) : (
              <DataTable 
                title="Lista de Marujos"
                data={dadosFiltrados}
                columns={[
                  { accessor: 'nome', header: 'Nome' },
                  { accessor: 'idade', header: 'Idade' },
                  { accessor: 'whatsapp', header: 'WhatsApp' },
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
                    accessor: 'onda_onde', 
                    header: 'Onda',
                    cell: (value, row) => (
                      <Badge variant="outline" className="bg-sunset-50 text-sunset-800">
                        {value} {row.onda_numero}
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
                  },
                ]}
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

export default Marujos;
