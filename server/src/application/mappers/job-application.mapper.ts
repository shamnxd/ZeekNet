import { JobApplication, InterviewSchedule, InterviewFeedback } from '../../domain/entities/job-application.entity';
import {
  JobApplicationListResponseDto,
  JobApplicationDetailResponseDto,
  InterviewScheduleResponseDto,
  PaginatedApplicationsResponseDto,
} from '../dto/job-application/job-application-response.dto';
import { CreateJobApplicationRequestDto } from '../dto/job-application/create-job-application.dto';
import { AddInterviewRequestDto } from '../dto/job-application/add-interview.dto';
import { UpdateInterviewRequestDto } from '../dto/job-application/update-interview.dto';
import { AddInterviewFeedbackRequestDto } from '../dto/job-application/add-interview-feedback.dto';

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
      seeker_id: params?.seekerName ? application.seeker_id : undefined,
      seeker_name: params?.seekerName,
      seeker_avatar: params?.seekerAvatar,
      job_id: application.job_id,
      job_title: params?.jobTitle || '',
      company_name: params?.companyName,
      company_logo: params?.companyLogo,
      score: application.score,
      stage: application.stage,
      applied_date: application.applied_date.toISOString(),
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
      seeker_id: application.seeker_id,
      seeker_name: seekerData?.name || '',
      seeker_avatar: seekerData?.avatar,
      seeker_headline: seekerData?.headline,
      job_id: application.job_id,
      job_title: jobData?.title || '',
      job_company: jobData?.companyName,
      job_location: jobData?.location,
      job_type: jobData?.employmentTypes?.[0],
      cover_letter: application.cover_letter,
      resume_url: application.resume_url,
      resume_filename: application.resume_filename,
      score: application.score,
      stage: application.stage,
      applied_date: application.applied_date.toISOString(),
      rejection_reason: application.rejection_reason,
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

  static interviewToDto(interview: InterviewSchedule): InterviewScheduleResponseDto {
    return {
      id: interview.id || '',
      date: interview.date.toISOString(),
      time: interview.time,
      interview_type: interview.interview_type,
      location: interview.location,
      interviewer_name: interview.interviewer_name,
      status: interview.status || 'scheduled',
      feedback: interview.feedback
        ? {
          reviewer_name: interview.feedback.reviewer_name,
          rating: interview.feedback.rating,
          comment: interview.feedback.comment,
          reviewed_at: interview.feedback.reviewed_at.toISOString(),
        }
        : undefined,
      created_at: interview.created_at?.toISOString(),
      updated_at: interview.updated_at?.toISOString(),
    };
  }

  static createApplicationDataFromDto(dto: CreateJobApplicationRequestDto, seekerId: string, companyId: string) {
    return {
      seeker_id: seekerId,
      job_id: dto.job_id,
      company_id: companyId,
      cover_letter: dto.cover_letter,
      resume_url: dto.resume_url,
      resume_filename: dto.resume_filename,
    };
  }

  static interviewDataFromDto(dto: AddInterviewRequestDto): Omit<InterviewSchedule, 'id' | 'created_at' | 'updated_at'> {
    return {
      date: dto.date instanceof Date ? dto.date : new Date(dto.date),
      time: dto.time,
      interview_type: dto.interview_type,
      location: dto.location,
      interviewer_name: dto.interviewer_name,
      status: 'scheduled',
    };
  }

  static updateInterviewDataFromDto(dto: UpdateInterviewRequestDto): Partial<InterviewSchedule> {
    const data: Partial<InterviewSchedule> = {};

    if (dto.date !== undefined) {
      data.date = dto.date instanceof Date ? dto.date : new Date(dto.date);
    }
    if (dto.time !== undefined) {
      data.time = dto.time;
    }
    if (dto.interview_type !== undefined) {
      data.interview_type = dto.interview_type;
    }
    if (dto.location !== undefined) {
      data.location = dto.location;
    }
    if (dto.interviewer_name !== undefined) {
      data.interviewer_name = dto.interviewer_name;
    }
    if (dto.status !== undefined) {
      data.status = dto.status;
    }

    return data;
  }

  static feedbackDataFromDto(dto: AddInterviewFeedbackRequestDto): InterviewFeedback {
    return {
      reviewer_name: dto.reviewer_name,
      rating: dto.rating,
      comment: dto.comment,
      reviewed_at: new Date(),
    };
  }
}

