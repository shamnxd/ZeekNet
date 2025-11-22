export interface CompanyProfileData {
  userId: string;
  companyName: string;
  logo: string;
  banner: string;
  websiteLink: string;
  employeeCount: number;
  industry: string;
  organisation: string;
  aboutUs: string;
  isVerified: 'pending';
}

export interface CompanyContactData {
  companyId: string;
  email: string;
  phone: string;
  twitterLink: string;
  facebookLink: string;
  linkedin: string;
}

export interface CompanyLocationData {
  companyId: string;
  location: string;
  officeName?: string;
  address?: string;
  isHeadquarters: boolean;
}

export interface CompanyVerificationData {
  companyId: string;
  taxId: string;
  businessLicenseUrl: string;
}

export interface JobPostingData {
  company_id: string;
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
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  isVerified: boolean;
  isBlocked: boolean;
  refreshToken: string | null;
}

export type { CompanyProfileResponseDto, CompanyContactResponseDto, CompanyLocationResponseDto, CompanyProfileWithDetailsResponseDto } from '../dto/company/company-response.dto';

export type { JobPostingResponseDto, JobPostingDetailResponseDto, PaginatedJobPostingsResponse } from '../dto/job-posting/job-posting-response.dto';