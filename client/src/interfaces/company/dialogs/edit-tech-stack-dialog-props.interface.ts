import type { TechStackItem } from '@/interfaces/company/company-data.interface';

export interface EditTechStackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (techStack: TechStackItem[]) => void;
  techStack: TechStackItem[];
}
