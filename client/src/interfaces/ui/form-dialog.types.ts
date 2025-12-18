import type { ReactNode } from 'react';

export interface ValidationRule {
  required?: boolean | string
  minLength?: { value: number; message: string }
  maxLength?: { value: number; message: string }
  pattern?: { value: RegExp; message: string }
  validate?: (value: string) => boolean | string
}

export interface FormField {
  id: string
  label: string
  type?: 'text' | 'email' | 'tel' | 'date' | 'textarea'
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  validation?: ValidationRule
  required?: boolean
}

export interface FieldGroup {
  fields: FormField[]
  gridCols?: 1 | 2 | 3 | 4
}

export interface BasicFormDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  isLoading?: boolean
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
  children: ReactNode
}

export interface AdvancedFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  fields?: FormField[]
  fieldGroups?: FieldGroup[]
  onSubmit: () => void
  submitLabel?: string
  cancelLabel?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  children?: ReactNode
}

export type FormDialogProps = BasicFormDialogProps | AdvancedFormDialogProps
