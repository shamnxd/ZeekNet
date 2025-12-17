export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean | string;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select';
  placeholder?: string;
  validation?: ValidationRule;
  options?: { value: string; label: string }[];
}

export interface FieldGroup {
  title: string;
  fields: FormField[];
}

export interface BasicFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, string>) => void;
  title: string;
  fields: FormField[];
  submitText?: string;
  cancelText?: string;
}

export interface AdvancedFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, string>) => void;
  title: string;
  fieldGroups: FieldGroup[];
  submitText?: string;
  cancelText?: string;
}

export type FormDialogProps = BasicFormDialogProps | AdvancedFormDialogProps;
