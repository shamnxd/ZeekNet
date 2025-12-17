export interface JobPostingQuery {
  page?: number
  limit?: number
  category_ids?: string[]
  employment_types?: string[]
  salary_min?: number
  salary_max?: number
  location?: string
  search?: string
  status?: 'active' | 'unlisted' | 'expired' | 'blocked'
}
