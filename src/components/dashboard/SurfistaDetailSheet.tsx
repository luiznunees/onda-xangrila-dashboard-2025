
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import SurfistaStatusManager from './SurfistaStatusManager';

type SurfistaDetailSheetProps = {
  surfista: any;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
};

const SurfistaDetailSheet = ({ surfista, isOpen, onOpenChange, onUpdate }: SurfistaDetailSheetProps) => {
  if (!surfista) return null;

  const calcularIdade = (dataNascimento: string): number => {
    const hoje = new Date();
    const dataNasc = new Date(dataNascimento);
    let idade = hoje.getFullYear() - dataNasc.getFullYear();
    const m = hoje.getMonth() - dataNasc.getMonth();
    
    if (m < 0 || (m === 0 && hoje.getDate() < dataNasc.getDate())) {
      idade--;
    }
    
    return idade;
  };

  const renderBooleanField = (value: string, trueText: string, falseText: string = 'Não') => {
    if (value === 'Sim' || value === 'sim') {
      return <Badge variant="outline" className="bg-green-50 text-green-800">{trueText}</Badge>;
    }
    return <Badge variant="outline" className="bg-gray-50 text-gray-600">{falseText}</Badge>;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-4xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl">Ficha do Surfista - {surfista.nome_surfista}</SheetTitle>
        </SheetHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coluna Esquerda - Dados Pessoais */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nome Completo</label>
                    <p className="font-medium">{surfista.nome_surfista}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Idade</label>
                    <p className="font-medium">{calcularIdade(surfista.data_nascimento)} anos</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Data de Nascimento</label>
                  <p className="font-medium">{new Date(surfista.data_nascimento).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">WhatsApp</label>
                  <p className="font-medium">{surfista.telefone_surfista}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">RG/CPF</label>
                  <p className="font-medium">{surfista.rg_cpf_surfista || 'Não informado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Endereço</label>
                  <p className="font-medium">{surfista.endereco_completo_surfista}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Escola e Educação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Escola/Série</label>
                  <p className="font-medium">{surfista.escola_serie_ano}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Primeira Comunhão</label>
                    {renderBooleanField(surfista.fez_primeira_comunhao, 'Sim')}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Crisma</label>
                    {renderBooleanField(surfista.fez_crisma, 'Sim')}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Responsáveis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nome do Pai</label>
                    <p className="font-medium">{surfista.nome_pai}</p>
                    <label className="text-sm font-medium text-gray-600 mt-2 block">Telefone</label>
                    <p className="font-medium">{surfista.telefone_pai}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nome da Mãe</label>
                    <p className="font-medium">{surfista.nome_mae}</p>
                    <label className="text-sm font-medium text-gray-600 mt-2 block">Telefone</label>
                    <p className="font-medium">{surfista.telefone_mae}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita - Informações Adicionais e Gerenciamento */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Gerais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Tamanho da Camiseta</label>
                  <Badge variant="outline" className="ml-2">{surfista.tamanho_camiseta_surfista}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Instagram</label>
                  <p className="font-medium">{surfista.arroba_instagram || 'Não possui'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Irmãos</label>
                  <p className="font-medium">{surfista.irmaos || 'Não informado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Instrumento</label>
                  <p className="font-medium">{surfista.instrumento || 'Não toca'}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Saúde</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Medicamentos</label>
                  <p className="font-medium">{surfista.medicamento || 'Nenhum'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Alergias</label>
                  <p className="font-medium">{surfista.alergia || 'Nenhuma'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Fobias</label>
                  <p className="font-medium">{surfista.fobia || 'Nenhuma'}</p>
                </div>
              </CardContent>
            </Card>

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

            <Separator />

            {/* Gerenciamento de Status e Pagamento */}
            <SurfistaStatusManager 
              surfista={surfista} 
              onUpdate={onUpdate}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SurfistaDetailSheet;
