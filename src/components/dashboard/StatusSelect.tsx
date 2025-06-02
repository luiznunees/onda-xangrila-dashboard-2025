
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface StatusSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  type: 'inscricao' | 'pagamento';
  disabled?: boolean;
}

const StatusSelect = ({ value, onValueChange, type, disabled = false }: StatusSelectProps) => {
  const getStatusOptions = () => {
    if (type === 'inscricao') {
      return [
        { value: 'pendente', label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'confirmado', label: 'Confirmado', color: 'bg-green-100 text-green-800' },
        { value: 'lista_espera', label: 'Lista de Espera', color: 'bg-orange-100 text-orange-800' }
      ];
    } else {
      return [
        { value: 'nao_pago', label: 'Não Pago', color: 'bg-red-100 text-red-800' },
        { value: 'pendente', label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'pago', label: 'Pago', color: 'bg-green-100 text-green-800' }
      ];
    }
  };

  const options = getStatusOptions();
  const currentOption = options.find(opt => opt.value === value);

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue>
          {currentOption && (
            <Badge variant="outline" className={currentOption.color}>
              {currentOption.label}
            </Badge>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <Badge variant="outline" className={option.color}>
              {option.label}
            </Badge>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StatusSelect;
