import { JobPosting, ATSPipelineConfig } from '../../domain/entities/job-posting.entity';
import { JobStatus } from '../../domain/enums/job-status.enum';
import { EmploymentType } from '../../domain/enums/employment-type.enum';
import { ATSStage } from '../../domain/enums/ats-stage.enum';
import { Salary } from '../../domain/interfaces/salary.interface';
import { STAGE_TO_SUB_STAGES } from '../../domain/utils/ats-pipeline.util';
import { JobPostingResponseDto, JobPostingDetailResponseDto, CompanyJobPostingListItemDto, PublicJobListItemDto } from '../dto/job-posting/job-posting-response.dto';
import { AdminJobListItem, AdminJobStatsResponseDto } from '../dto/admin/admin-job-response.dto';
import { CreateInput } from '../../domain/types/common.types';

export class JobPostingMapper {
  static toPersistence(data: {
    companyId: string;
    title: string;
    description: string;
    responsibilities: string[];
    qualifications: string[];
    niceToHaves?: string[];
    benefits?: string[];
    salary: Salary;
    employmentTypes: EmploymentType[];
    location: string;
    skillsRequired: string[];
    categoryIds: string[];
    enabledStages?: ATSStage[];
    isFeatured?: boolean;
    expiresAt?: Date;
    totalVacancies?: number;
  }): Omit<JobPosting, 'id' | '_id' | 'createdAt' | 'updatedAt' | 'companyName' | 'companyLogo' | 'unpublishReason'> {
    const defaultEnabledStages = [
      ATSStage.IN_REVIEW,
      ATSStage.SHORTLISTED,
      ATSStage.INTERVIEW,
      ATSStage.TECHNICAL_TASK,
      ATSStage.COMPENSATION,
      ATSStage.OFFER,
    ];
    let enabledStages = data.enabledStages || defaultEnabledStages;
    
    // Ensure OFFER stage is always included
    if (!enabledStages.includes(ATSStage.OFFER)) {
      enabledStages = [...enabledStages, ATSStage.OFFER];
    }
    
    // Initialize pipeline config
    const atsPipelineConfig: ATSPipelineConfig = {};
    enabledStages.forEach((stage) => {
      // Only add stage if it exists in STAGE_TO_SUB_STAGES (filter out invalid/old stages)
      if (STAGE_TO_SUB_STAGES[stage]) {
        atsPipelineConfig[stage] = [...STAGE_TO_SUB_STAGES[stage]];
      }
    });
    
    return {
      companyId: data.companyId,
      title: data.title,
      description: data.description,
      responsibilities: data.responsibilities,
      qualifications: data.qualifications,
      niceToHaves: data.niceToHaves || [],
      benefits: data.benefits || [],
      salary: data.salary,
      employmentTypes: data.employmentTypes,
      location: data.location,
      skillsRequired: data.skillsRequired,
      categoryIds: data.categoryIds,
      enabledStages,
      atsPipelineConfig,
      isFeatured: data.isFeatured || false,
      status: JobStatus.ACTIVE,
      viewCount: 0,
      applicationCount: 0,
      totalVacancies: data.totalVacancies ?? 1,
      filledVacancies: 0,
    };
  }
  static toResponse(
    jobPosting: JobPosting,
    companyData?: { companyName: string; logo: string },
  ): JobPostingResponseDto {
    return {
      id: jobPosting.id,
      company_id: jobPosting.companyId,
      company_name: companyData?.companyName,
      company_logo: companyData?.logo,
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
      status: jobPosting.status,
      is_featured: jobPosting.isFeatured,
      unpublish_reason: jobPosting.unpublishReason,
      view_count: jobPosting.viewCount,
      application_count: jobPosting.applicationCount,
      enabled_stages: jobPosting.enabledStages,
      total_vacancies: jobPosting.totalVacancies,
      filled_vacancies: jobPosting.filledVacancies,
      closure_type: jobPosting.closureType,
      closed_at: jobPosting.closedAt,
      createdAt: jobPosting.createdAt,
      updatedAt: jobPosting.updatedAt,
    };
  }

