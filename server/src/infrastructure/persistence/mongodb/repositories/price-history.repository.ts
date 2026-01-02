import { IPriceHistoryRepository } from 'src/domain/interfaces/repositories/price-history/IPriceHistoryRepository';
import { PriceHistory, PriceType } from 'src/domain/entities/price-history.entity';
import { PriceHistoryModel, PriceHistoryDocument as ModelDocument } from 'src/infrastructure/persistence/mongodb/models/price-history.model';
import { PriceHistoryMapper } from 'src/infrastructure/mappers/persistence/mongodb/payment/price-history.mapper';
import { Types } from 'mongoose';

import { RepositoryBase } from 'src/infrastructure/persistence/mongodb/repositories/base-repository';
import { CreateInput } from 'src/domain/types/common.types';

export class PriceHistoryRepository extends RepositoryBase<PriceHistory, ModelDocument> implements IPriceHistoryRepository {
  constructor() {
    super(PriceHistoryModel);
  }

  protected mapToEntity(doc: ModelDocument): PriceHistory {
    return PriceHistoryMapper.toEntity(doc);
  }

  protected mapToDocument(entity: Partial<PriceHistory>): Partial<ModelDocument> {
    return PriceHistoryMapper.toDocument(entity);
  }

  async create(data: {
    planId: string;
    stripePriceId: string;
    type: PriceType;
    amount: number;
    isActive?: boolean;
  }): Promise<PriceHistory> {
    const doc = new PriceHistoryModel({
      ...this.mapToDocument(data as unknown as Partial<PriceHistory>),
      isActive: data.isActive ?? true,
      archivedAt: null,
    });

    const savedDoc = await doc.save();
    return this.mapToEntity(savedDoc);
  }

  async findByPlanId(planId: string): Promise<PriceHistory[]> {
    if (!Types.ObjectId.isValid(planId)) {
      return [];
    }

    const docs = await PriceHistoryModel.find({
      planId: new Types.ObjectId(planId),
    }).sort({ createdAt: -1 }).exec();

    return docs.map((doc) => this.mapToEntity(doc));
  }

  async findActiveByPlanIdAndType(planId: string, type: PriceType): Promise<PriceHistory | null> {
    if (!Types.ObjectId.isValid(planId)) {
      return null;
    }

    const doc = await PriceHistoryModel.findOne({
      planId: new Types.ObjectId(planId),
      type,
      isActive: true,
    }).exec();

    return doc ? this.mapToEntity(doc) : null;
  }

  async findLastArchivedByPlanIdAndType(planId: string, type: PriceType): Promise<PriceHistory | null> {
    if (!Types.ObjectId.isValid(planId)) {
      return null;
    }

    const doc = await PriceHistoryModel.findOne({
      planId: new Types.ObjectId(planId),
      type,
      isActive: false,
    })
      .sort({ archivedAt: -1 })
      .exec();

    return doc ? this.mapToEntity(doc) : null;
  }

  async findByStripePriceId(stripePriceId: string): Promise<PriceHistory | null> {
    const doc = await PriceHistoryModel.findOne({ stripePriceId }).exec();
    return doc ? this.mapToEntity(doc) : null;
  }

  async archivePrice(stripePriceId: string): Promise<PriceHistory | null> {
    const doc = await PriceHistoryModel.findOneAndUpdate(
      { stripePriceId },
      {
        $set: {
          isActive: false,
          archivedAt: new Date(),
        },
      },
      { new: true },
    ).exec();

    return doc ? this.mapToEntity(doc) : null;
  }

  async archiveAllByPlanId(planId: string): Promise<void> {
    if (!Types.ObjectId.isValid(planId)) {
      return;
    }

    await PriceHistoryModel.updateMany(
      { planId: new Types.ObjectId(planId), isActive: true },
      {
        $set: {
          isActive: false,
          archivedAt: new Date(),
        },
      },
    );
  }
}

