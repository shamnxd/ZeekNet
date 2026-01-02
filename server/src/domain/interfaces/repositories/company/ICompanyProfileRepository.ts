import { CompanyProfile } from 'src/domain/entities/company-profile.entity';
import { IBaseRepository } from 'src/domain/interfaces/repositories/base/IBaseRepository';

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
  countTotal(): Promise<number>;
  countByVerificationStatus(status: 'pending' | 'rejected' | 'verified'): Promise<number>;
  getLocationStats(): Promise<{ country: string; count: number }[]>;
}