  static toDetailedResponse(
    jobPosting: JobPosting,
    companyData?: { 
      companyName: string; 
      logo: string; 
      organisation: string;
      employeeCount: number;
      websiteLink: string;
      aboutUs?: string; 
      workplacePictures?: Array<{ pictureUrl: string; caption?: string }> 
    },
  ): JobPostingDetailResponseDto {
    const baseDto = this.toResponse(jobPosting, companyData);
    return {
      id: baseDto.id,
      title: baseDto.title,
      description: baseDto.description,
      responsibilities: baseDto.responsibilities,
      qualifications: baseDto.qualifications,
      nice_to_haves: baseDto.nice_to_haves,
      benefits: baseDto.benefits,
      salary: baseDto.salary,
      employment_types: baseDto.employment_types,
      location: baseDto.location,
      skills_required: baseDto.skills_required,
      category_ids: baseDto.category_ids,
      status: baseDto.status,
      is_featured: baseDto.is_featured,
      unpublish_reason: baseDto.unpublish_reason,
      view_count: baseDto.view_count,
      application_count: baseDto.application_count,
      enabled_stages: baseDto.enabled_stages,
      total_vacancies: baseDto.total_vacancies,
      filled_vacancies: baseDto.filled_vacancies,
      closure_type: baseDto.closure_type,
      closed_at: baseDto.closed_at instanceof Date ? baseDto.closed_at.toISOString() : baseDto.closed_at,
      createdAt: baseDto.createdAt instanceof Date ? baseDto.createdAt.toISOString() : baseDto.createdAt,
      updatedAt: baseDto.updatedAt instanceof Date ? baseDto.updatedAt.toISOString() : baseDto.updatedAt,
      company: {
        companyName: companyData?.companyName || '',
        logo: companyData?.logo || '',
        organisation: companyData?.organisation || 'Unknown',
        employeeCount: companyData?.employeeCount || 0,
        websiteLink: companyData?.websiteLink || '',
        workplacePictures: companyData?.workplacePictures || [],
      },
    };
  }

  static toResponseList(
    jobPostings: JobPosting[],
    companyDataMap?: Map<string, { companyName: string; logo: string }>,
  ): JobPostingResponseDto[] {
    return jobPostings.map((jobPosting) => {
      const companyData = companyDataMap?.get(jobPosting.companyId);
      return this.toResponse(jobPosting, companyData);
    });
  }

  static toAdminListItemResponse(jobPosting: JobPosting): AdminJobListItem {
    return {
      id: jobPosting.id,
      title: jobPosting.title,
      companyName: jobPosting.companyName || 'Company',
      location: jobPosting.location,
      salary: jobPosting.salary,
      status: jobPosting.status,
      applications: jobPosting.applicationCount,
      viewCount: jobPosting.viewCount,
      createdAt: jobPosting.createdAt,
      employmentTypes: jobPosting.employmentTypes,
      categoryIds: jobPosting.categoryIds,
    };
  }

  static toAdminListItemResponseList(jobPostings: JobPosting[]): AdminJobListItem[] {
    return jobPostings.map((job) => this.toAdminListItemResponse(job));
  }

  static toSimpleResponse(job: JobPosting): Record<string, unknown> {
    return {
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
    };
  }

  static toSimpleResponseList(jobs: JobPosting[]): Record<string, unknown>[] {
    return jobs.map((job) => this.toSimpleResponse(job));
  }

  static toAdminStatsResponse(jobs: JobPosting[]): AdminJobStatsResponseDto {
    return {
      total: jobs.length,
      active: jobs.filter((job) => job.status === JobStatus.ACTIVE).length,
      inactive: jobs.filter((job) => job.status !== JobStatus.ACTIVE).length,
      totalApplications: jobs.reduce((sum, job) => sum + job.applicationCount, 0),
      totalViews: jobs.reduce((sum, job) => sum + job.viewCount, 0),
    };
  }

  static toCompanyListItemResponse(job: JobPosting): CompanyJobPostingListItemDto {
    return {
      id: job.id,
      title: job.title,
      status: job.status,
      employmentTypes: job.employmentTypes,
      applicationCount: job.applicationCount,
      viewCount: job.viewCount,
      isFeatured: job.isFeatured,
      unpublishReason: job.unpublishReason,
      createdAt: job.createdAt,
      enabled_stages: job.enabledStages,
    };
  }

  static toCompanyListItemResponseList(jobs: JobPosting[]): CompanyJobPostingListItemDto[] {
    return jobs.map((job) => this.toCompanyListItemResponse(job));
  }

  static toPublicJobListItem(job: JobPosting): PublicJobListItemDto {
    return {
      id: job.id,
      title: job.title,
      viewCount: job.viewCount,
      applicationCount: job.applicationCount,
      salary: job.salary,
      companyName: job.companyName || '',
      companyLogo: job.companyLogo,
      isFeatured: job.isFeatured,
      createdAt: job.createdAt,
      location: job.location,
      description: job.description,
      skillsRequired: job.skillsRequired,
      employmentTypes: job.employmentTypes,
    };
  }

  static toPublicJobListItemList(jobs: JobPosting[]): PublicJobListItemDto[] {
    return jobs.map((job) => this.toPublicJobListItem(job));
  }
}
