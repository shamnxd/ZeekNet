import { JobApplication } from '../../../../domain/entities/job-application.entity';
import type { JobApplicationDocument } from '../models/job-application.model';
import { Types } from 'mongoose';

export class JobApplicationMapper {
  static toEntity(doc: JobApplicationDocument): JobApplication {
    return JobApplication.create({
      id: doc._id.toString(),
      seekerId: doc.seeker_id.toString(),
      jobId: doc.job_id.toString(),
      companyId: doc.company_id.toString(),
      coverLetter: doc.cover_letter,
      resumeUrl: doc.resume_url,
      resumeFilename: doc.resume_filename,
      stage: doc.stage,
      score: doc.score,
      interviews: (doc.interviews || []).map(i => ({
        id: i._id?.toString(),
        date: new Date(i.date),
        time: i.time,
        interviewType: i.interview_type,
        location: i.location,
        interviewerName: i.interviewer_name,
        status: i.status,
        feedback: i.feedback
          ? {
            reviewerName: i.feedback.reviewer_name,
            rating: i.feedback.rating,
            comment: i.feedback.comment,
            reviewedAt: new Date(i.feedback.reviewed_at),
          }
          : undefined,
        createdAt: i.created_at ? new Date(i.created_at) : undefined,
        updatedAt: i.updated_at ? new Date(i.updated_at) : undefined,
      })),
      rejectionReason: doc.rejection_reason,
      appliedDate: new Date(doc.applied_date),
      createdAt: new Date(doc.createdAt),
      updatedAt: new Date(doc.updatedAt),
    });
  }

  static toDocument(entity: JobApplication): Partial<JobApplicationDocument> {
    return {
      ...(entity.seekerId && { seeker_id: new Types.ObjectId(entity.seekerId) }),
      ...(entity.jobId && { job_id: new Types.ObjectId(entity.jobId) }),
      ...(entity.companyId && { company_id: new Types.ObjectId(entity.companyId) }),
      ...(entity.coverLetter !== undefined && { cover_letter: entity.coverLetter }),
      ...(entity.resumeUrl !== undefined && { resume_url: entity.resumeUrl }),
      ...(entity.resumeFilename !== undefined && { resume_filename: entity.resumeFilename }),
      ...(entity.stage !== undefined && { stage: entity.stage }),
      ...(entity.score !== undefined && { score: entity.score }),
      ...(entity.interviews && {
        interviews: entity.interviews.map(i => ({
          date: i.date,
          time: i.time,
          interview_type: i.interviewType,
          location: i.location,
          interviewer_name: i.interviewerName,
          status: i.status,
          feedback: i.feedback
            ? {
              reviewer_name: i.feedback.reviewerName,
              rating: i.feedback.rating,
              comment: i.feedback.comment,
              reviewed_at: i.feedback.reviewedAt,
            }
            : undefined,
          created_at: i.createdAt,
          updated_at: i.updatedAt,
        })),
      }),
      ...(entity.rejectionReason !== undefined && { rejection_reason: entity.rejectionReason }),
      ...(entity.appliedDate && { applied_date: entity.appliedDate }),
    };
  }
}