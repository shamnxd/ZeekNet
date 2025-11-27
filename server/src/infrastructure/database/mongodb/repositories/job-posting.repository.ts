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

  // Override findById to populate company data
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
      is_active: true,
      admin_blocked: false,
      view_count: 0,
      application_count: 0,
    });

    const savedDoc = await document.save();
    return this.mapToEntity(savedDoc);
  }

  // Get all jobs for public (active, non-blocked, with company info)
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
    
    // Get blocked user IDs
    const blockedUsers = await UserModel.find({ isBlocked: true }).select('_id').lean();
    const blockedUserIds = blockedUsers.map(u => String(u._id));
    
    // Get company profiles for blocked users
    const blockedCompanies = await CompanyProfileModel.find({ 
      userId: { $in: blockedUserIds },
    }).select('_id').lean();
    const blockedCompanyIds = blockedCompanies.map(c => c._id);

    // Build query for publicly visible jobs from non-blocked companies
    const andConditions: Record<string, unknown>[] = [
      { $or: [ { is_active: true }, { is_active: { $exists: false } } ] },
      { $or: [ { admin_blocked: false }, { admin_blocked: { $exists: false } } ] },
    ];

    // Exclude jobs from blocked companies
    if (blockedCompanyIds.length > 0) {
      andConditions.push({ company_id: { $nin: blockedCompanyIds } });
    }

    // Apply filters to the database query
    if (filters?.categoryIds && filters.categoryIds.length > 0) {
      andConditions.push({ category_ids: { $in: filters.categoryIds } });
    }

    if (filters?.employmentTypes && filters.employmentTypes.length > 0) {
      andConditions.push({ employment_types: { $in: filters.employmentTypes } });
    }

    // Salary filtering: show jobs where salary range overlaps with filter range
    // Job is visible if: job.max >= filter.min AND job.min <= filter.max
    if (filters?.salaryMin !== undefined && filters?.salaryMax !== undefined) {
      andConditions.push({
        $and: [
          { 'salary.max': { $gte: filters.salaryMin } },
          { 'salary.min': { $lte: filters.salaryMax } },
        ],
      });
    } else if (filters?.salaryMin !== undefined) {
      // Only min specified: show jobs where max salary >= filter min
      andConditions.push({ 'salary.max': { $gte: filters.salaryMin } });
    } else if (filters?.salaryMax !== undefined) {
      // Only max specified: show jobs where min salary <= filter max
      andConditions.push({ 'salary.min': { $lte: filters.salaryMax } });
    }

    if (filters?.location) {
      andConditions.push({ location: { $regex: filters.location, $options: 'i' } });
    }

    if (filters?.search) {
      // Search in title, description, and location
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

    // Fetch and populate in one query
    const documents = await JobPostingModel.find(criteria, {
      ...projection,
      company_id: 1,
    }).populate('company_id', 'companyName logo');
    
    let validJobs = documents.filter(doc => doc.company_id !== null);

    // If search query exists, also filter by company name (client-side since it's populated data)
    if (filters?.search && validJobs.length > 0) {
      const searchLower = filters.search.toLowerCase();
      validJobs = validJobs.filter(doc => {
        const plainDoc = doc.toObject();
        const companyData = plainDoc.company_id as { companyName?: string; logo?: string } | null;
        
        // Check if search matches title, description, location, or company name
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

  // Get jobs by company (for company dashboard)
  async getJobsByCompany(
    companyId: string,
    projection: Record<string, 1 | 0>,
  ): Promise<Partial<JobPosting>[]> {
    if (!Types.ObjectId.isValid(companyId)) {
      return [];
    }

    const criteria = { company_id: new Types.ObjectId(companyId) };
    let documents = await JobPostingModel.find(criteria, projection);

    // Fallback: if projection yielded zero results, re-query without projection
    if (documents.length === 0) {
      documents = await JobPostingModel.find(criteria);
    }
    
    return documents.map((doc) => {
      const plainDoc = doc.toObject();
      return {
        id: plainDoc._id.toString(),
        title: plainDoc.title,
        isActive: plainDoc.is_active,
        employmentTypes: plainDoc.employment_types,
        applicationCount: plainDoc.application_count,
        viewCount: plainDoc.view_count,
        adminBlocked: plainDoc.admin_blocked,
        unpublishReason: plainDoc.unpublish_reason,
        createdAt: plainDoc.createdAt,
      };
    });
  }

  // Get all jobs for admin (all jobs with company info)
  async getAllJobsForAdmin(): Promise<JobPosting[]> {
    const projection: Record<string, 1 | 0> = {
      title: 1,
      location: 1,
      salary: 1,
      is_active: 1,
      admin_blocked: 1,
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