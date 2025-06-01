
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MultiSelectFilter from './MultiSelectFilter';
import SortSelect from './SortSelect';
import { Search, Filter, X } from 'lucide-react';

type SurfistasFiltersProps = {
  data: any[];
  onFilteredDataChange: (filteredData: any[]) => void;
};

const SurfistasFilters = ({ data, onFilteredDataChange }: SurfistasFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string[]>([]);
  const [selectedPaymentType, setSelectedPaymentType] = useState<string[]>([]);
  const [selectedShirtSizes, setSelectedShirtSizes] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('nome_surfista');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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

  const processedData = data.map(surfista => ({
    ...surfista,
    idade: calcularIdade(surfista.data_nascimento),
  }));

  // Extrair opções únicas dos dados
  const statusOptions = [...new Set(processedData.map(item => item.status_inscricao))].filter(Boolean).map(status => ({
    value: status,
    label: status === 'confirmado' ? 'Confirmado' : 
           status === 'pendente' ? 'Pendente' : 
           status === 'lista_espera' ? 'Lista de Espera' : status
  }));

  const paymentStatusOptions = [...new Set(processedData.map(item => item.status_pagamento))].filter(Boolean).map(status => ({
    value: status,
    label: status === 'pago' ? 'Pago' : 
           status === 'pendente' ? 'Pendente' : 
           status === 'nao_pago' ? 'Não Pago' : status
  }));

  const paymentTypeOptions = [...new Set(processedData.map(item => item.tipo_pagamento))].filter(Boolean).map(type => ({
    value: type,
    label: type === 'pix' ? 'PIX' : type === 'dinheiro' ? 'Dinheiro' : type
  }));

  const shirtSizeOptions = [...new Set(processedData.map(item => item.tamanho_camiseta_surfista))].filter(Boolean).map(size => ({
    value: size,
    label: size
  }));

  const sortOptions = [
    { value: 'nome_surfista', label: 'Nome' },
    { value: 'idade', label: 'Idade' },
    { value: 'status_inscricao', label: 'Status de Inscrição' },
    { value: 'status_pagamento', label: 'Status de Pagamento' },
    { value: 'created_at', label: 'Data de Inscrição' },
  ];

  const applyFilters = () => {
    let filtered = [...processedData];

    // Filtro por termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.nome_surfista?.toLowerCase().includes(term) ||
        item.telefone_surfista?.includes(term) ||
        item.escola_serie_ano?.toLowerCase().includes(term)
      );
    }

    // Filtro por status de inscrição
    if (selectedStatus.length > 0) {
      filtered = filtered.filter(item => selectedStatus.includes(item.status_inscricao));
    }

    // Filtro por status de pagamento
    if (selectedPaymentStatus.length > 0) {
      filtered = filtered.filter(item => selectedPaymentStatus.includes(item.status_pagamento));
    }

    // Filtro por tipo de pagamento
    if (selectedPaymentType.length > 0) {
      filtered = filtered.filter(item => selectedPaymentType.includes(item.tipo_pagamento));
    }

    // Filtro por tamanho de camiseta
    if (selectedShirtSizes.length > 0) {
      filtered = filtered.filter(item => selectedShirtSizes.includes(item.tamanho_camiseta_surfista));
    }

    // Filtro por faixa etária
    if (ageRange.min) {
      filtered = filtered.filter(item => item.idade >= parseInt(ageRange.min));
    }
    if (ageRange.max) {
      filtered = filtered.filter(item => item.idade <= parseInt(ageRange.max));
    }

    // Aplicar ordenação
    filtered.sort((a, b) => {
      let valueA = a[sortBy];
      let valueB = b[sortBy];

      // Tratamento especial para datas
      if (sortBy === 'created_at') {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      }

      // Tratamento especial para números
      if (sortBy === 'idade') {
        valueA = Number(valueA) || 0;
        valueB = Number(valueB) || 0;
      }

      // Tratamento para strings
      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
      }
      if (typeof valueB === 'string') {
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    onFilteredDataChange(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedStatus, selectedPaymentStatus, selectedPaymentType, selectedShirtSizes, ageRange, sortBy, sortOrder, data]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedStatus([]);
    setSelectedPaymentStatus([]);
    setSelectedPaymentType([]);
    setSelectedShirtSizes([]);
    setAgeRange({ min: '', max: '' });
    setSortBy('nome_surfista');
    setSortOrder('asc');
  };

  const hasActiveFilters = searchTerm || selectedStatus.length > 0 || selectedPaymentStatus.length > 0 || 
                         selectedPaymentType.length > 0 || selectedShirtSizes.length > 0 || 
                         ageRange.min || ageRange.max;

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros e Busca
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              <X className="h-4 w-4 mr-1" />
              Limpar Filtros
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, telefone ou escola..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtros em Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MultiSelectFilter
            options={statusOptions}
            selectedValues={selectedStatus}
            onSelectionChange={setSelectedStatus}
            placeholder="Status de Inscrição"
            label="Status de Inscrição"
          />
          
          <MultiSelectFilter
            options={paymentStatusOptions}
            selectedValues={selectedPaymentStatus}
            onSelectionChange={setSelectedPaymentStatus}
            placeholder="Status de Pagamento"
            label="Status de Pagamento"
          />

          <MultiSelectFilter
            options={paymentTypeOptions}
            selectedValues={selectedPaymentType}
            onSelectionChange={setSelectedPaymentType}
            placeholder="Tipo de Pagamento"
            label="Tipo de Pagamento"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MultiSelectFilter
            options={shirtSizeOptions}
            selectedValues={selectedShirtSizes}
            onSelectionChange={setSelectedShirtSizes}
            placeholder="Tamanho da Camiseta"
            label="Tamanho da Camiseta"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Faixa Etária</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={ageRange.min}
                onChange={(e) => setAgeRange(prev => ({ ...prev, min: e.target.value }))}
                className="w-20"
              />
              <span className="self-center">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={ageRange.max}
                onChange={(e) => setAgeRange(prev => ({ ...prev, max: e.target.value }))}
                className="w-20"
              />
            </div>
          </div>

          <SortSelect
            options={sortOptions}
            value={sortBy}
            order={sortOrder}
            onValueChange={setSortBy}
            onOrderChange={setSortOrder}
          />
        </div>

        {/* Badges dos filtros ativos */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2">
            {searchTerm && (
              <Badge variant="secondary">
                Busca: {searchTerm}
              </Badge>
            )}
            {selectedStatus.map(status => (
              <Badge key={status} variant="secondary">
                Status: {statusOptions.find(opt => opt.value === status)?.label}
              </Badge>
            ))}
            {selectedPaymentStatus.map(status => (
              <Badge key={status} variant="secondary">
                Pagamento: {paymentStatusOptions.find(opt => opt.value === status)?.label}
              </Badge>
            ))}
            {selectedPaymentType.map(type => (
              <Badge key={type} variant="secondary">
                Tipo: {paymentTypeOptions.find(opt => opt.value === type)?.label}
              </Badge>
            ))}
            {selectedShirtSizes.map(size => (
              <Badge key={size} variant="secondary">
                Camiseta: {size}
              </Badge>
            ))}
            {(ageRange.min || ageRange.max) && (
              <Badge variant="secondary">
                Idade: {ageRange.min || '0'} - {ageRange.max || '∞'}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SurfistasFilters;
