import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog'
import { Button } from './button'
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import type { ConfirmationDialogProps } from '@/interfaces/ui/confirmation-dialog-props.interface';

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText = 'Cancel',
  variant = 'warning',
  isLoading = false,
}: ConfirmationDialogProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: <XCircle className="h-6 w-6 text-red-600" />,
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
          iconBg: 'bg-red-100 dark:bg-red-900/20',
        }
      case 'success':
        return {
          icon: <CheckCircle className="h-6 w-6 text-green-600" />,
          confirmButton: 'bg-green-600 hover:bg-green-700 text-white',
          iconBg: 'bg-green-100 dark:bg-green-900/20',
        }
      default:
        return {
          icon: <AlertTriangle className="h-6 w-6 text-yellow-600" />,
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700 text-white',
          iconBg: 'bg-yellow-100 dark:bg-yellow-900/20',
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${styles.iconBg}`}>
              {styles.icon}
            </div>
            <div>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription className="mt-2">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            className={styles.confirmButton}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}