
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface SortSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

const SortSelect = ({ value, onValueChange }: SortSelectProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium flex items-center gap-2">
        <ArrowUpDown className="h-4 w-4" />
        Ordenar por Data
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Selecionar ordenação" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">
            <div className="flex items-center gap-2">
              <ArrowDown className="h-4 w-4" />
              Mais recentes primeiro
            </div>
          </SelectItem>
          <SelectItem value="oldest">
            <div className="flex items-center gap-2">
              <ArrowUp className="h-4 w-4" />
              Mais antigas primeiro
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortSelect;
