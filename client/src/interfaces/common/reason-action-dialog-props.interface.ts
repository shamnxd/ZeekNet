import type { ReasonOption } from './reason-option.interface';

export interface ReasonActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  title: string;
  description: string;
  reasons: ReasonOption[];
  actionText: string;
}
