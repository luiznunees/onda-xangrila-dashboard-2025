
import Sidebar from '@/components/dashboard/Sidebar';
import CalendarComponent from '@/components/dashboard/Calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, List, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Agenda = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="container py-6">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Agenda</h1>
          
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <CalendarComponent />
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="mr-2 h-5 w-5" />
                    Informações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Próximos Eventos</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Acompanhe os principais eventos e prazos para o Retiro Onda Xangri-lá 2025.
                      </p>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h3 className="font-medium">Adicionar Eventos</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Para adicionar novos eventos, entre em contato com a coordenação do retiro.
                      </p>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h3 className="font-medium">Dúvidas</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Em caso de dúvidas sobre a agenda, consulte a seção de perguntas frequentes.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <List className="mr-2 h-5 w-5" />
                    Próximos Eventos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="reunioes">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="reunioes">Reuniões</TabsTrigger>
                      <TabsTrigger value="prazos">Prazos</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="reunioes" className="space-y-4 pt-4">
                      <div className="flex items-start">
                        <div className="bg-ocean-100 text-ocean-800 rounded p-2 mr-3 text-center min-w-[50px]">
                          <div className="text-xs">Jun</div>
                          <div className="font-bold">15</div>
                        </div>
                        <div>
                          <h4 className="font-medium">Reunião com Pais</h4>
                          <p className="text-xs text-muted-foreground">19:00 - Online</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-ocean-100 text-ocean-800 rounded p-2 mr-3 text-center min-w-[50px]">
                          <div className="text-xs">Jul</div>
                          <div className="font-bold">10</div>
                        </div>
                        <div>
                          <h4 className="font-medium">Reunião com Instrutores</h4>
                          <p className="text-xs text-muted-foreground">18:30 - Sede</p>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="prazos" className="space-y-4 pt-4">
                      <div className="flex items-start">
                        <div className="bg-sunset-100 text-sunset-800 rounded p-2 mr-3 text-center min-w-[50px]">
                          <div className="text-xs">Jun</div>
                          <div className="font-bold">30</div>
                        </div>
                        <div>
                          <h4 className="font-medium">Prazo para Inscrição</h4>
                          <p className="text-xs text-muted-foreground">Último dia para se inscrever</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-sunset-100 text-sunset-800 rounded p-2 mr-3 text-center min-w-[50px]">
                          <div className="text-xs">Jul</div>
                          <div className="font-bold">5</div>
                        </div>
                        <div>
                          <h4 className="font-medium">Prazo para Pagamento</h4>
                          <p className="text-xs text-muted-foreground">Último dia para pagamento</p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Agenda;
