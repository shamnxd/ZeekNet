export interface CompanyContact {
  id: string;
  companyId: string;
  email: string;
  phone: string;
  website?: string;
  linkedIn?: string;
  twitter?: string;
  facebook?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TechStackItem {
  id: string;
  companyId: string;
  name: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OfficeLocation {
  id: string;
  companyId: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  zipCode?: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Benefit {
  id: string;
  companyId: string;
  title: string;
  description?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkplacePicture {
  id: string;
  companyId: string;
  url: string;
  caption?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  seekerId: string;
  companyId: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted';
  stage: string;
  resumeUrl?: string;
  coverLetter?: string;
  createdAt: string;
  updatedAt: string;
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
