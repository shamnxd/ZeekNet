export interface CompanyProfileResponseDto {
  id: string;
  company_name: string;
  logo: string;
  banner: string;
  website_link: string;
  employee_count: number;
  industry: string;
  organisation: string;
  about_us: string;
  is_verified: 'pending' | 'rejected' | 'verified';
  is_blocked: boolean;
  rejection_reason?: string;
  tax_id?: string;
  business_license?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CompanyContactResponseDto {
  id: string;
  email: string;
  phone: string;
  twitter_link: string;
  facebook_link: string;
  linkedin: string;
}

export interface CompanyLocationResponseDto {
  id: string;
  location: string;
  office_name: string;
  address: string;
  is_headquarters: boolean;
}

export interface CompanyProfileWithDetailsResponseDto {
  profile: CompanyProfileResponseDto;
  contact: CompanyContactResponseDto | null;
  locations: CompanyLocationResponseDto[];
  techStack: {
    id: string;
    techStack: string;
  }[];
  benefits: {
    id: string;
    perk: string;
    description: string;
  }[];
  workplacePictures: {
    id: string;
    pictureUrl: string;
    caption?: string;
  }[];
  jobPostings: {
    id: string;
    title: string;
    description: string;
    location: string;
    employmentType: string;
    salaryMin?: number;
    salaryMax?: number;
    status: 'active' | 'unlisted' | 'expired' | 'blocked' | 'closed';
    createdAt: string;
    updatedAt: string;
  }[];
}