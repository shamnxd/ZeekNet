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
import { CompanyBenefits } from '../../../domain/entities/company-benefits.entity';
import { CompanyOfficeLocation } from '../../../domain/entities/company-office-location.entity';
import { CompanyTechStack } from '../../../domain/entities/company-tech-stack.entity';
import { CompanyWorkplacePictures } from '../../../domain/entities/company-workplace-pictures.entity';

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

    const hasActiveSubscription = !!subscription && !subscription.isDefault;


    let logo = company.logo;
    if (logo && !logo.startsWith('http')) {
      logo = await this._s3Service.getSignedUrl(logo);
    }

    let banner = company.banner;
    if (banner && !banner.startsWith('http')) {
      banner = await this._s3Service.getSignedUrl(banner);
    }


    const workplacePicturesWithUrls = await Promise.all(
      workplacePictures.map(async (pic: CompanyWorkplacePictures) => {
        let imageUrl = pic.pictureUrl;
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
      locations: locations.map((loc: CompanyOfficeLocation) => ({
        id: loc.id,
        city: loc.location,
        state: '',
        country: '',
        address: loc.address,
        isPrimary: loc.isHeadquarters,
      })),
      techStack: techStack.map((tech: CompanyTechStack) => ({
        id: tech.id,
        name: tech.techStack,
        category: 'Development',
      })),
      benefits: benefits.map((benefit: CompanyBenefits) => ({
        id: benefit.id,
        title: benefit.perk,
        description: benefit.description,
        icon: 'star',
      })),
      workplacePictures: workplacePicturesWithUrls,
      activeJobCount: activeJobsCount,
    };
  }
}
