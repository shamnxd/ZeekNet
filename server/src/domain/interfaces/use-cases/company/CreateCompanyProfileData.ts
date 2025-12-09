
export interface CreateCompanyProfileData {
  userId?: string;
  companyName: string;
  logo: string;
  banner: string;
  websiteLink: string;
  employeeCount: number;
  industry: string;
  organisation: string;
  aboutUs: string;
  foundedDate?: Date;
  phone?: string;
  taxId?: string;
  businessLicenseUrl?: string;
  email?: string;
  location?: string;
}
