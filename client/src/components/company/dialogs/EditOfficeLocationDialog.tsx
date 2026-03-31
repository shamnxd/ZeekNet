import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus } from 'lucide-react';
import type { OfficeLocation } from '@/interfaces/company/company-data.interface';
import type { EditOfficeLocationDialogProps } from '@/interfaces/company/dialogs/edit-office-location-dialog-props.interface';

const EditOfficeLocationDialog: React.FC<EditOfficeLocationDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  locations
}) => {
  const [items, setItems] = useState<OfficeLocation[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setItems(locations.length > 0 ? [...locations] : [{
        location: '',
        officeName: '',
        address: '',
        isHeadquarters: false
      }]);
      setErrors({});
    }
  }, [isOpen, locations]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    items.forEach((item, index) => {
      if (!item.officeName?.trim()) {
        newErrors[`officeName-${index}`] = 'Office name is required';
        isValid = false;
      }
      if (!item.location?.trim()) {
        newErrors[`location-${index}`] = 'City/Location is required';
        isValid = false;
      }
      if (!item.address?.trim()) {
        newErrors[`address-${index}`] = 'Address is required';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(items);
    onClose();
  };

  const addItem = () => {
    setItems(prev => [...prev, {
      location: '',
      officeName: '',
      address: '',
      isHeadquarters: false
    }]);
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
    // Also clean up errors for removed item
    const newErrors = { ...errors };
    delete newErrors[`officeName-${index}`];
    delete newErrors[`location-${index}`];
    delete newErrors[`address-${index}`];
    setErrors(newErrors);
  };

  const updateItem = (index: number, field: keyof OfficeLocation, value: string | boolean) => {
    setItems(prev => prev.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ));
    // Clear error when user types
    if (errors[`${field}-${index}`]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[`${field}-${index}`];
        return next;
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Office Locations</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            {items.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Office Location {index + 1}</h4>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`officeName-${index}`}>Office Name *</Label>
                    <Input
                      id={`officeName-${index}`}
                      value={item.officeName}
                      onChange={(e) => updateItem(index, 'officeName', e.target.value)}
                      placeholder="e.g., Main Office, Branch Office"
                      className={errors[`officeName-${index}`] ? 'border-red-500' : ''}
                    />
                    {errors[`officeName-${index}`] && (
                      <p className="text-xs text-red-500 mt-1">{errors[`officeName-${index}`]}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor={`location-${index}`}>Location *</Label>
                    <Input
                      id={`location-${index}`}
                      value={item.location}
                      onChange={(e) => updateItem(index, 'location', e.target.value)}
                      placeholder="e.g., New York, NY"
                      className={errors[`location-${index}`] ? 'border-red-500' : ''}
                    />
                    {errors[`location-${index}`] && (
                      <p className="text-xs text-red-500 mt-1">{errors[`location-${index}`]}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor={`address-${index}`}>Address *</Label>
                  <Textarea
                    id={`address-${index}`}
                    value={item.address}
                    onChange={(e) => updateItem(index, 'address', e.target.value)}
                    placeholder="Full address of the office"
                    rows={2}
                    className={errors[`address-${index}`] ? 'border-red-500' : ''}
                  />
                  {errors[`address-${index}`] && (
                    <p className="text-xs text-red-500 mt-1">{errors[`address-${index}`]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={addItem}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Office Location
          </Button>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Locations
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};


export default EditOfficeLocationDialog;