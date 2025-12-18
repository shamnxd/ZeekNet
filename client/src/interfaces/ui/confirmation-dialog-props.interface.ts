export interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'success'
  isLoading?: boolean
}
