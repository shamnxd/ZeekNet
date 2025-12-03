import { IJobPostingRepository } from '../../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { JobPosting } from '../../../../domain/entities/job-posting.entity';
import { JobPostingModel, JobPostingDocument } from '../models/job-posting.model';
import { Types } from 'mongoose';
import { JobPostingMapper } from '../mappers/job-posting.mapper';
import { RepositoryBase } from './base-repository';
import { DailyLimitErorr } from 'src/domain/errors/errors';

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

  async postJob(jobData: Omit<JobPosting, 'id' | '_id' | 'createdAt' | 'updatedAt'>): Promise<JobPosting> {

    const document = new JobPostingModel({
      company_id: new Types.ObjectId(jobData.companyId),
      title: jobData.title,
      description: jobData.description,
      responsibilities: jobData.responsibilities,
      qualifications: jobData.qualifications,
      nice_to_haves: jobData.niceToHaves || [],
      benefits: jobData.benefits || [],
      salary: jobData.salary,
      employment_types: jobData.employmentTypes,
      location: jobData.location,
      skills_required: jobData.skillsRequired || [],
      category_ids: jobData.categoryIds || [],
      status: 'active',
      view_count: 0,
      application_count: 0,
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
    
    const blockedUsers = await UserModel.find({ isBlocked: true }).select('_id').lean();
    const blockedUserIds = blockedUsers.map(u => String(u._id));
    
    const blockedCompanies = await CompanyProfileModel.find({ 
      userId: { $in: blockedUserIds },
    }).select('_id').lean();
    const blockedCompanyIds = blockedCompanies.map(c => c._id);

    const andConditions: Record<string, unknown>[] = [
      { status: 'active' },
    ];

    if (blockedCompanyIds.length > 0) {
      andConditions.push({ company_id: { $nin: blockedCompanyIds } });
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
      const plainDoc = doc.toObject();
      const companyData = plainDoc.company_id as { companyName?: string; logo?: string };
      
      return {
        id: plainDoc._id.toString(),
        title: plainDoc.title,
        viewCount: plainDoc.view_count,
        applicationCount: plainDoc.application_count,
        salary: plainDoc.salary,
        companyName: companyData?.companyName || 'Company',
        companyLogo: companyData?.logo,
        createdAt: plainDoc.createdAt,
        location: plainDoc.location,
        description: plainDoc.description,
        skillsRequired: plainDoc.skills_required,
        categoryIds: plainDoc.category_ids,
        employmentTypes: plainDoc.employment_types,
      };
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
    
    return documents.map((doc) => {
      const plainDoc = doc.toObject();
      return {
        id: plainDoc._id.toString(),
        title: plainDoc.title,
        status: plainDoc.status,
        employmentTypes: plainDoc.employment_types,
        applicationCount: plainDoc.application_count,
        viewCount: plainDoc.view_count,
        unpublishReason: plainDoc.unpublish_reason,
        createdAt: plainDoc.createdAt,
      };
    });
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
}