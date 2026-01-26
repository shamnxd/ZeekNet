export interface CompanyProfileData {
  company_name?: string
  website_link?: string
  website?: string
  industry?: string
  organisation?: string
  employee_count?: number
  employees?: string
  about_us?: string
  description?: string
  location?: string
  phone?: string
  foundedDate?: string
  logo?: string
  banner?: string
  business_license?: string
  tax_id?: string
  email?: string
}

export interface CompanyProfileResponse {
  id: string
  company_name: string
  logo: string
  banner: string
  website_link: string
  website?: string
  employee_count: number
  employees?: string
  industry: string
  organisation: string
  about_us: string
  description?: string
  location?: string
  phone?: string
  foundedDate?: string
  business_license?: string
  tax_id?: string
  email?: string
  is_verified: 'pending' | 'rejected' | 'verified'
  is_blocked: boolean
  rejection_reason?: string
  created_at: string
  updated_at: string
}

export interface JobPostingRequest {
  title: string
  description: string
  responsibilities: string[]
  qualifications: string[]
  nice_to_haves?: string[]
  benefits?: string[]
  salary: {
    min: number
    max: number
  }
  employment_types: ("full-time" | "part-time" | "contract" | "internship" | "remote")[]
  location: string
  skills_required?: string[]
  category_ids: string[]
  enabled_stages?: string[]
  total_vacancies?: number
  is_featured?: boolean
}

export interface CompanyDashboard {
  totalJobs: number;
  activeJobs: number;
  pendingJobs: number;
  totalApplications: number;
  recentApplications: unknown[];
  profileCompletion: number;
  profileStatus: string;
  verificationStatus?: string;
}
