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

// Interface for company side application list view
export interface CompanySideApplication {
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
  sub_stage?: string;
  applied_date: string;
  is_blocked?: boolean;
}

// Interface for company side application detail view
export interface CompanySideApplicationDetail extends CompanySideApplication {
  seeker_headline?: string;
  job_company?: string;
  job_location?: string;
  job_type?: string;
  cover_letter?: string;
  resume_url?: string;
  resume_filename?: string;
  rejection_reason?: string;
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
  // Personal Info
  full_name?: string;
  date_of_birth?: string | Date; // Date string or Date object
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
