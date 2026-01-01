import { JobApplication } from '../../../domain/entities/job-application.entity';
import { JobPosting } from '../../../domain/entities/job-posting.entity';
import { ATSStage, ATSSubStage, InReviewSubStage } from '../../../domain/enums/ats-stage.enum';
import {
  JobApplicationListResponseDto,
  JobApplicationDetailResponseDto,
} from '../../dtos/job-application/responses/job-application-response.dto';
import { CreateInput } from '../../../domain/types/common.types';

export class JobApplicationMapper {
  static toEntity(data: {
    seekerId: string;
    jobId: string;
    companyId: string;
    coverLetter?: string;
    resumeUrl?: string;
    resumeFilename?: string;
    stage?: ATSStage;
    appliedDate?: Date;
    score?: number;
  }): CreateInput<JobApplication> {
    return {
      seekerId: data.seekerId,
      jobId: data.jobId,
      companyId: data.companyId,
      coverLetter: data.coverLetter || '',
      resumeUrl: data.resumeUrl || '',
      resumeFilename: data.resumeFilename || '',
      stage: data.stage || ATSStage.IN_REVIEW,
      subStage: InReviewSubStage.PROFILE_REVIEW, // Default sub-stage for new applications
      appliedDate: data.appliedDate || new Date(),
      score: data.score ?? -1,
    };
  }
  static toListResponse(
    application: JobApplication,
    additionalData?: {
      seekerName?: string;
      seekerAvatar?: string;
      jobTitle?: string;
      companyName?: string;
      companyLogo?: string;
    } | JobPosting | null,
  ): JobApplicationListResponseDto {
    const data = (additionalData || {}) as { seekerName?: string; seekerAvatar?: string; jobTitle?: string; title?: string; companyName?: string; companyLogo?: string };
    return {
      id: application.id,
      seeker_id: data?.seekerName ? application.seekerId : undefined,
      seeker_name: data?.seekerName,
      seeker_avatar: data?.seekerAvatar,
      job_id: application.jobId,
      job_title: data?.jobTitle || data?.title || '',
      company_name: data?.companyName,
      company_logo: data?.companyLogo,
      score: application.score,
      stage: application.stage as unknown as 'rejected' | 'applied' | 'shortlisted' | 'interview' | 'hired', // Legacy compatibility - will be updated to use ATSStage values
      sub_stage: application.subStage,
      applied_date: application.appliedDate.toISOString(),
    };
  }

  static toDetailResponse(
    application: JobApplication,
    seekerData?: {
      name?: string;
      avatar?: string;
      headline?: string;
      email?: string;
      phone?: string;
      location?: string;
      summary?: string;
      skills?: string[];
      languages?: string[];
      date_of_birth?: Date;
      gender?: string;
      experiences?: Array<{
        title: string;
        company: string;
        startDate: Date;
        endDate?: Date;
        location?: string;
        description?: string;
      }>;
      education?: Array<{
        school: string;
        degree?: string;
        startDate: Date;
        endDate?: Date;
        location?: string;
      }>;
    },
    jobData?: {
      title?: string;
      companyName?: string;
      companyLogo?: string;
      location?: string;
      employmentTypes?: string[];
    } | JobPosting | null,
    signedResumeUrl?: string,
  ): JobApplicationDetailResponseDto {
    const job = (jobData || {}) as { title?: string; companyName?: string; companyLogo?: string; location?: string; employmentTypes?: string[] };
    return {
      id: application.id,
      seeker_id: application.seekerId,
      seeker_name: seekerData?.name || '',
      seeker_avatar: seekerData?.avatar,
      seeker_headline: seekerData?.headline,
      job_id: application.jobId,
      job_title: job?.title || '',
      job_company: job?.companyName,
      job_location: job?.location,
      job_type: job?.employmentTypes?.[0],
      company_name: job?.companyName,
      company_logo: job?.companyLogo,
      cover_letter: application.coverLetter,
      resume_url: signedResumeUrl || application.resumeUrl,
      resume_filename: application.resumeFilename,
      score: application.score,
      stage: application.stage as unknown as 'rejected' | 'applied' | 'shortlisted' | 'interview' | 'hired', // Legacy compatibility - will be updated to use ATSStage values
      sub_stage: application.subStage,
      applied_date: application.appliedDate.toISOString(),
      rejection_reason: application.rejectionReason,
      interviews: [], // Old interview array removed - now handled by new ATS system
      full_name: seekerData?.name,
      date_of_birth: seekerData?.date_of_birth,
      gender: seekerData?.gender,
      email: seekerData?.email,
      phone: seekerData?.phone,
      address: seekerData?.location,
      about_me: seekerData?.summary,
      languages: seekerData?.languages,
      skills: seekerData?.skills,
      resume_data: seekerData?.experiences || seekerData?.education
        ? {
          experience: seekerData.experiences?.map((exp) => ({
            title: exp.title,
            company: exp.company,
            period: `${exp.startDate.toLocaleDateString()} - ${exp.endDate ? exp.endDate.toLocaleDateString() : 'Present'}`,
            location: exp.location,
            description: exp.description,
          })),
          education: seekerData.education?.map((edu) => ({
            degree: edu.degree || '',
            school: edu.school,
            period: `${edu.startDate.toLocaleDateString()} - ${edu.endDate ? edu.endDate.toLocaleDateString() : 'Present'}`,
            location: edu.location,
          })),
        }
        : undefined,
    };
  }
}


