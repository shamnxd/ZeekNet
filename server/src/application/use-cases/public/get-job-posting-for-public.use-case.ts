import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { IGetJobPostingForPublicUseCase } from '../../../domain/interfaces/use-cases/IPublicUseCases';
import { AppError } from '../../../domain/errors/errors';
import { JobPostingDetailResponseDto } from '../../dto/job-posting/job-posting-response.dto';

export class GetJobPostingForPublicUseCase implements IGetJobPostingForPublicUseCase {
  constructor(private readonly _jobPostingRepository: IJobPostingRepository) {}

  async execute(jobId: string): Promise<JobPostingDetailResponseDto> {
    try {
      if (!jobId || jobId === 'undefined') {
        throw new AppError('Job ID is required', 400);
      }

      const jobPosting = await this._jobPostingRepository.findById(jobId);

      if (!jobPosting) {
        throw new AppError('Job posting not found', 404);
      }

      // Business logic: Check if job is visible to public
      if (jobPosting.adminBlocked) {
        throw new AppError('Job posting not found', 404);
      }

      if (!jobPosting.isActive) {
        throw new AppError('Job posting not found', 404);
      }

      // Increment view count
      await this._jobPostingRepository.update(jobId, { 
        viewCount: jobPosting.viewCount + 1, 
      });

      // Build detailed response DTO (business logic in use case)
      const company = await this.getCompanyDetails(jobPosting.companyId);

      return {
        id: jobPosting.id,
        title: jobPosting.title,
        description: jobPosting.description,
        responsibilities: jobPosting.responsibilities,
        qualifications: jobPosting.qualifications,
        nice_to_haves: jobPosting.niceToHaves,
        benefits: jobPosting.benefits,
        salary: jobPosting.salary,
        employment_types: jobPosting.employmentTypes,
        location: jobPosting.location,
        skills_required: jobPosting.skillsRequired,
        category_ids: jobPosting.categoryIds,
        is_active: jobPosting.isActive,
        admin_blocked: jobPosting.adminBlocked,
        unpublish_reason: jobPosting.unpublishReason,
        view_count: jobPosting.viewCount + 1,
        application_count: jobPosting.applicationCount,
        createdAt: jobPosting.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: jobPosting.updatedAt?.toISOString() || new Date().toISOString(),
        company,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch job posting', 500);
    }
  }

  private async getCompanyDetails(companyId: string): Promise<JobPostingDetailResponseDto['company']> {
    // Import models dynamically to avoid circular dependencies
    const { CompanyProfileModel } = await import('../../../infrastructure/database/mongodb/models/company-profile.model');
    const { UserModel } = await import('../../../infrastructure/database/mongodb/models/user.model');
    const { CompanyWorkplacePicturesModel } = await import('../../../infrastructure/database/mongodb/models/company-workplace-pictures.model');

    try {
      const companyProfile = await CompanyProfileModel.findById(companyId).populate('userId', 'isBlocked');

      if (!companyProfile) {
        return {
          companyName: 'ZeekNet Company',
          logo: '/white.png',
          workplacePictures: [],
        };
      }

      // Check if user is blocked
      const user = await UserModel.findById(companyProfile.userId);
      if (user && user.isBlocked) {
        throw new AppError('Job posting not found', 404);
      }

      // Get workplace pictures
      const workplacePictures = await CompanyWorkplacePicturesModel.find({
        companyId: companyProfile._id,
      })
        .select('pictureUrl caption')
        .limit(4);

      return {
        companyName: companyProfile.companyName || 'Unknown Company',
        logo: companyProfile.logo || '/white.png',
        workplacePictures: workplacePictures.map((pic) => ({
          pictureUrl: pic.pictureUrl,
          caption: pic.caption,
        })),
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      return {
        companyName: 'ZeekNet Company',
        logo: '/white.png',
        workplacePictures: [],
      };
    }
  }
}
