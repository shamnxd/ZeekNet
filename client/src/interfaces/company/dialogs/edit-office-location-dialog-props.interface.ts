import type { OfficeLocation } from '@/interfaces/company/office-location.interface';

export interface EditOfficeLocationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (locations: OfficeLocation[]) => void;
  locations: OfficeLocation[];
}
