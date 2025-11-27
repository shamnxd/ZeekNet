export interface InterviewScheduleResponseDto {
  id: string;
  date: string;
  time: string;
  interview_type: string;
  location: string;
  interviewer_name?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  feedback?: {
    reviewer_name: string;
    rating?: number;
    comment: string;
    reviewed_at: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface JobApplicationListResponseDto {
  id: string;
  seeker_id?: string;
  seeker_name?: string;
  seeker_avatar?: string;
  job_id: string;
  job_title: string;
  company_name?: string;
  company_logo?: string;
  score?: number;
  stage: 'applied' | 'shortlisted' | 'interview' | 'rejected' | 'hired';
  applied_date: string;
}

export interface JobApplicationDetailResponseDto {
  id: string;
  seeker_id: string;
  seeker_name: string;
  seeker_avatar?: string;
  seeker_headline?: string;
  job_id: string;
  job_title: string;
  job_company?: string;
  job_location?: string;
  job_type?: string;
  company_name?: string;
  company_logo?: string;
  cover_letter: string;
  resume_url: string;
  resume_filename: string;
  score?: number;
  stage: 'applied' | 'shortlisted' | 'interview' | 'rejected' | 'hired';
  applied_date: string;
  rejection_reason?: string;
  interviews: InterviewScheduleResponseDto[];
  // Seeker profile data (joined)
  full_name?: string;
  date_of_birth?: Date;
  gender?: string;
  languages?: string[];
  address?: string;
  about_me?: string;
  current_job?: string;
  highest_qualification?: string;
  experience_years?: number;
  skills?: string[];
  email?: string;
  phone?: string;
  // Resume data (from seeker profile)
  resume_data?: {
    experience?: Array<{
      title: string;
      company: string;
      period: string;
      location?: string;
      description?: string;
    }>;
    education?: Array<{
      degree: string;
      school: string;
      period: string;
      location?: string;
    }>;
    industry_knowledge?: string[];
    tools_technologies?: string[];
    other_skills?: string[];
  };
}

export interface PaginatedApplicationsResponseDto {
  applications: JobApplicationListResponseDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

