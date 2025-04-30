
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import StatsCard from "@/components/dashboard/StatsCard";
import CountdownTimer from "@/components/dashboard/CountdownTimer";
import DataChart from "@/components/dashboard/DataChart";
import Sidebar from "@/components/dashboard/Sidebar";
import { User, Users, Surf, LifeBuoy } from "lucide-react";

// Dados de exemplo
const summaryData = [
  { name: 'Pré-Inscrições', value: 150 },
  { name: 'Surfistas', value: 80 },
  { name: 'Apoio', value: 30 },
  { name: 'Marujos', value: 20 },
];

const distributionData = [
  { name: 'Surfistas', value: 80, color: '#0369a1' },
  { name: 'Apoio', value: 30, color: '#38bdf8' },
  { name: 'Marujos', value: 20, color: '#f97316' },
];

const Dashboard = () => {
  // Log para fins de diagnóstico
  useEffect(() => {
    console.log("Dashboard montado");
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="container py-6">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Dashboard Onda Xangri-lá 2025</h1>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <StatsCard 
              title="Pré-Inscrições" 
              value={150} 
              icon={<User className="h-4 w-4" />}
              trend={{ value: 15, isPositive: true }}
            />
            <StatsCard 
              title="Surfistas" 
              value={80} 
              icon={<Surf className="h-4 w-4" />}
              trend={{ value: 10, isPositive: true }}
            />
            <StatsCard 
              title="Apoio" 
              value={30} 
              icon={<Users className="h-4 w-4" />}
              trend={{ value: 5, isPositive: true }}
            />
            <StatsCard 
              title="Marujos" 
              value={20} 
              icon={<LifeBuoy className="h-4 w-4" />}
              trend={{ value: 8, isPositive: true }}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <CountdownTimer />
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  <div className="relative w-full lg:w-1/3 h-full min-h-[200px]">
                    <div className="absolute inset-0 bg-ocean-gradient flex items-center justify-center p-6 text-white text-center">
                      <div>
                        <h3 className="text-lg font-bold">Retiro Onda</h3>
                        <p className="text-sm mt-2">18-20 de Julho de 2025</p>
                        <p className="text-sm mt-4">Xangri-lá, Rio Grande do Sul</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex-1">
                    <h3 className="font-medium text-lg mb-2">Informações Gerais</h3>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center space-x-2">
                        <span className="w-24 text-muted-foreground">Local:</span>
                        <span>Praia de Xangri-lá, RS</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-24 text-muted-foreground">Duração:</span>
                        <span>3 dias (sex a dom)</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-24 text-muted-foreground">Capacidade:</span>
                        <span>100 surfistas</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-24 text-muted-foreground">Coordenação:</span>
                        <span>Equipe Onda Xangri-lá</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <DataChart 
              type="bar" 
              title="Resumo de Participantes" 
              data={summaryData} 
            />
            <DataChart 
              type="pie" 
              title="Distribuição de Participantes" 
              data={distributionData} 
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
