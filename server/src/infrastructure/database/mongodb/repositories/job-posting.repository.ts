import { IJobPostingRepository } from '../../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { JobPosting } from '../../../../domain/entities/job-posting.entity';
import { JobPostingModel, JobPostingDocument } from '../models/job-posting.model';
import { Types } from 'mongoose';
import { JobPostingMapper } from '../mappers/job-posting.mapper';
import { RepositoryBase } from './base-repository';

export class JobPostingRepository extends RepositoryBase<JobPosting, JobPostingDocument> implements IJobPostingRepository {
  constructor() {
    super(JobPostingModel);
  }

  protected mapToEntity(doc: JobPostingDocument): JobPosting {
    return JobPostingMapper.toEntity(doc);
  }

  async create(data: Partial<JobPosting>): Promise<JobPosting> {
    const jobPostingData = {
      ...data,
      company_id: data.company_id ? new Types.ObjectId(data.company_id) : undefined,
      view_count: 0,
      application_count: 0,
      is_active: data.is_active ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const jobPosting = await JobPostingModel.create(jobPostingData);
    return this.mapToEntity(jobPosting);
  }

  async findById(id: string): Promise<JobPosting | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const jobPosting = await JobPostingModel.findById(id).populate('company_id', 'companyName logo');
    return jobPosting ? this.mapToEntity(jobPosting) : null;
  }

  async findOne(criteria: Partial<JobPosting>): Promise<JobPosting | null> {
    const document = await JobPostingModel.findOne(criteria).populate('company_id', 'companyName logo');
    return document ? this.mapToEntity(document) : null;
  }

  async findMany(criteria: Partial<JobPosting>): Promise<JobPosting[]> {
    const documents = await JobPostingModel.find(criteria).populate('company_id', 'companyName logo');
    return documents.map((doc) => this.mapToEntity(doc));
  }

  async update(id: string, data: Partial<JobPosting>): Promise<JobPosting | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const updateData: any = { ...data, updatedAt: new Date() };
    if (data.company_id) updateData.company_id = new Types.ObjectId(data.company_id);

    const result = await JobPostingModel.findByIdAndUpdate(id, updateData, { new: true })
      .populate('company_id', 'companyName logo');

    return result ? this.mapToEntity(result) : null;
  }

  async delete(id: string): Promise<void> {
    await JobPostingModel.findByIdAndDelete(id);
  }

  async exists(criteria: Partial<JobPosting>): Promise<boolean> {
    const count = await JobPostingModel.countDocuments(criteria);
    return count > 0;
  }

  async count(criteria: Partial<JobPosting>): Promise<number> {
    return await JobPostingModel.countDocuments(criteria);
  }
}