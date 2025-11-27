export interface JobPostingResponse {
  id: string;
  _id?: string; 
  company_id?: string;
  company_name?: string;
  companyName?: string;
  company_logo?: string;
  companyLogo?: string;
  title: string;
  description?: string;
  responsibilities?: string[];
  qualifications?: string[];
  nice_to_haves?: string[];
  benefits?: string[];
  salary?: {
    min: number;
    max: number;
  };
  employment_types?: string[];
  employmentTypes?: string[];
  location?: string;
  skills_required?: string[];
  skillsRequired?: string[];
  category_ids?: string[];
  is_active?: boolean;
  isActive?: boolean;
  admin_blocked?: boolean;
  adminBlocked?: boolean;
  unpublish_reason?: string;
  unpublishReason?: string;
  view_count?: number;
  viewCount?: number;
  application_count?: number;
  applicationCount?: number;
  createdAt?: string;
  updatedAt?: string;
  has_applied?: boolean;
  company?: {
    companyName: string;
    logo?: string;
    organisation: string;
    employeeCount: number;
    websiteLink: string;
    workplacePictures?: {
      pictureUrl: string;
      caption?: string;
    }[];
  };
}

export interface JobPostingQuery {
  page?: number;
  limit?: number;
  category_ids?: string[];
  employment_types?: string[];
  salary_min?: number;
  salary_max?: number;
  location?: string;
  search?: string;
  is_active?: boolean;
}

export interface PaginatedJobPostings {
  jobs: JobPostingResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}