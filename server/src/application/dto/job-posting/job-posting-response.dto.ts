export interface JobPostingResponseDto {
  id: string;
  company_id: string;
  company_name?: string;
  company_logo?: string;
  title: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  nice_to_haves: string[];
  benefits: string[];
  salary: { min: number; max: number };
  employment_types: string[];
  location: string;
  skills_required: string[];
  category_ids: string[];
  status: 'active' | 'unlisted' | 'expired' | 'blocked';
  unpublish_reason?: string;
  view_count: number;
  application_count: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyJobPostingListItemDto {
  id: string;
  title: string;
  status: 'active' | 'unlisted' | 'expired' | 'blocked';
  employmentTypes: string[];
  applicationCount: number;
  viewCount: number;
  unpublishReason?: string;
  createdAt: Date;
}

export interface PublicJobListItemDto {
  id: string;
  title: string;
  viewCount: number;
  applicationCount: number;
  salary: { min: number; max: number };
  companyName: string;
  companyLogo?: string;
  createdAt: Date;
  location: string;
  description: string;
  skillsRequired: string[];
  employmentTypes: string[];
}

export interface JobPostingDetailResponseDto {
  id: string;
  title: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  nice_to_haves: string[];
  benefits: string[];
  salary: { min: number; max: number };
  employment_types: string[];
  location: string;
  skills_required: string[];
  category_ids: string[];
  status: 'active' | 'unlisted' | 'expired' | 'blocked';
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