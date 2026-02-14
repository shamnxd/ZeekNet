export interface CompanyContact {
  id?: string;
  companyId?: string;
  email: string;
  phone: string;
  website?: string;
  linkedIn?: string;
  twitter?: string;
  facebook?: string;
  createdAt?: string;
  updatedAt?: string;

  linkedin?: string;
  twitter_link?: string;
  facebook_link?: string;
}

export interface TechStackItem {
  id?: string;
  companyId?: string;
  name?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;

  techStack?: string;
}

export interface OfficeLocation {
  id?: string;
  companyId?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  isPrimary?: boolean;
  createdAt?: string;
  updatedAt?: string;

  location?: string;
  officeName?: string;
  isHeadquarters?: boolean;
}

export interface Benefit {
  id?: string;
  companyId?: string;
  title?: string;
  description?: string;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;

  perk?: string;
}

export interface WorkplacePicture {
  id?: string;
  companyId?: string;
  url?: string;
  caption?: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;

  pictureUrl?: string;
}

export interface CompanySideApplication {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  skills?: string[];
  _id?: string;
  seeker_id?: string;
  seekerId?: string;
  seeker_name?: string;
  seekerName?: string;
  seeker_avatar?: string;
  seekerAvatar?: string;
  seeker_headline?: string;
  job_id: string;
  jobId?: string;
  job_title: string;
  jobTitle?: string;
  company_name?: string;
  companyName?: string;
  company_id?: string;
  companyId?: string;
  company_logo?: string;
  companyLogo?: string;
  updatedAt?: string;
  updated_at?: string;
  score?: number;
  stage: 'applied' | 'in_review' | 'shortlisted' | 'interview' | 'technical_task' | 'compensation' | 'offer' | 'hired' | 'rejected' | 'APPLIED' | 'IN_REVIEW' | 'SHORTLISTED' | 'INTERVIEW' | 'TECHNICAL_TASK' | 'COMPENSATION' | 'OFFER' | 'HIRED' | 'REJECTED';
  sub_stage?: string;
  subStage?: string;
  applied_date: string;
  appliedDate?: string;
  is_blocked?: boolean;

  job?: {
    id: string;
    title: string;
    [key: string]: unknown;
  };
  seeker?: {
    id: string;
    name?: string;
    [key: string]: unknown;
  };
  user?: {
    email?: string;
    [key: string]: unknown;
  };
  profile?: {
    phone?: string;
    [key: string]: unknown;
  };
  resume_url?: string;
  resume_filename?: string;
  resumeUrl?: string;
  cover_letter?: string;
  coverLetter?: string;
  employmentType?: string;
  appliedAt?: string;
  createdAt?: string;
  created_at?: string;
  avatar?: string;
  experience?: unknown[];
  full_name?: string;
  match_percentage?: number;
  resume_data?: {
    [key: string]: unknown;
  };
}

export interface CompanySideApplicationDetail extends CompanySideApplication {
  seeker_headline?: string;
  job_company?: string;
  job_location?: string;
  job_type?: string;
  cover_letter?: string;
  resume_url?: string;
  resume_filename?: string;
  rejection_reason?: string;
  withdrawalReason?: string;
  interviews?: Array<{
    id: string;
    date: string;
    time: string;
    interview_type: string;
    location: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | 'no-show';
    feedback?: {
      reviewer_name: string;
      rating?: number;
      comment: string;
      reviewed_at: string;
    };
  }>;
  full_name?: string;
  date_of_birth?: string | Date;
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
  expectedSalary?: string;
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
    tools_technologies?: string[];
    other_skills?: string[];
  };
}
