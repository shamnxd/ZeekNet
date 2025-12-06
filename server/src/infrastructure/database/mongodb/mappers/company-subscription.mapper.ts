import { CompanySubscription, SubscriptionStatus } from '../../../../domain/entities/company-subscription.entity';
import { CompanySubscriptionDocument, SubscriptionStatusType } from '../models/company-subcription.model';
import { Types } from 'mongoose';

export class CompanySubscriptionMapper {
  static toEntity(doc: CompanySubscriptionDocument | (CompanySubscriptionDocument & { planId?: { name: string; jobPostLimit: number; featuredJobLimit: number } })): CompanySubscription {
    return CompanySubscription.create({
      id: String(doc._id),
      companyId: String(doc.companyId),
      planId: ((): string => {
        const docWithPlan = doc as CompanySubscriptionDocument & { planId?: { _id?: unknown } | string };
        if (docWithPlan.planId && typeof docWithPlan.planId === 'object' && docWithPlan.planId._id) {
          return String(docWithPlan.planId._id);
        }
        return String(doc.planId);
      })(),
      startDate: doc.startDate,
      expiryDate: doc.expiryDate,
      isActive: doc.isActive,
      jobPostsUsed: doc.jobPostsUsed,
      featuredJobsUsed: doc.featuredJobsUsed,
      applicantAccessUsed: doc.applicantAccessUsed,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      planName: (doc as CompanySubscriptionDocument & { planId?: { name?: string } }).planId?.name ?? undefined,
      jobPostLimit: (doc as CompanySubscriptionDocument & { planId?: { jobPostLimit?: number } }).planId?.jobPostLimit ?? undefined,
      featuredJobLimit: (doc as CompanySubscriptionDocument & { planId?: { featuredJobLimit?: number } }).planId?.featuredJobLimit ?? undefined,
      isDefault: (doc as CompanySubscriptionDocument & { planId?: { isDefault?: boolean } }).planId?.isDefault ?? false,
      stripeCustomerId: doc.stripeCustomerId,
      stripeSubscriptionId: doc.stripeSubscriptionId,
      stripeStatus: doc.stripeStatus as SubscriptionStatus | undefined,
      billingCycle: doc.billingCycle,
      cancelAtPeriodEnd: doc.cancelAtPeriodEnd,
      currentPeriodStart: doc.currentPeriodStart,
      currentPeriodEnd: doc.currentPeriodEnd,
    });
  }

  static toDocument(entity: Partial<CompanySubscription>): Partial<CompanySubscriptionDocument> {
    const doc: Partial<CompanySubscriptionDocument> = {};
    
    if (entity.companyId) doc.companyId = new Types.ObjectId(entity.companyId);
    if (entity.planId) doc.planId = new Types.ObjectId(entity.planId);
    if ('startDate' in entity) doc.startDate = entity.startDate ?? null;
    if ('expiryDate' in entity) doc.expiryDate = entity.expiryDate ?? null;
    if (entity.isActive !== undefined) doc.isActive = entity.isActive;
    if (entity.jobPostsUsed !== undefined) doc.jobPostsUsed = entity.jobPostsUsed;
    if (entity.featuredJobsUsed !== undefined) doc.featuredJobsUsed = entity.featuredJobsUsed;
    if (entity.applicantAccessUsed !== undefined) doc.applicantAccessUsed = entity.applicantAccessUsed;
    if (entity.stripeCustomerId !== undefined) doc.stripeCustomerId = entity.stripeCustomerId;
    if (entity.stripeSubscriptionId !== undefined) doc.stripeSubscriptionId = entity.stripeSubscriptionId;
    if (entity.stripeStatus !== undefined) doc.stripeStatus = entity.stripeStatus as SubscriptionStatusType;
    if (entity.billingCycle !== undefined) doc.billingCycle = entity.billingCycle;
    if (entity.cancelAtPeriodEnd !== undefined) doc.cancelAtPeriodEnd = entity.cancelAtPeriodEnd;
    if (entity.currentPeriodStart !== undefined) doc.currentPeriodStart = entity.currentPeriodStart;
    if (entity.currentPeriodEnd !== undefined) doc.currentPeriodEnd = entity.currentPeriodEnd;
    
    return doc;
  }
}
