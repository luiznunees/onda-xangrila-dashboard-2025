
import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Sidebar from '@/components/dashboard/Sidebar';
import CalendarComponent from '@/components/dashboard/Calendar';
import EventForm from '@/components/agenda/EventForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, List, Info, Plus, Edit, Trash, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const Agenda = () => {
  const [eventos, setEventos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventFormOpen, setEventFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const { toast } = useToast();
  const { userProfile } = useAuth();

  const loadEventos = async () => {
    try {
      const { data, error } = await supabase
        .from('eventos_agenda')
        .select(`
          *,
          criador:usuarios!criado_por(nome_completo)
        `)
        .order('data_evento', { ascending: true });

      if (error) throw error;
      setEventos(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar eventos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEventos();
  }, []);

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Tem certeza que deseja excluir este evento?')) return;

    try {
      const { error } = await supabase
        .from('eventos_agenda')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      toast({
        title: "Evento excluído com sucesso!",
      });

      loadEventos();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir evento",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditEvent = (event: any) => {
    setEditingEvent(event);
    setEventFormOpen(true);
  };

  const handleFormClose = () => {
    setEventFormOpen(false);
    setEditingEvent(null);
  };

  const renderEventBadge = (tipo: string) => {
    switch (tipo) {
      case 'reuniao':
        return <Badge className="bg-blue-100 text-blue-800">Reunião</Badge>;
      case 'prazo':
        return <Badge className="bg-red-100 text-red-800">Prazo</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-800">Evento</Badge>;
    }
  };

  const canEditEvent = (evento: any) => {
    return userProfile?.id === evento.criado_por;
  };

  const proximosEventos = eventos
    .filter(evento => new Date(evento.data_evento) >= new Date())
    .slice(0, 5);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <main className="container py-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Agenda</h1>
              <Button onClick={() => setEventFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Evento
              </Button>
            </div>
            
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
                        <h3 className="font-medium">Sistema de Agenda</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Todos podem ver os eventos, mas apenas o criador pode editar seus próprios eventos.
                        </p>
                      </div>
                      
                      <div className="border-t pt-4">
                        <h3 className="font-medium">Tipos de Eventos</h3>
                        <div className="space-y-2 mt-2">
                          {renderEventBadge('evento')}
                          {renderEventBadge('reuniao')}
                          {renderEventBadge('prazo')}
                        </div>
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
                    {loading ? (
                      <p className="text-sm text-muted-foreground">Carregando eventos...</p>
                    ) : proximosEventos.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Nenhum evento próximo.</p>
                    ) : (
                      <div className="space-y-4">
                        {proximosEventos.map((evento) => (
                          <div key={evento.id} className="border-b pb-4 last:border-b-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  {renderEventBadge(evento.tipo_evento)}
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(evento.data_evento).toLocaleDateString()}
                                  </span>
                                </div>
                                <h4 className="font-medium text-sm">{evento.titulo}</h4>
                                {evento.hora_inicio && (
                                  <p className="text-xs text-muted-foreground">
                                    {evento.hora_inicio}
                                    {evento.hora_fim && ` - ${evento.hora_fim}`}
                                  </p>
                                )}
                                <div className="flex items-center mt-1">
                                  <User className="h-3 w-3 mr-1 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">
                                    {evento.criador?.nome_completo || 'Usuário desconhecido'}
                                  </span>
                                </div>
                              </div>
                              
                              {canEditEvent(evento) && (
                                <div className="flex gap-1 ml-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEditEvent(evento)}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDeleteEvent(evento.id)}
                                  >
                                    <Trash className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>

      <EventForm
        open={eventFormOpen}
        onOpenChange={handleFormClose}
        event={editingEvent}
        onSave={loadEventos}
      />
    </ProtectedRoute>
  );
};

export default Agenda;
