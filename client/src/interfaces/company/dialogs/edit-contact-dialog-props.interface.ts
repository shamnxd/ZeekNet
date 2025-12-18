import type { CompanyContact } from '@/interfaces/company/company-data.interface';

export interface EditContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: CompanyContact) => void;
  contact?: CompanyContact;
}
