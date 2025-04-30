
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import StatsCard from "@/components/dashboard/StatsCard";
import CountdownTimer from "@/components/dashboard/CountdownTimer";
import DataChart from "@/components/dashboard/DataChart";
import Sidebar from "@/components/dashboard/Sidebar";
import { User, Users, Waves, LifeBuoy } from "lucide-react";

const Dashboard = () => {
  const { toast } = useToast();

  // Buscar dados das pré-inscrições
  const fetchPreInscricoes = async () => {
    const { data, error } = await supabase
      .from('pre_inscricoes')
      .select('count')
      .single();
    
    if (error) {
      console.error('Erro ao buscar contagem de pré-inscrições:', error);
      return 0;
    }
    
    return data?.count || 0;
  };
  
  // Buscar dados dos surfistas
  const fetchSurfistas = async () => {
    const { data, error } = await supabase
      .from('fichas_surfistas')
      .select('count')
      .single();
    
    if (error) {
      console.error('Erro ao buscar contagem de surfistas:', error);
      return 0;
    }
    
    return data?.count || 0;
  };
  
  // Buscar dados da equipe de apoio
  const fetchApoio = async () => {
    const { data, error } = await supabase
      .from('fichas_apoio')
      .select('count')
      .single();
    
    if (error) {
      console.error('Erro ao buscar contagem de apoio:', error);
      return 0;
    }
    
    return data?.count || 0;
  };
  
  // Buscar dados dos marujos
  const fetchMarujos = async () => {
    const { data, error } = await supabase
      .from('fichas_marujos')
      .select('count')
      .single();
    
    if (error) {
      console.error('Erro ao buscar contagem de marujos:', error);
      return 0;
    }
    
    return data?.count || 0;
  };

  // Buscar todos os dados para o dashboard
  const fetchDashboardData = async () => {
    try {
      const [preInscricoesData, surfistasData, apoioData, marujosData] = await Promise.all([
        supabase.from('pre_inscricoes').select('*'),
        supabase.from('fichas_surfistas').select('*'),
        supabase.from('fichas_apoio').select('*'),
        supabase.from('fichas_marujos').select('*'),
      ]);

      return {
        preInscricoes: preInscricoesData.data || [],
        surfistas: surfistasData.data || [],
        apoio: apoioData.data || [],
        marujos: marujosData.data || [],
      };
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados do dashboard.",
        variant: "destructive"
      });
      return {
        preInscricoes: [],
        surfistas: [],
        apoio: [],
        marujos: [],
      };
    }
  };

  // Buscar dados com React Query
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData
  });

  // Processar dados para os cards e gráficos
  const summaryData = [
    { name: 'Pré-Inscrições', value: dashboardData?.preInscricoes.length || 0 },
    { name: 'Surfistas', value: dashboardData?.surfistas.length || 0 },
    { name: 'Apoio', value: dashboardData?.apoio.length || 0 },
    { name: 'Marujos', value: dashboardData?.marujos.length || 0 },
  ];

  const distributionData = [
    { name: 'Surfistas', value: dashboardData?.surfistas.length || 0, color: '#0369a1' },
    { name: 'Apoio', value: dashboardData?.apoio.length || 0, color: '#38bdf8' },
    { name: 'Marujos', value: dashboardData?.marujos.length || 0, color: '#f97316' },
  ];

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
              value={dashboardData?.preInscricoes.length || 0} 
              icon={<User className="h-4 w-4" />}
              trend={{ value: 0, isPositive: true }}
              isLoading={isLoading}
            />
            <StatsCard 
              title="Surfistas" 
              value={dashboardData?.surfistas.length || 0} 
              icon={<Waves className="h-4 w-4" />}
              trend={{ value: 0, isPositive: true }}
              isLoading={isLoading}
            />
            <StatsCard 
              title="Apoio" 
              value={dashboardData?.apoio.length || 0} 
              icon={<Users className="h-4 w-4" />}
              trend={{ value: 0, isPositive: true }}
              isLoading={isLoading}
            />
            <StatsCard 
              title="Marujos" 
              value={dashboardData?.marujos.length || 0} 
              icon={<LifeBuoy className="h-4 w-4" />}
              trend={{ value: 0, isPositive: true }}
              isLoading={isLoading}
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
              isLoading={isLoading}
            />
            <DataChart 
              type="pie" 
              title="Distribuição de Participantes" 
              data={distributionData}
              isLoading={isLoading}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
