
import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DataChart from '@/components/dashboard/DataChart';
import DataTable from '@/components/dashboard/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Check, Surf, Filter, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

// Dados de exemplo
const surfistasData = [
  { 
    id: 1, 
    nome: 'Carolina Silva', 
    idade: 25, 
    genero: 'Feminino', 
    nivel: 'intermediário', 
    pagamento: 'pago',
    interesses: ['aulas-extras', 'fotografia']
  },
  { 
    id: 2, 
    nome: 'Marcos Santos', 
    idade: 32, 
    genero: 'Masculino', 
    nivel: 'avançado', 
    pagamento: 'pago',
    interesses: ['yoga', 'fotografia']
  },
  { 
    id: 3, 
    nome: 'Júlia Lima', 
    idade: 18, 
    genero: 'Feminino', 
    nivel: 'iniciante', 
    pagamento: 'pendente',
    interesses: ['aulas-extras']
  },
  { 
    id: 4, 
    nome: 'André Oliveira', 
    idade: 28, 
    genero: 'Masculino', 
    nivel: 'intermediário', 
    pagamento: 'pago',
    interesses: ['fotografia', 'meditação']
  },
  { 
    id: 5, 
    nome: 'Fernanda Costa', 
    idade: 22, 
    genero: 'Feminino', 
    nivel: 'iniciante', 
    pagamento: 'pendente',
    interesses: ['yoga', 'aulas-extras']
  },
  { 
    id: 6, 
    nome: 'Pedro Alves', 
    idade: 35, 
    genero: 'Masculino', 
    nivel: 'avançado', 
    pagamento: 'pago',
    interesses: ['fotografia', 'competição']
  },
  { 
    id: 7, 
    nome: 'Beatriz Mendes', 
    idade: 27, 
    genero: 'Feminino', 
    nivel: 'intermediário', 
    pagamento: 'pendente',
    interesses: ['yoga', 'meditação']
  },
  { 
    id: 8, 
    nome: 'Lucas Souza', 
    idade: 30, 
    genero: 'Masculino', 
    nivel: 'intermediário', 
    pagamento: 'pago',
    interesses: ['aulas-extras', 'competição']
  },
];

// Dados para gráficos
const nivelData = [
  { name: 'Iniciante', value: 25 },
  { name: 'Intermediário', value: 40 },
  { name: 'Avançado', value: 15 },
];

const generoData = [
  { name: 'Feminino', value: 35 },
  { name: 'Masculino', value: 45 },
];

const idadeData = [
  { name: 'Até 18', value: 10 },
  { name: '19-25', value: 25 },
  { name: '26-35', value: 30 },
  { name: '36+', value: 15 },
];

const pagamentoData = [
  { name: 'Pago', value: 60 },
  { name: 'Pendente', value: 20 },
];

const interessesData = [
  { name: 'Aulas Extras', value: 40 },
  { name: 'Fotografia', value: 35 },
  { name: 'Yoga', value: 25 },
  { name: 'Meditação', value: 20 },
  { name: 'Competição', value: 15 },
];

