
import { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as UICalendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

type CalendarEvent = {
  id: string;
  title: string;
  date: Date;
  type: 'reuniao' | 'prazo' | 'evento';
  details?: string;
};

// Mock de eventos
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Reunião com Instrutores',
    date: new Date('2025-07-10'),
    type: 'reuniao',
    details: 'Preparação final para o retiro',
  },
  {
    id: '2',
    title: 'Prazo de Pagamento',
    date: new Date('2025-06-15'),
    type: 'prazo',
    details: 'Última data para pagamento da inscrição',
  },
  {
    id: '3',
    title: 'Início do Retiro',
    date: new Date('2025-07-18'),
    type: 'evento',
    details: 'Cerimônia de abertura',
  },
];

export function CalendarComponent() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'month' | 'day'>('month');
  const [selectedEvents, setSelectedEvents] = useState<CalendarEvent[]>([]);

  // Função para selecionar uma data e mostrar seus eventos
  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      const events = mockEvents.filter(event => 
        event.date.getDate() === selectedDate.getDate() &&
        event.date.getMonth() === selectedDate.getMonth() &&
        event.date.getFullYear() === selectedDate.getFullYear()
      );
      setSelectedEvents(events);
      if (events.length > 0) {
        setView('day');
      }
    }
  };

  // Retornar para visualização do mês
  const handleBackToMonth = () => {
    setView('month');
  };

  // Verificar se uma data tem eventos
  const hasEvents = (day: Date) => {
    return mockEvents.some(event => 
      event.date.getDate() === day.getDate() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getFullYear() === day.getFullYear()
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarIcon className="mr-2 h-5 w-5" />
          Agenda
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={view} onValueChange={(value) => setView(value as 'month' | 'day')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="month">Mês</TabsTrigger>
            <TabsTrigger value="day">Dia</TabsTrigger>
          </TabsList>
          <TabsContent value="month" className="mt-4">
            <UICalendar
              mode="single"
              selected={date}
              onSelect={handleSelect}
              className="rounded-md border"
              modifiers={{
                event: (day) => hasEvents(day),
              }}
              modifiersClassNames={{
                event: 'font-bold bg-ocean-100 text-ocean-800',
              }}
            />
          </TabsContent>
          <TabsContent value="day" className="mt-4">
            {date ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">
                    {date.toLocaleDateString('pt-BR', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </h3>
                  {view === 'day' && (
                    <Button variant="outline" size="sm" onClick={handleBackToMonth}>
                      Voltar para Mês
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2">
                  {selectedEvents.length > 0 ? (
                    selectedEvents.map((event) => (
                      <div key={event.id} className="border rounded-md p-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{event.title}</h4>
                          <Badge variant={
                            event.type === 'reuniao' ? 'default' :
                            event.type === 'prazo' ? 'destructive' :
                            'outline'
                          }>
                            {event.type === 'reuniao' ? 'Reunião' :
                             event.type === 'prazo' ? 'Prazo' : 'Evento'}
                          </Badge>
                        </div>
                        {event.details && (
                          <p className="text-sm text-muted-foreground mt-1">{event.details}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      Nenhum evento para esta data.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                Selecione uma data para ver os eventos.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default CalendarComponent;
