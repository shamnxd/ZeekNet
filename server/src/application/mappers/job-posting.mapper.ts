import { CreateJobPostingRequestDto } from '../dto/job-posting/job-posting.dto';
import { JobPosting } from '../../domain/entities/job-posting.entity';
import { JobPostingData, JobPostingResponseDto } from './types';

export class JobPostingMapper {
  static toDomain(dto: CreateJobPostingRequestDto, companyId: string): JobPostingData {
    return {
      company_id: companyId,
      title: dto.title,
      description: dto.description,
      responsibilities: dto.responsibilities,
      qualifications: dto.qualifications,
      nice_to_haves: dto.nice_to_haves,
      benefits: dto.benefits,
      salary: dto.salary,
      employment_types: dto.employment_types,
      location: dto.location,
      skills_required: dto.skills_required,
      category_ids: dto.category_ids,
    };
  }

  static toDto(
    domain: JobPosting,
    companyData?: { companyName: string; logo: string },
  ): JobPostingResponseDto {
    return {
      id: domain.id,
      company_id: domain.companyId,
      company_name: companyData?.companyName,
      company_logo: companyData?.logo,
      title: domain.title,
      description: domain.description,
      responsibilities: domain.responsibilities,
      qualifications: domain.qualifications,
      nice_to_haves: domain.niceToHaves,
      benefits: domain.benefits,
      salary: domain.salary,
      employment_types: domain.employmentTypes,
      location: domain.location,
      skills_required: domain.skillsRequired,
      category_ids: domain.categoryIds,
      is_active: domain.isActive,
      admin_blocked: domain.adminBlocked,
      unpublish_reason: domain.unpublishReason,
      view_count: domain.viewCount,
      application_count: domain.applicationCount,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }
}