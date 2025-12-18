import type { Benefit } from '@/interfaces/company/benefit.interface';

export interface EditBenefitsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (benefits: Benefit[]) => void;
  benefits: Benefit[];
}
