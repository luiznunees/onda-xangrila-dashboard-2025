
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
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

interface SimpleEventFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: SimpleEvent;
  onSave: (event: SimpleEvent) => void;
}

const SimpleEventForm = ({ open, onOpenChange, event, onSave }: SimpleEventFormProps) => {
  const [formData, setFormData] = useState({
    titulo: event?.titulo || '',
    descricao: event?.descricao || '',
    data_evento: event?.data_evento || '',
    hora_inicio: event?.hora_inicio || '',
    hora_fim: event?.hora_fim || '',
    tipo_evento: event?.tipo_evento || 'evento',
    criado_por: event?.criado_por || 'Sistema',
  });
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEvent: SimpleEvent = {
      ...formData,
      id: event?.id || `event_${Date.now()}`,
    };
    
    onSave(newEvent);
    onOpenChange(false);
    
    toast({
      title: event ? "Evento atualizado!" : "Evento criado!",
      description: "As alterações foram salvas com sucesso.",
    });
    
    // Resetar formulário se for novo evento
    if (!event) {
      setFormData({
        titulo: '',
        descricao: '',
        data_evento: '',
        hora_inicio: '',
        hora_fim: '',
        tipo_evento: 'evento',
        criado_por: 'Sistema',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {event ? 'Editar Evento' : 'Novo Evento'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="tipo_evento">Tipo *</Label>
            <Select
              value={formData.tipo_evento}
              onValueChange={(value) => setFormData({ ...formData, tipo_evento: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="evento">Evento</SelectItem>
                <SelectItem value="reuniao">Reunião</SelectItem>
                <SelectItem value="prazo">Prazo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="data_evento">Data *</Label>
            <Input
              id="data_evento"
              type="date"
              value={formData.data_evento}
              onChange={(e) => setFormData({ ...formData, data_evento: e.target.value })}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hora_inicio">Hora Início</Label>
              <Input
                id="hora_inicio"
                type="time"
                value={formData.hora_inicio}
                onChange={(e) => setFormData({ ...formData, hora_inicio: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="hora_fim">Hora Fim</Label>
              <Input
                id="hora_fim"
                type="time"
                value={formData.hora_fim}
                onChange={(e) => setFormData({ ...formData, hora_fim: e.target.value })}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="criado_por">Criado por</Label>
            <Input
              id="criado_por"
              value={formData.criado_por}
              onChange={(e) => setFormData({ ...formData, criado_por: e.target.value })}
            />
          </div>
        </form>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {event ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SimpleEventForm;
