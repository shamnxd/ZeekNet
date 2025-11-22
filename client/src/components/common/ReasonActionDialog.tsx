import { useState } from 'react'
import FormDialog from './FormDialog'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

export interface ReasonOption {
  value: string
  label: string
}

interface ReasonActionDialogProps {
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

const ReasonActionDialog = ({
  open,
  onOpenChange,
  title,
  description,
  reasonOptions,
  onConfirm,
  actionLabel = 'Submit',
  confirmVariant = 'destructive',
  loading = false,
  showReasonField = true,
}: ReasonActionDialogProps) => {
  const [reasonType, setReasonType] = useState<string>('')
  const [customReason, setCustomReason] = useState<string>('')
  const canSubmit = !showReasonField || (reasonType && (reasonType !== 'other' || customReason.trim()))
  const selectedLabel = reasonType === 'other' ? customReason : (reasonOptions.find(r => r.value === reasonType)?.label || '')

  const handleConfirm = () => {
    if (!canSubmit) return
    onConfirm(selectedLabel)
    setReasonType('')
    setCustomReason('')
  }
  return (
    <FormDialog
      isOpen={open}
      onClose={() => onOpenChange(false)}
      onConfirm={handleConfirm}
      title={title}
      description={description || ''}
      confirmText={actionLabel}
      cancelText="Cancel"
      confirmVariant={confirmVariant}
      isLoading={loading}
    >
      {showReasonField && (
        <div>
          <label className="text-sm font-medium mb-1 block">Reason</label>
          <Select value={reasonType} onValueChange={setReasonType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select reason..." />
            </SelectTrigger>
            <SelectContent>
              {reasonOptions.map(reason => (
                <SelectItem value={reason.value} key={reason.value}>{reason.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {reasonType === 'other' && (
            <textarea
              className="mt-2 w-full border rounded p-2 text-sm min-h-[90px]"
              value={customReason}
              onChange={e => setCustomReason(e.target.value)}
              required
              placeholder="Describe the reason..."
            />
          )}
        </div>
      )}
    </FormDialog>
  )
}

export default ReasonActionDialog