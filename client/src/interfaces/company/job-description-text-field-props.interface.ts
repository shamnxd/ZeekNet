import type { JobPostingData } from "@/interfaces/job/job-posting-data.interface";

export interface JobDescriptionTextFieldProps {
  field: keyof JobPostingData;
  label: string;
  placeholder: string;
  helperText: string;
  value: string;
  required?: boolean;
  error?: string;
  onChange: (field: keyof JobPostingData, value: string) => void;
}
