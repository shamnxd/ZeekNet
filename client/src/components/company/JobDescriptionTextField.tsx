import { Textarea } from "@/components/ui/textarea";

import type { JobDescriptionTextFieldProps } from '@/interfaces/company/job-description-text-field-props.interface';

export const JobDescriptionTextField: React.FC<JobDescriptionTextFieldProps> = ({
  field,
  label,
  placeholder,
  helperText,
  value,
  required = false,
  error,
  onChange,
}) => (
  <div className="flex gap-30 w-full">
    <div className="flex flex-col gap-1 w-180">
      <h3 className="text-sm font-semibold text-[#25324B]">
        {label} {required && <span className="text-red-500">*</span>}
      </h3>
      <p className="text-sm text-[#7C8493]">{helperText}</p>
    </div>
    <div className="flex flex-col gap-1 w-full">
      <div className={`border rounded-[10px] overflow-hidden ${error ? 'border-red-500' : 'border-[#D6DDEB]'}`}>
        <Textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
          className="min-h-[120px] w-[387px] border-0 resize-none focus:ring-0 p-4 text-sm text-[#25324B] placeholder:text-[#7C8493] focus:outline-none"
          autoFocus={false}
        />
        <div className="flex justify-between items-center p-3 border-t border-[#D6DDEB] bg-[#F8F8FD]">
          <span className="text-xs text-[#7C8493]">
            Maximum 500 characters
          </span>
          <span className="text-xs text-[#7C8493]">
            {value.length}/500
          </span>
        </div>
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  </div>
);