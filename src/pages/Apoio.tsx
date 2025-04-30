
import Sidebar from '@/components/dashboard/Sidebar';
import DataChart from '@/components/dashboard/DataChart';
import DataTable from '@/components/dashboard/DataTable';
import { Button } from '@/components/ui/button';
import { Download, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Dados de exemplo
const apoioData = [
  { id: 1, nome: 'Mariana Costa', funcao: 'recepção', disponibilidade: 'Sexta - Domingo' },
  { id: 2, nome: 'Roberto Silva', funcao: 'alimentação', disponibilidade: 'Sábado - Domingo' },
  { id: 3, nome: 'Júlio Santos', funcao: 'limpeza', disponibilidade: 'Sexta - Domingo' },
  { id: 4, nome: 'Carla Oliveira', funcao: 'organização', disponibilidade: 'Sexta - Sábado' },
  { id: 5, nome: 'Adriana Lima', funcao: 'recepção', disponibilidade: 'Domingo' },
  { id: 6, nome: 'Fernando Alves', funcao: 'alimentação', disponibilidade: 'Sexta - Domingo' },
  { id: 7, nome: 'Patrícia Mendes', funcao: 'limpeza', disponibilidade: 'Sábado' },
  { id: 8, nome: 'Ricardo Gomes', funcao: 'organização', disponibilidade: 'Sexta - Domingo' },
];

// Dados para o gráfico
const distribuicaoFuncoes = [
  { name: 'Recepção', value: 8 },
  { name: 'Alimentação', value: 10 },
  { name: 'Limpeza', value: 6 },
  { name: 'Organização', value: 6 },
];

const distribuicaoDias = [
  { name: 'Sexta', value: 25 },
  { name: 'Sábado', value: 28 },
  { name: 'Domingo', value: 22 },
];

const Apoio = () => {
  // Função para exportar
  const handleExport = (format: 'csv' | 'pdf') => {
    alert(`Exportando lista de apoio em formato ${format}`);
    // Implementação real da exportação seria feita aqui
  };
  
  // Estilizar os badges de função
  const getBadgeStyle = (funcao: string) => {
    switch (funcao) {
      case 'recepção':
        return 'bg-ocean-100 text-ocean-800';
      case 'alimentação':
        return 'bg-sand-100 text-sand-800';
      case 'limpeza':
        return 'bg-blue-100 text-blue-800';
      case 'organização':
        return 'bg-purple-100 text-purple-800';
      default:
        return '';
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="container py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Equipe de Apoio</h1>
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
                <CardTitle>Visão Geral da Equipe de Apoio</CardTitle>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-sand-600" />
                  <span className="font-medium">Total: 30 pessoas</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <DataChart 
                  type="pie" 
                  title="Distribuição por Função" 
                  data={distribuicaoFuncoes} 
                  colors={['#0ea5e9', '#eab308', '#3b82f6', '#8b5cf6']}
                />
                <DataChart 
                  type="bar" 
                  title="Disponibilidade por Dia" 
                  data={distribuicaoDias}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="mb-6">
            <DataTable 
              title="Lista da Equipe de Apoio"
              data={apoioData}
              columns={[
                { accessor: 'nome', header: 'Nome' },
                { 
                  accessor: 'funcao', 
                  header: 'Função',
                  cell: (value) => (
                    <Badge className={getBadgeStyle(value)}>
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </Badge>
                  )
                },
                { accessor: 'disponibilidade', header: 'Disponibilidade' },
              ]}
              onExport={handleExport}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Apoio;
