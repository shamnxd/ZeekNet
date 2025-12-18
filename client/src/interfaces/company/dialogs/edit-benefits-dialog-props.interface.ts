import type { Benefit } from '@/interfaces/company/company-data.interface';

export interface EditBenefitsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (benefits: Benefit[]) => void;
  benefits: Benefit[];
}
