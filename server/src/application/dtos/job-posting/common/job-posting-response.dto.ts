import { JobStatus } from '../../../../domain/enums/job-status.enum';
import { EmploymentType } from '../../../../domain/enums/employment-type.enum';

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
  employment_types: EmploymentType[];
  location: string;
  skills_required: string[];
  category_ids: string[];
  status: JobStatus;
  is_featured: boolean;
  unpublish_reason?: string;
  view_count: number;
  application_count: number;
  enabled_stages?: string[];
  total_vacancies?: number;
  filled_vacancies?: number;
  closure_type?: string;
  closed_at?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyJobPostingListItemDto {
  id: string;
  title: string;
  status: JobStatus;
  employmentTypes: EmploymentType[];
  applicationCount: number;
  viewCount: number;
  isFeatured: boolean;
  unpublishReason?: string;
  createdAt: Date;
  enabled_stages?: string[];
}

export interface PublicJobListItemDto {
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

export interface JobPostingDetailResponseDto {
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
  enabled_stages?: string[];
  total_vacancies?: number;
  filled_vacancies?: number;
  closure_type?: string;
  closed_at?: string;
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

