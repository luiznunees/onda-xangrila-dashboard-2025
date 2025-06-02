import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Filter } from "lucide-react";
import MultiSelectFilter from "./MultiSelectFilter";
import SortSelect from "./SortSelect";

interface PreInscricao {
  id: string;
  nome_completo: string;
  idade: number;
  cidade: string;
  bairro: string;
  nome_responsavel: string;
  telefone_responsavel: string;
  created_at: string;
}

interface PreInscricoesFiltersProps {
  data: PreInscricao[];
  onFilteredDataChange: (filteredData: PreInscricao[]) => void;
}

const PreInscricoesFilters = ({ data, onFilteredDataChange }: PreInscricoesFiltersProps) => {
  const [selectedCidades, setSelectedCidades] = useState<string[]>([]);
  const [selectedIdades, setSelectedIdades] = useState<string[]>([]);
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
    
    // Retorna a cidade mais frequente ou a primeira se todas têm a mesma frequência
    const cityCount = matchingCities.reduce((acc, city) => {
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(cityCount)
      .sort(([,a], [,b]) => b - a)[0][0];
  };

  // Gerar opções únicas para cidades (normalizadas)
  const allCities = data.map(item => item.cidade);
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

  const idadeOptions = Array.from(new Set(data.map(item => item.idade)))
    .sort((a, b) => a - b)
    .map(idade => ({ value: idade.toString(), label: `${idade} anos` }));

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
    { value: 'created_at', label: 'Data de Inscrição' },
    { value: 'nome_completo', label: 'Nome' },
    { value: 'idade', label: 'Idade' },
    { value: 'cidade', label: 'Cidade' }
  ];

  // Aplicar filtros e ordenação
  useEffect(() => {
    let filteredData = [...data];

    // Filtro por cidade (considerando normalização)
    if (selectedCidades.length > 0) {
      filteredData = filteredData.filter(item => {
        const normalizedItemCity = normalizeText(item.cidade);
        return selectedCidades.some(selectedCity => 
          normalizeText(selectedCity) === normalizedItemCity
        );
      });
    }

    // Filtro por idade
    if (selectedIdades.length > 0) {
      filteredData = filteredData.filter(item => 
        selectedIdades.includes(item.idade.toString())
      );
    }

    // Filtro por mês de inscrição
    if (selectedMeses.length > 0) {
      filteredData = filteredData.filter(item => {
        const mesInscricao = new Date(item.created_at).getMonth() + 1;
        const mesString = mesInscricao.toString().padStart(2, '0');
        return selectedMeses.includes(mesString);
      });
    }

    // Aplicar ordenação
    filteredData.sort((a, b) => {
      let valueA = a[sortBy as keyof PreInscricao];
      let valueB = b[sortBy as keyof PreInscricao];
      
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
  }, [selectedCidades, selectedIdades, selectedMeses, sortBy, sortOrder, data, onFilteredDataChange]);

  // Limpar todos os filtros
  const clearAllFilters = () => {
    setSelectedCidades([]);
    setSelectedIdades([]);
    setSelectedMeses([]);
    setSortBy("created_at");
    setSortOrder("desc");
  };

  // Contar filtros ativos
  const activeFiltersCount = selectedCidades.length + selectedIdades.length + selectedMeses.length;

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
            label="Mês de Inscrição"
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
          <div className="flex items-center gap-2">
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

export default PreInscricoesFilters;
