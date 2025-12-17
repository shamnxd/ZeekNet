import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CheckboxProps } from '@/interfaces/ui/checkbox-props.interface';

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, id, disabled, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type="checkbox"
          ref={ref}
          id={id}
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <div
          onClick={() => !disabled && onCheckedChange?.(!checked)}
          className={cn(
            "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
            checked && "bg-primary text-primary-foreground",
            className
          )}
        >
          {checked && (
            <Check className="h-4 w-4 text-primary-foreground" />
          )}
        </div>
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }