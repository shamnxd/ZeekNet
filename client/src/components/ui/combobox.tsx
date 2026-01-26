import * as React from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { ComboboxOption, ComboboxProps } from '@/interfaces/ui/combobox-props.interface';

export type { ComboboxOption };

export function Combobox({
  options,
  value = [],
  onChange,
  placeholder = "Type to search...",
  multiple = true,
  disabled = false,
  className,
  onSearch,
  loading = false,
  inputClassName,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!multiple && value.length > 0) {
      const option = options.find(opt => opt.value === value[0]);
      setSearchTerm(option ? option.label : value[0]);
    }
  }, [value, multiple, options]);

  const filteredOptions = React.useMemo(() => {
    if (!searchTerm) return [];
    const term = searchTerm.toLowerCase();
    return options.filter((option) => {
      if (!option || !option.value || !option.label) return false;
      const isSelected = value.includes(option.value);
      const matches = option.label.toLowerCase().includes(term);
      return matches && !isSelected;
    });
  }, [options, searchTerm, value]);

  const handleSelect = (selectedValue: string) => {
    if (multiple) {
      if (!value.includes(selectedValue)) {
        onChange([...value, selectedValue]);
      }
    } else {
      onChange([selectedValue]);
      const option = options.find(opt => opt.value === selectedValue);
      setSearchTerm(option ? option.label : selectedValue);
    }
    // setSearchTerm(""); // Removed for single select persistence
    if (multiple) setSearchTerm("");
    setOpen(false);
    inputRef.current?.focus();
  };

  const handleAddCustom = (customValue: string) => {
    const trimmed = customValue.trim();
    if (!trimmed) return;

    if (multiple) {
      if (!value.includes(trimmed)) {
        onChange([...value, trimmed]);
      }
    } else {
      onChange([trimmed]);
      setSearchTerm(trimmed);
    }
    // setSearchTerm("");
    if (multiple) setSearchTerm("");
    setOpen(false);
    inputRef.current?.focus();
  };

  const handleRemove = (valueToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== valueToRemove));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setOpen(term.length > 0);
    if (onSearch) {
      onSearch(term);
    }
  };

  const handleInputFocus = () => {
    if (searchTerm.length > 0) {
      setOpen(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => setOpen(false), 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      e.preventDefault();
      if (filteredOptions.length > 0) {
        handleSelect(filteredOptions[0].value);
      } else {
        handleAddCustom(searchTerm);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setSearchTerm("");
    }
  };

  const getLabelForValue = (val: string) => {
    const option = options.find((opt) => opt.value === val);
    return option ? option.label : val;
  };

  return (
    <div className={cn("relative", className)}>
      <div className="space-y-2">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={inputClassName}
        />
        {multiple && value.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {value.map((val) => (
              <Badge
                key={val}
                variant="secondary"
                className="px-2 py-1 text-sm"
              >
                {getLabelForValue(val)}
                <button
                  type="button"
                  onClick={(e) => handleRemove(val, e)}
                  className="ml-2 hover:bg-destructive/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md max-h-60 overflow-auto">
          {loading ? (
            <div className="px-2 py-6 text-center text-sm text-muted-foreground">
              Loading...
            </div>
          ) : filteredOptions.length === 0 ? (
            <div className="px-2 py-1">
              {searchTerm.trim() ? (
                <div
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleAddCustom(searchTerm);
                  }}
                  className="cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <span className="text-muted-foreground">Add "</span>
                  <span className="font-medium">{searchTerm}</span>
                  <span className="text-muted-foreground">"</span>
                </div>
              ) : (
                <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                  Type to search...
                </div>
              )}
            </div>
          ) : (
            <>
              {filteredOptions.map((option) => {
                return (
                  <div
                    key={option.value}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(option.value);
                    }}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Check className="mr-2 h-4 w-4 opacity-0" />
                    {option.label}
                  </div>
                );
              })}

              {searchTerm.trim() &&
                !filteredOptions.some(opt => opt?.value?.toLowerCase() === searchTerm.trim().toLowerCase()) &&
                !value.includes(searchTerm.trim()) && (
                  <div
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleAddCustom(searchTerm);
                    }}
                    className="cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground border-t"
                  >
                    <span className="text-muted-foreground">Add "</span>
                    <span className="font-medium">{searchTerm}</span>
                    <span className="text-muted-foreground">"</span>
                  </div>
                )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

