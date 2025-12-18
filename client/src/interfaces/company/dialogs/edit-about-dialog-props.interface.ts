export interface EditAboutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (aboutUs: string) => void;
  aboutUs: string;
}
