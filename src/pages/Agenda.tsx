
import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import CalendarComponent from '@/components/dashboard/Calendar';
import SimpleEventForm from '@/components/agenda/SimpleEventForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, List, Info, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SimpleEvent {
  id?: string;
  titulo: string;
  descricao: string;
  data_evento: string;
  hora_inicio: string;
  hora_fim: string;
  tipo_evento: string;
  criado_por: string;
}

const Agenda = () => {
  const [eventos, setEventos] = useState<SimpleEvent[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SimpleEvent | undefined>();
  const { toast } = useToast();

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

  const handleSaveEvent = (event: SimpleEvent) => {
    if (editingEvent) {
      // Editar evento existente
      setEventos(eventos.map(e => e.id === editingEvent.id ? event : e));
    } else {
      // Criar novo evento
      setEventos([...eventos, event]);
    }
    setEditingEvent(undefined);
  };

  const handleEditEvent = (event: SimpleEvent) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEventos(eventos.filter(e => e.id !== eventId));
    toast({
      title: "Evento excluído",
      description: "O evento foi removido com sucesso.",
    });
  };

  const proximosEventos = eventos
    .filter(evento => new Date(evento.data_evento) >= new Date())
    .slice(0, 5);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="container py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Agenda</h1>
            <Button onClick={() => {
              setEditingEvent(undefined);
              setShowEventForm(true);
            }}>
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
                        Gerencie eventos e compromissos do retiro.
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
                    Próximos Eventos ({proximosEventos.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {proximosEventos.length === 0 ? (
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
                              <p className="text-xs text-muted-foreground mt-1">
                                Por: {evento.criado_por}
                              </p>
                            </div>
                            <div className="flex gap-2 ml-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditEvent(evento)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => evento.id && handleDeleteEvent(evento.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
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
      
      <SimpleEventForm
        open={showEventForm}
        onOpenChange={setShowEventForm}
        event={editingEvent}
        onSave={handleSaveEvent}
      />
    </div>
  );
};

export default Agenda;
