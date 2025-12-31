import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IGetJobPostingForPublicUseCase } from 'src/domain/interfaces/use-cases/public/IGetJobPostingForPublicUseCase';
import { BadRequestError, NotFoundError } from '../../../domain/errors/errors';
import { JobPostingDetailResponseDto } from '../../dto/job-posting/job-posting-response.dto';
import { JobPostingMapper } from '../../mappers/job-posting.mapper';
import { CompanyProfileMapper } from '../../mappers/company-profile.mapper';
import { CompanyProfile } from '../../../domain/entities/company-profile.entity';
import { IS3Service } from '../../../domain/interfaces/services/IS3Service';

export class GetJobPostingForPublicUseCase implements IGetJobPostingForPublicUseCase {
  constructor(
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _s3Service: IS3Service,
  ) {}

  async execute(jobId: string, userId?: string): Promise<JobPostingDetailResponseDto> {
    if (!jobId || jobId === 'undefined') {
      throw new BadRequestError('Job ID is required');
    }

    const jobPosting = await this._jobPostingRepository.findById(jobId);

    if (!jobPosting) {
      throw new NotFoundError('Job posting not found');
    }

    if (jobPosting.status === 'blocked') {
      throw new NotFoundError('Job posting not found');
    }

    if (jobPosting.status !== 'active') {
      throw new NotFoundError('Job posting not found');
    }

    await this._jobPostingRepository.update(jobId, { 
      viewCount: jobPosting.viewCount + 1, 
    });

    const company = await this.getCompanyDetails(jobPosting.companyId);

    let hasApplied: boolean | undefined = undefined;
    if (userId) {
      const existingApplication = await this._jobApplicationRepository.findOne({
        seeker_id: userId,
        job_id: jobId,
      });
      hasApplied = !!existingApplication;
    }

    const response = JobPostingMapper.toDetailedResponse(jobPosting, company);
    response.has_applied = hasApplied;
    return response;
  }

  private async getCompanyDetails(companyId: string): Promise<JobPostingDetailResponseDto['company']> {
    if (!companyId || companyId.length !== 24) {
      return {
        companyName: 'ZeekNet Company',
        logo: '/white.png',
        organisation: 'Unknown',
        employeeCount: 0,
        websiteLink: '',
        workplacePictures: [],
      };
    }
    
    const { CompanyProfileModel } = await import('../../../infrastructure/database/mongodb/models/company-profile.model');
    const { UserModel } = await import('../../../infrastructure/database/mongodb/models/user.model');
    const { CompanyWorkplacePicturesModel } = await import('../../../infrastructure/database/mongodb/models/company-workplace-pictures.model');

    const companyProfile = await CompanyProfileModel.findById(companyId).populate('userId', 'isBlocked');

    if (!companyProfile) {
      return {
        companyName: 'ZeekNet Company',
        logo: '/white.png',
        organisation: 'Unknown',
        employeeCount: 0,
        websiteLink: '',
        workplacePictures: [],
      };
    }

    const user = await UserModel.findById(companyProfile.userId);
    if (user && user.isBlocked) {
      throw new NotFoundError('Job posting not found');
    }

    const workplacePictures = await CompanyWorkplacePicturesModel.find({
      companyId: companyProfile._id,
    })
      .select('pictureUrl caption')
      .limit(4);

    const logoKey = companyProfile.logo && !companyProfile.logo.startsWith('http') && companyProfile.logo !== '/white.png' 
      ? companyProfile.logo 
      : null;
    const logoUrl = logoKey ? await this._s3Service.getSignedUrl(logoKey) : (companyProfile.logo || '/white.png');

    const workplacePictureUrls = await Promise.all(
      workplacePictures.map(pic => {
        const picKey = pic.pictureUrl && !pic.pictureUrl.startsWith('http') ? pic.pictureUrl : null;
        return picKey ? this._s3Service.getSignedUrl(picKey) : Promise.resolve(pic.pictureUrl);
      }),
    );

    return CompanyProfileMapper.toPublicCompanyDetails(
      companyProfile as unknown as CompanyProfile,
      logoUrl,
      workplacePictures.map((pic, index) => ({
        pictureUrl: workplacePictureUrls[index] || pic.pictureUrl,
        caption: pic.caption,
      })),
    );
  }
}
