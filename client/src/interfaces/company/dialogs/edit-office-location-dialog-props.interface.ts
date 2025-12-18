import type { OfficeLocation } from '@/interfaces/company/company-data.interface';

export interface EditOfficeLocationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (locations: OfficeLocation[]) => void;
  locations: OfficeLocation[];
}
