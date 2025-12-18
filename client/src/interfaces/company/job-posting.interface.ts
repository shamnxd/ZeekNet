export interface JobPosting {
  id: string
  title: string
  description: string
  location: string
  employmentType: string
  salaryMin?: number
  salaryMax?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}
