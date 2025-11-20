import { Types } from 'mongoose';
import type { IJobApplicationRepository, PaginatedApplications } from '../../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import type { JobApplication, InterviewSchedule, InterviewFeedback, ApplicationStage } from '../../../../domain/entities/job-application.entity';
import { JobApplicationModel } from '../models/job-application.model';
import { JobApplicationMapper } from '../mappers/job-application.mapper';
import { RepositoryBase } from './base-repository';
import type { JobApplicationDocument } from '../models/job-application.model';

export class JobApplicationRepository extends RepositoryBase<JobApplication, JobApplicationDocument> implements IJobApplicationRepository {
  constructor() {
    super(JobApplicationModel);
  }

  protected mapToEntity(doc: JobApplicationDocument): JobApplication {
    return JobApplicationMapper.toEntity(doc);
  }

  protected mapToDocument(entity: Partial<JobApplication>): Partial<JobApplicationDocument> {
    return JobApplicationMapper.toDocument(entity as JobApplication);
  }

  async addInterview(applicationId: string, interviewData: Omit<InterviewSchedule, 'id' | 'created_at' | 'updated_at'>): Promise<JobApplication | null> {
    const interview = {
      ...interviewData,
      id: new Types.ObjectId().toString(),
      created_at: new Date(),
      updated_at: new Date(),
    };

    const updated = await JobApplicationModel.findByIdAndUpdate(
      applicationId,
      { $push: { interviews: interview }, updatedAt: new Date() },
      { new: true },
    );

    return updated ? this.mapToEntity(updated) : null;
  }

  async addInterviewFeedback(applicationId: string, interviewId: string, feedbackData: InterviewFeedback): Promise<JobApplication | null> {
    const updated = await JobApplicationModel.findOneAndUpdate(
      { _id: applicationId, 'interviews.id': interviewId },
      { 
        $set: { 
          'interviews.$.feedback': feedbackData,
          'interviews.$.updated_at': new Date(),
          updatedAt: new Date(),
        },
      },
      { new: true },
    );

    return updated ? this.mapToEntity(updated) : null;
  }

  async deleteInterview(applicationId: string, interviewId: string): Promise<JobApplication | null> {
    const updated = await JobApplicationModel.findByIdAndUpdate(
      applicationId,
      { 
        $pull: { interviews: { id: interviewId } },
        updatedAt: new Date(),
      },
      { new: true },
    );

    return updated ? this.mapToEntity(updated) : null;
  }

  async updateInterview(applicationId: string, interviewId: string, interviewData: Partial<InterviewSchedule>): Promise<JobApplication | null> {
    const updateFields: Record<string, unknown> = {};
    Object.keys(interviewData).forEach(key => {
      updateFields[`interviews.$.${key}`] = interviewData[key as keyof InterviewSchedule];
    });
    updateFields['interviews.$.updated_at'] = new Date();
    updateFields['updatedAt'] = new Date();

    const updated = await JobApplicationModel.findOneAndUpdate(
      { _id: applicationId, 'interviews.id': interviewId },
      { $set: updateFields },
      { new: true },
    );

    return updated ? this.mapToEntity(updated) : null;
  }

  async findByCompanyId(companyId: string, filters: { stage?: ApplicationStage; search?: string; page: number; limit: number }): Promise<PaginatedApplications> {
    const query: Record<string, unknown> = { company_id: new Types.ObjectId(companyId) };
    if (filters.stage) query.stage = filters.stage;

    const skip = (filters.page - 1) * filters.limit;
    const [applications, total] = await Promise.all([
      JobApplicationModel.find(query)
        .skip(skip)
        .limit(filters.limit)
        .sort({ applied_date: -1 }),
      JobApplicationModel.countDocuments(query),
    ]);

    return {
      applications: applications.map(doc => this.mapToEntity(doc)),
      pagination: {
        total,
        page: filters.page,
        limit: filters.limit,
        totalPages: Math.ceil(total / filters.limit),
      },
    };
  }

  async findByJobId(jobId: string, filters: { stage?: ApplicationStage; search?: string; page: number; limit: number }): Promise<PaginatedApplications> {
    const query: Record<string, unknown> = { job_id: new Types.ObjectId(jobId) };
    if (filters.stage) query.stage = filters.stage;

    const skip = (filters.page - 1) * filters.limit;
    const [applications, total] = await Promise.all([
      JobApplicationModel.find(query)
        .skip(skip)
        .limit(filters.limit)
        .sort({ applied_date: -1 }),
      JobApplicationModel.countDocuments(query),
    ]);

    return {
      applications: applications.map(doc => this.mapToEntity(doc)),
      pagination: {
        total,
        page: filters.page,
        limit: filters.limit,
        totalPages: Math.ceil(total / filters.limit),
      },
    };
  }

  async updateScore(applicationId: string, score: number): Promise<JobApplication | null> {
    const updated = await JobApplicationModel.findByIdAndUpdate(
      applicationId,
      { score, updatedAt: new Date() },
      { new: true },
    );

    return updated ? this.mapToEntity(updated) : null;
  }

  async updateStage(applicationId: string, stage: ApplicationStage, rejectionReason?: string): Promise<JobApplication | null> {
    const updateData: Record<string, unknown> = { stage, updatedAt: new Date() };
    if (stage === 'rejected' && rejectionReason) {
      updateData.rejection_reason = rejectionReason;
    }

    const updated = await JobApplicationModel.findByIdAndUpdate(
      applicationId,
      updateData,
      { new: true },
    );

    return updated ? this.mapToEntity(updated) : null;
  }

  async findBySeekerId(seekerId: string, filters: { stage?: ApplicationStage; page: number; limit: number }): Promise<PaginatedApplications> {
    const query: Record<string, unknown> = { seeker_id: new Types.ObjectId(seekerId) };
    if (filters.stage) query.stage = filters.stage;

    const skip = (filters.page - 1) * filters.limit;
    const [applications, total] = await Promise.all([
      JobApplicationModel.find(query)
        .skip(skip)
        .limit(filters.limit)
        .sort({ applied_date: -1 }),
      JobApplicationModel.countDocuments(query),
    ]);

    return {
      applications: applications.map(doc => this.mapToEntity(doc)),
      pagination: {
        total,
        page: filters.page,
        limit: filters.limit,
        totalPages: Math.ceil(total / filters.limit),
      },
    };
  }
}