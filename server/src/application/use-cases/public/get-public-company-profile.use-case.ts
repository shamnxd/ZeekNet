import { IGetPublicCompanyProfileUseCase } from '../../../domain/interfaces/use-cases/public/IGetPublicCompanyProfileUseCase';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanySubscriptionRepository } from '../../../domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { ICompanyContactRepository } from '../../../domain/interfaces/repositories/company/ICompanyContactRepository';
import { ICompanyOfficeLocationRepository } from '../../../domain/interfaces/repositories/company/ICompanyOfficeLocationRepository';
import { ICompanyTechStackRepository } from '../../../domain/interfaces/repositories/company/ICompanyTechStackRepository';
import { ICompanyBenefitsRepository } from '../../../domain/interfaces/repositories/company/ICompanyBenefitsRepository';
import { ICompanyWorkplacePicturesRepository } from '../../../domain/interfaces/repositories/company/ICompanyWorkplacePicturesRepository';
import { IS3Service } from '../../../domain/interfaces/services/IS3Service';
import { CompanyVerificationStatus } from '../../../domain/enums/verification-status.enum';
import { NotFoundError } from '../../../domain/errors/errors';

export class GetPublicCompanyProfileUseCase implements IGetPublicCompanyProfileUseCase {
  constructor(
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _subscriptionRepository: ICompanySubscriptionRepository,
    private readonly _contactRepository: ICompanyContactRepository,
    private readonly _officeLocationRepository: ICompanyOfficeLocationRepository,
    private readonly _techStackRepository: ICompanyTechStackRepository,
    private readonly _benefitsRepository: ICompanyBenefitsRepository,
    private readonly _workplacePicturesRepository: ICompanyWorkplacePicturesRepository,
    private readonly _s3Service: IS3Service,
  ) {}

  async execute(companyId: string): Promise<unknown> {
    const company = await this._companyProfileRepository.findById(companyId);

    if (!company || company.isVerified !== CompanyVerificationStatus.VERIFIED || company.isBlocked) {
      throw new NotFoundError('Company not found');
    }

    // Fetch all company data in parallel
    const [
      activeJobsCount,
      subscription,
      contact,
      locations,
      techStack,
      benefits,
      workplacePictures,
    ] = await Promise.all([
      this._jobPostingRepository.countActiveJobsByCompany(company.id),
      this._subscriptionRepository.findActiveByCompanyId(company.id),
      this._contactRepository.findOne({ companyId: company.id }),
      this._officeLocationRepository.findMany({ companyId: company.id }),
      this._techStackRepository.findMany({ companyId: company.id }),
      this._benefitsRepository.findMany({ companyId: company.id }),
      this._workplacePicturesRepository.findMany({ companyId: company.id }),
    ]);

    const hasActiveSubscription = !!subscription;

    // Generate signed URLs for images
    let logo = company.logo;
    if (logo && !logo.startsWith('http')) {
      logo = await this._s3Service.getSignedUrl(logo);
    }

    let banner = company.banner;
    if (banner && !banner.startsWith('http')) {
      banner = await this._s3Service.getSignedUrl(banner);
    }

    // Generate signed URLs for workplace pictures
    const workplacePicturesWithUrls = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      workplacePictures.map(async (pic: any) => {
        let imageUrl = pic.imageUrl;
        if (imageUrl && !imageUrl.startsWith('http')) {
          imageUrl = await this._s3Service.getSignedUrl(imageUrl);
        }
        return {
          id: pic.id,
          imageUrl,
          caption: pic.caption,
        };
      }),
    );

    return {
      profile: {
        id: company.id,
        companyName: company.companyName,
        logo,
        banner,
        websiteLink: company.websiteLink,
        employeeCount: company.employeeCount,
        industry: company.industry,
        organisation: company.organisation,
        aboutUs: company.aboutUs,
        phone: company.phone,
        foundedDate: company.foundedDate,
        hasActiveSubscription,
      },
      contact: contact ? {
        email: contact.email,
        phone: contact.phone,
      } : null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      locations: locations.map((loc: any) => ({
        id: loc.id,
        city: loc.city,
        state: loc.state,
        country: loc.country,
        address: loc.address,
        isPrimary: loc.isPrimary,
      })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      techStack: techStack.map((tech: any) => ({
        id: tech.id,
        name: tech.name,
        category: tech.category,
      })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      benefits: benefits.map((benefit: any) => ({
        id: benefit.id,
        title: benefit.title,
        description: benefit.description,
        icon: benefit.icon,
      })),
      workplacePictures: workplacePicturesWithUrls,
      activeJobCount: activeJobsCount,
    };
  }
}
