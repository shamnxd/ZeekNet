import { JobApplication, InterviewSchedule } from '../../domain/entities/job-application.entity';
import {
  JobApplicationListResponseDto,
  JobApplicationDetailResponseDto,
  InterviewScheduleResponseDto,
} from '../dto/job-application/job-application-response.dto';

export class JobApplicationMapper {
  static toListDto(
    application: JobApplication,
    params?: {
      seekerName?: string;
      seekerAvatar?: string;
      jobTitle?: string;
      companyName?: string;
      companyLogo?: string;
    },
  ): JobApplicationListResponseDto {
    return {
      id: application.id,
      seeker_id: params?.seekerName ? application.seekerId : undefined,
      seeker_name: params?.seekerName,
      seeker_avatar: params?.seekerAvatar,
      job_id: application.jobId,
      job_title: params?.jobTitle || '',
      company_name: params?.companyName,
      company_logo: params?.companyLogo,
      score: application.score,
      stage: application.stage,
      applied_date: application.appliedDate.toISOString(),
    };
  }

  static toDetailDto(
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
      cover_letter: application.coverLetter,
      resume_url: application.resumeUrl,
      resume_filename: application.resumeFilename,
      score: application.score,
      stage: application.stage,
      applied_date: application.appliedDate.toISOString(),
      rejection_reason: application.rejectionReason,
      interviews: application.interviews.map((interview) => this.interviewToDto(interview)),
      // Seeker profile data
      full_name: seekerData?.name,
      email: seekerData?.email,
      phone: seekerData?.phone,
      address: seekerData?.location,
      about_me: seekerData?.summary,
      languages: seekerData?.languages,
      skills: seekerData?.skills,
      // Resume data (from seeker profile)
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

  private static interviewToDto(interview: InterviewSchedule): InterviewScheduleResponseDto {
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

