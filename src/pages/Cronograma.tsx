
import Sidebar from '@/components/dashboard/Sidebar';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Clock, 
  Coffee, 
  Waves, 
  Sun, 
  UtensilsCrossed, 
  Music, 
  Users, 
  SunMoon,
  Calendar,
  Info
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Tipos para as atividades do cronograma
interface Atividade {
  horario: string;
  titulo: string;
  descricao?: string;
  tipo: 'surf' | 'alimentacao' | 'descanso' | 'reuniao' | 'atividade';
  local?: string;
}

// Dados das atividades por dia
const atividadesDia1: Atividade[] = [
  { horario: '14:00', titulo: 'Check-in', descricao: 'Recepção e entrega de kits', tipo: 'reuniao', local: 'Pousada' },
  { horario: '16:00', titulo: 'Abertura', descricao: 'Cerimônia de abertura e boas-vindas', tipo: 'reuniao', local: 'Auditório' },
  { horario: '17:00', titulo: 'Divisão de grupos', descricao: 'Organização dos participantes por nível', tipo: 'reuniao', local: 'Auditório' },
  { horario: '18:30', titulo: 'Jantar de boas-vindas', descricao: 'Jantar de confraternização', tipo: 'alimentacao', local: 'Refeitório' },
  { horario: '20:00', titulo: 'Apresentação dos instrutores', descricao: 'Conhecer a equipe', tipo: 'reuniao', local: 'Auditório' },
  { horario: '21:30', titulo: 'Luau de integração', descricao: 'Música e interação', tipo: 'atividade', local: 'Praia' },
];

const atividadesDia2: Atividade[] = [
  { horario: '06:00', titulo: 'Despertar', tipo: 'descanso' },
  { horario: '06:30', titulo: 'Café da manhã', tipo: 'alimentacao', local: 'Refeitório' },
  { horario: '07:30', titulo: 'Aula prática de surf I', descricao: 'Iniciantes e intermediários', tipo: 'surf', local: 'Praia' },
  { horario: '10:30', titulo: 'Lanche da manhã', tipo: 'alimentacao', local: 'Praia' },
  { horario: '11:00', titulo: 'Palestra sobre segurança', tipo: 'reuniao', local: 'Auditório' },
  { horario: '12:30', titulo: 'Almoço', tipo: 'alimentacao', local: 'Refeitório' },
  { horario: '14:00', titulo: 'Descanso', tipo: 'descanso' },
  { horario: '15:00', titulo: 'Aula prática de surf II', descricao: 'Todos os níveis', tipo: 'surf', local: 'Praia' },
  { horario: '18:00', titulo: 'Yoga ao pôr do sol', tipo: 'atividade', local: 'Deck' },
  { horario: '19:30', titulo: 'Jantar', tipo: 'alimentacao', local: 'Refeitório' },
  { horario: '21:00', titulo: 'Fogueira e música', tipo: 'atividade', local: 'Praia' },
];

const atividadesDia3: Atividade[] = [
  { horario: '06:30', titulo: 'Despertar', tipo: 'descanso' },
  { horario: '07:00', titulo: 'Café da manhã', tipo: 'alimentacao', local: 'Refeitório' },
  { horario: '08:00', titulo: 'Aula prática final', descricao: 'Todos os níveis', tipo: 'surf', local: 'Praia' },
  { horario: '11:00', titulo: 'Mini campeonato', descricao: 'Competição amigável', tipo: 'surf', local: 'Praia' },
  { horario: '13:00', titulo: 'Almoço de encerramento', tipo: 'alimentacao', local: 'Refeitório' },
  { horario: '14:30', titulo: 'Cerimônia de encerramento', descricao: 'Entrega de certificados', tipo: 'reuniao', local: 'Auditório' },
  { horario: '16:00', titulo: 'Checkout e despedida', tipo: 'reuniao', local: 'Pousada' },
];

// Função para obter o ícone e cor baseado no tipo da atividade
const getAtividadeIconAndColor = (tipo: Atividade['tipo']) => {
  switch (tipo) {
    case 'surf':
      return { icon: <Waves className="h-4 w-4" />, color: 'bg-ocean-100 text-ocean-800' };
    case 'alimentacao':
      return { icon: <UtensilsCrossed className="h-4 w-4" />, color: 'bg-sand-100 text-sand-800' };
    case 'descanso':
      return { icon: <SunMoon className="h-4 w-4" />, color: 'bg-purple-100 text-purple-800' };
    case 'reuniao':
      return { icon: <Users className="h-4 w-4" />, color: 'bg-blue-100 text-blue-800' };
    case 'atividade':
      return { icon: <Music className="h-4 w-4" />, color: 'bg-sunset-100 text-sunset-800' };
    default:
      return { icon: <Clock className="h-4 w-4" />, color: 'bg-gray-100 text-gray-800' };
  }
};

