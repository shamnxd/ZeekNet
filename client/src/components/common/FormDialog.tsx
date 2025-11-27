import { type ReactNode, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface ValidationRule {
  required?: boolean | string
  minLength?: { value: number; message: string }
  maxLength?: { value: number; message: string }
  pattern?: { value: RegExp; message: string }
  validate?: (value: string) => boolean | string
}

interface FormField {
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

interface FieldGroup {
  fields: FormField[]
  gridCols?: 1 | 2 | 3 | 4
}

interface BasicFormDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  isLoading?: boolean
  children: ReactNode
}

interface AdvancedFormDialogProps {
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

type FormDialogProps = BasicFormDialogProps | AdvancedFormDialogProps

const isAdvancedFormDialog = (props: FormDialogProps): props is AdvancedFormDialogProps => {
  return 'open' in props && 'onOpenChange' in props
}

const FormDialog = (props: FormDialogProps) => {
  
  if (isAdvancedFormDialog(props)) {
    const {
      open,
      onOpenChange,
      title,
      description,
      fields = [],
      fieldGroups = [],
      onSubmit,
      submitLabel = 'Save',
      cancelLabel = 'Cancel',
      maxWidth = 'md',
      children,
    } = props

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})

    const maxWidthClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
    }

    const validateField = (field: FormField): string | null => {
      const value = field.value?.trim() || ''
      const validation = field.validation
      
      // Check required
      if ((validation?.required || field.required) && !value) {
        const message = typeof validation?.required === 'string' 
          ? validation.required 
          : `${field.label} is required`
        return message
      }

      // Check minLength
      if (validation?.minLength && value.length > 0 && value.length < validation.minLength.value) {
        return validation.minLength.message
      }

      // Check maxLength
      if (validation?.maxLength && value.length > validation.maxLength.value) {
        return validation.maxLength.message
      }

      // Check pattern
      if (validation?.pattern && value && !validation.pattern.value.test(value)) {
        return validation.pattern.message
      }

      // Check email type
      if (field.type === 'email' && value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailPattern.test(value)) {
          return 'Please enter a valid email address'
        }
      }

      // Check date type
      if (field.type === 'date' && value) {
        const date = new Date(value)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        // Check if valid date
        if (isNaN(date.getTime())) {
          return 'Please enter a valid date'
        }
        
        // Check if date is not in the future (for birthdate/start dates)
        if (validation?.validate) {
          const result = validation.validate(value)
          if (result !== true) {
            return typeof result === 'string' ? result : 'Invalid date'
          }
        }
      }

      // Check custom validation
      if (validation?.validate && !field.type) {
        const result = validation.validate(value)
        if (result !== true) {
          return typeof result === 'string' ? result : 'Validation failed'
        }
      }

      return null
    }

    const handleFieldBlur = (fieldId: string, field: FormField) => {
      setTouched(prev => ({ ...prev, [fieldId]: true }))
      const error = validateField(field)
      setErrors(prev => ({
        ...prev,
        [fieldId]: error || ''
      }))
    }

    const handleFieldChange = (field: FormField, value: string) => {
      field.onChange(value)
      
      // Clear error when user starts typing
      if (errors[field.id]) {
        setErrors(prev => ({ ...prev, [field.id]: '' }))
      }
    }

    const validateAllFields = (): boolean => {
      const allFields = [...fields, ...fieldGroups.flatMap(g => g.fields)]
      const newErrors: Record<string, string> = {}
      let isValid = true

      allFields.forEach(field => {
        const error = validateField(field)
        if (error) {
          newErrors[field.id] = error
          isValid = false
        }
      })

      setErrors(newErrors)
      setTouched(
        allFields.reduce((acc, field) => ({ ...acc, [field.id]: true }), {})
      )

      return isValid
    }

    const handleSubmit = () => {
      if (validateAllFields()) {
        onSubmit()
      }
    }

    // Check if form has any errors
    const hasErrors = Object.values(errors).some(error => error !== '')

    const renderField = (field: FormField) => {
      const error = touched[field.id] ? errors[field.id] : ''
      const hasError = !!error

      const commonProps = {
        id: field.id,
        value: field.value,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
          handleFieldChange(field, e.target.value),
        onBlur: () => handleFieldBlur(field.id, field),
        placeholder: field.placeholder,
        'aria-invalid': hasError,
      }

      if (field.type === 'textarea') {
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {(field.required || field.validation?.required) && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </Label>
            <Textarea
              {...commonProps}
              rows={field.rows || 3}
              className="resize-none"
            />
            {hasError && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>
        )
      }

      return (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.id}>
            {field.label}
            {(field.required || field.validation?.required) && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </Label>
          <Input
            {...commonProps}
            type={field.type || 'text'}
          />
          {hasError && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>
      )
    }

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={`${maxWidthClasses[maxWidth]}`}>
          <DialogHeader>
            <DialogTitle className="!text-lg !font-bold">{title}</DialogTitle>
            {description && <DialogDescription className="!mb-2">{description}</DialogDescription>}
          </DialogHeader>
          
          <div className="space-y-4">
            {children}
            
            {fields.map(renderField)}

            {fieldGroups.map((group, groupIndex) => (
              <div 
                key={groupIndex} 
                className={`grid gap-4 ${
                  group.gridCols === 2 ? 'grid-cols-2' : 
                  group.gridCols === 3 ? 'grid-cols-3' : 
                  group.gridCols === 4 ? 'grid-cols-4' : 
                  'grid-cols-1'
                }`}
              >
                {group.fields.map(renderField)}
              </div>
            ))}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {cancelLabel}
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="bg-cyan-600 hover:bg-cyan-700"
              disabled={hasErrors && Object.keys(touched).length > 0}
            >
              {submitLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  const {
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmVariant = 'default',
    isLoading = false,
    children,
  } = props

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {children}
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button 
            onClick={onConfirm} 
            variant={confirmVariant}
            disabled={isLoading}
            className={confirmVariant === 'default' ? 'bg-cyan-600 hover:bg-cyan-700' : ''}
          >
            {isLoading ? 'Loading...' : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default FormDialog