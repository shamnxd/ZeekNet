import type { JobPostingData } from './job-posting-data.interface'

export interface JobPostingStepProps {
  data: JobPostingData
  onDataChange: (data: Partial<JobPostingData>) => void
  onNext: () => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
  onSubmit: () => void
}
