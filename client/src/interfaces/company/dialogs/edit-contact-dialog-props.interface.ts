import type { CompanyContact } from '../company-contact.interface';

export interface EditContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: CompanyContact) => void;
  contact?: CompanyContact;
}
