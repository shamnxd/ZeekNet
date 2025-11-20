import { CompanyProfile } from '../../../entities/company-profile.entity';
import { IBaseRepository } from '../IBaseRepository';

export interface ICompanyProfileRepository extends IBaseRepository<CompanyProfile> {
  // Use findOne({ userId }) and exists({ userId }) from base instead
  
  // Complex query with pagination, search, filtering, and population
  getAllCompanies(options: {
    page: number;
    limit: number;
    search?: string;
    industry?: string;
    isVerified?: 'pending' | 'rejected' | 'verified';
    isBlocked?: boolean;
    sortBy?: 'createdAt' | 'companyName' | 'employeeCount';
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ companies: CompanyProfile[]; total: number }>;
}