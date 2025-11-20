import { JobPosting } from '../../../../domain/entities/job-posting.entity';
import { JobPostingDocument } from '../models/job-posting.model';
import { Types } from 'mongoose';

export class JobPostingMapper {
  static toEntity(doc: JobPostingDocument): JobPosting {
    return JobPosting.create({
      id: String(doc._id),
      companyId: String(doc.company_id),
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
      isActive: doc.is_active !== undefined ? doc.is_active : true,
      viewCount: doc.view_count || 0,
      applicationCount: doc.application_count || 0,
      createdAt: doc.createdAt || new Date(),
      updatedAt: doc.updatedAt || new Date(),
      adminBlocked: doc.admin_blocked,
      unpublishReason: doc.unpublish_reason,
    });
  }

  static toDocument(entity: JobPosting): Partial<JobPostingDocument> {
    return {
      company_id: new Types.ObjectId(entity.companyId),
      title: entity.title,
      description: entity.description,
      responsibilities: entity.responsibilities,
      qualifications: entity.qualifications,
      nice_to_haves: entity.niceToHaves,
      benefits: entity.benefits,
      salary: entity.salary,
      employment_types: entity.employmentTypes,
      location: entity.location,
      skills_required: entity.skillsRequired,
      category_ids: entity.categoryIds,
      is_active: entity.isActive,
      admin_blocked: entity.adminBlocked,
      unpublish_reason: entity.unpublishReason,
      view_count: entity.viewCount,
      application_count: entity.applicationCount,
    };
  }
}