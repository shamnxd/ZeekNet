import { PriceHistory, PriceType } from '../../../../domain/entities/price-history.entity';
import { PriceHistoryDocument } from '../models/price-history.model';
import { Types } from 'mongoose';

export class PriceHistoryMapper {
  static toEntity(doc: PriceHistoryDocument): PriceHistory {
    return PriceHistory.create({
      id: String(doc._id),
      planId: String(doc.planId),
      stripePriceId: doc.stripePriceId,
      type: doc.type,
      amount: doc.amount,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      archivedAt: doc.archivedAt,
    });
  }

  static toDocument(entity: Partial<PriceHistory> | Record<string, unknown>): Partial<PriceHistoryDocument> {
    const doc: Partial<PriceHistoryDocument> = {};
    const input = entity as Record<string, unknown>;

    if (input.planId !== undefined) doc.planId = new Types.ObjectId(input.planId as string);
    if (input.stripePriceId !== undefined) doc.stripePriceId = input.stripePriceId as string;
    if (input.type !== undefined) doc.type = input.type as PriceType;
    if (input.amount !== undefined) doc.amount = input.amount as number;
    if (input.isActive !== undefined) doc.isActive = input.isActive as boolean;
    if (input.archivedAt !== undefined) doc.archivedAt = input.archivedAt as Date;

    return doc;
  }
}
