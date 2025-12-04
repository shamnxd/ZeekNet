import { IPriceHistoryRepository } from '../../../../domain/interfaces/repositories/price-history/IPriceHistoryRepository';
import { PriceHistory, PriceType } from '../../../../domain/entities/price-history.entity';
import { PriceHistoryModel, PriceHistoryDocument as ModelDocument } from '../models/price-history.model';
import { PriceHistoryMapper } from '../mappers/price-history.mapper';
import { Types } from 'mongoose';

export class PriceHistoryRepository implements IPriceHistoryRepository {
  async create(data: {
    planId: string;
    stripePriceId: string;
    type: PriceType;
    amount: number;
    isActive?: boolean;
  }): Promise<PriceHistory> {
    const doc = new PriceHistoryModel({
      planId: new Types.ObjectId(data.planId),
      stripePriceId: data.stripePriceId,
      type: data.type,
      amount: data.amount,
      isActive: data.isActive ?? true,
      archivedAt: null,
    });

    const savedDoc = await doc.save();
    return PriceHistoryMapper.toEntity(savedDoc);
  }

  async findByPlanId(planId: string): Promise<PriceHistory[]> {
    if (!Types.ObjectId.isValid(planId)) {
      return [];
    }

    const docs = await PriceHistoryModel.find({
      planId: new Types.ObjectId(planId),
    }).sort({ createdAt: -1 }).exec();

    return docs.map((doc) => PriceHistoryMapper.toEntity(doc));
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

    return doc ? PriceHistoryMapper.toEntity(doc) : null;
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

    return doc ? PriceHistoryMapper.toEntity(doc) : null;
  }

  async findByStripePriceId(stripePriceId: string): Promise<PriceHistory | null> {
    const doc = await PriceHistoryModel.findOne({ stripePriceId }).exec();
    return doc ? PriceHistoryMapper.toEntity(doc) : null;
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

    return doc ? PriceHistoryMapper.toEntity(doc) : null;
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
