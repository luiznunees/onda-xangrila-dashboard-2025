import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Filter } from "lucide-react";
import MultiSelectFilter from "./MultiSelectFilter";
import SortSelect from "./SortSelect";

interface Confirmado {
  id: string;
  nome_completo: string;
  idade: number;
  cidade: string;
  bairro: string;
  nome_responsavel: string;
  telefone_responsavel: string;
  Status: string;
  created_at: string;
}

interface ConfirmadosFiltersProps {
  data: Confirmado[];
  onFilteredDataChange: (filteredData: Confirmado[]) => void;
}

const ConfirmadosFilters = ({ data, onFilteredDataChange }: ConfirmadosFiltersProps) => {
  const [selectedCidades, setSelectedCidades] = useState<string[]>([]);
  const [selectedIdades, setSelectedIdades] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedMeses, setSelectedMeses] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Função para normalizar texto
  const normalizeText = (text: string): string => {
    return text
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/\s+/g, ' '); // Remove espaços extras
  };

  // Função para encontrar a cidade mais comum com essa normalização
  const getMostCommonCity = (normalizedCity: string, cities: string[]): string => {
    const matchingCities = cities.filter(city => 
      normalizeText(city) === normalizedCity
    );
    
    const cityCount = matchingCities.reduce((acc, city) => {
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(cityCount)
      .sort(([,a], [,b]) => b - a)[0][0];
  };

  // Gerar opções únicas para cidades (normalizadas)
  const allCities = data.map(item => item.cidade).filter(Boolean);
  const normalizedCityMap = new Map<string, string>();
  
  allCities.forEach(city => {
    const normalized = normalizeText(city);
    if (!normalizedCityMap.has(normalized)) {
      normalizedCityMap.set(normalized, getMostCommonCity(normalized, allCities));
    }
  });

  const cidadeOptions = Array.from(normalizedCityMap.values())
    .sort()
    .map(cidade => ({ value: cidade, label: cidade }));

  const idadeOptions = Array.from(new Set(data.map(item => item.idade).filter(Boolean)))
    .sort((a, b) => a - b)
    .map(idade => ({ value: idade.toString(), label: `${idade} anos` }));

  // Opções de status únicos
  const statusOptions = Array.from(new Set(data.map(item => item.Status).filter(Boolean)))
    .sort()
    .map(status => ({ value: status, label: status }));

  // Opções de mês para filtro por data
  const mesOptions = [
    { value: "01", label: "Janeiro" },
    { value: "02", label: "Fevereiro" },
    { value: "03", label: "Março" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Maio" },
    { value: "06", label: "Junho" },
    { value: "07", label: "Julho" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" }
  ];

  const sortOptions = [
    { value: 'created_at', label: 'Data de Confirmação' },
    { value: 'nome_completo', label: 'Nome' },
    { value: 'idade', label: 'Idade' },
    { value: 'cidade', label: 'Cidade' },
    { value: 'Status', label: 'Status' }
  ];

  // Aplicar filtros e ordenação
  useEffect(() => {
    let filteredData = [...data];

    // Filtro por cidade (considerando normalização)
    if (selectedCidades.length > 0) {
      filteredData = filteredData.filter(item => {
        if (!item.cidade) return false;
        const normalizedItemCity = normalizeText(item.cidade);
        return selectedCidades.some(selectedCity => 
          normalizeText(selectedCity) === normalizedItemCity
        );
      });
    }

    // Filtro por idade
    if (selectedIdades.length > 0) {
      filteredData = filteredData.filter(item => 
        item.idade && selectedIdades.includes(item.idade.toString())
      );
    }

    // Filtro por status
    if (selectedStatus.length > 0) {
      filteredData = filteredData.filter(item => 
        item.Status && selectedStatus.includes(item.Status)
      );
    }

    // Filtro por mês de confirmação
    if (selectedMeses.length > 0) {
      filteredData = filteredData.filter(item => {
        if (!item.created_at) return false;
        const mesConfirmacao = new Date(item.created_at).getMonth() + 1;
        const mesString = mesConfirmacao.toString().padStart(2, '0');
        return selectedMeses.includes(mesString);
      });
    }

    // Aplicar ordenação
    filteredData.sort((a, b) => {
      let valueA = a[sortBy as keyof Confirmado];
      let valueB = b[sortBy as keyof Confirmado];
      
      if (sortBy === 'created_at') {
        valueA = new Date(valueA as string);
        valueB = new Date(valueB as string);
      }
      
      if (sortBy === 'idade') {
        valueA = Number(valueA) || 0;
        valueB = Number(valueB) || 0;
      }
      
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

    onFilteredDataChange(filteredData);
  }, [selectedCidades, selectedIdades, selectedStatus, selectedMeses, sortBy, sortOrder, data, onFilteredDataChange]);

  // Limpar todos os filtros
  const clearAllFilters = () => {
    setSelectedCidades([]);
    setSelectedIdades([]);
    setSelectedStatus([]);
    setSelectedMeses([]);
    setSortBy("created_at");
    setSortOrder("desc");
  };

  // Contar filtros ativos
  const activeFiltersCount = selectedCidades.length + selectedIdades.length + selectedStatus.length + selectedMeses.length;

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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <MultiSelectFilter
            label="Cidade"
            options={cidadeOptions}
            selectedValues={selectedCidades}
            onSelectionChange={setSelectedCidades}
            placeholder="Todas as cidades"
          />
          
          <MultiSelectFilter
            label="Idade"
            options={idadeOptions}
            selectedValues={selectedIdades}
            onSelectionChange={setSelectedIdades}
            placeholder="Todas as idades"
          />
          
          <MultiSelectFilter
            label="Status"
            options={statusOptions}
            selectedValues={selectedStatus}
            onSelectionChange={setSelectedStatus}
            placeholder="Todos os status"
          />
          
          <MultiSelectFilter
            label="Mês de Confirmação"
            options={mesOptions}
            selectedValues={selectedMeses}
            onSelectionChange={setSelectedMeses}
            placeholder="Todos os meses"
          />

          <SortSelect
            options={sortOptions}
            value={sortBy}
            order={sortOrder}
            onValueChange={setSortBy}
            onOrderChange={setSortOrder}
          />
        </div>

        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Filtros ativos:</span>
            
            {selectedCidades.map(cidade => (
              <Badge key={`cidade-${cidade}`} variant="outline" className="gap-1">
                {cidade}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setSelectedCidades(prev => prev.filter(c => c !== cidade))}
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
            
            {selectedStatus.map(status => (
              <Badge key={`status-${status}`} variant="outline" className="gap-1">
                {status}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setSelectedStatus(prev => prev.filter(s => s !== status))}
                />
              </Badge>
            ))}
            
            {selectedMeses.map(mes => (
              <Badge key={`mes-${mes}`} variant="outline" className="gap-1">
                {mesOptions.find(m => m.value === mes)?.label}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setSelectedMeses(prev => prev.filter(m => m !== mes))}
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

export default ConfirmadosFilters;
