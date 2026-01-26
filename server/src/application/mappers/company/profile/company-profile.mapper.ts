import { CompanyProfile } from 'src/domain/entities/company-profile.entity';
import { CompanyVerification } from 'src/domain/entities/company-verification.entity';
import { CompanyContact } from 'src/domain/entities/company-contact.entity';
import { CompanyOfficeLocation } from 'src/domain/entities/company-office-location.entity';
import { CompanyTechStack } from 'src/domain/entities/company-tech-stack.entity';
import { CompanyBenefits } from 'src/domain/entities/company-benefits.entity';
import { CompanyWorkplacePictures } from 'src/domain/entities/company-workplace-pictures.entity';
import { JobPosting } from 'src/domain/entities/job-posting.entity';
import { CompanyProfileResponseDto, CompanyProfileWithDetailsResponseDto } from 'src/application/dtos/company/profile/info/responses/company-response.dto';
import { CompanyContactMapper } from 'src/application/mappers/company/profile/company-contact.mapper';
import { CompanyOfficeLocationMapper } from 'src/application/mappers/company/profile/company-office-location.mapper';
import { CompanyTechStackMapper } from 'src/application/mappers/company/profile/company-tech-stack.mapper';
import { CompanyBenefitMapper } from 'src/application/mappers/company/profile/company-benefit.mapper';
import { CompanyWorkplacePictureMapper } from 'src/application/mappers/company/media/company-workplace-picture.mapper';
import { JobPostingMapper } from 'src/application/mappers/job/job-posting.mapper';
import { CreateCompanyProfileFromDtoRequestDto } from 'src/application/dtos/company/profile/info/requests/create-company-profile-from-dto.dto';
import { CreateCompanyProfileRequestDtoType } from 'src/application/dtos/company/profile/info/requests/create-company-profile-request.dto';
import { CompanyVerificationStatus } from 'src/domain/enums/verification-status.enum';
import { SimpleUpdateCompanyProfileRequestDto } from 'src/application/dtos/company/profile/info/requests/company-profile.dto';
import { CompanyWithVerificationResult } from 'src/application/dtos/admin/companies/responses/company-with-verification-result.dto';
import { CreateInput } from 'src/domain/types/common.types';

export class CompanyProfileMapper {
  static fromDto(dto: Omit<CreateCompanyProfileFromDtoRequestDto, 'userId'>): CreateCompanyProfileRequestDtoType {
    return {
      companyName: dto.company_name,
      logo: dto.logo || '/default-logo.png',
      banner: '/default-banner.png',
      websiteLink: dto.website || '',
      employeeCount: parseInt(dto.employees),
      industry: dto.industry,
      organisation: dto.organisation,
      aboutUs: dto.description,
      taxId: dto.tax_id,
      businessLicenseUrl: dto.business_license,
      email: dto.email,
      location: dto.location,
    };
  }

