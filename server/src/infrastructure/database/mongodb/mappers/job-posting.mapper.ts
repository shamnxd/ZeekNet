import { JobPosting } from '../../../../domain/entities/job-posting.entity';
import { JobPostingDocument } from '../models/job-posting.model';
import { Types } from 'mongoose';

interface PopulatedCompany {
  _id: Types.ObjectId;
  companyName: string;
  logo: string;
}

export class JobPostingMapper {
  static toEntity(doc: JobPostingDocument): JobPosting {
    // Extract populated company data if available
    const populatedCompany = (doc as unknown as { company_id?: Types.ObjectId | PopulatedCompany }).company_id;
    const companyName = populatedCompany && typeof populatedCompany === 'object' && 'companyName' in populatedCompany
      ? populatedCompany.companyName as string
      : undefined;
    const companyLogo = populatedCompany && typeof populatedCompany === 'object' && 'logo' in populatedCompany
      ? populatedCompany.logo as string
      : undefined;

    // Extract company_id correctly whether it's populated or not
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
      isActive: doc.is_active !== undefined ? doc.is_active : true,
      viewCount: doc.view_count || 0,
      applicationCount: doc.application_count || 0,
      createdAt: doc.createdAt || new Date(),
      updatedAt: doc.updatedAt || new Date(),
      companyName,
      companyLogo,
      adminBlocked: doc.admin_blocked,
      unpublishReason: doc.unpublish_reason,
    });
  }

  static toDocument(entity: Partial<JobPosting>): Partial<JobPostingDocument> {
    const doc: Partial<JobPostingDocument> = {};
    
    // Only map fields that are actually provided
    if (entity.companyId !== undefined) {
      doc.company_id = new Types.ObjectId(entity.companyId);
    }
    if (entity.title !== undefined) doc.title = entity.title;
    if (entity.description !== undefined) doc.description = entity.description;
    if (entity.responsibilities !== undefined) doc.responsibilities = entity.responsibilities;
    if (entity.qualifications !== undefined) doc.qualifications = entity.qualifications;
    if (entity.niceToHaves !== undefined) doc.nice_to_haves = entity.niceToHaves;
    if (entity.benefits !== undefined) doc.benefits = entity.benefits;
    if (entity.salary !== undefined) doc.salary = entity.salary;
    if (entity.employmentTypes !== undefined) doc.employment_types = entity.employmentTypes;
    if (entity.location !== undefined) doc.location = entity.location;
    if (entity.skillsRequired !== undefined) doc.skills_required = entity.skillsRequired;
    if (entity.categoryIds !== undefined) doc.category_ids = entity.categoryIds;
    if (entity.isActive !== undefined) doc.is_active = entity.isActive;
    if (entity.adminBlocked !== undefined) doc.admin_blocked = entity.adminBlocked;
    if (entity.unpublishReason !== undefined) doc.unpublish_reason = entity.unpublishReason;
    if (entity.viewCount !== undefined) doc.view_count = entity.viewCount;
    if (entity.applicationCount !== undefined) doc.application_count = entity.applicationCount;
    
    return doc;
  }
}