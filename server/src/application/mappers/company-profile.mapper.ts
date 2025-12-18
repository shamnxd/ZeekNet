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
import { JobPostingMapper } from './job-posting.mapper';
import { CreateCompanyProfileFromDtoRequestDto } from '../dto/company/create-company-profile-from-dto.dto';
import { CreateCompanyProfileRequestDtoType } from '../dto/company/create-company-profile-request.dto';
import { CompanyVerificationStatus } from '../../domain/enums/verification-status.enum';
import { SimpleUpdateCompanyProfileRequestDto } from '../dto/company/company-profile.dto';
import { CompanyWithVerificationResult } from '../dto/company/company-with-verification-result.dto';
import { CreateInput } from '../../domain/types/common.types';

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
  ): CompanyWithVerificationResult {
    return {
      id: company.id,
      userId: company.userId,
      companyName: company.companyName,
      logo: company.logo,
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

  static toUpdateEntity(data: Partial<SimpleUpdateCompanyProfileRequestDto>): Partial<CompanyProfile> {
    return {
      ...(data.company_name && { companyName: data.company_name }),
      ...(data.logo && { logo: data.logo }),
      ...(data.banner && { banner: data.banner }),
      ...(data.website_link && { websiteLink: data.website_link }),
      ...(data.employee_count !== undefined && { employeeCount: data.employee_count }),
      ...(data.industry && { industry: data.industry }),
      ...(data.organisation && { organisation: data.organisation }),
      ...(data.about_us && { aboutUs: data.about_us }),
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
