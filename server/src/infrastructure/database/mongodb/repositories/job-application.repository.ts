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
      { _id: applicationId, 'interviews._id': new Types.ObjectId(interviewId) },
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
        $pull: { interviews: { _id: new Types.ObjectId(interviewId) } },
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
      { _id: applicationId, 'interviews._id': new Types.ObjectId(interviewId) },
      { $set: updateFields },
      { new: true },
    );

    return updated ? this.mapToEntity(updated) : null;
  }

  async countApplicationInday(userId: string): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return JobApplicationModel.countDocuments({
      applicant_id: userId,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    }).exec();
  }

  async checkCanApply(userId: string, companyId: string): Promise<boolean> {
    let startDate = new Date();

    let application = await JobApplicationModel.findOne({
      seeker_id: userId,
      company_id: companyId,
      stage: 'rejected',
    });

    if(!application) {
      return true;
    };

    startDate.setDate(application?.updated_at);
    let endDate = new Date();
    endDate.setDate(endDate.getMonth() + 6);


    let count = await JobApplicationModel.countDocuments({
      seeker_id: userId,
      company_id: companyId,
      createdAt: { $gte: startDate, $lte: endDate },
    });;

    if(count >= 1) {
      return false;
    }
  }
}