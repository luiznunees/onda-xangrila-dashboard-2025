
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ImageUpload from './ImageUpload';

type SurfistaStatusManagerProps = {
  surfista: any;
  onUpdate: () => void;
};

const SurfistaStatusManager = ({ surfista, onUpdate }: SurfistaStatusManagerProps) => {
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const updateSurfista = async (field: string, value: string) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('fichas_surfistas')
        .update({ [field]: value })
        .eq('id', surfista.id);

      if (error) throw error;

      toast({
        title: "Atualizado com sucesso",
        description: `${field} foi atualizado.`,
      });
      
      onUpdate();
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar a informação.",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmado': return 'default';
      case 'pendente': return 'secondary';
      case 'lista_espera': return 'outline';
      default: return 'secondary';
    }
  };

  const getPaymentStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pago': return 'default';
      case 'pendente': return 'secondary';
      case 'nao_pago': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmado': return 'Confirmado';
      case 'pendente': return 'Pendente';
      case 'lista_espera': return 'Lista de Espera';
      default: return status;
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'pago': return 'Pago';
      case 'pendente': return 'Pendente';
      case 'nao_pago': return 'Não Pago';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Status de Inscrição */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status de Inscrição</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Badge variant={getStatusBadgeVariant(surfista.status_inscricao)}>
              {getStatusLabel(surfista.status_inscricao)}
            </Badge>
            <Select 
              value={surfista.status_inscricao || 'pendente'} 
              onValueChange={(value) => updateSurfista('status_inscricao', value)}
              disabled={updating}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Selecionar status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="confirmado">Confirmado</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="lista_espera">Lista de Espera</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Foto 3x4 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Foto 3x4</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload
            currentImageUrl={surfista.foto_url}
            onImageUploaded={(url) => updateSurfista('foto_url', url)}
            bucketName="surfistas-fotos"
            label="Foto 3x4"
            accept="image/*"
          />
        </CardContent>
      </Card>

      {/* Pagamento */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pagamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Tipo de Pagamento</label>
              <Select 
                value={surfista.tipo_pagamento || ''} 
                onValueChange={(value) => updateSurfista('tipo_pagamento', value)}
                disabled={updating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="dinheiro">Dinheiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Status do Pagamento</label>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={getPaymentStatusBadgeVariant(surfista.status_pagamento)}>
                  {getPaymentStatusLabel(surfista.status_pagamento)}
                </Badge>
                <Select 
                  value={surfista.status_pagamento || 'nao_pago'} 
                  onValueChange={(value) => updateSurfista('status_pagamento', value)}
                  disabled={updating}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="nao_pago">Não Pago</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Comprovante de Pagamento */}
          {surfista.tipo_pagamento === 'pix' && surfista.status_pagamento === 'pago' && (
            <div className="mt-4">
              <label className="text-sm font-medium">Comprovante de Pagamento</label>
              <div className="mt-2">
                <ImageUpload
                  currentImageUrl={surfista.comprovante_url}
                  onImageUploaded={(url) => updateSurfista('comprovante_url', url)}
                  bucketName="comprovantes-pagamento"
                  label="Comprovante"
                  accept="image/*,.pdf"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SurfistaStatusManager;
