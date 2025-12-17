import { JobPosting } from '../../../../domain/entities/job-posting.entity';
import { JobPostingDocument } from '../models/job-posting.model';
import { Types } from 'mongoose';
import { JobStatus } from '../../../../domain/enums/job-status.enum';
import { EmploymentType } from '../../../../domain/enums/employment-type.enum';

interface PopulatedCompany {
  _id: Types.ObjectId;
  companyName: string;
  logo: string;
}

export class JobPostingMapper {
  static toEntity(doc: JobPostingDocument & { company_id?: Types.ObjectId | PopulatedCompany }): JobPosting {
    const populatedCompany = doc.company_id;
    const companyName = populatedCompany && typeof populatedCompany === 'object' && 'companyName' in populatedCompany
      ? populatedCompany.companyName
      : undefined;
    const companyLogo = populatedCompany && typeof populatedCompany === 'object' && 'logo' in populatedCompany
      ? populatedCompany.logo
      : undefined;

    const companyId = populatedCompany && typeof populatedCompany === 'object' && '_id' in populatedCompany
      ? String(populatedCompany._id)
      : String(doc.company_id);

    return JobPosting.create({
      id: String(doc._id),
      companyId,
      title: doc.title || '',
      description: doc.description || '',
      responsibilities: doc.responsibilities || [],
      qualifications: doc.qualifications || [],
      niceToHaves: doc.nice_to_haves || [],
      benefits: doc.benefits || [],
      salary: doc.salary || { min: 0, max: 0 },
      employmentTypes: doc.employment_types || [],
      location: doc.location || '',
      skillsRequired: doc.skills_required || [],
      categoryIds: doc.category_ids || [],
      status: doc.status || JobStatus.ACTIVE,
      isFeatured: doc.is_featured || false,
      viewCount: doc.view_count || 0,
      applicationCount: doc.application_count || 0,
      createdAt: doc.createdAt || new Date(),
      updatedAt: doc.updatedAt || new Date(),
      companyName,
      companyLogo,
      unpublishReason: doc.unpublish_reason,
    });
  }

  static toDocument(entity: Partial<JobPosting> | Record<string, unknown>): Partial<JobPostingDocument> {
    const doc: Partial<JobPostingDocument> = {};
    
    const input = entity as Record<string, unknown>;
    
    if (input.companyId !== undefined) {
      doc.company_id = new Types.ObjectId(input.companyId as string);
    }
    if (input.title !== undefined) doc.title = input.title as string;
    if (input.description !== undefined) doc.description = input.description as string;
    if (input.responsibilities !== undefined) doc.responsibilities = input.responsibilities as string[];
    if (input.qualifications !== undefined) doc.qualifications = input.qualifications as string[];

    if (input.niceToHaves !== undefined) {
      doc.nice_to_haves = input.niceToHaves as string[];
    } else if (input.nice_to_haves !== undefined) {
      doc.nice_to_haves = input.nice_to_haves as string[];
    }
    
    if (input.benefits !== undefined) doc.benefits = input.benefits as string[];
    if (input.salary !== undefined) doc.salary = input.salary as { min: number; max: number };
    
    if (input.employmentTypes !== undefined) {
      doc.employment_types = input.employmentTypes as EmploymentType[];
    } else if (input.employment_types !== undefined) {
      doc.employment_types = input.employment_types as EmploymentType[];
    }
    
    if (input.location !== undefined) doc.location = input.location as string;

    if (input.skillsRequired !== undefined) {
      doc.skills_required = input.skillsRequired as string[];
    } else if (input.skills_required !== undefined) {
      doc.skills_required = input.skills_required as string[];
    }

    if (input.categoryIds !== undefined) {
      doc.category_ids = input.categoryIds as string[];
    } else if (input.category_ids !== undefined) {
      doc.category_ids = input.category_ids as string[];
    }
    
    if (input.status !== undefined) {
      doc.status = input.status as JobStatus;
    }

    if (input.isFeatured !== undefined) {
      doc.is_featured = input.isFeatured as boolean;
    } else if (input.is_featured !== undefined) {
      doc.is_featured = input.is_featured as boolean;
    }
    
    if (input.unpublishReason !== undefined) {
      doc.unpublish_reason = input.unpublishReason as string;
    } else if (input.unpublish_reason !== undefined) {
      doc.unpublish_reason = input.unpublish_reason as string;
    }
    
    if (input.viewCount !== undefined) {
      doc.view_count = input.viewCount as number;
    } else if (input.view_count !== undefined) {
      doc.view_count = input.view_count as number;
    }
    
    if (input.applicationCount !== undefined) {
      doc.application_count = input.applicationCount as number;
    } else if (input.application_count !== undefined) {
      doc.application_count = input.application_count as number;
    }
    
    return doc;
  }
}