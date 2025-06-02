
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Filter } from "lucide-react";
import MultiSelectFilter from "./MultiSelectFilter";
import SortSelect from "./SortSelect";

interface Surfista {
  id: string;
  nome_surfista: string;
  idade: number;
  escola_serie_ano: string;
  tamanho_camiseta_surfista: string;
  status_inscricao?: string;
  status_pagamento?: string;
  tipo_pagamento?: string;
  created_at: string;
}

interface SurfistasFiltersProps {
  data: Surfista[];
  onFilteredDataChange: (filteredData: Surfista[]) => void;
}

const SurfistasFilters = ({ data, onFilteredDataChange }: SurfistasFiltersProps) => {
  const [selectedStatusInscricao, setSelectedStatusInscricao] = useState<string[]>([]);
  const [selectedStatusPagamento, setSelectedStatusPagamento] = useState<string[]>([]);
  const [selectedTipoPagamento, setSelectedTipoPagamento] = useState<string[]>([]);
  const [selectedIdades, setSelectedIdades] = useState<string[]>([]);
  const [selectedTamanhos, setSelectedTamanhos] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<string>("newest");

  // Opções para filtros
  const statusInscricaoOptions = [
    { value: 'pendente', label: 'Pendente' },
    { value: 'confirmado', label: 'Confirmado' },
    { value: 'lista_espera', label: 'Lista de Espera' }
  ];

  const statusPagamentoOptions = [
    { value: 'nao_pago', label: 'Não Pago' },
    { value: 'pendente', label: 'Pendente' },
    { value: 'pago', label: 'Pago' }
  ];

  const tipoPagamentoOptions = [
    { value: 'pix', label: 'PIX' },
    { value: 'dinheiro', label: 'Dinheiro' }
  ];

  const idadeOptions = Array.from(new Set(data.map(item => item.idade)))
    .sort((a, b) => a - b)
    .map(idade => ({ value: idade.toString(), label: `${idade} anos` }));

  const tamanhoOptions = Array.from(new Set(data.map(item => item.tamanho_camiseta_surfista)))
    .sort()
    .map(tamanho => ({ value: tamanho, label: tamanho }));

  // Aplicar filtros e ordenação
  useEffect(() => {
    let filteredData = [...data];

    // Filtro por status de inscrição
    if (selectedStatusInscricao.length > 0) {
      filteredData = filteredData.filter(item => 
        selectedStatusInscricao.includes(item.status_inscricao || 'pendente')
      );
    }

    // Filtro por status de pagamento
    if (selectedStatusPagamento.length > 0) {
      filteredData = filteredData.filter(item => 
        selectedStatusPagamento.includes(item.status_pagamento || 'nao_pago')
      );
    }

    // Filtro por tipo de pagamento
    if (selectedTipoPagamento.length > 0) {
      filteredData = filteredData.filter(item => 
        item.tipo_pagamento && selectedTipoPagamento.includes(item.tipo_pagamento)
      );
    }

    // Filtro por idade
    if (selectedIdades.length > 0) {
      filteredData = filteredData.filter(item => 
        selectedIdades.includes(item.idade.toString())
      );
    }

    // Filtro por tamanho de camiseta
    if (selectedTamanhos.length > 0) {
      filteredData = filteredData.filter(item => 
        selectedTamanhos.includes(item.tamanho_camiseta_surfista)
      );
    }

    // Aplicar ordenação por data
    filteredData.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      
      if (sortOrder === "newest") {
        return dateB - dateA; // Mais recentes primeiro
      } else {
        return dateA - dateB; // Mais antigas primeiro
      }
    });

    onFilteredDataChange(filteredData);
  }, [selectedStatusInscricao, selectedStatusPagamento, selectedTipoPagamento, selectedIdades, selectedTamanhos, sortOrder, data, onFilteredDataChange]);

  // Limpar todos os filtros
  const clearAllFilters = () => {
    setSelectedStatusInscricao([]);
    setSelectedStatusPagamento([]);
    setSelectedTipoPagamento([]);
    setSelectedIdades([]);
    setSelectedTamanhos([]);
    setSortOrder("newest");
  };

  // Contar filtros ativos
  const activeFiltersCount = selectedStatusInscricao.length + selectedStatusPagamento.length + 
                            selectedTipoPagamento.length + selectedIdades.length + selectedTamanhos.length;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros e Ordenação
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">{activeFiltersCount} filtro(s) ativo(s)</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
          <MultiSelectFilter
            title="Status da Inscrição"
            options={statusInscricaoOptions}
            selectedValues={selectedStatusInscricao}
            onSelectionChange={setSelectedStatusInscricao}
            placeholder="Todos os status"
          />
          
          <MultiSelectFilter
            title="Status do Pagamento"
            options={statusPagamentoOptions}
            selectedValues={selectedStatusPagamento}
            onSelectionChange={setSelectedStatusPagamento}
            placeholder="Todos os status"
          />

          <MultiSelectFilter
            title="Tipo de Pagamento"
            options={tipoPagamentoOptions}
            selectedValues={selectedTipoPagamento}
            onSelectionChange={setSelectedTipoPagamento}
            placeholder="Todos os tipos"
          />
          
          <MultiSelectFilter
            title="Idade"
            options={idadeOptions}
            selectedValues={selectedIdades}
            onSelectionChange={setSelectedIdades}
            placeholder="Todas as idades"
          />

          <MultiSelectFilter
            title="Tamanho Camiseta"
            options={tamanhoOptions}
            selectedValues={selectedTamanhos}
            onSelectionChange={setSelectedTamanhos}
            placeholder="Todos os tamanhos"
          />

          <SortSelect
            value={sortOrder}
            onValueChange={setSortOrder}
          />
        </div>

        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Filtros ativos:</span>
            
            {selectedStatusInscricao.map(status => (
              <Badge key={`status-inscricao-${status}`} variant="outline" className="gap-1">
                Status: {statusInscricaoOptions.find(s => s.value === status)?.label}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setSelectedStatusInscricao(prev => prev.filter(s => s !== status))}
                />
              </Badge>
            ))}

            {selectedStatusPagamento.map(status => (
              <Badge key={`status-pagamento-${status}`} variant="outline" className="gap-1">
                Pagamento: {statusPagamentoOptions.find(s => s.value === status)?.label}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setSelectedStatusPagamento(prev => prev.filter(s => s !== status))}
                />
              </Badge>
            ))}

            {selectedTipoPagamento.map(tipo => (
              <Badge key={`tipo-pagamento-${tipo}`} variant="outline" className="gap-1">
                Tipo: {tipoPagamentoOptions.find(t => t.value === tipo)?.label}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setSelectedTipoPagamento(prev => prev.filter(t => t !== tipo))}
                />
              </Badge>
            ))}

            {selectedIdades.map(idade => (
              <Badge key={`idade-${idade}`} variant="outline" className="gap-1">
                {idade} anos
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setSelectedIdades(prev => prev.filter(i => i !== idade))}
                />
              </Badge>
            ))}

            {selectedTamanhos.map(tamanho => (
              <Badge key={`tamanho-${tamanho}`} variant="outline" className="gap-1">
                {tamanho}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setSelectedTamanhos(prev => prev.filter(t => t !== tamanho))}
                />
              </Badge>
            ))}
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Limpar todos
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SurfistasFilters;
