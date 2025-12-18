import type { TechStackItem } from '@/interfaces/company/tech-stack-item.interface';

export interface EditTechStackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (techStack: TechStackItem[]) => void;
  techStack: TechStackItem[];
}
