import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import { Badge } from '@/components/ui/badge';
import { publicApi } from '@/api/public.api';
import { X } from 'lucide-react';
import type { TechStackItem } from '@/interfaces/company/tech-stack-item.interface';
// be - in
interface EditTechStackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (techStack: TechStackItem[]) => void;
  techStack: TechStackItem[];
}

const EditTechStackDialog: React.FC<EditTechStackDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  techStack
}) => {
  const [selectedStacks, setSelectedStacks] = useState<string[]>([]);
  const [skillsOptions, setSkillsOptions] = useState<ComboboxOption[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(false);

  const fetchSkills = async (searchTerm?: string) => {
    try {
      setSkillsLoading(true);
      const response = await publicApi.getAllSkills({
        limit: 20,
        search: searchTerm,
      });
      if (response.success && response.data) {
        const options: ComboboxOption[] = response.data.map((skillName: string) => ({
          value: skillName,
          label: skillName,
        }));
        setSkillsOptions(options);
      }
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    } finally {
      setSkillsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const currentStacks = techStack.map(item => item.techStack).filter(Boolean);
      setSelectedStacks(currentStacks);
      fetchSkills();
    }
  }, [isOpen, techStack]);

  const handleAddStack = (values: string[]) => {
    const newStacks = values.filter(v => !selectedStacks.includes(v));
    if (newStacks.length > 0) {
      setSelectedStacks(prev => [...prev, ...newStacks]);
    }
  };

  const handleRemoveStack = (stackToRemove: string) => {
    setSelectedStacks(prev => prev.filter(stack => stack !== stackToRemove));
  };

  const handleSave = () => {
    const techStackItems: TechStackItem[] = selectedStacks.map(stack => {
      const existingItem = techStack.find(item => item.techStack === stack);
      return existingItem ? { ...existingItem } : { techStack: stack };
    });
    
    onSave(techStackItems);
    onClose();
  };

  const handleClose = () => {
    const currentStacks = techStack.map(item => item.techStack).filter(Boolean);
    setSelectedStacks(currentStacks);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Tech Stack</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Add Technology</Label>
            <Combobox
              options={skillsOptions}
              value={[]}
              onChange={handleAddStack}
              placeholder="Type to search and add technology..."
              multiple={true}
              loading={skillsLoading}
              onSearch={(searchTerm) => {
                if (searchTerm.length >= 2 || searchTerm.length === 0) {
                  fetchSkills(searchTerm);
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              Search and select technologies to add to your tech stack
            </p>
          </div>

          {selectedStacks.length > 0 && (
            <div className="space-y-2">
              <Label>Current Tech Stack ({selectedStacks.length})</Label>
              <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-gray-50 min-h-[60px]">
                {selectedStacks.map((stack) => (
                  <Badge
                    key={stack}
                    variant="secondary"
                    className="px-3 py-1 text-sm flex items-center gap-2"
                  >
                    {stack}
                    <button
                      type="button"
                      onClick={() => handleRemoveStack(stack)}
                      className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                      aria-label={`Remove ${stack}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {selectedStacks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No technologies added yet. Use the search above to add technologies.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save Tech Stack
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTechStackDialog;