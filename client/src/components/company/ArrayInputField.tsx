import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";

import type { ArrayInputFieldProps } from '@/interfaces/company/array-input-field-props.interface';

export const ArrayInputField: React.FC<ArrayInputFieldProps> = ({
  field,
  label,
  placeholder,
  helperText,
  value,
  required = false,
  error,
  onChange,
}) => {
  const [newItem, setNewItem] = useState("");

  const handleAddItem = () => {
    if (newItem.trim() && !value.includes(newItem.trim())) {
      onChange(field, [...value, newItem.trim()]);
      setNewItem("");
    }
  };

  const handleRemoveItem = (itemToRemove: string) => {
    onChange(field, value.filter(item => item !== itemToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  };

  return (
    <div className="flex gap-30 w-full">
      <div className="flex flex-col gap-1 w-180">
        <h3 className="text-sm font-semibold text-[#25324B]">
          {label} {required && <span className="text-red-500">*</span>}
        </h3>
        <p className="text-sm text-[#7C8493]">{helperText}</p>
      </div>
      <div className="flex flex-col gap-3 w-full">
        {}
        <div className="flex items-center gap-2">
          <Input
            placeholder={placeholder}
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-[300px] h-11 px-4 py-3 border border-[#D6DDEB] rounded-[10px] text-sm"
          />
          <Button
            type="button"
            onClick={handleAddItem}
            disabled={!newItem.trim()}
            className="h-11 px-4 py-2 bg-[#4640DE] text-white rounded-[10px] hover:bg-[#3A35C7] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {}
        {value.length > 0 && (
          <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
            {value.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-[#F8F8FD] border border-[#D6DDEB] rounded-[10px] px-3 py-2"
              >
                <span className="text-sm text-[#25324B] flex-1">{item}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item)}
                  className="text-[#7C8493] hover:text-red-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {}
        <div className="flex justify-between items-center">
          <span className="text-xs text-[#7C8493]">
            {value.length} item{value.length !== 1 ? 's' : ''} added
          </span>
          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};