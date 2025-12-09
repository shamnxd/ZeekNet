import { IGetCompanyProfileUseCase, IGetCompanyJobPostingsUseCase, IGetCompanyProfileWithJobPostingsUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';
import { JobPosting } from '../../../domain/entities/job-posting.entity';
import { CompanyProfileWithDetailsResponseDto } from '../../dto/company/company-response.dto';
import { CompanyProfileMapper } from '../../mappers/company-profile.mapper';
import { AppError } from '../../../domain/errors/errors';
import { IS3Service } from '../../../domain/interfaces/services/IS3Service';

export class GetCompanyProfileWithJobPostingsUseCase implements IGetCompanyProfileWithJobPostingsUseCase {
  constructor(
    private readonly _getCompanyProfileUseCase: IGetCompanyProfileUseCase,
    private readonly _getCompanyJobPostingsUseCase: IGetCompanyJobPostingsUseCase,
    private readonly _s3Service: IS3Service,
  ) {}

  async execute(userId: string): Promise<CompanyProfileWithDetailsResponseDto> {
    const companyProfile = await this._getCompanyProfileUseCase.execute(userId);

    if (!companyProfile) {
      throw new AppError('Company profile not found', 404);
    }

    const jobPostingsQuery = {
      page: 1,
      limit: 3,
      is_active: true,
      category_ids: undefined,
      employment_types: undefined,
      salary_min: undefined,
      salary_max: undefined,
      location: undefined,
      search: undefined,
    };

    const jobPostings = await this._getCompanyJobPostingsUseCase.execute({ userId, ...jobPostingsQuery });

    const jobEntities: JobPosting[] = jobPostings.jobs.map(j => JobPosting.create({
      id: j.id,
      companyId: companyProfile.profile.id,
      title: j.title,
      description: '',
      responsibilities: [],
      qualifications: [],
      niceToHaves: [],
      benefits: [],
      salary: { min: 0, max: 0 },
      employmentTypes: j.employmentTypes || [],
      location: '',
      skillsRequired: [],
      categoryIds: [],
      status: j.status,
      viewCount: j.viewCount,
      applicationCount: j.applicationCount,
      createdAt: j.createdAt,
      updatedAt: j.createdAt,
      unpublishReason: j.unpublishReason,
      companyName: companyProfile.profile.companyName,
      companyLogo: companyProfile.profile.logo,
    }));

    const logoKey = companyProfile.profile.logo && !companyProfile.profile.logo.startsWith('http') ? companyProfile.profile.logo : null;
    const bannerKey = companyProfile.profile.banner && !companyProfile.profile.banner.startsWith('http') ? companyProfile.profile.banner : null;
    const businessLicenseKey = companyProfile.verification?.businessLicenseUrl && !companyProfile.verification.businessLicenseUrl.startsWith('http') 
      ? companyProfile.verification.businessLicenseUrl 
      : null;

    const [logoUrl, bannerUrl, businessLicenseUrl, workplacePictureUrls] = await Promise.all([
      logoKey ? this._s3Service.getSignedUrl(logoKey) : Promise.resolve(null),
      bannerKey ? this._s3Service.getSignedUrl(bannerKey) : Promise.resolve(null),
      businessLicenseKey ? this._s3Service.getSignedUrl(businessLicenseKey) : Promise.resolve(null),
      Promise.all(companyProfile.workplacePictures.map(pic => {
        const picKey = pic.pictureUrl && !pic.pictureUrl.startsWith('http') ? pic.pictureUrl : null;
        return picKey ? this._s3Service.getSignedUrl(picKey) : Promise.resolve(pic.pictureUrl);
      })),
    ]);

    const responseData = CompanyProfileMapper.toDetailedResponse({
      ...companyProfile,
      jobPostings: jobEntities,
      signedUrls: {
        logo: logoUrl,
        banner: bannerUrl,
        businessLicense: businessLicenseUrl,
        workplacePictures: companyProfile.workplacePictures.map((pic, index) => ({
          id: pic.id,
          pictureUrl: workplacePictureUrls[index] || pic.pictureUrl,
        })),
      },
    });

    return responseData;
  }
}

