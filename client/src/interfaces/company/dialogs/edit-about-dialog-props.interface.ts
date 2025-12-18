export interface EditAboutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (about: string) => void;
  about: string;
}
