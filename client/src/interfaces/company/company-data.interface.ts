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
  // IDs - support both naming conventions
  id?: string;
  _id?: string;
  jobId?: string;
  job_id?: string;
  seekerId?: string;
  seeker_id?: string;
  companyId?: string;
  company_id?: string;
  
  status?: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted';
  stage?: string;
  subStage?: string;
  sub_stage?: string;
  
  // Resume and cover letter - support both naming conventions
  resumeUrl?: string;
  resume_url?: string;
  resume_filename?: string;
  coverLetter?: string;
  cover_letter?: string;
  
  // Dates - support both naming conventions
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  applied_date?: string;
  appliedAt?: string;
  
  // Seeker info - support both naming conventions
  seeker_name?: string;
  seeker_avatar?: string;
  seeker_headline?: string;
  name?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  score?: number;
  avatar?: string;
  experience?: string;
  match_percentage?: number;
  
  // Profile details from server
  date_of_birth?: string | Date;
  gender?: string;
  languages?: string[];
  address?: string;
  about_me?: string;
  skills?: string[];
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
  
  // Nested objects
  seeker?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  job?: {
    id: string;
    title: string;
    job_title?: string;
    job_company?: string;
    job_location?: string;
    job_type?: string;
  };
}
