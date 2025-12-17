export interface ComboboxOption {
  value: string
  label: string
}

export interface ComboboxProps {
  options: ComboboxOption[]
  value?: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  multiple?: boolean
  disabled?: boolean
  className?: string
  onSearch?: (searchTerm: string) => void
  loading?: boolean
  inputClassName?: string
}
