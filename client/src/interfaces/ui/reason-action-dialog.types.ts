export interface ReasonOption {
  value: string
  label: string
}

export interface ReasonActionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  actionLabel?: string
  confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  reasonOptions: ReasonOption[]
  onConfirm: (reason: string) => void
  loading?: boolean
  showReasonField?: boolean
}
