import type { JobPostingResponse } from './job-posting-response.interface'

export interface PaginatedJobPostings {
  jobs: JobPostingResponse[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
