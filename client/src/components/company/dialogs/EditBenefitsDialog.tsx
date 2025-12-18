import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus } from 'lucide-react';
import type { Benefit } from '@/interfaces/company/benefit.interface';

interface EditBenefitsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (benefits: Benefit[]) => void;
  benefits: Benefit[];
}

const EditBenefitsDialog: React.FC<EditBenefitsDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  benefits
}) => {
  const [items, setItems] = useState<Benefit[]>([]);

  useEffect(() => {
    if (isOpen) {
      setItems(benefits.length > 0 ? [...benefits] : [{
        perk: '',
        description: ''
      }]);
    }
  }, [isOpen, benefits]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validItems = items.filter(item => 
      item.perk.trim() !== '' && item.description.trim() !== ''
    );
    onSave(validItems);
    onClose();
  };

  const addItem = () => {
    setItems(prev => [...prev, { perk: '', description: '' }]);
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof Benefit, value: string) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
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
                  />
                </div>

                <div>
                  <Label htmlFor={`description-${index}`}>Description *</Label>
                  <Textarea
                    id={`description-${index}`}
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    placeholder="Describe this benefit in detail..."
                    rows={3}
                  />
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