const Cronograma = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="container py-6">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Cronograma</h1>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Programação do Retiro Onda Xangri-lá 2025
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="dia1">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="dia1" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> 18/07 (Sexta)
                  </TabsTrigger>
                  <TabsTrigger value="dia2" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> 19/07 (Sábado)
                  </TabsTrigger>
                  <TabsTrigger value="dia3" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> 20/07 (Domingo)
                  </TabsTrigger>
                </TabsList>
                
                {/* Conteúdo para o Dia 1 */}
                <TabsContent value="dia1" className="mt-6">
                  <div className="relative">
                    {/* Linha de tempo */}
                    <div className="absolute left-[39px] top-0 bottom-0 w-px bg-muted dark:bg-neutral-800"></div>
                    
                    <div className="space-y-8">
                      {atividadesDia1.map((atividade, index) => {
                        const { icon, color } = getAtividadeIconAndColor(atividade.tipo);
                        return (
                          <div key={index} className="relative grid grid-cols-[80px_1fr] gap-4">
                            <div className="flex flex-col items-center">
                              <div className="flex items-center justify-center rounded-full w-10 h-10 bg-background border z-10">
                                <span className="text-sm font-medium">{atividade.horario}</span>
                              </div>
                            </div>
                            <div className="bg-card rounded-lg p-4 border shadow-sm">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                <h3 className="font-medium text-lg">{atividade.titulo}</h3>
                                <Badge className={color}>{icon} {atividade.tipo}</Badge>
                              </div>
                              {atividade.descricao && (
                                <p className="text-sm text-muted-foreground">{atividade.descricao}</p>
                              )}
                              {atividade.local && (
                                <div className="text-xs text-muted-foreground mt-2 flex items-center">
                                  <span>📍 {atividade.local}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>
                
                {/* Conteúdo para o Dia 2 */}
                <TabsContent value="dia2" className="mt-6">
                  <div className="relative">
                    {/* Linha de tempo */}
                    <div className="absolute left-[39px] top-0 bottom-0 w-px bg-muted dark:bg-neutral-800"></div>
                    
                    <div className="space-y-8">
                      {atividadesDia2.map((atividade, index) => {
                        const { icon, color } = getAtividadeIconAndColor(atividade.tipo);
                        return (
                          <div key={index} className="relative grid grid-cols-[80px_1fr] gap-4">
                            <div className="flex flex-col items-center">
                              <div className="flex items-center justify-center rounded-full w-10 h-10 bg-background border z-10">
                                <span className="text-sm font-medium">{atividade.horario}</span>
                              </div>
                            </div>
                            <div className="bg-card rounded-lg p-4 border shadow-sm">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                <h3 className="font-medium text-lg">{atividade.titulo}</h3>
                                <Badge className={color}>{icon} {atividade.tipo}</Badge>
                              </div>
                              {atividade.descricao && (
                                <p className="text-sm text-muted-foreground">{atividade.descricao}</p>
                              )}
                              {atividade.local && (
                                <div className="text-xs text-muted-foreground mt-2 flex items-center">
                                  <span>📍 {atividade.local}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>
                
                {/* Conteúdo para o Dia 3 */}
                <TabsContent value="dia3" className="mt-6">
                  <div className="relative">
                    {/* Linha de tempo */}
                    <div className="absolute left-[39px] top-0 bottom-0 w-px bg-muted dark:bg-neutral-800"></div>
                    
                    <div className="space-y-8">
                      {atividadesDia3.map((atividade, index) => {
                        const { icon, color } = getAtividadeIconAndColor(atividade.tipo);
                        return (
                          <div key={index} className="relative grid grid-cols-[80px_1fr] gap-4">
                            <div className="flex flex-col items-center">
                              <div className="flex items-center justify-center rounded-full w-10 h-10 bg-background border z-10">
                                <span className="text-sm font-medium">{atividade.horario}</span>
                              </div>
                            </div>
                            <div className="bg-card rounded-lg p-4 border shadow-sm">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                <h3 className="font-medium text-lg">{atividade.titulo}</h3>
                                <Badge className={color}>{icon} {atividade.tipo}</Badge>
                              </div>
                              {atividade.descricao && (
                                <p className="text-sm text-muted-foreground">{atividade.descricao}</p>
                              )}
                              {atividade.local && (
                                <div className="text-xs text-muted-foreground mt-2 flex items-center">
                                  <span>📍 {atividade.local}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardContent className="p-4 flex items-center space-x-3">
                <div className="p-2 rounded-full bg-ocean-100">
                  <Waves className="h-5 w-5 text-ocean-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Aulas de Surf</p>
                  <p className="text-xs text-muted-foreground">3 sessões programadas</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center space-x-3">
                <div className="p-2 rounded-full bg-sand-100">
                  <UtensilsCrossed className="h-5 w-5 text-sand-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Refeições</p>
                  <p className="text-xs text-muted-foreground">7 refeições completas</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center space-x-3">
                <div className="p-2 rounded-full bg-sunset-100">
                  <Music className="h-5 w-5 text-sunset-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Atividades Extras</p>
                  <p className="text-xs text-muted-foreground">Yoga, música e mais</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center space-x-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Reuniões</p>
                  <p className="text-xs text-muted-foreground">6 momentos coletivos</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-5 w-5" />
                Informações Importantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-2">
                <Sun className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium">Horários podem sofrer alterações</p>
                  <p className="text-sm text-muted-foreground">Dependendo das condições do mar e do clima</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Coffee className="h-5 w-5 text-brown-500 mt-0.5" />
                <div>
                  <p className="font-medium">Refeições e lanches</p>
                  <p className="text-sm text-muted-foreground">Todas as refeições estão inclusas na programação</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Users className="h-5 w-5 text-ocean-500 mt-0.5" />
                <div>
                  <p className="font-medium">Participação nas atividades</p>
                  <p className="text-sm text-muted-foreground">A participação em todas as atividades é recomendada, mas não obrigatória</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Cronograma;
