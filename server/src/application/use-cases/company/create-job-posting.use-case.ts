import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { CreateJobPostingData, ICreateJobPostingUseCase, IGetCompanyProfileByUserIdUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';
import { AppError } from '../../../domain/errors/errors';
import { JobPosting } from '../../../domain/entities/job-posting.entity';

export class CreateJobPostingUseCase implements ICreateJobPostingUseCase {
  constructor(
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _getCompanyProfileByUserIdUseCase: IGetCompanyProfileByUserIdUseCase,
  ) {}

  async execute(userId: string, jobData: CreateJobPostingData): Promise<JobPosting> {
    const companyProfile = await this._getCompanyProfileByUserIdUseCase.execute(userId);
    if (!companyProfile) {
      throw new AppError('Company profile not found', 404);
    }
    const companyId = companyProfile.id;
    
    const jobPosting = {
      company_id: companyId,
      title: jobData.title,
      description: jobData.description,
      responsibilities: jobData.responsibilities,
      qualifications: jobData.qualifications,
      nice_to_haves: jobData.nice_to_haves,
      benefits: jobData.benefits,
      salary: jobData.salary,
      employment_types: jobData.employment_types,
      location: jobData.location,
      skills_required: jobData.skills_required,
      category_ids: jobData.category_ids,
      is_active: true,
      view_count: 0,
      application_count: 0,
    };

    return await this._jobPostingRepository.create(jobPosting as unknown as Omit<JobPosting, 'id' | '_id' | 'createdAt' | 'updatedAt'>);
  }
}

