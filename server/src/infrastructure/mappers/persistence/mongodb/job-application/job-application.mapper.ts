import { JobApplication } from 'src/domain/entities/job-application.entity';
import type { JobApplicationDocument } from 'src/infrastructure/persistence/mongodb/models/job-application.model';
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
      subStage: doc.sub_stage,
      atsScore: doc.ats_score,
      score: doc.score,
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
      ...(entity.subStage !== undefined && { sub_stage: entity.subStage }),
      ...(entity.atsScore !== undefined && { ats_score: entity.atsScore }),
      ...(entity.score !== undefined && { score: entity.score }),
      ...(entity.rejectionReason !== undefined && { rejection_reason: entity.rejectionReason }),
      ...(entity.appliedDate && { applied_date: entity.appliedDate }),
    };
  }
}

