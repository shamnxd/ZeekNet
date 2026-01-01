import { IJobPostingRepository } from '../../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { JobPosting } from '../../../../domain/entities/job-posting.entity';
import { JobPostingModel, JobPostingDocument } from '../models/job-posting.model';
import { Types } from 'mongoose';
import { JobPostingMapper } from '../mappers/job/job-posting.mapper';
import { RepositoryBase } from './base-repository';
import { CreateInput } from '../../../../domain/types/common.types';



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

  async findById(id: string): Promise<JobPosting | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const document = await JobPostingModel.findById(id)
      .populate('company_id', 'companyName logo');
    
    return document ? this.mapToEntity(document) : null;
  }

  async findByIds(ids: string[]): Promise<JobPosting[]> {
    const validIds = ids.filter(id => Types.ObjectId.isValid(id));
    
    if (validIds.length === 0) {
      return [];
    }

    const documents = await JobPostingModel.find({
      _id: { $in: validIds.map(id => new Types.ObjectId(id)) }
    }).populate('company_id', 'companyName logo');

    return documents.map(doc => this.mapToEntity(doc));
  }

  async postJob(job: JobPosting): Promise<JobPosting> {
    const document = new JobPostingModel({
      ...this.mapToDocument(job),
      _id: new Types.ObjectId(job.id), // Ensure ID is passed
    });

    const savedDoc = await document.save();
    return this.mapToEntity(savedDoc);
  }

  async getAllJobsForPublic(
    projection: Record<string, 1 | 0>,
    filters?: {
      categoryIds?: string[];
      employmentTypes?: string[];
      salaryMin?: number;
      salaryMax?: number;
      location?: string;
      search?: string;
    },
  ): Promise<Partial<JobPosting>[]> {
    const { CompanyProfileModel } = await import('../models/company-profile.model');
    const { UserModel } = await import('../models/user.model');
    const { CompanySubscriptionModel } = await import('../models/company-subcription.model');
    
    const blockedUsers = await UserModel.find({ isBlocked: true }).select('_id').lean();
    const blockedUserIds = blockedUsers.map(u => String(u._id));
    
    const blockedCompanies = await CompanyProfileModel.find({ 
      userId: { $in: blockedUserIds },
    }).select('_id').lean();
    const blockedCompanyIds = blockedCompanies.map(c => c._id);

    const expiredSubscriptions = await CompanySubscriptionModel.find({
      isActive: true,
      expiryDate: { $lt: new Date(), $gte: new Date('1900-01-01') },
    }).select('companyId').lean();
    const expiredCompanyIds = expiredSubscriptions.map(s => s.companyId);

    const andConditions: Record<string, unknown>[] = [
      { status: { $in: ['active'] } }, // Only show active jobs, exclude closed
    ];

    if (blockedCompanyIds.length > 0) {
      andConditions.push({ company_id: { $nin: blockedCompanyIds } });
    }

    if (expiredCompanyIds.length > 0) {
      andConditions.push({ company_id: { $nin: expiredCompanyIds } });
    }

    if (filters?.categoryIds && filters.categoryIds.length > 0) {
      andConditions.push({ category_ids: { $in: filters.categoryIds } });
    }

    if (filters?.employmentTypes && filters.employmentTypes.length > 0) {
      andConditions.push({ employment_types: { $in: filters.employmentTypes } });
    }

    if (filters?.salaryMin !== undefined && filters?.salaryMax !== undefined) {
      andConditions.push({
        $and: [
          { 'salary.max': { $gte: filters.salaryMin } },
          { 'salary.min': { $lte: filters.salaryMax } },
        ],
      });
    } else if (filters?.salaryMin !== undefined) {
      andConditions.push({ 'salary.max': { $gte: filters.salaryMin } });
    } else if (filters?.salaryMax !== undefined) {
      andConditions.push({ 'salary.min': { $lte: filters.salaryMax } });
    }

    if (filters?.location) {
      andConditions.push({ location: { $regex: filters.location, $options: 'i' } });
    }

    if (filters?.search) {
      andConditions.push({
        $or: [
          { title: { $regex: filters.search, $options: 'i' } },
          { description: { $regex: filters.search, $options: 'i' } },
          { location: { $regex: filters.search, $options: 'i' } },
        ],
      });
    }

    const criteria: Record<string, unknown> = {
      $and: andConditions,
    };

    const documents = await JobPostingModel.find(criteria, {
      ...projection,
      company_id: 1,
    }).populate('company_id', 'companyName logo');
    
    let validJobs = documents.filter(doc => doc.company_id !== null);

    if (filters?.search && validJobs.length > 0) {
      const searchLower = filters.search.toLowerCase();
      validJobs = validJobs.filter(doc => {
        const plainDoc = doc.toObject();
        const companyData = plainDoc.company_id as { companyName?: string; logo?: string } | null;
        
        return (
          plainDoc.title?.toLowerCase().includes(searchLower) ||
          plainDoc.description?.toLowerCase().includes(searchLower) ||
          plainDoc.location?.toLowerCase().includes(searchLower) ||
          companyData?.companyName?.toLowerCase().includes(searchLower)
        );
      });
    }
    
    return validJobs.map((doc) => {
      const entity = this.mapToEntity(doc);
      return entity;
    });
  }

  async getJobsByCompany(
    companyId: string,
    projection: Record<string, 1 | 0>,
  ): Promise<Partial<JobPosting>[]> {
    if (!Types.ObjectId.isValid(companyId)) {
      return [];
    }

    const criteria = { company_id: new Types.ObjectId(companyId) };
    let documents = await JobPostingModel.find(criteria, projection);

    if (documents.length === 0) {
      documents = await JobPostingModel.find(criteria);
    }
    
    return documents.map((doc) => this.mapToEntity(doc));
  }

  async getAllJobsForAdmin(): Promise<JobPosting[]> {
    const projection: Record<string, 1 | 0> = {
      title: 1,
      location: 1,
      salary: 1,
      status: 1,
      application_count: 1,
      view_count: 1,
      employment_types: 1,
      category_ids: 1,
      createdAt: 1,
      company_id: 1,
    };

    const documents = await JobPostingModel.find({}, projection)
      .populate('company_id', 'companyName')
      .sort({ createdAt: -1 });

    return documents.map((doc) => this.mapToEntity(doc));
  }

  async countActiveJobsByCompany(companyId: string): Promise<number> {
    if (!Types.ObjectId.isValid(companyId)) {
      return 0;
    }

    const count = await JobPostingModel.countDocuments({
      company_id: new Types.ObjectId(companyId),
      status: 'active',
    });

    return count;
  }
}

