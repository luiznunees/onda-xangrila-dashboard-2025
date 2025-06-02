
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
  Eye,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { convertToCSV, downloadCSV, downloadPDF } from "@/utils/exportUtils";

interface Column {
  accessor: string;
  header: string;
  cell?: (value: any, row: any) => React.ReactNode;
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
  onDelete?: (id: string) => Promise<void>;
  onViewDetails?: (row: any) => void;
}

export function DataTable({
  title,
  data,
  columns,
  onExport,
  filters,
  detailFields,
  onDelete,
  onViewDetails,
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  
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

  const handleExport = (format: 'csv' | 'pdf') => {
    if (onExport) {
      // If custom export handler provided, use it
      onExport(format);
      return;
    }
    
    // Otherwise use built-in export functionality
    const timestamp = new Date().toISOString().slice(0, 10);
    const sanitizedTitle = title.toLowerCase().replace(/\s+/g, '-');
    
    if (format === 'csv') {
      const csvData = convertToCSV(filteredData, columns);
      downloadCSV(csvData, `${sanitizedTitle}-${timestamp}.csv`);
      
      toast({
        title: "Exportação concluída",
        description: `Dados exportados para formato CSV com sucesso`,
      });
    } else if (format === 'pdf') {
      downloadPDF(
        filteredData, 
        columns, 
        title, 
        `${sanitizedTitle}-${timestamp}.pdf`
      );
      
      toast({
        title: "Exportação concluída",
        description: `Dados exportados para formato PDF com sucesso`,
      });
    }
  };

  const handleViewDetails = (row: any) => {
    if (onViewDetails) {
      onViewDetails(row);
    } else {
      setSelectedRow(row);
      setIsDetailDialogOpen(true);
    }
  };

  const handleDeleteClick = (id: string) => {
    setRowToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!rowToDelete || !onDelete) return;
    
    try {
      await onDelete(rowToDelete);
      toast({
        title: "Item excluído",
        description: "O item foi excluído com sucesso",
      });
      setIsDeleteDialogOpen(false);
      setRowToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir item:", error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o item. Tente novamente.",
        variant: "destructive"
      });
    }
  };

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
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  Exportar CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  Exportar PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.accessor}>{column.header}</TableHead>
                ))}
                <TableHead className="w-[100px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, rowIndex) => (
                  <TableRow key={`row-${rowIndex}`}>
                    {columns.map((column) => (
                      <TableCell key={column.accessor}>
                        {column.cell 
                          ? column.cell(row[column.accessor], row)
                          : row[column.accessor]}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(row)}
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {onDelete && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(row.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="h-24 text-center">
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

      {/* Modal para detalhes (fallback case) */}
      {!onViewDetails && (
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes</DialogTitle>
              <DialogDescription>
                Informações completas do registro
              </DialogDescription>
            </DialogHeader>
            
            {selectedRow && detailFields && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                {detailFields.map((field, index) => (
                  <div key={index} className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">{field.label}</span>
                    <span className="text-sm">
                      {field.render
                        ? field.render(selectedRow[field.accessor], selectedRow)
                        : selectedRow[field.accessor] ?? '-'}
                    </span>
                  </div>
                ))}
              </div>
            )}
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Fechar</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de confirmação de exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Este item será permanentemente excluído
              do sistema e não poderá ser recuperado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

export default DataTable;
