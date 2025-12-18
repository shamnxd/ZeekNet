import { ApplicationStage } from '@/constants/enums'

export interface Application {
  _id: string
  seeker_id: string
  seeker_name: string
  seeker_avatar?: string
  job_id: string
  job_title: string
  score?: number
  stage: ApplicationStage
  applied_date: string
  resume_url?: string
  company_name?: string
  company_logo?: string
  companyName?: string
  jobTitle?: string
}
