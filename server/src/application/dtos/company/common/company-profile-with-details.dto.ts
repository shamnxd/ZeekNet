export interface CompanyProfileDto {
  id: string;
  userId: string;
  companyName: string;
  logo?: string;
  banner?: string;
  websiteLink?: string;
  employeeCount: number;
  industry: string;
  organisation: string;
  aboutUs: string;
  isVerified: string;
  isBlocked: boolean;
  rejectionReason?: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyContactDto {
  id: string;
  companyId: string;
  phone?: string;
  email?: string;
  linkedin?: string;
  facebook?: string;
  twitter?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyOfficeLocationDto {
  id: string;
  companyId: string;
  location: string;
  officeName?: string;
  address?: string;
  isHeadquarters: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyTechStackDto {
  id: string;
  companyId: string;
  techStack: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyBenefitsDto {
  id: string;
  companyId: string;
  perk: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyWorkplacePicturesDto {
  id: string;
  companyId: string;
  pictureUrl: string;
  caption?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyVerificationDto {
  id: string;
  companyId: string;
  taxId: string;
  businessLicenseUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyProfileWithDetailsDto {
  profile: CompanyProfileDto;
  contact: CompanyContactDto | null;
  locations: CompanyOfficeLocationDto[];
  techStack: CompanyTechStackDto[];
  benefits: CompanyBenefitsDto[];
  workplacePictures: CompanyWorkplacePicturesDto[];
  verification: CompanyVerificationDto | null;
}
