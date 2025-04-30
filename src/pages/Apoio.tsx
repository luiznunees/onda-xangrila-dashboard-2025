
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import Sidebar from '@/components/dashboard/Sidebar';
import DataChart from '@/components/dashboard/DataChart';
import DataTable from '@/components/dashboard/DataTable';
import StatsCard from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, Check, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

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
  const [filtroEquipe, setFiltroEquipe] = useState<string | null>(null);
  
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
  const { data: equipeApoio, isLoading } = useQuery({
    queryKey: ['apoio'],
    queryFn: fetchApoio
  });
  
  // Processar dados para exibição
  const dadosProcessados = equipeApoio?.map(pessoa => ({
    ...pessoa,
    idade: calcularIdade(pessoa.data_nascimento),
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
  
  // Dados para o gráfico de faixa etária
  const getDistribuicaoPorFaixaEtaria = () => {
    if (!dadosProcessados.length) return [];
    
    const faixas = {
      'Até 18': 0,
      '19-25': 0,
      '26-35': 0,
      '36-45': 0,
      '46+': 0,
    };
    
    dadosProcessados.forEach(pessoa => {
      const idade = pessoa.idade;
      if (idade <= 18) faixas['Até 18']++;
      else if (idade <= 25) faixas['19-25']++;
      else if (idade <= 35) faixas['26-35']++;
      else if (idade <= 45) faixas['36-45']++;
      else faixas['46+']++;
    });
    
    return Object.entries(faixas).map(([name, value]) => ({ name, value }));
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
              value={equipes.length}
              icon={<Users className="h-4 w-4" />}
              description="Total de equipes diferentes"
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
              title="Distribuição por Faixa Etária"
              data={getDistribuicaoPorFaixaEtaria()}
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
                    accessor: 'tamanho_camiseta', 
                    header: 'Camiseta',
                    cell: (value) => (
                      <Badge variant="outline">
                        {value}
                      </Badge>
                    )
                  },
                  { 
                    accessor: 'ja_fez_onda', 
                    header: 'Já fez Onda',
                    cell: (value, row) => value ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        <Check className="mr-1 h-3 w-3" /> Sim {row.onda_numero ? `(${row.onda_numero})` : ''}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-orange-500">
                        Não
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

export default Apoio;
