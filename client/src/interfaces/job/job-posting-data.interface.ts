export interface JobPostingData {
  title: string
  employmentTypes: string[]
  salary: {
    min: number
    max: number
  }
  categoryIds: string[]
  skillsRequired: string[]
  location: string
  
  description: string
  responsibilities: string[]
  qualifications: string[]
  niceToHaves: string[]
  
  benefits: string[]
  enabledStages: string[]
}
