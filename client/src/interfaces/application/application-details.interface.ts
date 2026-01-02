import { ApplicationStage } from '@/constants/enums'

export interface InterviewScheduleItem {
  id: string
  date: string
  interview_type: string
  time: string
  location: string
  status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
  feedback?: {
    reviewer_name: string
    rating?: number
    comment: string
    reviewed_at: string
  }
}

export interface ApplicationDetails {
  _id: string
  seeker_id: string
  seeker_name: string
  seeker_avatar?: string
  seeker_headline?: string
  job_id: string
  job_title: string
  job_company?: string
  job_location?: string
  job_type?: string
  score?: number
  stage: ApplicationStage
  applied_date: string
  resume_url?: string
  cover_letter?: string
  full_name?: string
  date_of_birth?: string
  gender?: string
  languages?: string[]
  address?: string
  about_me?: string
  current_job?: string
  highest_qualification?: string
  experience_years?: number
  skills?: string[]
  email?: string
  phone?: string
  instagram?: string
  twitter?: string
  website?: string
  resume_data?: {
    experience?: Array<{
      title: string
      company: string
      period: string
      location?: string
      description?: string
    }>
    education?: Array<{
      degree: string
      school: string
      period: string
      location?: string
    }>
    industry_knowledge?: string[]
    tools_technologies?: string[]
    other_skills?: string[]
  }
  hiring_progress?: {
    interview_date?: string
    interview_location?: string
    interview_status?: string
    assigned_to?: {
      name: string
      avatar?: string
    }
    notes?: Array<{
      id: string
      author: string
      author_avatar?: string
      date: string
      time: string
      content: string
      replies?: number
    }>
  }
  interview_schedule?: InterviewScheduleItem[]
}
