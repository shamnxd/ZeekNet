import { CompanyProfile } from '../../../entities/company-profile.entity';
import { IBaseRepository } from '../IBaseRepository';

export interface ICompanyProfileRepository extends IBaseRepository<CompanyProfile> {
  getAllCompanies(options: {
    page: number;
    limit: number;
    search?: string;
    industry?: string;
    isVerified?: 'pending' | 'rejected' | 'verified';
    isBlocked?: boolean;
    sortBy?: 'createdAt' | 'companyName' | 'employeeCount' | 'activeJobCount';
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ companies: CompanyProfile[]; total: number }>;
  findByIds(ids: string[]): Promise<CompanyProfile[]>;
}