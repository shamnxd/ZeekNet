import { JobApplication } from '../../../../domain/entities/job-application.entity';
import type { JobApplicationDocument } from '../models/job-application.model';

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
}


