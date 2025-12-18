export interface PurchaseResultDialogProps {
  isOpen: boolean;
  onClose: () => void;
  success: boolean;
  message: string;
}
