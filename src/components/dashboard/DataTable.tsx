
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DownloadIcon,
  FilterIcon,
  SearchIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface Column {
  accessor: string;
  header: string;
  cell?: (value: any, row: any) => React.ReactNode;
  isCompact?: boolean;
}

interface DetailField {
  label: string;
  accessor: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  title: string;
  data: any[];
  columns: Column[];
  onExport?: (format: 'csv' | 'pdf') => void;
  filters?: React.ReactNode;
  detailFields?: DetailField[];
}

export function DataTable({
  title,
  data,
  columns,
  onExport,
  filters,
  detailFields,
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [expandedRows, setExpandedRows] = useState<Record<string | number, boolean>>({});
  
  // Função para alternar a expansão da linha
  const toggleRowExpansion = (rowIndex: number) => {
    setExpandedRows(prev => ({
      ...prev,
      [rowIndex]: !prev[rowIndex]
    }));
  };
  
  // Filtrar dados baseado no termo de busca
  const filteredData = data.filter(item =>
    Object.keys(item).some(key =>
      item[key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  
  // Calcular páginas
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Separar colunas compactas das detalhadas
  const compactColumns = columns.filter(col => col.isCompact !== false);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <CardTitle>{title}</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-[200px]"
              />
            </div>
            
            {filters && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <FilterIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {filters}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {onExport && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    Exportar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onExport('csv')}>
                    Exportar CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onExport('pdf')}>
                    Exportar PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {compactColumns.map((column) => (
                  <TableHead key={column.accessor}>{column.header}</TableHead>
                ))}
                {detailFields && <TableHead className="w-10"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, rowIndex) => (
                  <>
                    <TableRow key={`row-${rowIndex}`}>
                      {compactColumns.map((column) => (
                        <TableCell key={column.accessor}>
                          {column.cell 
                            ? column.cell(row[column.accessor], row)
                            : row[column.accessor]}
                        </TableCell>
                      ))}
                      {detailFields && (
                        <TableCell className="p-0 text-right">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => toggleRowExpansion(rowIndex)}
                            aria-label={expandedRows[rowIndex] ? "Recolher detalhes" : "Expandir detalhes"}
                          >
                            {expandedRows[rowIndex] ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                    {detailFields && (
                      <TableRow key={`details-${rowIndex}`} className="border-0">
                        <TableCell colSpan={compactColumns.length + 1} className="p-0">
                          <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out bg-muted/20 ${
                              expandedRows[rowIndex] ? 'max-h-96' : 'max-h-0'
                            }`}
                          >
                            {expandedRows[rowIndex] && (
                              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
                                {detailFields.map((field, fieldIndex) => (
                                  <div key={fieldIndex} className="flex flex-col">
                                    <span className="font-medium text-sm text-muted-foreground">{field.label}</span>
                                    <span className="text-sm">
                                      {field.render 
                                        ? field.render(row[field.accessor], row) 
                                        : row[field.accessor] || '-'}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length + (detailFields ? 1 : 0)} className="h-24 text-center">
                    Nenhum resultado encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {paginatedData.length} de {filteredData.length} registros
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm">
            Página {currentPage} de {totalPages || 1}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default DataTable;