const Surfistas = () => {
  const [filtros, setFiltros] = useState({
    nivel: [] as string[],
    genero: [] as string[],
    pagamento: [] as string[],
    interesses: [] as string[],
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
  
  // Aplicar filtros aos dados
  const dadosFiltrados = surfistasData.filter(surfista => {
    // Se não há filtros para uma categoria, não filtra por ela
    const filtroPorNivel = filtros.nivel.length === 0 || filtros.nivel.includes(surfista.nivel);
    const filtroPorGenero = filtros.genero.length === 0 || filtros.genero.includes(surfista.genero);
    const filtroPorPagamento = filtros.pagamento.length === 0 || filtros.pagamento.includes(surfista.pagamento);
    const filtroPorInteresses = filtros.interesses.length === 0 || 
      filtros.interesses.some(interesse => surfista.interesses.includes(interesse));
    
    return filtroPorNivel && filtroPorGenero && filtroPorPagamento && filtroPorInteresses;
  });
  
  // Opções de filtro para o dropdown
  const FiltersComponent = (
    <>
      <DropdownMenuItem className="flex flex-col items-start">
        <h4 className="font-semibold mb-1">Nível</h4>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="filter-nivel-iniciante"
              checked={filtros.nivel.includes('iniciante')}
              onCheckedChange={() => updateFiltro('nivel', 'iniciante')}
            />
            <Label htmlFor="filter-nivel-iniciante">Iniciante</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="filter-nivel-intermediario"
              checked={filtros.nivel.includes('intermediário')}
              onCheckedChange={() => updateFiltro('nivel', 'intermediário')}
            />
            <Label htmlFor="filter-nivel-intermediario">Intermediário</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="filter-nivel-avancado"
              checked={filtros.nivel.includes('avançado')}
              onCheckedChange={() => updateFiltro('nivel', 'avançado')}
            />
            <Label htmlFor="filter-nivel-avancado">Avançado</Label>
          </div>
        </div>
      </DropdownMenuItem>
      <DropdownMenuItem className="flex flex-col items-start mt-2">
        <h4 className="font-semibold mb-1">Pagamento</h4>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="filter-pagamento-pago"
              checked={filtros.pagamento.includes('pago')}
              onCheckedChange={() => updateFiltro('pagamento', 'pago')}
            />
            <Label htmlFor="filter-pagamento-pago">Pago</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="filter-pagamento-pendente"
              checked={filtros.pagamento.includes('pendente')}
              onCheckedChange={() => updateFiltro('pagamento', 'pendente')}
            />
            <Label htmlFor="filter-pagamento-pendente">Pendente</Label>
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
  
  // Função para exportar
  const handleExport = (format: 'csv' | 'pdf') => {
    alert(`Exportando lista de surfistas em formato ${format}`);
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
                  <Surf className="h-5 w-5 text-ocean-600" />
                  <span className="font-medium">Total: 80 surfistas</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="nivel">
                <TabsList className="grid grid-cols-5 mb-6">
                  <TabsTrigger value="nivel">Nível</TabsTrigger>
                  <TabsTrigger value="genero">Gênero</TabsTrigger>
                  <TabsTrigger value="idade">Idade</TabsTrigger>
                  <TabsTrigger value="pagamento">Pagamento</TabsTrigger>
                  <TabsTrigger value="interesses">Interesses</TabsTrigger>
                </TabsList>
                
                <TabsContent value="nivel">
                  <DataChart 
                    type="pie" 
                    title="" 
                    data={nivelData} 
                    colors={['#38bdf8', '#0ea5e9', '#0369a1']}
                  />
                </TabsContent>
                
                <TabsContent value="genero">
                  <DataChart 
                    type="pie" 
                    title="" 
                    data={generoData} 
                    colors={['#f472b6', '#0369a1']}
                  />
                </TabsContent>
                
                <TabsContent value="idade">
                  <DataChart 
                    type="bar" 
                    title="" 
                    data={idadeData}
                  />
                </TabsContent>
                
                <TabsContent value="pagamento">
                  <DataChart 
                    type="pie" 
                    title="" 
                    data={pagamentoData} 
                    colors={['#10b981', '#f97316']}
                  />
                </TabsContent>
                
                <TabsContent value="interesses">
                  <DataChart 
                    type="bar" 
                    title="" 
                    data={interessesData}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <div className="mb-6">
            <DataTable 
              title="Lista de Surfistas"
              data={dadosFiltrados}
              columns={[
                { accessor: 'nome', header: 'Nome' },
                { accessor: 'idade', header: 'Idade' },
                { accessor: 'genero', header: 'Gênero' },
                { 
                  accessor: 'nivel', 
                  header: 'Nível',
                  cell: (value) => {
                    let cor = '';
                    if (value === 'iniciante') cor = 'bg-ocean-200 text-ocean-800';
                    if (value === 'intermediário') cor = 'bg-ocean-500 text-white';
                    if (value === 'avançado') cor = 'bg-ocean-800 text-white';
                    
                    return (
                      <Badge variant="outline" className={cor}>
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                      </Badge>
                    );
                  }
                },
                { 
                  accessor: 'pagamento', 
                  header: 'Pagamento',
                  cell: (value) => {
                    return value === 'pago' ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        <Check className="mr-1 h-3 w-3" /> Pago
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-orange-500">
                        Pendente
                      </Badge>
                    );
                  }
                },
                { 
                  accessor: 'interesses', 
                  header: 'Interesses',
                  cell: (value) => (
                    <div className="flex flex-wrap gap-1">
                      {value.map((interesse: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {interesse.replace('-', ' ')}
                        </Badge>
                      ))}
                    </div>
                  )
                },
              ]}
              filters={FiltersComponent}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Surfistas;
