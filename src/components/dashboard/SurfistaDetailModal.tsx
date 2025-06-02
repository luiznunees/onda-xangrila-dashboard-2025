
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import FileUpload from './FileUpload';
import StatusSelect from './StatusSelect';

interface Surfista {
  id: string;
  nome_surfista: string;
  data_nascimento: string;
  telefone_surfista: string;
  idade: number;
  escola_serie_ano: string;
  tamanho_camiseta_surfista: string;
  endereco_completo_surfista: string;
  nome_pai: string;
  telefone_pai: string;
  nome_mae: string;
  telefone_mae: string;
  arroba_instagram?: string;
  rg_cpf_surfista?: string;
  instrumento?: string;
  irmaos?: string;
  medicamento?: string;
  alergia?: string;
  fobia?: string;
  fez_primeira_comunhao: string;
  fez_crisma: string;
  informacao_adicional_surfista?: string;
  status_inscricao?: string;
  tipo_pagamento?: string;
  status_pagamento?: string;
  comprovante_url?: string;
  foto_url?: string;
}

interface SurfistaDetailModalProps {
  surfista: Surfista | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const SurfistaDetailModal = ({ surfista, isOpen, onClose, onUpdate }: SurfistaDetailModalProps) => {
  const [editingStatus, setEditingStatus] = useState(false);
  const [editingPayment, setEditingPayment] = useState(false);
  const { toast } = useToast();

  if (!surfista) return null;

  const handleStatusUpdate = async (field: string, value: string) => {
    try {
      const { error } = await supabase
        .from('fichas_surfistas')
        .update({ [field]: value })
        .eq('id', surfista.id);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: "Status atualizado com sucesso.",
      });
      
      onUpdate();
      setEditingStatus(false);
      setEditingPayment(false);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o status.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string, type: 'inscricao' | 'pagamento') => {
    const statusConfig = {
      inscricao: {
        'pendente': { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
        'confirmado': { label: 'Confirmado', color: 'bg-green-100 text-green-800' },
        'lista_espera': { label: 'Lista de Espera', color: 'bg-orange-100 text-orange-800' }
      },
      pagamento: {
        'nao_pago': { label: 'Não Pago', color: 'bg-red-100 text-red-800' },
        'pendente': { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
        'pago': { label: 'Pago', color: 'bg-green-100 text-green-800' }
      }
    };

    const config = statusConfig[type][status as keyof typeof statusConfig[typeof type]];
    return config ? (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    ) : <span>-</span>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Ficha Completa - {surfista.nome_surfista}
          </DialogTitle>
          <DialogDescription>
            Informações detalhadas do surfista
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna da Foto */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Foto 3x4</CardTitle>
              </CardHeader>
              <CardContent>
                {surfista.foto_url ? (
                  <div className="space-y-3">
                    <img 
                      src={surfista.foto_url} 
                      alt={`Foto de ${surfista.nome_surfista}`}
                      className="w-full max-w-[200px] mx-auto rounded-lg border"
                    />
                    <FileUpload
                      surfistId={surfista.id}
                      currentFileUrl={surfista.foto_url}
                      fileType="foto"
                      onUploadSuccess={onUpdate}
                    />
                  </div>
                ) : (
                  <div className="text-center space-y-3">
                    <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">Nenhuma foto enviada</span>
                    </div>
                    <FileUpload
                      surfistId={surfista.id}
                      fileType="foto"
                      onUploadSuccess={onUpdate}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status e Pagamento */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status & Pagamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Status da Inscrição</label>
                  {editingStatus ? (
                    <StatusSelect
                      value={surfista.status_inscricao || 'pendente'}
                      onValueChange={(value) => handleStatusUpdate('status_inscricao', value)}
                      type="inscricao"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      {getStatusBadge(surfista.status_inscricao || 'pendente', 'inscricao')}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setEditingStatus(true)}
                      >
                        Editar
                      </Button>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-3">
                  <label className="text-sm font-medium block">Tipo de Pagamento</label>
                  <Select 
                    value={surfista.tipo_pagamento || ''} 
                    onValueChange={(value) => handleStatusUpdate('tipo_pagamento', value)}
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
                  <label className="text-sm font-medium mb-2 block">Status do Pagamento</label>
                  {editingPayment ? (
                    <StatusSelect
                      value={surfista.status_pagamento || 'nao_pago'}
                      onValueChange={(value) => handleStatusUpdate('status_pagamento', value)}
                      type="pagamento"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      {getStatusBadge(surfista.status_pagamento || 'nao_pago', 'pagamento')}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setEditingPayment(true)}
                      >
                        Editar
                      </Button>
                    </div>
                  )}
                </div>

                {surfista.tipo_pagamento === 'pix' && surfista.status_pagamento === 'pago' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium block">Comprovante de Pagamento</label>
                    <FileUpload
                      surfistId={surfista.id}
                      currentFileUrl={surfista.comprovante_url}
                      fileType="comprovante"
                      onUploadSuccess={onUpdate}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Colunas das Informações */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações Pessoais */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Nome Completo</span>
                  <p className="text-sm">{surfista.nome_surfista}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Data de Nascimento</span>
                  <p className="text-sm">{new Date(surfista.data_nascimento).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Idade</span>
                  <p className="text-sm">{surfista.idade} anos</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">WhatsApp</span>
                  <p className="text-sm">{surfista.telefone_surfista}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Instagram</span>
                  <p className="text-sm">{surfista.arroba_instagram || 'Não informado'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">RG/CPF</span>
                  <p className="text-sm">{surfista.rg_cpf_surfista || 'Não informado'}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-sm font-medium text-muted-foreground">Endereço Completo</span>
                  <p className="text-sm">{surfista.endereco_completo_surfista}</p>
                </div>
              </CardContent>
            </Card>

            {/* Escola e Atividades */}
            <Card>
              <CardHeader>
                <CardTitle>Escola e Atividades</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Escola/Série</span>
                  <p className="text-sm">{surfista.escola_serie_ano}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Tamanho da Camiseta</span>
                  <p className="text-sm">{surfista.tamanho_camiseta_surfista}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Toca Instrumento</span>
                  <p className="text-sm">{surfista.instrumento || 'Não toca'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Irmãos</span>
                  <p className="text-sm">{surfista.irmaos || 'Não informado'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Responsáveis */}
            <Card>
              <CardHeader>
                <CardTitle>Responsáveis</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Nome do Pai</span>
                  <p className="text-sm">{surfista.nome_pai}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Telefone do Pai</span>
                  <p className="text-sm">{surfista.telefone_pai}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Nome da Mãe</span>
                  <p className="text-sm">{surfista.nome_mae}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Telefone da Mãe</span>
                  <p className="text-sm">{surfista.telefone_mae}</p>
                </div>
              </CardContent>
            </Card>

            {/* Informações de Saúde e Religiosas */}
            <Card>
              <CardHeader>
                <CardTitle>Saúde e Informações Religiosas</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Medicamentos</span>
                  <p className="text-sm">{surfista.medicamento || 'Não toma medicamentos'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Alergias</span>
                  <p className="text-sm">{surfista.alergia || 'Não tem alergias'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Fobias</span>
                  <p className="text-sm">{surfista.fobia || 'Não tem fobias'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Primeira Comunhão</span>
                  <p className="text-sm">{surfista.fez_primeira_comunhao}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Crisma</span>
                  <p className="text-sm">{surfista.fez_crisma}</p>
                </div>
              </CardContent>
            </Card>

            {/* Informações Adicionais */}
            {surfista.informacao_adicional_surfista && (
              <Card>
                <CardHeader>
                  <CardTitle>Informações Adicionais</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{surfista.informacao_adicional_surfista}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SurfistaDetailModal;
