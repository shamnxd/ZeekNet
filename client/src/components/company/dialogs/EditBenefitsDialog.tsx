import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { Benefit } from '@/interfaces/company/company-data.interface';
import type { EditBenefitsDialogProps } from '@/interfaces/company/dialogs/edit-benefits-dialog-props.interface';

const EditBenefitsDialog: React.FC<EditBenefitsDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  benefits
}) => {
  const [items, setItems] = useState<Benefit[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setItems(benefits.length > 0 ? [...benefits] : [{
        perk: '',
        description: ''
      }]);
      setErrors({});
    }
  }, [isOpen, benefits]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    items.forEach((item, index) => {
      if (!item.perk?.trim()) {
        newErrors[`perk-${index}`] = 'Benefit name is required';
        isValid = false;
      }
      if (!item.description?.trim()) {
        newErrors[`description-${index}`] = 'Description is required';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fill in all required fields');
      return;
    }
    onSave(items);
    onClose();
  };

  const addItem = () => {
    setItems(prev => [...prev, { perk: '', description: '' }]);
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
    const newErrors = { ...errors };
    delete newErrors[`perk-${index}`];
    delete newErrors[`description-${index}`];
    setErrors(newErrors);
  };

  const updateItem = (index: number, field: keyof Benefit, value: string) => {
    setItems(prev => prev.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ));
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
          <DialogTitle>Edit Benefits & Perks</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            {items.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Benefit {index + 1}</h4>
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

                <div>
                  <Label htmlFor={`perk-${index}`}>Benefit/Perk Name *</Label>
                  <Input
                    id={`perk-${index}`}
                    value={item.perk}
                    onChange={(e) => updateItem(index, 'perk', e.target.value)}
                    placeholder="e.g., Health Insurance, Flexible Hours"
                    className={errors[`perk-${index}`] ? 'border-red-500' : ''}
                  />
                  {errors[`perk-${index}`] && (
                    <p className="text-xs text-red-500 mt-1">{errors[`perk-${index}`]}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor={`description-${index}`}>Description *</Label>
                  <Textarea
                    id={`description-${index}`}
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    placeholder="Describe this benefit in detail..."
                    rows={3}
                    className={errors[`description-${index}`] ? 'border-red-500' : ''}
                  />
                  {errors[`description-${index}`] && (
                    <p className="text-xs text-red-500 mt-1">{errors[`description-${index}`]}</p>
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
            Add Benefit
          </Button>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Benefits
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};


export default EditBenefitsDialog;