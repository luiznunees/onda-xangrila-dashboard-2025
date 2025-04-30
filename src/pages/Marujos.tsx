
import Sidebar from '@/components/dashboard/Sidebar';
import DataChart from '@/components/dashboard/DataChart';
import DataTable from '@/components/dashboard/DataTable';
import { Button } from '@/components/ui/button';
import { Download, Users, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Dados de exemplo
const marujosData = [
  { 
    id: 1, 
    nome: 'Gabriel Santos', 
    especialidade: 'instrutor', 
    certificacoes: true, 
    disponibilidade: 'Sexta - Domingo' 
  },
  { 
    id: 2, 
    nome: 'Luciana Costa', 
    especialidade: 'segurança', 
    certificacoes: true, 
    disponibilidade: 'Sábado - Domingo' 
  },
  { 
    id: 3, 
    nome: 'Rodrigo Lima', 
    especialidade: 'primeiros_socorros', 
    certificacoes: true, 
    disponibilidade: 'Sexta - Domingo' 
  },
  { 
    id: 4, 
    nome: 'Camila Oliveira', 
    especialidade: 'instrutor', 
    certificacoes: false, 
    disponibilidade: 'Domingo' 
  },
  { 
    id: 5, 
    nome: 'Eduardo Martins', 
    especialidade: 'segurança', 
    certificacoes: true, 
    disponibilidade: 'Sexta - Sábado' 
  },
  { 
    id: 6, 
    nome: 'Amanda Vieira', 
    especialidade: 'primeiros_socorros', 
    certificacoes: false, 
    disponibilidade: 'Sexta - Domingo' 
  },
];

// Dados para os gráficos
const distribuicaoEspecialidades = [
  { name: 'Instrutor de Surf', value: 8 },
  { name: 'Segurança Aquática', value: 7 },
  { name: 'Primeiros Socorros', value: 5 },
];

const distribuicaoCertificacoes = [
  { name: 'Com Certificação', value: 15 },
  { name: 'Sem Certificação', value: 5 },
];

const Marujos = () => {
  // Função para exportar
  const handleExport = (format: 'csv' | 'pdf') => {
    alert(`Exportando lista de marujos em formato ${format}`);
    // Implementação real da exportação seria feita aqui
  };
  
  // Estilizar os badges de especialidade
  const getBadgeStyle = (especialidade: string) => {
    switch (especialidade) {
      case 'instrutor':
        return 'bg-sunset-100 text-sunset-800';
      case 'segurança':
        return 'bg-ocean-100 text-ocean-800';
      case 'primeiros_socorros':
        return 'bg-green-100 text-green-800';
      default:
        return '';
    }
  };

  // Formatar nome da especialidade
  const formatarEspecialidade = (especialidade: string) => {
    switch (especialidade) {
      case 'instrutor':
        return 'Instrutor de Surf';
      case 'segurança':
        return 'Segurança Aquática';
      case 'primeiros_socorros':
        return 'Primeiros Socorros';
      default:
        return especialidade;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="container py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Marujos</h1>
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
                <CardTitle>Visão Geral dos Marujos</CardTitle>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-sunset-600" />
                  <span className="font-medium">Total: 20 marujos</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <DataChart 
                  type="pie" 
                  title="Distribuição por Especialidade" 
                  data={distribuicaoEspecialidades} 
                  colors={['#f97316', '#0ea5e9', '#10b981']}
                />
                <DataChart 
                  type="pie" 
                  title="Certificações" 
                  data={distribuicaoCertificacoes}
                  colors={['#10b981', '#f97316']}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="mb-6">
            <DataTable 
              title="Lista de Marujos"
              data={marujosData}
              columns={[
                { accessor: 'nome', header: 'Nome' },
                { 
                  accessor: 'especialidade', 
                  header: 'Especialidade',
                  cell: (value) => (
                    <Badge className={getBadgeStyle(value)}>
                      {formatarEspecialidade(value)}
                    </Badge>
                  )
                },
                { 
                  accessor: 'certificacoes', 
                  header: 'Certificações',
                  cell: (value) => value ? (
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="mr-1 h-4 w-4" /> Certificado
                    </span>
                  ) : (
                    <span className="flex items-center text-orange-500">
                      <XCircle className="mr-1 h-4 w-4" /> Não certificado
                    </span>
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

export default Marujos;
