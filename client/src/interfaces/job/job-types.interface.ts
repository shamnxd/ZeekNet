// Job-related interfaces based on server DTOs

export type JobStatus = 'active' | 'unlisted' | 'expired' | 'blocked';
export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';

export interface JobDetailResponse {
  id: string;
  title: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  nice_to_haves: string[];
  benefits: string[];
  salary: { min: number; max: number };
  employment_types: EmploymentType[];
  location: string;
  skills_required: string[];
  category_ids: string[];
  status: JobStatus;
  is_featured: boolean;
  unpublish_reason?: string;
  view_count: number;
  application_count: number;
  createdAt: string;
  updatedAt: string;
  has_applied?: boolean;
  company: {
    companyName: string;
    logo: string;
    organisation: string;
    employeeCount: number;
    websiteLink: string;
    workplacePictures: Array<{
      pictureUrl: string;
      caption?: string;
    }>;
  };
}

export interface CompanyJobListItem {
  id: string;
  title: string;
  status: JobStatus;
  employmentTypes: EmploymentType[];
  applicationCount: number;
  viewCount: number;
  isFeatured: boolean;
  unpublishReason?: string;
  createdAt: Date;
}

export interface PublicJobListItem {
  id: string;
  title: string;
  viewCount: number;
  applicationCount: number;
  salary: { min: number; max: number };
  companyName: string;
  companyLogo?: string;
  isFeatured: boolean;
  createdAt: Date;
  location: string;
  description: string;
  skillsRequired: string[];
  employmentTypes: EmploymentType[];
}
