import { SubscriptionPlan } from '../../../../domain/entities/subscription-plan.entity';
import { SubscriptionPlanDocument } from '../models/subscription-plan.model';

export class SubscriptionPlanMapper {
  static toEntity(doc: SubscriptionPlanDocument): SubscriptionPlan {
    return SubscriptionPlan.create({
      id: String(doc._id),
      name: doc.name,
      description: doc.description,
      price: doc.price,
      duration: doc.duration,
      yearlyDiscount: doc.yearlyDiscount,
      features: doc.features,
      jobPostLimit: doc.jobPostLimit,
      featuredJobLimit: doc.featuredJobLimit,
      applicantAccessLimit: doc.applicantAccessLimit,
      isActive: doc.isActive,
      isPopular: doc.isPopular,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toDocument(entity: Partial<SubscriptionPlan>): Partial<SubscriptionPlanDocument> {
    const doc: Partial<SubscriptionPlanDocument> = {};
    
    if (entity.name !== undefined) doc.name = entity.name;
    if (entity.description !== undefined) doc.description = entity.description;
    if (entity.price !== undefined) doc.price = entity.price;
    if (entity.duration !== undefined) doc.duration = entity.duration;
    if (entity.yearlyDiscount !== undefined) doc.yearlyDiscount = entity.yearlyDiscount;
    if (entity.features !== undefined) doc.features = entity.features;
    if (entity.jobPostLimit !== undefined) doc.jobPostLimit = entity.jobPostLimit;
    if (entity.featuredJobLimit !== undefined) doc.featuredJobLimit = entity.featuredJobLimit;
    if (entity.applicantAccessLimit !== undefined) doc.applicantAccessLimit = entity.applicantAccessLimit;
    if (entity.isActive !== undefined) doc.isActive = entity.isActive;
    if (entity.isPopular !== undefined) doc.isPopular = entity.isPopular;
    
    return doc;
  }
}
