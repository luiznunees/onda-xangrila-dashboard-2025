
import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import DataChart from "@/components/dashboard/DataChart";
import DataTable from "@/components/dashboard/DataTable";
import StatsCard from "@/components/dashboard/StatsCard";
import { UserPlus, TrendingUp, UserCheck } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

// Dados de exemplo para pré-inscrições
const mockData = [
  { id: 1, nome: "Ana Silva", email: "ana@email.com", telefone: "(51) 91234-5678", interesse: "surfista", dataInscricao: "2025-05-01" },
  { id: 2, nome: "João Santos", email: "joao@email.com", telefone: "(51) 92345-6789", interesse: "apoio", dataInscricao: "2025-05-05" },
  { id: 3, nome: "Maria Oliveira", email: "maria@email.com", telefone: "(51) 93456-7890", interesse: "marujo", dataInscricao: "2025-05-10" },
  { id: 4, nome: "Pedro Costa", email: "pedro@email.com", telefone: "(51) 94567-8901", interesse: "surfista", dataInscricao: "2025-05-12" },
  { id: 5, nome: "Carla Martins", email: "carla@email.com", telefone: "(51) 95678-9012", interesse: "surfista", dataInscricao: "2025-05-15" },
  { id: 6, nome: "Lucas Mendes", email: "lucas@email.com", telefone: "(51) 96789-0123", interesse: "apoio", dataInscricao: "2025-05-18" },
  { id: 7, nome: "Julia Lima", email: "julia@email.com", telefone: "(51) 97890-1234", interesse: "marujo", dataInscricao: "2025-05-20" },
  { id: 8, nome: "Rafael Alves", email: "rafael@email.com", telefone: "(51) 98901-2345", interesse: "surfista", dataInscricao: "2025-05-22" },
  { id: 9, nome: "Fernanda Sousa", email: "fernanda@email.com", telefone: "(51) 99012-3456", interesse: "surfista", dataInscricao: "2025-05-25" },
  { id: 10, nome: "Bruno Castro", email: "bruno@email.com", telefone: "(51) 90123-4567", interesse: "apoio", dataInscricao: "2025-05-28" },
];

// Dados para o gráfico de tendência
const tendenciaData = [
  { name: '01/05', inscricoes: 3 },
  { name: '08/05', inscricoes: 8 },
  { name: '15/05', inscricoes: 12 },
  { name: '22/05', inscricoes: 18 },
  { name: '29/05', inscricoes: 25 },
  { name: '05/06', inscricoes: 38 },
  { name: '12/06', inscricoes: 50 },
];

// Dados para o gráfico de distribuição
const distribuicaoData = [
  { name: 'Surfistas', value: 80 },
  { name: 'Apoio', value: 40 },
  { name: 'Marujos', value: 30 },
];

const PreInscricoes = () => {
  const [filtroInteresse, setFiltroInteresse] = useState<string | null>(null);
  
  // Filtro para a tabela
  const filteredData = filtroInteresse 
    ? mockData.filter(item => item.interesse === filtroInteresse)
    : mockData;
  
  // Função para exportação
  const handleExport = (format: 'csv' | 'pdf') => {
    alert(`Exportando pré-inscrições em formato ${format}`);
    // Implementar a exportação real posteriormente
  };
  
  // Componente de filtros para a tabela
  const FiltersComponent = (
    <>
      <DropdownMenuItem onClick={() => setFiltroInteresse(null)}>
        Todos os interesses
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setFiltroInteresse('surfista')}>
        Somente Surfistas
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setFiltroInteresse('apoio')}>
        Somente Apoio
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setFiltroInteresse('marujo')}>
        Somente Marujos
      </DropdownMenuItem>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="container py-6">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Pré-Inscrições</h1>
          
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <StatsCard 
              title="Total de Pré-Inscrições" 
              value={150}
              icon={<UserPlus className="h-4 w-4" />}
              description="Todas as pessoas interessadas no retiro"
            />
            <StatsCard 
              title="Crescimento Semanal" 
              value="12%"
              icon={<TrendingUp className="h-4 w-4" />}
              description="Aumento nas últimas 7 dias"
            />
            <StatsCard 
              title="Taxa de Conversão" 
              value="53%"
              icon={<UserCheck className="h-4 w-4" />}
              description="De pré-inscritos para inscritos"
            />
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <DataChart 
              type="line"
              title="Tendência de Pré-Inscrições"
              data={tendenciaData}
              dataKey="inscricoes"
              nameKey="name"
            />
            
            <DataChart 
              type="pie"
              title="Distribuição por Interesse"
              data={distribuicaoData}
              colors={['#0369a1', '#38bdf8', '#f97316']}
            />
          </div>
          
          <div className="mb-6">
            <DataTable 
              title="Lista de Pré-Inscrições"
              data={filteredData}
              columns={[
                { accessor: 'nome', header: 'Nome' },
                { accessor: 'email', header: 'Email' },
                { accessor: 'telefone', header: 'Telefone' },
                { 
                  accessor: 'interesse', 
                  header: 'Interesse',
                  cell: (value) => (
                    <span className={
                      value === 'surfista' ? 'text-ocean-600' :
                      value === 'apoio' ? 'text-sand-600' :
                      'text-sunset-600'
                    }>
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                  )
                },
                { accessor: 'dataInscricao', header: 'Data' }
              ]}
              onExport={handleExport}
              filters={FiltersComponent}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PreInscricoes;
