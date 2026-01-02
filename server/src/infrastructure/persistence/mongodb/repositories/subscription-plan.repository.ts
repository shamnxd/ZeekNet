import { ISubscriptionPlanRepository, SubscriptionPlanQueryOptions, PaginatedSubscriptionPlans } from 'src/domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { SubscriptionPlan } from 'src/domain/entities/subscription-plan.entity';
import { SubscriptionPlanModel, SubscriptionPlanDocument as ModelDocument } from 'src/infrastructure/persistence/mongodb/models/subscription-plan.model';
import { SubscriptionPlanMapper } from 'src/infrastructure/mappers/persistence/mongodb/subscriptions/subscription-plan.mapper';
import { RepositoryBase } from 'src/infrastructure/persistence/mongodb/repositories/base-repository';

export class SubscriptionPlanRepository extends RepositoryBase<SubscriptionPlan, ModelDocument> implements ISubscriptionPlanRepository {
  constructor() {
    super(SubscriptionPlanModel);
  }

  protected mapToEntity(doc: ModelDocument): SubscriptionPlan {
    return SubscriptionPlanMapper.toEntity(doc);
  }

  protected mapToDocument(entity: Partial<SubscriptionPlan>): Partial<ModelDocument> {
    return SubscriptionPlanMapper.toDocument(entity);
  }

  async findByName(name: string): Promise<SubscriptionPlan | null> {
    const escapedName = name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const doc = await this.model.findOne({ 
      name: { $regex: new RegExp(`^${escapedName}$`, 'i') }, 
    }).exec();
    return doc ? this.mapToEntity(doc) : null;
  }

  async findAllWithPagination(options: SubscriptionPlanQueryOptions): Promise<PaginatedSubscriptionPlans> {
    const {
      page = 1,
      limit = 10,
      search = '',
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = options;

    const query: Record<string, unknown> = {};

    if (search) {
      const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { name: { $regex: new RegExp(escapedSearch, 'i') } },
        { description: { $regex: new RegExp(escapedSearch, 'i') } },
      ];
    }

    if (isActive !== undefined) {
      query.isActive = isActive;
    }

    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    const [plans, total] = await Promise.all([
      this.model.find(query).sort(sort).skip(skip).limit(limit).exec(),
      this.model.countDocuments(query).exec(),
    ]);

    return {
      plans: plans.map((doc) => this.mapToEntity(doc)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async unmarkAllAsPopular(): Promise<void> {
    await this.model.updateMany(
      { isPopular: true },
      { $set: { isPopular: false } },
    ).exec();
  }

  async findDefault(): Promise<SubscriptionPlan | null> {
    const doc = await this.model.findOne({ isDefault: true }).exec();
    return doc ? this.mapToEntity(doc) : null;
  }

  async unmarkAllAsDefault(): Promise<void> {
    await this.model.updateMany(
      { isDefault: true },
      { $set: { isDefault: false } },
    ).exec();
  }

  async findByIds(ids: string[]): Promise<SubscriptionPlan[]> {
    const docs = await this.model.find({ _id: { $in: ids } }).exec();
    return docs.map(doc => this.mapToEntity(doc));
  }

  async findByStripePriceId(stripePriceId: string): Promise<SubscriptionPlan | null> {
    const doc = await this.model.findOne({
      $or: [
        { stripePriceIdMonthly: stripePriceId },
        { stripePriceIdYearly: stripePriceId },
      ],
    }).exec();
    return doc ? this.mapToEntity(doc) : null;
  }

  async updateStripeIds(id: string, data: {
    stripeProductId?: string;
    stripePriceIdMonthly?: string;
    stripePriceIdYearly?: string;
  }): Promise<SubscriptionPlan | null> {
    const updateData: Record<string, string> = {};
    if (data.stripeProductId) updateData.stripeProductId = data.stripeProductId;
    if (data.stripePriceIdMonthly) updateData.stripePriceIdMonthly = data.stripePriceIdMonthly;
    if (data.stripePriceIdYearly) updateData.stripePriceIdYearly = data.stripePriceIdYearly;

    const doc = await this.model.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    ).exec();
    
    return doc ? this.mapToEntity(doc) : null;
  }
}

