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
  // UI compatibility fields
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
  // UI compatibility fields
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
  // UI compatibility fields
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
  // UI compatibility fields
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
  // UI compatibility fields
  pictureUrl?: string;
}

export interface CompanySideApplication {
  id?: string;
  _id?: string;
  jobId?: string;
  seekerId?: string;
  companyId?: string;
  status?: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted';
  stage?: string;
  resumeUrl?: string;
  coverLetter?: string;
  createdAt?: string;
  updatedAt?: string;
  // Flattened/Legacy fields support
  seeker_name?: string;
  name?: string;
  full_name?: string;
  email?: string;
  applied_date?: string;
  appliedAt?: string;
  created_at?: string;
  score?: number;
  seeker_avatar?: string;
  avatar?: string;
  experience?: string;
  match_percentage?: number;
  seeker?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  job?: {
    id: string;
    title: string;
  };
}