  static toEntity(data: {
    userId: string;
    companyName: string;
    logo?: string;
    banner?: string;
    websiteLink?: string;
    employeeCount?: number;
    industry?: string;
    organisation?: string;
    aboutUs?: string;
    email?: string;
  }): CreateInput<CompanyProfile> {
    return {
      userId: data.userId,
      companyName: data.companyName,
      logo: data.logo || '/default-logo.png',
      banner: data.banner || '/default-banner.png',
      websiteLink: data.websiteLink || '',
      employeeCount: data.employeeCount || 0,
      industry: data.industry || 'Unknown',
      organisation: data.organisation || 'Unknown',
      aboutUs: data.aboutUs || '',
      email: data.email || '',
      isVerified: CompanyVerificationStatus.PENDING,
      isBlocked: false,
    };
  }

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
    jobPostings?: JobPosting[] | Record<string, unknown>[];
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
      jobPostings: (data.jobPostings
        ? (data.jobPostings.length > 0 && 'createdAt' in data.jobPostings[0] && data.jobPostings[0].createdAt instanceof Date
          ? JobPostingMapper.toSimpleResponseList(data.jobPostings as JobPosting[])
          : data.jobPostings)
        : []) as Array<{
          id: string;
          title: string;
          description: string;
          location: string;
          employmentType: string;
          salaryMin?: number;
          salaryMax?: number;
          status: 'active' | 'unlisted' | 'expired' | 'blocked';
          createdAt: string;
          updatedAt: string;
        }>,
    };
  }

  static toAdminListItemResponse(
    company: CompanyProfile,
    verification?: { taxId: string; businessLicenseUrl: string } | null,
    logoUrl?: string,
  ): CompanyWithVerificationResult {
    return {
      id: company.id,
      userId: company.userId,
      companyName: company.companyName,
      logo: logoUrl || company.logo,
      banner: company.banner,
      websiteLink: company.websiteLink,
      employeeCount: company.employeeCount,
      industry: company.industry,
      organisation: company.organisation,
      aboutUs: company.aboutUs,
      isVerified: company.isVerified,
      isBlocked: company.isBlocked,
      email: company.email,
      createdAt: company.createdAt.toISOString(),
      updatedAt: company.updatedAt.toISOString(),
      ...(verification && {
        verification: {
          taxId: verification.taxId,
          businessLicenseUrl: verification.businessLicenseUrl,
        },
      }),
    };
  }

  static toAdminFullProfileResponse(data: {
    company: CompanyProfile;
    verification?: { taxId: string; businessLicenseUrl: string } | null;
    contact?: CompanyContact | null;
    locations?: CompanyOfficeLocation[];
    techStack?: CompanyTechStack[];
    benefits?: CompanyBenefits[];
    workplacePictures?: Array<{ id: string; imageUrl: string; caption?: string }>;
    activeJobCount?: number;
    jobs?: JobPosting[];
  }): CompanyWithVerificationResult {
    const base = this.toAdminListItemResponse(data.company, data.verification);

    return {
      ...base,
      contact: data.contact ? {
        email: data.contact.email || '',
        phone: data.contact.phone || '',
        twitterLink: data.contact.twitterLink || '',
        facebookLink: data.contact.facebookLink || '',
        linkedin: data.contact.linkedin || '',
      } : null,
      locations: data.locations?.map(loc => ({
        id: loc.id,
        city: loc.location,
        state: '',
        country: '',
        address: loc.address || '',
        isPrimary: loc.isHeadquarters,
      })),
      techStack: data.techStack?.map(tech => ({
        id: tech.id,
        name: tech.techStack,
        category: 'Development',
      })),
      benefits: data.benefits?.map(benefit => ({
        id: benefit.id,
        title: benefit.perk,
        description: benefit.description || '',
        icon: 'star',
      })),
      workplacePictures: data.workplacePictures,
      activeJobCount: data.activeJobCount,
      jobs: data.jobs?.map(job => ({
        id: job.id,
        title: job.title,
        description: job.description,
        location: job.location,
        employmentType: job.employmentTypes[0] || 'Full-time',
      })),
    };
  }

  static toUpdateEntity(data: Partial<SimpleUpdateCompanyProfileRequestDto>): Partial<CompanyProfile> {
    return {
      ...(data.company_name !== undefined && { companyName: data.company_name }),
      ...(data.logo !== undefined && { logo: data.logo }),
      ...(data.banner !== undefined && { banner: data.banner }),
      ...(data.website_link !== undefined && { websiteLink: data.website_link }),
      ...(data.employee_count !== undefined && { employeeCount: data.employee_count }),
      ...(data.industry !== undefined && { industry: data.industry }),
      ...(data.organisation !== undefined && { organisation: data.organisation }),
      ...(data.about_us !== undefined && { aboutUs: data.about_us }),
    };
  }

  static toPublicCompanyDetails(
    profile: CompanyProfile,
    logoUrl?: string,
    workplacePictures?: Array<{ pictureUrl: string; caption?: string }>,
  ) {
    return {
      companyName: profile.companyName || 'Unknown Company',
      logo: logoUrl || profile.logo || '/white.png',
      organisation: profile.organisation || 'Unknown',
      employeeCount: profile.employeeCount || 0,
      websiteLink: profile.websiteLink || '',
      workplacePictures: workplacePictures || [],
    };
  }
}


