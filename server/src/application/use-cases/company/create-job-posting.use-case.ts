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
    
    const jobPosting: Omit<JobPosting, 'id' | '_id' | 'createdAt' | 'updatedAt'> = {
      companyId: companyProfile.id,
      title: jobData.title,
      description: jobData.description,
      responsibilities: jobData.responsibilities,
      qualifications: jobData.qualifications,
      niceToHaves: jobData.nice_to_haves || [],
      benefits: jobData.benefits || [],
      salary: jobData.salary,
      employmentTypes: jobData.employment_types,
      location: jobData.location,
      skillsRequired: jobData.skills_required || [],
      categoryIds: jobData.category_ids || [],
      status: 'active',
      viewCount: 0,
      applicationCount: 0,
    };

    return await this._jobPostingRepository.postJob(jobPosting);
  }
}

