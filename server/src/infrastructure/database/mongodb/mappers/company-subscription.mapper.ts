import { CompanySubscription } from '../../../../domain/entities/company-subscription.entity';
import { CompanySubscriptionDocument } from '../models/company-subcription.model';
import { Types } from 'mongoose';

export class CompanySubscriptionMapper {
  static toEntity(doc: CompanySubscriptionDocument & { plan?: { name: string; jobPostLimit: number; featuredJobLimit: number } }): CompanySubscription {
    return CompanySubscription.create({
      id: String(doc._id),
      companyId: String(doc.companyId),
      planId: String(doc.planId),
      startDate: doc.startDate,
      expiryDate: doc.expiryDate,
      isActive: doc.isActive,
      jobPostsUsed: doc.jobPostsUsed,
      featuredJobsUsed: doc.featuredJobsUsed,
      applicantAccessUsed: doc.applicantAccessUsed,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      planName: doc.plan?.name,
      jobPostLimit: doc.plan?.jobPostLimit,
      featuredJobLimit: doc.plan?.featuredJobLimit,
    });
  }

  static toDocument(entity: Partial<CompanySubscription>): Partial<CompanySubscriptionDocument> {
    const doc: Partial<CompanySubscriptionDocument> = {};
    
    if (entity.companyId) doc.companyId = new Types.ObjectId(entity.companyId);
    if (entity.planId) doc.planId = new Types.ObjectId(entity.planId);
    if (entity.startDate) doc.startDate = entity.startDate;
    if (entity.expiryDate) doc.expiryDate = entity.expiryDate;
    if (entity.isActive !== undefined) doc.isActive = entity.isActive;
    if (entity.jobPostsUsed !== undefined) doc.jobPostsUsed = entity.jobPostsUsed;
    if (entity.featuredJobsUsed !== undefined) doc.featuredJobsUsed = entity.featuredJobsUsed;
    if (entity.applicantAccessUsed !== undefined) doc.applicantAccessUsed = entity.applicantAccessUsed;
    
    return doc;
  }
}
