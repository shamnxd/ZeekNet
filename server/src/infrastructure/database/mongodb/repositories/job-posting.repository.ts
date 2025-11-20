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

  protected mapToDocument(entity: Partial<JobPosting>): Partial<JobPostingDocument> {
    return JobPostingMapper.toDocument(entity as JobPosting);
  }

  // Override findById to add populate
  async findById(id: string): Promise<JobPosting | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const jobPosting = await JobPostingModel.findById(id).populate('company_id', 'companyName logo');
    return jobPosting ? this.mapToEntity(jobPosting) : null;
  }

  // Override findOne to add populate
  async findOne(criteria: Record<string, unknown>): Promise<JobPosting | null> {
    const document = await JobPostingModel.findOne(criteria).populate('company_id', 'companyName logo');
    return document ? this.mapToEntity(document) : null;
  }

  // Override findMany to add populate
  async findMany(criteria: Record<string, unknown>): Promise<JobPosting[]> {
    const documents = await JobPostingModel.find(criteria).populate('company_id', 'companyName logo');
    return documents.map((doc) => this.mapToEntity(doc));
  }
}