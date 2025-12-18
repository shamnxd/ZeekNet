import type { TechStackItem } from '../tech-stack-item.interface';

export interface EditTechStackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (techStack: TechStackItem[]) => void;
  techStack: TechStackItem[];
}
