import { CompanyProfile } from '../../domain/entities/company-profile.entity';
import { CompanyVerification } from '../../domain/entities/company-verification.entity';
import { CompanyContact } from '../../domain/entities/company-contact.entity';
import { CompanyOfficeLocation } from '../../domain/entities/company-office-location.entity';
import { CompanyTechStack } from '../../domain/entities/company-tech-stack.entity';
import { CompanyBenefits } from '../../domain/entities/company-benefits.entity';
import { CompanyWorkplacePictures } from '../../domain/entities/company-workplace-pictures.entity';
import { JobPosting } from '../../domain/entities/job-posting.entity';
import { CompanyProfileResponseDto, CompanyProfileWithDetailsResponseDto } from '../dto/company/company-response.dto';
import { CompanyContactMapper } from './company-contact.mapper';
import { CompanyOfficeLocationMapper } from './company-office-location.mapper';
import { CompanyTechStackMapper } from './company-tech-stack.mapper';
import { CompanyBenefitMapper } from './company-benefit.mapper';
import { CompanyWorkplacePictureMapper } from './company-workplace-picture.mapper';

export class CompanyProfileMapper {
  static toResponse(
    profile: CompanyProfile,
    verification?: CompanyVerification | null,
    signedUrls?: { logo?: string | null; banner?: string | null; businessLicense?: string | null },
  ): CompanyProfileResponseDto {
    return {
      id: profile.id,
      company_name: profile.companyName,
      logo: signedUrls?.logo !== undefined && signedUrls.logo !== null ? signedUrls.logo : profile.logo,
      banner: signedUrls?.banner !== undefined && signedUrls.banner !== null ? signedUrls.banner : profile.banner,
      website_link: profile.websiteLink,
      employee_count: profile.employeeCount,
      industry: profile.industry,
      organisation: profile.organisation,
      about_us: profile.aboutUs,
      is_verified: profile.isVerified,
      is_blocked: profile.isBlocked,
      rejection_reason: profile.rejectionReason,
      tax_id: verification?.taxId,
      business_license: signedUrls?.businessLicense !== undefined && signedUrls.businessLicense !== null ? signedUrls.businessLicense : (verification?.businessLicenseUrl ?? undefined),
      created_at: profile.createdAt,
      updated_at: profile.updatedAt,
    };
  }

  static toDetailedResponse(data: {
    profile: CompanyProfile;
    contact: CompanyContact | null;
    locations: CompanyOfficeLocation[];
    techStack: CompanyTechStack[];
    benefits: CompanyBenefits[];
    workplacePictures: CompanyWorkplacePictures[];
    jobPostings?: JobPosting[];
    verification: CompanyVerification | null;
    signedUrls?: { logo?: string | null; banner?: string | null; businessLicense?: string | null; workplacePictures?: Array<{ id: string; pictureUrl: string }> };
  }): CompanyProfileWithDetailsResponseDto {
    return {
      profile: this.toResponse(data.profile, data.verification, data.signedUrls),
      contact: data.contact ? CompanyContactMapper.toResponse(data.contact) : null,
      locations: CompanyOfficeLocationMapper.toResponseList(data.locations),
      techStack: CompanyTechStackMapper.toResponseList(data.techStack),
      benefits: CompanyBenefitMapper.toResponseList(data.benefits),
      workplacePictures: data.signedUrls?.workplacePictures || CompanyWorkplacePictureMapper.toResponseList(data.workplacePictures),
      jobPostings: data.jobPostings
        ? data.jobPostings.map((job) => ({
          id: job.id,
          title: job.title,
          description: job.description,
          location: job.location,
          employmentType: job.employmentTypes?.[0] || '',
          salaryMin: job.salary?.min,
          salaryMax: job.salary?.max,
          status: job.status,
          createdAt: job.createdAt.toISOString(),
          updatedAt: job.updatedAt.toISOString(),
        }))
        : [],
    };
  }
}
