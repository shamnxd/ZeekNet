export interface PurchaseConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  planName: string;
  price: number;
  duration: number;
}
