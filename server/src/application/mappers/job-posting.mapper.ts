import { JobPosting } from '../../domain/entities/job-posting.entity';
import { JobPostingResponseDto, JobPostingDetailResponseDto } from '../dto/job-posting/job-posting-response.dto';

export class JobPostingMapper {
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
}
