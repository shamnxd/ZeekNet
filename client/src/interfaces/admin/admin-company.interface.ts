export interface Company {
  id: string;
  userId: string;
  companyName: string;
  logo: string;
  banner: string;
  websiteLink: string;
  employeeCount: number;
  industry: string;
  organisation: string;
  aboutUs: string;
  isVerified: 'pending' | 'rejected' | 'verified';
  isBlocked: boolean;
  email: string;
  createdAt: string;
  updatedAt: string;
  verification?: {
    taxId: string;
    businessLicenseUrl: string;
  } | null;
  contact?: {
    email: string;
    phone: string;
    twitterLink: string;
    facebookLink: string;
    linkedin: string;
  } | null;
  locations?: Array<{
    id: string;
    city: string;
    state: string;
    country: string;
    address: string;
    isPrimary: boolean;
  }>;
  techStack?: Array<{
    id: string;
    name: string;
    category: string;
  }>;
  benefits?: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
  }>;
  workplacePictures?: Array<{
    id: string;
    imageUrl: string;
    caption?: string;
  }>;
  activeJobCount?: number;
}

export interface GetAllCompaniesParams {
  page: number;
  limit: number;
  search?: string;
  industry?: string;
  isVerified?: 'pending' | 'rejected' | 'verified';
  isBlocked?: boolean | string;
}
