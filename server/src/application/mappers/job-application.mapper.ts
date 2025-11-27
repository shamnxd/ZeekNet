import { JobApplication, InterviewSchedule } from '../../domain/entities/job-application.entity';
import {
  JobApplicationListResponseDto,
  JobApplicationDetailResponseDto,
  InterviewScheduleResponseDto,
} from '../dto/job-application/job-application-response.dto';

export class JobApplicationMapper {
  static toListResponse(
    application: JobApplication,
    additionalData?: {
      seekerName?: string;
      seekerAvatar?: string;
      jobTitle?: string;
      companyName?: string;
      companyLogo?: string;
    },
  ): JobApplicationListResponseDto {
    return {
      id: application.id,
      seeker_id: additionalData?.seekerName ? application.seekerId : undefined,
      seeker_name: additionalData?.seekerName,
      seeker_avatar: additionalData?.seekerAvatar,
      job_id: application.jobId,
      job_title: additionalData?.jobTitle || '',
      company_name: additionalData?.companyName,
      company_logo: additionalData?.companyLogo,
      score: application.score,
      stage: application.stage,
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
    },
  ): JobApplicationDetailResponseDto {
    return {
      id: application.id,
      seeker_id: application.seekerId,
      seeker_name: seekerData?.name || '',
      seeker_avatar: seekerData?.avatar,
      seeker_headline: seekerData?.headline,
      job_id: application.jobId,
      job_title: jobData?.title || '',
      job_company: jobData?.companyName,
      job_location: jobData?.location,
      job_type: jobData?.employmentTypes?.[0],
      company_name: jobData?.companyName,
      company_logo: jobData?.companyLogo,
      cover_letter: application.coverLetter,
      resume_url: application.resumeUrl,
      resume_filename: application.resumeFilename,
      score: application.score,
      stage: application.stage,
      applied_date: application.appliedDate.toISOString(),
      rejection_reason: application.rejectionReason,
      interviews: application.interviews.map((interview) => this.interviewToResponse(interview)),
      full_name: seekerData?.name,
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

  static interviewToResponse(interview: InterviewSchedule): InterviewScheduleResponseDto {
    return {
      id: interview.id || '',
      date: interview.date.toISOString(),
      time: interview.time,
      interview_type: interview.interviewType,
      location: interview.location,
      interviewer_name: interview.interviewerName,
      status: interview.status || 'scheduled',
      feedback: interview.feedback
        ? {
          reviewer_name: interview.feedback.reviewerName,
          rating: interview.feedback.rating,
          comment: interview.feedback.comment,
          reviewed_at: interview.feedback.reviewedAt.toISOString(),
        }
        : undefined,
      created_at: interview.createdAt?.toISOString(),
      updated_at: interview.updatedAt?.toISOString(),
    };
  }
}
