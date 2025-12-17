import type { OfficeLocation } from '../office-location.interface';

export interface EditOfficeLocationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (locations: OfficeLocation[]) => void;
  locations: OfficeLocation[];
}
