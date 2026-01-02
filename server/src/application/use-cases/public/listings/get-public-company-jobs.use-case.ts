import { IGetPublicCompanyJobsUseCase } from 'src/presentation/interfaces/IGetPublicCompanyJobsUseCase';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { CompanyVerificationStatus } from 'src/domain/enums/verification-status.enum';
import { NotFoundError } from 'src/domain/errors/errors';

export class GetPublicCompanyJobsUseCase implements IGetPublicCompanyJobsUseCase {
  constructor(
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _jobPostingRepository: IJobPostingRepository,
  ) {}

  async execute(companyId: string, page: number = 1, limit: number = 5): Promise<{
    jobs: Array<{
      id: string;
      title: string;
      location: string;
      salary: { min: number; max: number };
      employmentTypes: string[];
      createdAt: Date;
    }>;
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }> {
    const company = await this._companyProfileRepository.findById(companyId);
    
    if (!company || company.isVerified !== CompanyVerificationStatus.VERIFIED || company.isBlocked) {
      throw new NotFoundError('Company not found');
    }
    const total = await this._jobPostingRepository.countActiveJobsByCompany(companyId);
    const skip = (page - 1) * limit;
    const hasMore = skip + limit < total;
    const allJobs = await this._jobPostingRepository.getJobsByCompany(companyId, {
      title: 1,
      location: 1,
      salary: 1,
      employment_types: 1,
      createdAt: 1,
      status: 1,
    });

    const activeJobs = allJobs
      .filter((job: Partial<{ status: string }>) => job.status === 'active')
      .slice(skip, skip + limit);
      
    return {
      jobs: activeJobs.map((job: Partial<{ 
        id: string; 
        title: string; 
        location: string; 
        salary: { min: number; max: number }; 
        employmentTypes: string[]; 
        employment_types: string[]; 
        createdAt: Date;
      }>) => ({
        id: job.id || '',
        title: job.title || '',
        location: job.location || '',
        salary: job.salary || { min: 0, max: 0 },
        employmentTypes: job.employmentTypes || job.employment_types || [],
        createdAt: job.createdAt || new Date(),
      })),
      total,
      page,
      limit,
      hasMore,
    };
  }
}
