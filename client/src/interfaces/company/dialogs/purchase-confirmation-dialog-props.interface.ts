export interface PurchaseConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  plan: {
    id: string;
    name: string;
    price: number;
    yearlyDiscount: number;
    duration: number;
    features: string[];
  } | null;
  billingCycle: 'monthly' | 'annual';
  onConfirm: () => Promise<void>;
  loading: boolean;
  isUpgrade?: boolean;
}
