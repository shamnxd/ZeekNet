import { ICompanySubscriptionRepository, CreateSubscriptionData } from '../../../../domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { CompanySubscription } from '../../../../domain/entities/company-subscription.entity';
import { CompanySubscriptionModel } from '../models/company-subcription.model';
import { CompanySubscriptionMapper } from '../mappers/company-subscription.mapper';
import { Types } from 'mongoose';

export class CompanySubscriptionRepository implements ICompanySubscriptionRepository {
  async create(data: CreateSubscriptionData): Promise<CompanySubscription> {
    const doc = await CompanySubscriptionModel.create({
      companyId: new Types.ObjectId(data.companyId),
      planId: new Types.ObjectId(data.planId),
      startDate: data.startDate,
      expiryDate: data.expiryDate,
      isActive: data.isActive ?? true,
      jobPostsUsed: data.jobPostsUsed ?? 0,
      featuredJobsUsed: data.featuredJobsUsed ?? 0,
      applicantAccessUsed: data.applicantAccessUsed ?? 0,
      stripeCustomerId: data.stripeCustomerId,
      stripeSubscriptionId: data.stripeSubscriptionId,
      stripeStatus: data.stripeStatus,
      billingCycle: data.billingCycle,
      cancelAtPeriodEnd: data.cancelAtPeriodEnd ?? false,
      currentPeriodStart: data.currentPeriodStart,
      currentPeriodEnd: data.currentPeriodEnd,
    });

    const populated = await CompanySubscriptionModel.findById(doc._id).populate('planId', 'name jobPostLimit featuredJobLimit');
    return CompanySubscriptionMapper.toEntity(populated!);
  }

  async findById(id: string): Promise<CompanySubscription | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    
    const doc = await CompanySubscriptionModel.findById(id).populate('planId', 'name jobPostLimit featuredJobLimit');
    return doc ? CompanySubscriptionMapper.toEntity(doc) : null;
  }

  async findActiveByCompanyId(companyId: string): Promise<CompanySubscription | null> {
    if (!Types.ObjectId.isValid(companyId)) return null;
    
    const doc = await CompanySubscriptionModel.findOne({
      companyId: new Types.ObjectId(companyId),
      isActive: true,
      $or: [
        { expiryDate: null },
        { expiryDate: { $gt: new Date() } },
        { expiryDate: { $gte: new Date('2099-01-01') } },
      ],
    })
      .populate('planId', 'name jobPostLimit featuredJobLimit isDefault')
      .sort({ expiryDate: -1 });
    
    return doc ? CompanySubscriptionMapper.toEntity(doc) : null;
  }

  async findByCompanyId(companyId: string): Promise<CompanySubscription[]> {
    if (!Types.ObjectId.isValid(companyId)) return [];
    
    const docs = await CompanySubscriptionModel.find({
      companyId: new Types.ObjectId(companyId),
    })
      .populate('planId', 'name jobPostLimit featuredJobLimit')
      .sort({ createdAt: -1 });
    
    return docs.map(doc => CompanySubscriptionMapper.toEntity(doc));
  }

  async update(id: string, data: Partial<CompanySubscription>): Promise<CompanySubscription | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    
    const updateData = CompanySubscriptionMapper.toDocument(data);
    const doc = await CompanySubscriptionModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    ).populate('planId', 'name jobPostLimit featuredJobLimit');
    
    return doc ? CompanySubscriptionMapper.toEntity(doc) : null;
  }

  async deactivate(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) return;
    
    await CompanySubscriptionModel.findByIdAndUpdate(id, { isActive: false });
  }

  async findExpiredSubscriptions(): Promise<CompanySubscription[]> {
    const docs = await CompanySubscriptionModel.find({
      isActive: true,
      expiryDate: { $lt: new Date() },
    }).populate('planId', 'name jobPostLimit featuredJobLimit');
    
    return docs.map(doc => CompanySubscriptionMapper.toEntity(doc));
  }

  async incrementJobPostsUsed(subscriptionId: string): Promise<void> {
    if (!Types.ObjectId.isValid(subscriptionId)) return;
    
    await CompanySubscriptionModel.findByIdAndUpdate(subscriptionId, {
      $inc: { jobPostsUsed: 1 },
    });
  }

  async incrementFeaturedJobsUsed(subscriptionId: string): Promise<void> {
    if (!Types.ObjectId.isValid(subscriptionId)) return;
    
    await CompanySubscriptionModel.findByIdAndUpdate(subscriptionId, {
      $inc: { featuredJobsUsed: 1 },
    });
  }

  async decrementJobPostsUsed(subscriptionId: string): Promise<void> {
    if (!Types.ObjectId.isValid(subscriptionId)) return;
    
    await CompanySubscriptionModel.findByIdAndUpdate(subscriptionId, {
      $inc: { jobPostsUsed: -1 },
    });
  }

  async decrementFeaturedJobsUsed(subscriptionId: string): Promise<void> {
    if (!Types.ObjectId.isValid(subscriptionId)) return;
    
    await CompanySubscriptionModel.findByIdAndUpdate(subscriptionId, {
      $inc: { featuredJobsUsed: -1 },
    });
  }

  async findByStripeSubscriptionId(stripeSubscriptionId: string): Promise<CompanySubscription | null> {
    const doc = await CompanySubscriptionModel.findOne({
      stripeSubscriptionId,
    }).populate('planId', 'name jobPostLimit featuredJobLimit');
    
    return doc ? CompanySubscriptionMapper.toEntity(doc) : null;
  }
}
