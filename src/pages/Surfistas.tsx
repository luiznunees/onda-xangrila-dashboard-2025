
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import Sidebar from '@/components/dashboard/Sidebar';
import DataChart from '@/components/dashboard/DataChart';
import DataTable from '@/components/dashboard/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Check, Waves, Filter, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

// Tipo para surfistas
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
  const [filtros, setFiltros] = useState({
    nivel: [] as string[],
    genero: [] as string[],
    pagamento: [] as string[],
    interesses: [] as string[],
  });

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
  const { data: surfistas, isLoading } = useQuery({
    queryKey: ['surfistas'],
    queryFn: fetchSurfistas
  });
  
  // Função para atualizar filtros
  const updateFiltro = (categoria: keyof typeof filtros, valor: string) => {
    setFiltros(prev => {
      const atualizado = [...prev[categoria]];
      if (atualizado.includes(valor)) {
        return { 
          ...prev, 
          [categoria]: atualizado.filter(item => item !== valor)
        };
      } else {
        return {
          ...prev,
          [categoria]: [...atualizado, valor]
        };
      }
    });
  };

  // Dados processados para exibição
  const dadosProcessados = surfistas?.map(surfista => ({
    ...surfista,
    idade: calcularIdade(surfista.data_nascimento),
  })) || [];
  
  // Gráficos
  const getFaixaEtaria = () => {
    if (!dadosProcessados.length) return [];
    
    const faixas = {
      'Até 10': 0,
      '11-14': 0,
      '15-17': 0,
      '18+': 0
    };
    
    dadosProcessados.forEach(surfista => {
      const idade = surfista.idade;
      if (idade <= 10) faixas['Até 10']++;
      else if (idade <= 14) faixas['11-14']++;
      else if (idade <= 17) faixas['15-17']++;
      else faixas['18+']++;
    });
    
    return Object.entries(faixas).map(([name, value]) => ({ name, value }));
  };
  
  const getComunhaoCrisma = () => {
    if (!dadosProcessados.length) return [];
    
    const ambos = dadosProcessados.filter(s => s.fez_primeira_comunhao && s.fez_crisma).length;
    const soComunhao = dadosProcessados.filter(s => s.fez_primeira_comunhao && !s.fez_crisma).length;
    const soCrisma = dadosProcessados.filter(s => !s.fez_primeira_comunhao && s.fez_crisma).length;
    const nenhum = dadosProcessados.filter(s => !s.fez_primeira_comunhao && !s.fez_crisma).length;
    
    return [
      { name: 'Ambos', value: ambos },
      { name: 'Só Comunhão', value: soComunhao },
      { name: 'Só Crisma', value: soCrisma },
      { name: 'Nenhum', value: nenhum }
    ];
  };
  
  const getInteresses = () => {
    if (!dadosProcessados.length) return [];
    
    const tocaInstrumento = dadosProcessados.filter(s => s.toca_instrumento).length;
    const temAlergia = dadosProcessados.filter(s => s.tem_alergia).length;
    const tomaMedicamento = dadosProcessados.filter(s => s.toma_medicamento_continuo).length;
    const temFobia = dadosProcessados.filter(s => s.tem_fobia).length;
    
    return [
      { name: 'Toca Instrumento', value: tocaInstrumento },
      { name: 'Tem Alergia', value: temAlergia },
      { name: 'Toma Medicamento', value: tomaMedicamento },
      { name: 'Tem Fobia', value: temFobia }
    ];
  };
  
  // Opções de filtro para o dropdown
  const FiltersComponent = (
    <>
      <DropdownMenuItem className="flex flex-col items-start">
        <h4 className="font-semibold mb-1">Toca Instrumento</h4>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="filter-instrumento-sim"
              checked={filtros.interesses.includes('instrumento-sim')}
              onCheckedChange={() => updateFiltro('interesses', 'instrumento-sim')}
            />
            <Label htmlFor="filter-instrumento-sim">Sim</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="filter-instrumento-nao"
              checked={filtros.interesses.includes('instrumento-nao')}
              onCheckedChange={() => updateFiltro('interesses', 'instrumento-nao')}
            />
            <Label htmlFor="filter-instrumento-nao">Não</Label>
          </div>
        </div>
      </DropdownMenuItem>
      <DropdownMenuItem className="flex flex-col items-start mt-2">
        <h4 className="font-semibold mb-1">Comunhão e Crisma</h4>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="filter-comunhao"
              checked={filtros.interesses.includes('comunhao')}
              onCheckedChange={() => updateFiltro('interesses', 'comunhao')}
            />
            <Label htmlFor="filter-comunhao">Fez Comunhão</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="filter-crisma"
              checked={filtros.interesses.includes('crisma')}
              onCheckedChange={() => updateFiltro('interesses', 'crisma')}
            />
            <Label htmlFor="filter-crisma">Fez Crisma</Label>
          </div>
        </div>
      </DropdownMenuItem>
      <DropdownMenuItem className="flex justify-end pt-2 border-t mt-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setFiltros({
            nivel: [],
            genero: [],
            pagamento: [],
            interesses: [],
          })}
        >
          Limpar Filtros
        </Button>
      </DropdownMenuItem>
    </>
  );
  
  // Aplicar filtros
  const dadosFiltrados = dadosProcessados.filter(surfista => {
    // Filtrar por interesses
    if (filtros.interesses.includes('instrumento-sim') && !surfista.toca_instrumento) return false;
    if (filtros.interesses.includes('instrumento-nao') && surfista.toca_instrumento) return false;
    if (filtros.interesses.includes('comunhao') && !surfista.fez_primeira_comunhao) return false;
    if (filtros.interesses.includes('crisma') && !surfista.fez_crisma) return false;
    
    return true;
  });
  
  // Função para exportar
  const handleExport = (format: 'csv' | 'pdf') => {
    toast({
      title: `Exportando em formato ${format.toUpperCase()}`,
      description: "Arquivo sendo gerado para download",
    });
    // Implementação real da exportação seria feita aqui
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="container py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Surfistas</h1>
            <div className="flex items-center space-x-3">
              <Button onClick={() => handleExport('pdf')} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar PDF
              </Button>
              <Button onClick={() => handleExport('csv')} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar CSV
              </Button>
            </div>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Visão Geral de Surfistas</CardTitle>
                <div className="flex items-center space-x-2">
                  <Waves className="h-5 w-5 text-ocean-600" />
                  <span className="font-medium">Total: {surfistas?.length || 0} surfistas</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="idade">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="idade">Idade</TabsTrigger>
                  <TabsTrigger value="comunhao-crisma">Comunhão/Crisma</TabsTrigger>
                  <TabsTrigger value="interesses">Interesses</TabsTrigger>
                </TabsList>
                
                <TabsContent value="idade">
                  <DataChart 
                    type="bar" 
                    title="" 
                    data={getFaixaEtaria()} 
                    colors={['#38bdf8', '#0ea5e9', '#0369a1', '#075985']}
                  />
                </TabsContent>
                
                <TabsContent value="comunhao-crisma">
                  <DataChart 
                    type="pie" 
                    title="" 
                    data={getComunhaoCrisma()} 
                    colors={['#10b981', '#0369a1', '#f472b6', '#f97316']}
                  />
                </TabsContent>
                
                <TabsContent value="interesses">
                  <DataChart 
                    type="bar" 
                    title="" 
                    data={getInteresses()}
                    colors={['#38bdf8', '#f97316', '#10b981', '#f43f5e']}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <div className="mb-6">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <p>Carregando dados...</p>
              </div>
            ) : (
              <DataTable 
                title="Lista de Surfistas"
                data={dadosFiltrados}
                columns={[
                  { accessor: 'nome_surfista', header: 'Nome' },
                  { accessor: 'idade', header: 'Idade' },
                  { 
                    accessor: 'tamanho_camiseta_surfista', 
                    header: 'Camiseta',
                    cell: (value) => (
                      <Badge variant="outline" className="bg-ocean-50 text-ocean-800">
                        {value}
                      </Badge>
                    )
                  },
                  { 
                    accessor: 'escola_serie_ano', 
                    header: 'Escola/Série',
                  },
                  { 
                    accessor: 'fez_primeira_comunhao', 
                    header: 'Comunhão',
                    cell: (value) => value ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        <Check className="mr-1 h-3 w-3" /> Sim
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-orange-500">
                        Não
                      </Badge>
                    )
                  },
                  { 
                    accessor: 'fez_crisma', 
                    header: 'Crisma',
                    cell: (value) => value ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        <Check className="mr-1 h-3 w-3" /> Sim
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-orange-500">
                        Não
                      </Badge>
                    )
                  },
                ]}
                filters={FiltersComponent}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Surfistas;
