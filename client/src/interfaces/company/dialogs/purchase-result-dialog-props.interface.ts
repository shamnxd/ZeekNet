export interface PurchaseResultDialogProps {
  open: boolean;
  onClose: () => void;
  success: boolean;
  message: string;
  invoiceId?: string;
  transactionId?: string;
}
