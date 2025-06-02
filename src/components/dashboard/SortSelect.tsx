
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface SortSelectProps {
  options: { value: string; label: string }[];
  value: string;
  order: 'asc' | 'desc';
  onValueChange: (value: string) => void;
  onOrderChange: (order: 'asc' | 'desc') => void;
}

const SortSelect = ({ options, value, order, onValueChange, onOrderChange }: SortSelectProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium flex items-center gap-2">
        <ArrowUpDown className="h-4 w-4" />
        Ordenar por
      </label>
      <div className="flex gap-2">
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Selecionar campo" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={order} onValueChange={(value: 'asc' | 'desc') => onOrderChange(value)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">
              <div className="flex items-center gap-2">
                <ArrowUp className="h-4 w-4" />
                A-Z
              </div>
            </SelectItem>
            <SelectItem value="desc">
              <div className="flex items-center gap-2">
                <ArrowDown className="h-4 w-4" />
                Z-A
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SortSelect;
