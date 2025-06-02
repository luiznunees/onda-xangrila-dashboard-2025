
import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

interface MultiSelectFilterProps {
  options: { value: string; label: string }[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder?: string;
  label?: string;
}

const MultiSelectFilter = ({
  options,
  selectedValues,
  onSelectionChange,
  placeholder = "Selecionar...",
  label
}: MultiSelectFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleOption = (value: string) => {
    const newSelection = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedValues.length === options.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(options.map(opt => opt.value));
    }
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) return placeholder;
    if (selectedValues.length === 1) {
      const option = options.find(opt => opt.value === selectedValues[0]);
      return option?.label || selectedValues[0];
    }
    return `${selectedValues.length} selecionados`;
  };

  return (
    <div className="flex flex-col space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="truncate">{getDisplayText()}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white border shadow-md" align="start">
          <div className="p-2">
            <div className="flex items-center space-x-2 mb-2 pb-2 border-b">
              <Checkbox
                id="select-all"
                checked={selectedValues.length === options.length}
                onCheckedChange={handleSelectAll}
              />
              <label
                htmlFor="select-all"
                className="text-sm font-medium cursor-pointer"
              >
                Selecionar todos
              </label>
            </div>
            <div className="max-h-60 overflow-auto">
              {options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2 py-1">
                  <Checkbox
                    id={option.value}
                    checked={selectedValues.includes(option.value)}
                    onCheckedChange={() => handleToggleOption(option.value)}
                  />
                  <label
                    htmlFor={option.value}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MultiSelectFilter;
