import type { Benefit } from '../benefit.interface';

export interface EditBenefitsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (benefits: Benefit[]) => void;
  benefits: Benefit[];
}
