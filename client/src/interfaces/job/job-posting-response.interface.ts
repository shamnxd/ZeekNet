export interface JobPostingResponse {
  id: string
  _id?: string 
  company_id?: string
  companyId?: string
  company_name?: string
  companyName?: string
  company_logo?: string
  companyLogo?: string
  title: string
  description?: string
  responsibilities?: string[]
  qualifications?: string[]
  nice_to_haves?: string[]
  niceToHaves?: string[]
  benefits?: string[]
  salary?: {
    min: number
    max: number
  }
  employment_types?: string[]
  employmentTypes?: string[]
  location?: string
  skills_required?: string[]
  skillsRequired?: string[]
  category_ids?: string[]
  categoryIds?: string[]
  enabled_stages?: string[]
  enabledStages?: string[]
  status?: 'active' | 'unlisted' | 'expired' | 'blocked'
  unpublish_reason?: string
  unpublishReason?: string
  view_count?: number
  viewCount?: number
  application_count?: number
  applicationCount?: number
  applications?: number
  createdAt?: string
  updatedAt?: string
  has_applied?: boolean
  company?: {
    companyName: string
    logo?: string
    organisation: string
    employeeCount: number
    websiteLink: string
    workplacePictures?: {
      pictureUrl: string
      caption?: string
    }[]
  }
  analytics?: {
    totalViews: number
    totalViewsChange: number
    totalApplied: number
    totalAppliedChange: number
    traffic: { label: string; value: number; color: string }[]
    visitors: { country: string; count: number; flag: string }[]
  }
}
